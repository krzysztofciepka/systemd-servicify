const util = require('util');
const exec = util.promisify(require('child_process').exec);

function serviceExists(name) {
  return new Promise((resolve) => {
    exec(`systemctl list-units --full -all | grep "${name}"`)
      .then(() => {
        resolve(true);
      })
      .catch((err) => {
        if (err.code === 1) {
          resolve(false);
        } else {
          throw err;
        }
      });
  });
}

function createService(name, template) {
  return exec(`sudo bash -c 'echo "${template}" > /etc/systemd/system/${name}'`);
}

function enableService(name) {
  return exec(`sudo systemctl enable ${name}`);
}

function startService(name) {
  return exec(`sudo systemctl start ${name}`);
}

module.exports = {
  serviceExists,
  createService,
  enableService,
  startService,
};
