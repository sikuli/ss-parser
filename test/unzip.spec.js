const expect = require('chai').expect;
const fs = require('fs');
const path = require('path');
const os = require('os');
const rmdir = require('rimraf');
const parse = require('../lib');

describe('unzip', () => {
  let targetDir = path.join(os.tmpDir(), 'sikuli.slides-');

  before((done) => {
    fs.mkdtemp(targetDir, (err, dir) => {
      targetDir = dir;
      done(err);
    });
  });

  after((done) => {
    rmdir(targetDir, (err) => {
      done(err);
    });
  });

  it('unzips a pptx file to the given directory', (done) => {
    const pptxFile = path.join(__dirname, 'fixtures', 'simple.pptx');
    parse(pptxFile, targetDir, { type: 'pptx' })
      .then((files) => {
        expect(files).to.have.length(37);
        done();
      })
      .catch((e) => done(e));
  });
});
