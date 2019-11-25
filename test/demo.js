const gulpProject = require('../gulpfile/index');
gulpProject.test();

// const inspect = require('../build/inspect.js');
// inspect();

// const gulpProjectInit = require('../build/init.js');

// gulpProjectInit(false, 'app2test');

// console.log(process.cwd());
// console.log(__dirname);

// const ora = require('ora');

/*
const gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins');
const plugins = gulpLoadPlugins(),
  gutil = plugins.util,
  ftp = require('vinyl-ftp'); // 资源文件上传

var conn = ftp.create({
  host: '144.34.184.123',
  user: 'root',
  password: 'test',
  port: '21',
  log: gutil.log
});
// 将编译完成的代码上传到开发服务器上
return gulp.src( 'dist/**', { base: 'dist', buffer: false } ).on('error', function(err) {
    gutil.log('[Error]', err.toString());
   })
  .pipe( conn.dest( '/sports/webSystem/youkuVideo' ) ).on('error', function(err) {
    gutil.log('[Error]', err.toString());
  });
*/

// var options = process.argv;
// console.log(options[2]);
