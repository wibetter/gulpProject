// 引入gulp配置文件
const config = require('../../config/gulp-config.js');

const gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  plugins = gulpLoadPlugins(),
  gutil = plugins.util;

module.exports = function () {
  return gulp.src(['rev/**/*.json', config.distFileDir('html')], {base: config.base.dist})		//- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
    .pipe(plugins.revCollector())     // 给所有的HTML中相应的内容添加上版本号
    .on('error', function(err) {
      gutil.log(gutil.colors.red('[Error]'), err.toString());
    })
    .pipe(gulp.dest(config.base.dist));					//- 替换后的文件输出的目录
};
