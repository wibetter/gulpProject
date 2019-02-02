// 引入gulp配置文件
const config = require('../../config/gulp-config.js');

const gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  plugins = gulpLoadPlugins();

module.exports = function () {
  return gulp.src([config.distFileDir('html')], {base: config.base.dist})		//- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
    .pipe(plugins.replace("require-config", "require-config" + config.base.version))
    .pipe(gulp.dest(config.base.dist));					//- 替换后的文件输出的目录
};
