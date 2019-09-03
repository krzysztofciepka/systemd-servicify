const util = require('util');
const exec = util.promisify(require('child_process').exec);

module.exports = {
  async nodePath() {
    const result = await exec('which node');

    if (!result.stdout) {
      throw new Error('Node binary not found');
    }

    return result.stdout.replace('\n', '');
  },
};
