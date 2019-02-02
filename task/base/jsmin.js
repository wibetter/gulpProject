// 引入gulp配置文件
const config = require('../../config/gulp-config.js');

const gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  plugins = gulpLoadPlugins(),
  gutil = plugins.util;

module.exports = function () {

  /* 以下三个小任务允许同时进行 */

  // 将js库文件copy到dist/中
  gulp.src([config.srcFileDir('scriptLib')], {base: config.base.src})
    .pipe(gulp.dest(config.base.dist));

  // 将js数据文件copy到dist/中
  gulp.src([config.srcFileDir('scriptData')], {base: config.base.src})
    .pipe(gulp.dest(config.base.dist));

  // 将说明类文件copy到dist/中
  gulp.src([config.srcFileDir('text')], {base: config.base.src})
    .pipe(gulp.dest(config.base.dist));

  if (config.operate.rename) {
    return gulp.src([config.srcFileDir('script'),
      '!' + config.srcFileDir('scriptLib'),
      '!' + config.srcFileDir('scriptData'),
      '!' + config.srcFileDir('requireConfig')], {base: config.base.src + '/scripts'})
    // .pipe(plugins.jshint())
      .pipe(config.operate.compress ?
        plugins.uglify({
          mangle: true,//类型：Boolean 默认：true 是否修改变量名
          compress: true,//类型：Boolean 默认：true 是否完全压缩
        }) : gutil.noop()
      )
      .on('error', function(err) {
        gutil.log(gutil.colors.red('[Error]'), err.toString());
      })
      .pipe(plugins.rev({merge: true})) // Merge existing manifest file.
      .pipe(gulp.dest(config.base.dist + '/scripts'))
      .pipe(plugins.rev.manifest())
      .pipe(gulp.dest('rev/scripts'));
  } else {
    return gulp.src([config.srcFileDir('script'),
      '!' + config.srcFileDir('scriptLib'),
      '!' + config.srcFileDir('scriptData'),
      '!' + config.srcFileDir('requireConfig')], {base: config.base.src + '/scripts'})
    // .pipe(plugins.jshint())
      .pipe(config.operate.compress ?
        plugins.uglify({
          mangle: true,//类型：Boolean 默认：true 是否修改变量名
          compress: true,//类型：Boolean 默认：true 是否完全压缩
        }) : gutil.noop()
      )
      .on('error', function(err) {
        gutil.log(gutil.colors.red('[Error]'), err.toString());
      })
      .pipe(gulp.dest(config.base.dist + '/scripts'));
  }
};
