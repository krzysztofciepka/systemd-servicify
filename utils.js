const util = require('util');
const exec = util.promisify(require('child_process').exec);

module.exports = {
  async nodePath() {
    return (await exec('which node')).stdout.replace('\n', '');
  },
};
