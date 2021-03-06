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
var pkg = require('./package.json');

module.exports = {
  base: {
    src: 'src', // 项目源代码目录
    dist: 'dist', // 项目编译后的代码存放目录
    projectName: '#projectName#', // 当前项目名称
    assetsRoot: '//goodtool666.cn', // 源代码静态资源引用根地址【临时】
    assetsSubDirectory: '/sports/webSystem/#projectName#', // 本地开发环境的项目存放路径
    testSubDirectory: '/sports/webSystem/#projectName#', // 线上测试环境的项目存放路径
    onlineSubDirectory: '/ssfe/sports/#projectName#', // 线上正式环境的项目存放路径
    version: '-v' + pkg.version + '.20190118.01', // 项目版本号
    templateDist: path.resolve(process.cwd(), 'dist').replace(/\\/g, '/') + "/template", // 存放公共模块的目录地址
    scriptDist: path.resolve(process.cwd(), 'dist').replace(/\\/g, '/') + "/scripts", // 存放项目配置数据[压缩版]目录地址
    scriptSrc: path.resolve(process.cwd(), 'src').replace(/\\/g, '/') + "/scripts", // 存放项目配置数据[未压缩]目录地址
    indexHtml:  '/pages/index.html', // 默认打开的页面路径[如果填写的页面地址则不打开]
    devDomain:  path.resolve(process.cwd(), 'dist').replace(/\\/g, '/'),// 本地开发测试域名
    testDomain: '//goodtool666.cn', // 线上测试域名
    onlineDomain: '//e.sinaimg.cn', // 正式资源域名
  },
  fileDir: {  // 各类文件匹配正则
    script: "/scripts/**/*.js",
    scriptLib: "/scripts/lib/*.js",
    scriptData: "/scripts/data/**/*.js",
    requireConfig: "/scripts/config/*require-config*.js",
    css: "/css/**/*.css",
    cssLib: "/css/lib/**/*.min.css",
    sass: "/sass/**/*.scss",
    image: "/images/**/*",
    html: "/pages/**/*.html",
    font: "/css/fonts/**/*",
    text: "/**/*.txt",
    template: "/template/**/*.html",
  },
  ftpConfig: { // 线上测试服务器配置
    host: '49.235.6.237', // 腾讯云服务器ip
    user: 'root',
    password: '123456789',
    remoteSubDirectory: '/sports/webSystem/#projectName#', // 线上测试环境的项目存放路径，与base.testSubDirectory保持一致,
  },
  deploy: {
    'msg': '发布#projectName#', // 部署信息
    'mail': '365533093@qq.com', // 邮箱地址，用于接收部署结果
    'replace': true,
    'no-cache': true,
    'maxCount': 300, // 一次上传最大文件数
    'silent': true, // 使用安静模式：使用了危险选项时不会有提示问题，
  },
  operate: {
    compress: true, // 是否压缩js，以便线上调试代码
    rename: true, // js/css是否重命名
    html: {
      minifyJS: false, // 压缩页面JS
      minifyCSS: true, // 压缩页面CSS
    }
  },
};

