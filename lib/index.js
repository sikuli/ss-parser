const decompress = require('decompress');

function parsePPTX(pptxFile, outDir) {
  return decompress(pptxFile, outDir)
  .then((files) =>
    files
  );
}

module.exports = (inFile, outDir, opts) => {
  if (opts.type === 'pptx') {
    return parsePPTX(inFile, outDir);
  }
  throw new Error('Unknown file type.');
};
