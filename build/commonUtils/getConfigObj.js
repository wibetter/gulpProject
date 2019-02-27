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
  let currentConfig, defaultConfig = {
    base: {},
    fileDir: {},
    deploy: {},
    operate: {
      html: {}
    }
  };
  if (fileExists(currentConfigDir)) {
    const configObj = require(currentConfigDir);
    if (configObj && (configObj.base || configObj.host)) {
      currentConfig = configObj;
    }
  }
  if (!currentConfig) {
    currentConfig = defaultConfig;
  }
  return currentConfig;
};
