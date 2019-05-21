"use strict";

const fs = require('fs');
const validation =  require("./validation");

module.exports = async (app) => {
  let config, work;
  // get a validated config object
  try {
    config = await app.modules.jsonload(`${app.path}/config/work.json`);
    app.config.work = await validation(app, config);
  } catch (e) {
    console.log(e);
    throw e;
  }

  const load = async () => {
    for (let conf of app.config.work) {
      try {
        work = await app.modules.jsonload(`${conf.path}/${conf.file}`);
        app[conf.name] = work;
      } catch (e) {
        if (e.code === 'ENOENT') {
          // file does not exists
          app.modules.logger.log("warn", e.message);
        }
      }
    }
  }

  const save = async () => {
    for (let conf of app.config.work) {
      try {
        fs.writeFileSync(
          `${conf.path}/${conf.file}`,
          JSON.stringify(app[conf.name])
        );
      } catch (e) {
        app.modules.logger.log("warn", e.message);
      }
    }
  }

  // load the work
  await load();

  return { load, save };
};
