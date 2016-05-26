const Promise = require('bluebird');
const fs = require('fs');
const readFile = Promise.promisify(fs.readFile);
const cheerio = require('cheerio');
const path = require('path');
const parseTarget = require('./targetParser');
const actionsInterpreter = require('../interpreters/actionsInterpreter');

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
    return Promise.resolve(actionsInterpreter(txBodyElements[0].children[0].data));
  }
  return Promise.resolve(undefined);
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
