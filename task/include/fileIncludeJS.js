// 引入gulp配置文件
const config = require('../../config/gulp-config.js');

const gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  plugins = gulpLoadPlugins(),
  gutil = plugins.util;

module.exports = function() {
  return gulp.src(config.distFileDir('html'), {base: config.base.dist})
    .pipe(plugins.fileInclude({
      prefix: '@JS',//变量前缀 @JSinclude
      basepath: config.base.scriptDist, // 引用文件路径
      indent: true, // 是否保留文件的缩进
    }))
    .on('error', function(err) {
      gutil.log(gutil.colors.red('[Error]'), err.toString());
    })
    .pipe(gulp.dest(config.base.dist));
};
