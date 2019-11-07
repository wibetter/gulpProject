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
let simplifyConfig = getConfigObj(path.resolve(process.cwd(), 'simplify-config.js')),
  currentConfig = getConfigObj(path.resolve(process.cwd(), 'gulp-config.js'));

if(JSON.stringify(simplifyConfig) == "{}") { // 兼容老版本的gulpProject 的配置文件存放位置
  simplifyConfig = getConfigObj(path.resolve(process.cwd(), 'config/simplify-config.js'));
}

if(JSON.stringify(currentConfig) == "{}") { // 兼容老版本的gulpProject 的配置文件存放位置
  currentConfig = getConfigObj(path.resolve(process.cwd(), 'config/gulp-config.js'));
}

const defaultConfig = {
  base: {
    src: 'src', // 项目源代码目录
    dist: 'dist', // 项目编译后的代码存放目录
    projectName: 'gulpProject', // 当前项目名称
    assetsRoot: '//goodtool666.cn', // 源代码静态资源引用根地址【临时】
    assetsSubDirectory: '/sports/webSystem/gulpProject', // 本地开发环境的项目存放路径
    testSubDirectory: '/sports/webSystem/gulpProject', // 线上测试环境的项目存放路径
    onlineSubDirectory: '/ssfe/sports/gulpProject', // 线上正式环境的项目存放路径
    version: '-v' + pkg.version + '.20190125.01', // 项目版本号
    templateDist: path.resolve(process.cwd(), 'dist').replace(/\\/g, '/') + "/template", // 存放公共模块的目录地址
    scriptDist: path.resolve(process.cwd(), 'dist').replace(/\\/g, '/') + "/scripts", // 存放项目配置数据[压缩版]目录地址
    scriptSrc: path.resolve(process.cwd(), 'src').replace(/\\/g, '/') + "/scripts", // 存放项目配置数据[未压缩]目录地址
    indexHtml: '/pages/news.html', // 默认打开的页面路径[如果填写的页面地址则不打开]
    devDomain:  path.resolve(process.cwd(), 'dist').replace(/\\/g, '/'),// 本地开发测试域名
    testDomain: '//goodtool666.cn', // 线上测试域名
    onlineDomain: '//e.sinaimg.cn', // 正式资源域名
  },
  fileDir: {  // 各类文件存放路径正则
    script: "/scripts/**/*.js",
    scriptLib: "/scripts/**/*.min.js",
    scriptData: "/scripts/data/**/*.js",
    requireConfig: "/scripts/**/*require-config*.js",
    css: "/css/**/*.css",
    cssLib: "/css/**/*.min.css",
    sass: "/sass/**/*.scss",
    image: "/images/**/*",
    html: "/pages/**/*.html",
    font: "/css/fonts/**/*",
    text: "/**/*.txt",
    template: "/template/**/*.html",
  },
  ftpConfig: { // 线上测试服务器配置
    host: '10.41.41.73', // 默认 '10.210.227.108'
    user: 'sinas',
    password: 'sinasports',
    remoteSubDirectory: '/sports/webSystem/gulpProject', // 线上测试环境的项目存放路径，与base.testSubDirectory保持一致,
  },
  deploy: {  // 部署相关配置数据
    msg: '发布gulpProject', // 部署信息
    mail: 'liudan6@staff.sina.com.cn', // 邮箱地址，用于接收部署结果
    host: '10.41.41.73', // 默认 '10.210.227.108'
    replace: true,
    'no-cache': true,
    maxCount: 300, // 一次上传最大文件数
    silent: true, // 使用安静模式：使用了危险选项时不会有提示问题，
  },
  operate: {
    compress: true, // 是否压缩js，以便线上调试代码
    rename: true, // js是否重命名
    html: {
      minifyJS: false, // 是否压缩页面JS
      minifyCSS: true, // 是否压缩页面CSS
    }
  },
};
// 整合simplifyConfig和currentConfigd的配置数据
const paramConfig = Object.assign({}, defaultConfig, simplifyConfig, currentConfig);

module.exports = {
  base: paramConfig.base,
  fileDir: paramConfig.fileDir,
  ftpConfig: paramConfig.ftpConfig,
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
