/*
* Converts from English Metric Units (EMUs) to pixels
* @param {Number} emu - English Metric Unit
*/

exports.emuToPixels = function emuToPixels(emu) {
  // assuming the shape is not a child, so we divide by 9525.
  return emu === 0 ? 0 : Math.round(emu / 9525);
};

/*
* Converts from whole points to points.
* In drawing ML, Whole points are specified in increments of 100.
* Example: 1200 whole points equals 12 points.
* Use this to convert font size from whole points to regular points.
* @param {Number} wholePoint - whole points
* @return
*/
exports.wholePointsToPoints = function wholePointsToPoints(wholePoint) {
  return wholePoint / 100;
};
