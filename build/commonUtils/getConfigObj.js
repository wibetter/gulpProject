const glob = require('glob');

const fileExists = function(fileDir) {
  let exists = false;
  const files = glob.sync(fileDir);
  if (files.length > 0) {
    exists = true;
  }
  return exists;
};


module.exports = function(currentConfigDir) {
  let currentConfig = {
    base: {},
    fileDir: {},
    deploy: {},
    operate: {
      html: {}
    }
  };
  if (fileExists(currentConfigDir)) {
    const configObj = require(currentConfigDir);
    if (configObj && configObj.base) {
      currentConfig = configObj;
    }
  }
  return currentConfig;
};
