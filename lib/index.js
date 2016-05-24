const decompress = require('decompress');
const Promise = require('bluebird');
const fs = require('fs');
const readdir = Promise.promisify(fs.readdir);
const path = require('path');
const slideParser = require('./parsers/slideParser');

function parsePPTX(pptxFile, outDir) {
  return decompress(pptxFile, outDir)
    .then(() =>
      readdir(path.join(outDir, 'ppt', 'slides'))
    )
    .then((slideFiles) => {
      const xmlFiles = slideFiles.filter((file) => path.extname(file) === '.xml');
      return Promise.map(xmlFiles, (file) => slideParser(file))
                        .then((results) => results);
    })
    .catch((e) => Promise.reject(e));
}

module.exports = (inFile, outDir, opts) => {
  if (opts.type === 'pptx') {
    return parsePPTX(inFile, outDir);
  }
  throw new Error('Unknown file type.');
};
