// 引入gulp配置文件
const config = require('../config/gulp-config.js');

const gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  plugins = gulpLoadPlugins();

module.exports = function() {
  return gulp.src([config.base.dist + '/**/*', '!'+ config.base.dist +'/template/**/*', '!**/*.txt'])
    .pipe(plugins.zip('dist'+ config.base.version + '.zip'))
    .pipe(gulp.dest('zip'))
};
