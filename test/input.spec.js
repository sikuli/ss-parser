const expect = require('chai').expect;
const main = require('../');
const path = require('path');

describe('input', () => {
  it('throws an error when no input/output paths are given', () => {
    expect(main.bind()).to.throw(TypeError);
  });
  it('throws an error when an invalid input file is given', () => {
    expect(main.bind(null, './', __dirname)).to.throw(Error);
  });
  it('throws an error when an invalid output path is given', () => {
    expect(main.bind(null, path.join(__dirname, '..', 'package.json'),
      path.join(__dirname, 'no-such-dir'))).to.throw(Error);
  });
  it('throws an error when a relative input path is given', () => {
    expect(main.bind(null, path.join('..', 'package.json'),
      path.join(__dirname, 'no-such-dir'))).to.throw(Error);
  });
  it('throws an error when a relative output path is given', () => {
    expect(main.bind(null, path.join(__dirname, '..', 'package.json'), '..')).to.throw(Error);
  });
});
