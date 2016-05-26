const expect = require('chai').expect;
const Promise = require('bluebird');
const fs = require('fs');
const mkdtemp = Promise.promisify(fs.mkdtemp);
const path = require('path');
const os = require('os');
const rmdir = require('rimraf');
const decompress = require('decompress');
const slideParser = require('../lib/parsers/slideParser');

describe('slide parser', () => {
  let targetDir = path.join(os.tmpDir(), 'sikuli.slides-');
  const pptxFile = path.join(__dirname, 'fixtures', 'example.pptx');

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

  it('parses a slide with an action', (done) => {
    const slideFile = path.join(targetDir, 'ppt', 'slides', 'slide1.xml');
    const expected = {
      slide: 1,
      screenshot: undefined,
      target: [],
      action: { name: 'open',
                value: 'https://www.wikipedia.org/'
              },
      displayItems: []
    };
    slideParser(slideFile)
      .then((actual) => {
        expect(actual).to.deep.equal(expected);
        done();
      })
      .catch((e) => done(e));
  });

  it('parses a slide with a target and an action', (done) => {
    const slideFile = path.join(targetDir, 'ppt', 'slides', 'slide2.xml');
    const expected = {
      slide: 2,
      screenshot: path.join(targetDir, 'ppt', 'media', 'image00.png'),
      target: [{
        x: 410,
        y: 109,
        width: 140,
        height: 128
      }],
      action: { name: 'click',
                value: undefined
              },
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
