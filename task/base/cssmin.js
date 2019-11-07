// 引入gulp配置文件
const config = require('../../config/gulp-config.js');

const gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  plugins = gulpLoadPlugins(),

  gutil = plugins.util;

module.exports = function () {

  /* 以下两个小任务允许同时进行 */

  // 将字体文件和第三方css库文件copy到dist/中
  gulp.src([config.srcFileDir('font'), config.srcFileDir('cssLib')], {base: config.base.src })
    .pipe(gulp.dest(config.base.dist));

  if (config.operate.rename) {
    return  gulp.src([config.srcFileDir('css'), '!' + config.srcFileDir('cssLib')], {base: config.base.src})
    //.pipe(plugins.csslint())
    // .pipe(plugins.autoprefixer())
    // .pipe(plugins.csscomb())
    // .pipe(plugins.csso())
      .pipe(plugins.cssimport())
      .on('error', function(err) {
        gutil.log(gutil.colors.red('[Error]'), err.toString());
      })
      .pipe(plugins.cssmin())
      .pipe(plugins.rev())
      .pipe(gulp.dest(config.base.dist))
      .pipe(plugins.rev.manifest()) // 生成一个rev-manifest.json
      .pipe(gulp.dest('rev/css'));
  } else {
    return  gulp.src([config.srcFileDir('css'), '!' + config.srcFileDir('cssLib')], {base: config.base.src})
    //.pipe(plugins.csslint())
    // .pipe(plugins.autoprefixer())
    // .pipe(plugins.csscomb())
    // .pipe(plugins.csso())
      .pipe(plugins.cssimport())
      .on('error', function(err) {
        gutil.log(gutil.colors.red('[Error]'), err.toString());
      })
      .pipe(plugins.cssmin())
      .pipe(gulp.dest(config.base.dist))
  }

};
