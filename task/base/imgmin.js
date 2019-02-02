// 引入gulp配置文件
const config = require('../../config/gulp-config.js');

const gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  plugins = gulpLoadPlugins();

module.exports = function () {
  return gulp.src([config.srcFileDir('image')], {base: config.base.src})
    .pipe(plugins.cache(plugins.imagemin()))	//没有修改的图片直接从缓存文件读取
    .pipe(plugins.rev())
    .pipe(gulp.dest(config.base.dist))
    .pipe(plugins.rev.manifest())
    .pipe(gulp.dest('rev/img'));
};
