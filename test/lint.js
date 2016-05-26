/* eslint no-console: "off" */
const CLIEngine = require('eslint').CLIEngine;

describe('linting', () => {
  it('performs source code linting', (done) => {
    const cli = new CLIEngine({ useEslintrc: true });
    const report = cli.executeOnFiles(['test/', 'lib/']);
    const formatter = cli.getFormatter();
    console.log(formatter(report.results));
    if (report && report.errorCount > 0) {
      done(new Error('Source code linting failed'));
    }
    else {
      done();
    }
  });
});
