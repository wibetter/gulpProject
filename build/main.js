// gulpProject 功能模块引用主入口

const gulpfile = require('../gulpfile/index.js');

module.exports = {
  dev: gulpfile.dev,
  test: gulpfile.test,
  online: gulpfile.online
};
