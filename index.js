#!/usr/bin/env node

/* eslint-disable import/no-dynamic-require */
/* eslint-disable no-console */

const program = require('commander');
const fs = require('fs');
const os = require('os');
const path = require('path');

const template = require('./template');
const systemd = require('./systemd');
const utils = require('./utils');

const servicifyPackage = require(path.join(__dirname, 'package.json'));

program
  .version(servicifyPackage.version, '-v, --version', 'servicify version')
  .arguments('[entrypoint]')
  .option('-s, --service <service name>', 'name of systemd service')
  .option('-D, --dir <path>', 'root directory of node app')
  .option('-u, --user <username>', 'user which should own systemd service')
  .option('-d, --desc <description>', 'description of systemd service')
  .parse(process.argv);


const appPackage = require(path.join(program.dir || process.cwd(), 'package.json'));

(async () => {
  try {
    const state = {
      serviceName: `${program.service || appPackage.name || 'servicify-default'}.service`,
      templateParams: {
        nodePath: await utils.nodePath(),
        description: program.desc || appPackage.description || 'Auto-generated nodejs service',
        entrypoint: program.args[0] || 'index.js',
        user: program.user || os.userInfo().username,
        workDir: process.cwd(),
      },
    };

    if (await systemd.serviceExists(state.serviceName)) {
      console.error(`Service ${state.serviceName} already exists`);
      process.exit(1);
    }

    const templateStr = fs.readFileSync(
      path.join(__dirname, 'templates/forever.template'),
      { encoding: 'utf8' },
    );

    await systemd.createService(state.serviceName, template(templateStr, state.templateParams));
    await systemd.enableService(state.serviceName);
    await systemd.startService(state.serviceName);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
