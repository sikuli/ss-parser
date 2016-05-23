const decompress = require('decompress');
const Promise = require('bluebird');
const fs = require('fs');
const readdir = Promise.promisify(fs.readdir);
const path = require('path');

function parsePPTX(pptxFile, outDir) {
  return decompress(pptxFile, outDir)
    .then(() =>
      readdir(path.join(outDir, 'ppt', 'slides'))
    )
    .then((slideFiles) => {
      
    })
}

module.exports = (inFile, outDir, opts) => {
  if (opts.type === 'pptx') {
    return parsePPTX(inFile, outDir);
  }
  throw new Error('Unknown file type.');
};
