const unitConverter = require('../lib/interpreters/unitConverter');
const expect = require('chai').expect;

describe('unit converter', () => {
  it('converts 1465 emu to pixels', () => {
    expect(unitConverter.emuToPixels(20000)).to.equal(2);
  });

  it('converts 0 emu to pixels', () => {
    expect(unitConverter.emuToPixels(0)).to.equal(0);
  });

  it('converts 1200 whole points to points', () => {
    expect(unitConverter.wholePointsToPoints(1200)).to.equal(12);
  });
});
