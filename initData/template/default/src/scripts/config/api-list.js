/*
   定义API地址清单:APIList,并注入全局变量widow中【备注】
 */
var _protocal = location.protocol;
window.APIList = {
  recommend: _protocal + '//cre.dp.sina.cn/api/v3/get', // 相关推荐
  comment: _protocal + '//interface.sina.cn/wap_api/article_getall.d.json', // 热门评论
  support: _protocal + '//comment5.news.sina.com.cn/cmnt/vote', // 点赞
  appSharePageUrl: _protocal + '//interface.sina.cn/sports/client/manage_doc.d.json' // 普通页地址转成分享
  /*
    【跟帖支持】
    内部调用： http://comment5.intra.sina.com.cn/cmnt/vote
    外部调用： http://comment5.news.sina.com.cn/cmnt/vote
   */
};