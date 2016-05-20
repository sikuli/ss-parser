const fs = require('fs');
const path = require('path');
const parser = require('./lib');

module.exports = (inFile, outDir, opts) => {
  if (typeof inFile !== 'string' || typeof outDir !== 'string') {
    throw new TypeError('Expected a string path name.');
  }
  if (!fs.statSync(inFile).isFile() || !path.isAbsolute(inFile)) {
    throw new Error('Input path must be an absolute path to a file.');
  }
  if (!fs.statSync(outDir).isDirectory() || !path.isAbsolute(outDir)) {
    throw new Error('Output path must be an absolute path to a direcoty.');
  }
  parser(inFile, outDir, opts);
};
