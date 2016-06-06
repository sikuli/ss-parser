const unitConverter = require('../interpreters/unitConverter');
const actionsInterpreter = require('../interpreters/actionsInterpreter');
const Promise = require('bluebird');
const _ = require('lodash');


function isAReservedActionWord(text) {
  return actionsInterpreter.lookup(text).name !== undefined;
}
/*
 * Returns the location and dimension
 */
function getShape(xfrm) {
  const shape = {};
  xfrm.children.forEach((c) => {
    if (c.name === 'a:off') {
      shape.x = unitConverter.emuToPixels(c.attribs.x);
      shape.y = unitConverter.emuToPixels(c.attribs.y);
    }
    else if (c.name === 'a:ext') {
      shape.width = unitConverter.emuToPixels(c.attribs.cx);
      shape.height = unitConverter.emuToPixels(c.attribs.cy);
    }
  });
  return shape;
}

function getFontColor(rPrChildren) {
  let fontColor;
  if (rPrChildren) {
    const childNodes = rPrChildren.children.filter((c) =>
      c.type === 'tag');
    fontColor = childNodes.length > 0 ? childNodes[0].attribs.val : undefined;
  }
  return fontColor;
}
/*
 * Returns the language, font color and size, and text body
 */
function getContent(spElement) {
  // Get the language, background color, font size, and text of the textbox
  const txBody = spElement.children.filter((c) =>
    c.type === 'tag' && c.name === 'p:txBody')[0];
  const pElements = txBody.children.filter((c) =>
    c.type === 'tag' && c.name === 'a:p');
  const content = [];
  pElements.forEach((p) => {
    const ar = _.find(p.children, (c) => c.type === 'tag' && c.name === 'a:r');
    const rPr = _.find(ar.children, (c) => c.type === 'tag' && c.name === 'a:rPr');
    const rPrAttribs = rPr.attribs;
    const rPrChildren = _.find(rPr.children.filter((c) =>
      c.type === 'tag'), (c) => c.type === 'tag');
    const fontColor = getFontColor(rPrChildren);
    const tElem = _.find(ar.children, (c) => c.type === 'tag' && c.name === 'a:t');
    const text = _.find(tElem.children, (c) => c.type === 'text').data;
    content.push({
      lang: rPrAttribs.lang,
      fontSize: unitConverter.wholePointsToPoints(rPrAttribs.sz),
      fontColor,
      text
    });
  });
  return content;
}

/**
 * Returns the background color.
 */

function getBackgroundColor(spPr) {
  const solidFill = _.find(spPr.children, (c) => c.type === 'tag' && c.name === 'a:solidFill');
  let bgColor = undefined;
  if (solidFill) {
    bgColor = _.find(solidFill.children, (c) =>
      c.type === 'tag' && c.name === 'a:srgbClr'
    );
  }
  return bgColor ? bgColor.attribs.val : undefined;
}
/*
* Returns an object that represnts the drawn screen caption (lable) in the slide.
*/
module.exports = function parseCaption($) {
  const textElements = $('p\\:txBody > a\\:p > a\\:r > a\\:t')
                          .filter((i, elem) => {
                            const text = $(elem).text().trim();
                            return !_.isEmpty(text) && !isAReservedActionWord(text);
                          });
  const spElems = _.map(textElements, 'parent.parent.parent.parent');
  const shapeIds = [];
  // remove redundant shape elements. This occurs when the a:t element contains new lines
  const shapes = _.map(spElems, (shape) => {
    const nvSpPrChildren = _.find(shape.children, (o) => o.name === 'p:nvSpPr').children;
    const shapeId = _.find(nvSpPrChildren, (o) => o.name === 'p:cNvPr').attribs.id;
    if (_.indexOf(shapeIds, shapeId) === -1) {
      shapeIds.push(shapeId);
      return shape;
    }
    return undefined;
  });
  const spElements = _.filter(shapes, (s) => s !== undefined);
  const captions = [];
  _.forEach(spElements, (spElement) => {
    // const spElement = element.parent.parent.parent.parent;
    // // Get the location, dimensions, and background color of the textbox shape.
    const spPr = spElement.children.filter((c) =>
       c.type === 'tag' && c.name === 'p:spPr')[0];
    if (spPr) {
      const xfrm = spPr.children.filter((c) => c.type === 'tag' && c.name === 'a:xfrm')[0];
      const shape = getShape(xfrm);
      const bgColor = getBackgroundColor(spPr);
      // Get the language, background color, font size, and text of the textbox
      const text = getContent(spElement);
      captions.push({
        shape,
        body: text,
        style: {
          bgColor
        }
      });
    }
  });
  return Promise.resolve(captions);
};
