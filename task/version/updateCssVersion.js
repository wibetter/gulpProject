// 引入gulp配置文件
const config = require('../../config/gulp-config.js');

const gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  plugins = gulpLoadPlugins();

module.exports = function () {
  return gulp.src(['rev/**/*.json', config.distFileDir('css'), '!' + config.distFileDir('cssLib') ], {base: config.base.dist})
    .pipe(plugins.revCollector())   // 给所有的CSS中相应的内容添加上版本号
    .pipe(gulp.dest(config.base.dist));
};
