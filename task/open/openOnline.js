// 引入gulp配置文件
const config = require('../../config/gulp-config.js');

const gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  plugins = gulpLoadPlugins(),
  gutil = plugins.util;

module.exports = function () {
  return gulp.src(config.base.dist + config.base.indexHtml)
    .pipe(plugins.open({uri: 'http:' + config.online.distPath + config.base.indexHtml}))
    .on('error', function(err) {
      gutil.log(gutil.colors.red('[Error]'), err.toString());
    });
};
