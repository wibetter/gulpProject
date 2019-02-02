// 引入gulp配置文件
const gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  plugins = gulpLoadPlugins();

module.exports = function () {
  return gulp.src(['rev/scripts/*.json'], {base: 'rev'})
    .pipe(plugins.replace('.js', ''))
    .pipe(gulp.dest('rev'));
};
