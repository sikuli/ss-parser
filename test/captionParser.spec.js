const expect = require('chai')
  .expect;
const Promise = require('bluebird');
const fs = require('fs');
const mkdtemp = Promise.promisify(fs.mkdtemp);
const readFile = Promise.promisify(fs.readFile);
const path = require('path');
const os = require('os');
const rmdir = require('rimraf');
const decompress = require('decompress');
const captionParser = require('../lib/parsers/captionParser');
const cheerio = require('cheerio');

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

  it('parses a slide with a label whose style is inhertied from the master slide', (done) => {
    const slideFile = path.join(targetDir, 'ppt', 'slides', 'slide3.xml');
    const expected = [
      {
        shape: {
          x: 547,
          y: 47,
          width: 198,
          height: 40
        },
        body: [
          {
            lang: 'en',
            fontSize: NaN,
            fontColor: undefined,
            text: 'Wikipedia'
          }
        ],
        style: {
          bgColor: undefined
        }
      }
    ];
    readFile(slideFile)
      .then((content) =>
        captionParser(cheerio.load(content, {
          xmlMode: true
        }))
      )
      .then((actual) => {
        expect(actual)
          .to.deep.equal(expected);
        done();
      })
      .catch((e) => done(e));
  });

  it('parses a slide with two labels', (done) => {
    const slideFile = path.join(targetDir, 'ppt', 'slides', 'slide5.xml');
    const expected = [
      {
        shape: {
          x: 186,
          y: 175,
          width: 234,
          height: 110
        },
        body: [
          {
            lang: 'en',
            fontSize: 30,
            fontColor: 'FFFFFF',
            text: 'Label-1'
          },
          {
            lang: 'en',
            fontSize: 30,
            fontColor: 'FFFFFF',
            text: 'label-1'
          }
        ],
        style: {
          bgColor: 'FF0000'
        }
      },
      {
        shape: {
          x: 202,
          y: 337,
          width: 234,
          height: 110
        },
        body: [
          {
            lang: 'en',
            fontSize: 30,
            fontColor: 'FFFFFF',
            text: 'Label-2'
          },
          {
            lang: 'en',
            fontSize: 30,
            fontColor: 'FFFFFF',
            text: 'label-2'
          }
        ],
        style: {
          bgColor: 'FF0000'
        }
      }
    ];
    readFile(slideFile)
      .then((content) =>
        captionParser(cheerio.load(content, {
          xmlMode: true
        }))
      )
      .then((actual) => {
        expect(actual)
          .to.deep.equal(expected);
        done();
      })
      .catch((e) => done(e));
  });
});
