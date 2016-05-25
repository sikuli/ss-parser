const Promise = require('bluebird');
const fs = require('fs');
const readFile = Promise.promisify(fs.readFile);
const cheerio = require('cheerio');
const path = require('path');
const unitConverter = require('../utils/unitConverter');

function ParserError(message, extra) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
  this.extra = extra;
}

/*
* Returns the absoulte file path name of the screenshot.
*/
function parseSlideWithScreenshot($, slideRelPath) {
  const screenshotElement = $('p\\:pic > p\\:blipFill > a\\:blip');
  if (screenshotElement.length === 0) {
    return Promise.resolve(undefined);
  }
  const relId = screenshotElement.attr('r:embed');
  if (relId === undefined) {
    return Promise.resolve(undefined);
  }
  return readFile(slideRelPath)
    .then((content) => {
      const r$ = cheerio.load(content, { xmlMode: true });
      const screenshotPath = r$(`Relationship[Id="${relId}"]`).attr('Target');
      return path.resolve(slideRelPath, '..', '..', screenshotPath);
    });
}

/*
* Returns the text of the first non-empty text box element
*/
function parseActionName($) {
  const txBodyElements = $('p\\:txBody > a\\:p > a\\:r > a\\:t')
                          .filter((i, elem) => $(elem).text() !== '');
  if (txBodyElements.length > 0) {
    return Promise.resolve(txBodyElements[0].children[0].data);
  }
  return Promise.resolve(undefined);
}
/*
* Returns the location and dimension of the drawn target shape
*/
function parseTarget(e) {
  const locations = [];
  const dimensions = [];
  // A target is any shape that is not a text box shape
  e('p\\:cNvSpPr', 'p\\:sp > p\\:nvSpPr')
  .filter((i, p4Elem) =>
    p4Elem.attribs.txBox === undefined
  )
  .map((i, p4Elem) =>
    p4Elem.parent.parent.children.filter((c) =>
      c.type === 'tag' && c.name === 'p:spPr'
    )
  )
  .map((i, x1Elem) =>
    x1Elem.children.filter((c) =>
        c.type === 'tag' && c.name === 'a:xfrm'
    )
  )
  .map((i, x2Elem) =>
    x2Elem.children.filter((c) =>
        c.type === 'tag'
    )
  )
  .each((key, element) => {
    if (element.name === 'a:off') {
      locations.push({
        x: unitConverter.emuToPixels(parseInt(element.attribs.x, 10)),
        y: unitConverter.emuToPixels(parseInt(element.attribs.y, 10))
      });
    }
    else if (element.name === 'a:ext') {
      dimensions.push({
        width: unitConverter.emuToPixels(parseInt(element.attribs.cx, 10)),
        height: unitConverter.emuToPixels(parseInt(element.attribs.cy, 10))
      });
    }
  });
  if (dimensions.length !== dimensions.length) {
    return Promise.reject(new Error('Failed to find target'));
  }
  return Promise.resolve(locations.map((obj, key) =>
      ({ x: obj.x,
        y: obj.y,
        width: dimensions[key].width,
        height: dimensions[key].height
      })
  ));
}

/*
* TODO: Returns audio and caption items.
*/
function parseDisplayItems() {
  return Promise.resolve([]);
}

module.exports = function parseSlideFile(slideFilePath) {
  const fileBaseName = path.basename(slideFilePath, '.xml');
  const slideRelPath = path.resolve(slideFilePath, '..', '_rels', `${fileBaseName}.xml.rels`);
  return readFile(slideFilePath)
    .then((content) => {
      const $ = cheerio.load(content, { xmlMode: true });
      return [
        parseSlideWithScreenshot($, slideRelPath),
        parseActionName($),
        parseTarget($),
        parseDisplayItems()
      ];
    })
    .all()
    .then(([screenshot, action, target, displayItems]) =>
      ({ slide: Number(fileBaseName.substring(5)),
        screenshot,
        action,
        target,
        displayItems
      })
    )
    .catch((e) => {
      throw new ParserError(`Failed to parse file: ${fileBaseName}`, e.message);
    });
};
