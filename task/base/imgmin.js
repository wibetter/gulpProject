// 引入gulp配置文件
const config = require('../../config/gulp-config.js');

const gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  plugins = gulpLoadPlugins(),
  gutil = plugins.util;

module.exports = function () {

  // 将源代码中的图片复制到dist目录中
  return gulp.src([config.srcFileDir('image')], {base: config.base.src})
    .pipe(gulp.dest(config.base.dist));

  /*
  // imagemin存在安装问题，临时去掉图片压缩功能:  "gulp-imagemin": "^4.1.0"
  return gulp.src([config.srcFileDir('image')], {base: config.base.src})
    .pipe(plugins.imagemin())	//没有修改的图片直接从缓存文件读取，临时去掉 和 plugins.cache()
    .on('error', function(err) {
      gutil.log(gutil.colors.red('[Error]'), err.toString());
    })
    .pipe(plugins.rev())
    .pipe(gulp.dest(config.base.dist))
    .pipe(plugins.rev.manifest())
    .pipe(gulp.dest('rev/img'));
   */

};
