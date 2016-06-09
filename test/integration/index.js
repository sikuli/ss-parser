const expect = require('chai').expect;
const os = require('os');
const fs = require('fs');
const path = require('path');
const rmdir = require('rimraf');
const app = require('../../lib/');

describe('integration', () => {
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

  it('parses a PPTX file', (done) => {
    const pptxFile = path.join(__dirname, '..', 'fixtures', 'example.pptx');
    app(pptxFile, targetDir, { type: 'pptx' })
      .then((result) => {
        expect(result).to.have.length(5);
        done();
      })
      .catch((e) => done(e));
  });
});
