/*
线上页面配置数据，npm run build时会将page-config.js替换成online-page-config.js
*/
var PAGEDATA = {
  number: 'wm23900_0012', // 客户端分享渠道
  page: 0, // 推荐分页：默认取第一页
  page_size: 15, // 推荐分页：默认取一页取15个
  // 项目根地址（静态资源引用根地址）：require-config.js 的baseUrl引用此变量
  projectBase: '//ssfe.test.sina.com.cn/sports/webSystem/#projectName#/src',
  /* 相关推荐的参数 */
  cateid: '2L', // 栏目列表
  cre: 'sptapp', // 这两个参数主要用于描述产品位，需要statics=1激活这两个参数
  mod: 'r',
  merge: 3, // 显示推荐原因
  statics: 1,
  this_page: 1, // 是否过滤当前页
  rfunc: 105, // 应用场景参数
  app_type: 112, // 客户端类型: 110-新闻app，111-财经app，112-体育app
  /* 以上是相关推荐的参数 */
  isMore: true, // 相关推荐是否还有更多数据
  // app下载页
  appDownload: 'https://tale.sports.sina.com.cn/ios/appDownload.htm',
  // 通用链接
  universalLink: 'https://tale.sports.sina.com.cn/ios/appDownload.htm',
};
