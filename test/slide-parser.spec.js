const expect = require('chai').expect;
const Promise = require('bluebird');
const fs = require('fs');
const mkdtemp = Promise.promisify(fs.mkdtemp);
const path = require('path');
const os = require('os');
const rmdir = require('rimraf');
const decompress = require('decompress');
const slideParser = require('../lib/parsers/slide-parser');

describe('slide parser', () => {
  let targetDir = path.join(os.tmpDir(), 'sikuli.slides-');
  const pptxFile = path.join(__dirname, 'fixtures', 'simple.pptx');

  before((done) => {
    mkdtemp(targetDir)
      .then((dir) => {
        targetDir = dir;
        return decompress(pptxFile, targetDir);
      })
      .then(() => done())
      .catch((e) => done(e));
  });

  after((done) => {
    rmdir(targetDir, (err) => {
      done(err);
    });
  });

  it('parses a slide with a target and an action', (done) => {
    const slideFile = path.join(targetDir, 'ppt', 'slides', 'slide2.xml');
    const expected = {
      slide: 2,
      screenshot: path.join(targetDir, 'ppt', 'media', 'image00.png'),
      target: [{
        x: 3905725,
        y: 1037075,
        width: 1338000,
        height: 1221000
      }],
      action: 'Click',
      displayItems: []
    };
    slideParser(slideFile)
      .then((actual) => {
        expect(actual).to.deep.equal(expected);
        done();
      })
      .catch((e) => done(e));
  });
});
