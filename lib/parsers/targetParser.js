const unitConverter = require('../interpreters/unitConverter');
/*
* Returns the location and dimension of the drawn target shape
*/
function parseTarget(e) {
  const locations = [];
  const dimensions = [];
  // A target is any shape that is not a text box shape
  e('p\\:cNvSpPr', 'p\\:sp > p\\:nvSpPr')
  .filter((i, cNvSpPrElem) =>
    cNvSpPrElem.attribs.txBox === undefined
  )
  .map((i, cNvSpPrElem) =>
     // get the chidlren of the <p:sp> element
    cNvSpPrElem.parent.parent.children.filter((c) =>
      c.type === 'tag' && c.name === 'p:spPr'
    )
  )
  .map((i, spPrElem) =>
    spPrElem.children.filter((c) =>
        c.type === 'tag' && c.name === 'a:xfrm'
    )
  )
  .map((i, xfrmElem) =>
    xfrmElem.children.filter((c) =>
        c.type === 'tag'
    )
  )
  .each((key, xfrmChildelement) => {
    if (xfrmChildelement.name === 'a:off') {
      locations.push({
        x: unitConverter.emuToPixels(parseInt(xfrmChildelement.attribs.x, 10)),
        y: unitConverter.emuToPixels(parseInt(xfrmChildelement.attribs.y, 10))
      });
    }
    else if (xfrmChildelement.name === 'a:ext') {
      dimensions.push({
        width: unitConverter.emuToPixels(parseInt(xfrmChildelement.attribs.cx, 10)),
        height: unitConverter.emuToPixels(parseInt(xfrmChildelement.attribs.cy, 10))
      });
    }
  });
  if (dimensions.length !== locations.length) {
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
