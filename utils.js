const util = require('util');
const exec = util.promisify(require('child_process').exec);

module.exports = {
  async nodePath() {
    try {
      const result = await exec('which node');
      return result.stdout.replace('\n', '');
    } catch (err) {
      throw new Error('Node binary not found');
    }
  },
};
