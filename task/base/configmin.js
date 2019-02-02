// 引入gulp配置文件
const config = require('../../config/gulp-config.js');

const gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  plugins = gulpLoadPlugins(),
  gutil = plugins.util;

module.exports = function () {
  // 处理require-config文件
  gulp.src([config.srcFileDir('requireConfig')], {base: config.base.src})
  // .pipe(plugins.jshint())
    .pipe(config.operate.compress ?
      plugins.uglify({
        mangle: true,//类型：Boolean 默认：true 是否修改变量名
        compress: true,//类型：Boolean 默认：true 是否完全压缩
      }) : gutil.noop()
    )
    .pipe(
      plugins.rename({
        suffix: config.base.version,
      })
    )
    .pipe(gulp.dest(config.base.dist))
};
