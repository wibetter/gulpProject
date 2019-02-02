// 引入gulp配置文件
const config = require('../../config/gulp-config.js');

const gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  plugins = gulpLoadPlugins();

module.exports = function () {
  return gulp.src(config.base.dist + '/**', {base: config.base.dist})
    .pipe(plugins.replace(config.online.srcPath, config.online.distPath))
    .pipe(plugins.replace(config.base.onlineDomain + config.dirList.script, config.fileDomainList.script + config.dirList.script))
    .pipe(plugins.replace(config.base.onlineDomain + config.dirList.css, config.fileDomainList.css + config.dirList.css))
    .pipe(plugins.replace(config.base.onlineDomain + config.dirList.image, config.fileDomainList.image + config.dirList.image))
    .pipe(gulp.dest(config.base.dist));
};
