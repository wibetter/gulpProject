// 引入全局功能模块
const figlet = require('figlet');
const path = require('path');
const copy = require('copy');
const fs = require('fs');

// 命令行工具
const yargs = require('yargs');

// 引入本地脚本模块
const gulpProjectInit = require('../build/initAction.js');
const gulpfile = require('../gulpfile/index.js');
const gulpconfig = require('../config/gulp-config.js');

// 引入gulp相关功能模块
const gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  plugins = gulpLoadPlugins();

// 样式
const chalk = require('chalk');

const titleTip = function(msg){
  return chalk.green(chalk.bold(msg));
};

// 测试输出
const bigTip = figlet.textSync('gulpProject', {
  font: 'lean'
});
console.log(chalk.green(bigTip));

let argv = yargs
  .command('init [options]', '初始化gulpProject配置数据', (yargs) => {
    yargs
      .reset()
      .usage(titleTip('Usage')+': $0 init [options]')
      .option('isSimplify',{
        alias: 's',
        describe: '是否使用净化配置文件',
        default: false,
      })
      .option('projectName',{
        alias: 'n',
        describe: '项目名称',
        default: 'gulpProject',
      })
      .alias('h', 'help')
  }, (argv) => {
    gulpProjectInit(argv.isSimplify, argv.projectName);
  })
  .command('dev', '本地开发环境下编译代码', (yargs) => {
    yargs
      .reset()
      .usage(titleTip('Usage')+': $0 dev')
      .alias('h', 'help')
  }, (argv) => {
    gulpfile.dev();
  })
  .command('test', '线上测试环境下编译代码', (yargs) => {
    yargs
      .reset()
      .usage(titleTip('Usage')+': $0 test')
      .alias('h', 'help')
  }, (argv) => {
    gulpfile.test();
  })
  .command('online', '线上正式环境下编译代码', (yargs) => {
    yargs
      .reset()
      .usage(titleTip('Usage')+': $0 online')
      .alias('h', 'help')
  }, (argv) => {
    gulpfile.online();
  })
  .command('create [option]', '创建系统模板', (yargs) => {
    yargs
      .reset()
      .usage(titleTip('Usage')+': $0 create [option]')
      .option('template',{
        alias: 't',
        describe: '指定系统模板名称',
        default: 'default',
      })
      .option('projectName',{
        alias: 'n',
        describe: '指定项目名称',
        default: gulpconfig.base.projectName,
      })
      .alias('h', 'help')
  }, (argv) => {
    // 创建系统模板
    const templateDir = path.resolve(__dirname, '../initData/template/'+ argv.template);
    fs.exists(templateDir, function(exist) {
      if (exist) {
        copy(path.resolve(__dirname, '../initData/template/'+argv.template+'/**'), path.resolve(process.cwd()), function(){
          // 更新模板中的系统名称
          gulp.src(path.resolve(process.cwd(), './src/**'), {base: path.resolve(process.cwd())})
            .pipe(plugins.replace('#projectName#', argv.projectName))
            .pipe(gulp.dest(path.resolve(process.cwd())));
          console.log('系统模板：'+ argv.template +'创建成功');
        });
      } else {
        console.log('找不到'+ argv.template +'系统模块');
        process.exit();
      }
    });
  })
  .alias('h','help')
  .alias('v','version')
  .help()
  .updateStrings({
    'Usage:': titleTip('Usage:'),
    'Commands:': titleTip('Commands:'),
    'Options:': titleTip('Options:')
  })
  .argv;
