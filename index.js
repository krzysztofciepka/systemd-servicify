#!/usr/bin/env node

const program = require('commander');
const fs = require('fs');
const os = require('os');
const path = require('path');
const generateTemplate = require('./template');
const systemd = require('./systemd');
const utils = require('./utils');
const servicifyPackage = require('./package.json');

program
  .version(servicifyPackage.version, '-v, --version', 'servicify version')
  .arguments('[entrypoint]')
  .option('-s, --service <service name>', 'name of systemd service')
  .option('-D, --dir <path>', 'root directory of node app')
  .option('-u, --user <username>', 'user which should own systemd service')
  .option('-d, --desc <description>', 'description of systemd service')
  .parse(process.argv);

(async () => {
  try {
    const appPackage = require(path.join(program.dir || process.cwd(), 'package.json'));
    const node = await utils.nodePath();

    const config = {
      serviceName: `${program.service || appPackage.name || 'servicify-default'}.service`,
      templatePath: 'templates/forever.template',
      params: {
        nodePath: node,
        description: program.desc || appPackage.description || 'Auto-generated nodejs service',
        entrypoint: program.args[0] || 'index.js',
        user: program.user || os.userInfo().username,
        workDir: program.dir || process.cwd(),
      },
    };

    if (!fs.existsSync(path.join(config.params.workDir, config.params.entrypoint))) {
      throw new Error(`File ${config.params.entrypoint} not found`);
    }

    if (await systemd.serviceExists(config.serviceName)) {
      throw new Error(`Service ${config.serviceName} already exists`);
    }

    const template = fs.readFileSync(
      path.join(__dirname, config.templatePath),
      { encoding: 'utf8' },
    );

    await systemd.createService(
      config.serviceName,
      generateTemplate(template, config.params),
    );
    await systemd.enableService(config.serviceName);
    await systemd.startService(config.serviceName);
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      console.error('No package.json found. Probably not in project root');
    } else {
      console.error(err.message);
    }
    process.exit(1);
  }
})();
