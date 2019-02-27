const path = require('path');

const getConfigObj = require('../../build/commonUtils/getConfigObj.js');

/* 获取当前项目的构建配置文件 */
const pkg = getConfigObj(path.resolve(process.cwd(), './package.json'));

// 引入gulp配置文件
const config = require('../../config/gulp-config.js');

const gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  plugins = gulpLoadPlugins();

module.exports = function () {
  var currentVersion = config.base.version;
  currentVersion = currentVersion.substring(('-v' + (pkg.version || '0.1.1') + '.').length);
  // 将源代码中的#version#改成对应的版本号
  return gulp.src(config.base.dist + '/**', {base: config.base.dist})
    .pipe(plugins.replace('#version#', currentVersion))
    .pipe(gulp.dest(config.base.dist));
};
