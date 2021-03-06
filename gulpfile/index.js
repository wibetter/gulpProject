// 引入gulp配置文件
const config = require('../config/gulp-config.js');

// 引入node功能模块
const del = require('del');
const ora = require('ora');

// 引入gulp相关模块
const gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  plugins = gulpLoadPlugins();

/* 执行sass任务：
   将src/sass/中的sass文件转成css文件，并存放至src/css/中
 */
gulp.task('sass', require('../task/base/sass.js'));

gulp.task("autowatch", function () {
  return gulp.watch([config.srcFileDir('sass')], ['sass']);		//监听sass文件改变后，编译、去缓存
});

gulp.task('cssmin', ['sass'], require('../task/base/cssmin.js'));

gulp.task('jsmin', require('../task/base/jsmin.js'));

gulp.task('imgmin', require('../task/base/imgmin.js'));

gulp.task('configmin', require('../task/base/configmin.js'));

gulp.task('htmlmin', require('../task/base/htmlmin.js'));

// 合并html文件：主要用于合并公共的html模块【注：编译后进行合并】
gulp.task('fileinclude', require('../task/include/fileinclude.js'));

// 合并编译后的js 配置文件(已经压缩处理)：主要用于将页面配置数据置入中，以便后续维护【注：编译前进行合并】
gulp.task('fileIncludeJS', require('../task/include/fileIncludeJS.js'));

// 合并编译前的js 配置文件(未压缩处理)：主要用于将页面配置数据置入中，以便后续维护【注：编译前进行合并】
gulp.task('fileIncludeSrcJS', require('../task/include/fileIncludeSrcJS.js'));

// 将rev/scripts/*.json中的‘.js’后缀去掉
gulp.task('removeSuffix', require('../task/removeSuffix.js'));

/*
  替换html中的资源引用地址
  备注：默认此处的替换不会更新requireJS中的配置信息，因为里面的都是去掉了.js后缀的
*/
gulp.task('updateCssVersion', require('../task/version/updateCssVersion.js'));
gulp.task('updateJsVersion',  require('../task/version/updateJsVersion.js'));
gulp.task('updateHtmlVersion', require('../task/version/updateHtmlVersion.js'));

// 更新html中require-config版本号
gulp.task('updateHtmlConfigVersion', require('../task/version/updateHtmlConfigVersion.js'));

// 更新配置文件中使用到的js版本号
gulp.task('updateConfigVersion', ['removeSuffix'], require('../task/version/updateConfigVersion.js'));

// 切换系统版本号
gulp.task('switchVersion', require('../task/switch/switchVersion.js'));

// 将编译后资源地址切换至dev环境根目录下
gulp.task('switchDev', require('../task/switch/switchDev.js'));

// 将编译后资源地址切换至test环境根目录下
gulp.task('switchTest', require('../task/switch/switchTest.js'));

// 将编译后资源地址切换至online环境根目录下
gulp.task('switchOnline', require('../task/switch/switchOnline.js'));

gulp.task('switchOnlineConfig', require('../task/switch/switchOnlineConfig.js'));

gulp.task('openDev', require('../task/open/openDev.js'));

// 将编译后代码中的资源引用地址切换成dist中的
gulp.task('ftpToTest', require('../task/ftpToTest.js'));

// 以线上测试服务器地址打开首页
gulp.task('openTest', require('../task/open/openTest.js'));

// 以线上正式地址打开首页
gulp.task('openOnline', require('../task/open/openOnline.js'));

// 打包编译后的代码，以便传输和自动部署
gulp.task('zip', require('../task/zip.js'));

// 将线上环境的代码部署到新浪云存储中
gulp.task('deploy', require('../task/deploy.js'));

module.exports = {
  dev: function() {
    const spinner = ora('[本地开发环境]开始编译').start();
    spinner.text = '[本地开发环境]开始清空'+ config.base.dist + '/中的文件...';
    del([config.base.dist + '/**', 'rev/**']).then(() => {
      spinner.text = '[本地开发环境]已清空'+ config.base.dist + '/中的文件\n';
      setTimeout(function(){
        spinner.text = '[本地开发环境]编译源代码...\n';
      }, 1000);
      plugins.sequence(
        ['imgmin', 'jsmin', 'cssmin', 'htmlmin','configmin'],
        'fileinclude',
        'fileIncludeSrcJS',
        ['updateCssVersion','updateJsVersion','updateHtmlVersion'],
        'updateHtmlConfigVersion',
        'updateConfigVersion',
        'fileIncludeJS',
        'switchVersion',
        'switchDev',
        'openDev')(function(){
          spinner.succeed('[本地开发环境]源代码完成编译！\n');
        })
    });
  },
  test: function() {
    console.log('[线上开发环境]开始编译');
    const spinner = ora('[线上开发环境]开始编译').start();
    spinner.text = '[线上开发环境]开始清空'+ config.base.dist + '/中的文件...';

    del([config.base.dist + '/**', 'rev/**']).then(() => {
      spinner.text = '[线上开发环境]已清空'+ config.base.dist + '/中的文件\n';
      setTimeout(function(){
        spinner.text = '[线上开发环境]编译源代码...\n';
      }, 1000);
      plugins.sequence(
        ['cssmin', 'jsmin', 'imgmin', 'htmlmin', 'configmin'],
        'fileinclude',
        'fileIncludeSrcJS',
        ['updateCssVersion','updateJsVersion','updateHtmlVersion'],
        'updateHtmlConfigVersion',
        'updateConfigVersion',
        'fileIncludeJS',
        'switchVersion',
        'switchTest',
        'ftpToTest',
        'openTest')(function(){
        spinner.succeed('[线上开发环境]源代码完成编译！\n');
      })
    });
  },
  online: function() {
    console.log('[线上正式环境]开始编译');
    const spinner = ora('[线上正式环境]开始编译').start();
    spinner.text = '[线上正式环境]开始清空'+ config.base.dist + '/中的文件...';
    del([config.base.dist + '/**', 'rev/**', 'zip/**']).then(() => {
      spinner.text = '[线上正式环境]已清空'+ config.base.dist + '/中的文件\n';
      setTimeout(function(){
        spinner.text = '[线上正式环境]编译源代码...\n';
      }, 1000);
      plugins.sequence(['jsmin', 'cssmin', 'htmlmin','configmin', 'imgmin'],
        'switchOnlineConfig',
        'fileinclude',
        'fileIncludeSrcJS',
        ['updateCssVersion','updateJsVersion','updateHtmlVersion'],
        'updateHtmlConfigVersion',
        'updateConfigVersion',
        'fileIncludeJS',
        'switchVersion',
        'switchOnline',
        'openOnline',
        'zip')(function(){  // 去掉自动部署工具（仅限公司内网使用）
          spinner.succeed('[线上正式环境]源代码完成编译！\n');
        })
    });
  }
};
