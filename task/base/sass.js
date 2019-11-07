// 引入gulp配置文件
const config = require('../../config/gulp-config.js');

const gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  plugins = gulpLoadPlugins(),
  gutil = plugins.util;

/* 执行sass任务：
   将src/sass/中的sass文件转成css文件，并存放至src/css/中
  */
module.exports = function () {
  return gulp.src(config.srcFileDir('sass'), {base: config.base.src + '/sass'})
    .pipe(plugins.sass())
    .on('error', function(err) {
      gutil.log(gutil.colors.red('[Error]'), err.toString());
    })
    .pipe(gulp.dest(config.base.src + '/css')); /* 先存至源代码中 */
};
