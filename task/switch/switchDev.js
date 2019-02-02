// 引入gulp配置文件
const config = require('../../config/gulp-config.js');

const gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  plugins = gulpLoadPlugins();

module.exports = function () {
  // 以便本地运行
  return gulp.src(config.base.dist + '/**', {base: config.base.dist})
    .pipe(plugins.replace(config.dev.srcPath, config.dev.distPath))
    .pipe(plugins.replace('//purity', 'http://purity'))
    .pipe(plugins.replace('//n.sinaimg.cn', 'http://n.sinaimg.cn'))
    .pipe(plugins.replace('//e.sinaimg.cn', 'http://e.sinaimg.cn'))
    .pipe(plugins.replace('//e0.sinaimg.cn', 'http://e2.sinaimg.cn'))
    .pipe(plugins.replace('//e1.sinaimg.cn', 'http://e2.sinaimg.cn'))
    .pipe(plugins.replace('//e2.sinaimg.cn', 'http://e2.sinaimg.cn'))
    .pipe(plugins.replace('//mjs.sinaimg.cn', 'http://mjs.sinaimg.cn'))
    .pipe(gulp.dest(config.base.dist));
};
