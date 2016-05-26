const unitConverter = require('../interpreters/unitConverter');
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
module.exports = parseTarget;
