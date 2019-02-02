/* gulp环境配置
 * 【备注】
 * base：项目基本配置参数，其中src是源文件目录，dist是编译文件目录；
 * fileDir：各类文件的路径匹配正则清单
 * srcFileDir：获取源文件的路径匹配正则
 * distFileDir：获取编译文件的路径匹配正则
 * dev: 开发环境配置数据，用于本地开发调试
 * test: 编译完成，上传测试服务器，并自动浏览
 * online: 上线，编译完成后，将资源路径替换成CMS线上路径
 */
const path = require('path');
const pkg = require('../package.json');

const getConfigObj = require('../build/commonUtils/getConfigObj.js');

/* 获取当前项目的构建配置文件 */
const simplifyConfig = getConfigObj(path.resolve(process.cwd(), 'config/simplify-config.js')),
  currentConfig = getConfigObj(path.resolve(process.cwd(), 'config/gulp-config.js'));

const returnValue = function(val1, val2, val3) {
  if (val1 == false) {
    return val1;
  } else if (val2 == false) {
    return val2;
  } else {
    return val1 || val2 || val3;
  }
};

var paramConfig = {
  base: {
    src: simplifyConfig.base.src || currentConfig.base.src || 'src', // 项目源代码目录
    dist: simplifyConfig.base.dist || currentConfig.base.dist || 'dist', // 项目编译后的代码存放目录
    projectName: simplifyConfig.base.projectName || currentConfig.base.projectName || 'gulpProject', // 当前项目名称
    assetsRoot: simplifyConfig.base.assetsRoot || currentConfig.base.assetsRoot || '//ssfe.test.sina.com.cn', // 源代码静态资源引用根地址【临时】
    assetsSubDirectory: simplifyConfig.base.assetsSubDirectory || currentConfig.base.assetsSubDirectory || '/sports/webSystem/gulpProject', // 本地开发环境的项目存放路径
    testSubDirectory: simplifyConfig.base.testSubDirectory || currentConfig.base.testSubDirectory || '/sports/webSystem/gulpProject', // 线上测试环境的项目存放路径
    onlineSubDirectory: simplifyConfig.base.onlineSubDirectory || currentConfig.base.onlineSubDirectory || '/ssfe/sports/gulpProject', // 线上正式环境的项目存放路径
    version: simplifyConfig.base.version || currentConfig.base.version || '-v' + pkg.version + '.20190125.01', // 项目版本号
    templateDist: simplifyConfig.base.templateDist || currentConfig.base.templateDist || path.resolve(process.cwd(), 'dist').replace(/\\/g, '/') + "/template", // 存放公共模块的目录地址
    scriptDist: simplifyConfig.base.scriptDist || currentConfig.base.scriptDist || path.resolve(process.cwd(), 'dist').replace(/\\/g, '/') + "/scripts", // 存放项目配置数据[压缩版]目录地址
    scriptSrc: simplifyConfig.base.scriptSrc || currentConfig.base.scriptSrc || path.resolve(process.cwd(), 'src').replace(/\\/g, '/') + "/scripts", // 存放项目配置数据[未压缩]目录地址
    indexHtml:  simplifyConfig.base.indexHtml || currentConfig.base.indexHtml || '/pages/news.html', // 默认打开的页面路径[如果填写的页面地址则不打开]
    devDomain:  simplifyConfig.base.devDomain || currentConfig.base.devDomain || path.resolve(process.cwd(), 'dist').replace(/\\/g, '/'),// 本地开发测试域名
    testDomain: simplifyConfig.base.testDomain || currentConfig.base.testDomain || '//ssfe.test.sina.com.cn', // 线上测试域名
    onlineDomain: simplifyConfig.base.onlineDomain || currentConfig.base.onlineDomain || '//e.sinaimg.cn', // 正式资源域名
  },
  fileDir: {  // 各类文件存放路径正则
    script: simplifyConfig.fileDir.script || currentConfig.fileDir.script || "/scripts/**/*.js",
    scriptLib: simplifyConfig.fileDir.scriptLib || currentConfig.fileDir.scriptLib || "/scripts/**/*.min.js",
    scriptData: simplifyConfig.fileDir.scriptData || currentConfig.fileDir.scriptData || "/scripts/data/**/*.js",
    requireConfig: simplifyConfig.fileDir.requireConfig || currentConfig.fileDir.requireConfig || "/scripts/**/*require-config*.js",
    css: simplifyConfig.fileDir.css || currentConfig.fileDir.css || "/css/**/*.css",
    cssLib: simplifyConfig.fileDir.cssLib || currentConfig.fileDir.cssLib || "/css/**/*.min.css",
    sass: simplifyConfig.fileDir.sass || currentConfig.fileDir.sass || "/sass/**/*.scss",
    image: simplifyConfig.fileDir.image || currentConfig.fileDir.image || "/images/**/*",
    html: simplifyConfig.fileDir.html || currentConfig.fileDir.html || "/pages/**/*.html",
    font: simplifyConfig.fileDir.font || currentConfig.fileDir.font || "/css/fonts/**/*",
    text: simplifyConfig.fileDir.text || currentConfig.fileDir.text || "/**/*.txt",
    template: simplifyConfig.fileDir.template || currentConfig.fileDir.template || "/template/**/*.html",
  },
  /*
  deploy: {  // 部署相关配置数据
    msg: simplifyConfig.deploy.msg || currentConfig.deploy.msg || '发布gulpProject', // 部署信息
    mail: simplifyConfig.deploy.mail || currentConfig.deploy.mail || 'liudan6@staff.sina.com.cn', // 邮箱地址，用于接收部署结果
    replace: returnValue(simplifyConfig.deploy.replace, currentConfig.deploy.replace, true),
    'no-cache': returnValue(simplifyConfig.deploy['no-cache'], currentConfig.deploy['no-cache'], true),
    maxCount: simplifyConfig.deploy.maxCount || currentConfig.deploy.maxCount || 300, // 一次上传最大文件数
    silent: returnValue(simplifyConfig.deploy.silent, currentConfig.deploy.silent, true), // 使用安静模式：使用了危险选项时不会有提示问题，
  },
  */
  operate: {
    compress: returnValue(simplifyConfig.operate.compress, currentConfig.operate.compress, true), // 是否压缩js，以便线上调试代码
    rename: returnValue(simplifyConfig.operate.rename, currentConfig.operate.rename, true), // js是否重命名
    html: {
      minifyJS: returnValue(simplifyConfig.operate.html.minifyJS, currentConfig.operate.html.minifyJS, false), // 压缩页面JS
      minifyCSS: returnValue(simplifyConfig.operate.html.minifyCSS, currentConfig.operate.html.minifyCSS, true), // 压缩页面CSS
    }
  },
};

module.exports = {
  base: paramConfig.base,
  fileDir: paramConfig.fileDir,
  deploy: paramConfig.deploy,
  dirList: { // 各类文件目录匹配正则
    script: paramConfig.base.onlineSubDirectory + "/scripts",
    css: paramConfig.base.onlineSubDirectory + "/css",
    image: paramConfig.base.onlineSubDirectory + "/image",
  },
  fileDomainList: { // 各类文件目录匹配正则
    script: "//e2.sinaimg.cn",
    css: "//e0.sinaimg.cn",
    image: "//e1.sinaimg.cn",
  },
  operate: paramConfig.operate,
  srcFileDir: function(file) { // 获取各类源文件匹配正则表达式
    return paramConfig.base.src + paramConfig.fileDir[file];
  },
  distFileDir: function(file) { // 获取各类编译文件匹配正则表达式
    return paramConfig.base.dist + paramConfig.fileDir[file];
  },
  dev: { // 本地开发环境配置数据
    srcPath: paramConfig.base.assetsRoot + paramConfig.base.assetsSubDirectory + '/' + paramConfig.base.src,
    distPath:  paramConfig.base.devDomain
  },
  test: { // 线上测试服务器环境配置数据
    srcPath: paramConfig.base.assetsRoot + paramConfig.base.assetsSubDirectory + '/' + paramConfig.base.src,
    distPath:  paramConfig.base.testDomain + paramConfig.base.testSubDirectory
  },
  online: { // 线上正式环境配置数据
    srcPath: paramConfig.base.assetsRoot + paramConfig.base.assetsSubDirectory + '/' + paramConfig.base.src,
    distPath:  paramConfig.base.onlineDomain + paramConfig.base.onlineSubDirectory,
  }
};
