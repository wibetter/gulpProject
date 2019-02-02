// 引入gulp配置文件
const config = require('../../config/gulp-config.js');

const gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  plugins = gulpLoadPlugins();

module.exports = function () {
  var options = {
    removeComments: false,// 清除HTML注释
    collapseWhitespace: false,// 压缩HTML
    removeEmptyAttributes: true,// 删除所有空属性值 <input id="" /> ==> <input />
    minifyJS: config.operate.html.minifyJS, // 控制是否压缩页面JS
    minifyCSS: config.operate.html.minifyCSS, // 控制是否压缩页面CSS
  };
  return gulp.src([config.srcFileDir('html'),config.srcFileDir('template')], {base: config.base.src})
    .pipe(plugins.htmlmin(options))
    .pipe(gulp.dest(config.base.dist));
};
