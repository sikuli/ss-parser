const expect = require('chai').expect;
const fs = require('fs');
const path = require('path');
const os = require('os');
const rmdir = require('rimraf');
const readdir = require('bluebird').promisify(fs.readdir);
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
    const pptxFile = path.join(__dirname, 'fixtures', 'example.pptx');
    parse(pptxFile, targetDir, { type: 'pptx' })
      .then(() =>
        readdir(path.join(targetDir, 'ppt', 'slides'))
      )
      .then((files) => {
        expect(files).to.have.length(5);
        expect(files).to.include.members(['_rels', 'slide1.xml', 'slide2.xml']);
        done();
      })
      .catch((e) => done(e));
  });
});
