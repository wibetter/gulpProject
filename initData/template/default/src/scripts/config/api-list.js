/*
   定义API地址清单:APIList,并注入全局变量widow中【备注】
 */
(function(){
  var _protocal = location.protocol;
  if (_protocal !== 'http:' && _protocal !== 'https:') {
    _protocal = 'http:';
  }
  window.APIList = {
    recommend: _protocal + '//cre.dp.sina.cn/api/v3/get', // 相关推荐
    comment: _protocal + '//interface.sina.cn/wap_api/article_getall.d.json', // 热门评论
    support: _protocal + '//comment5.news.sina.com.cn/cmnt/vote', // 点赞
    appSharePageUrl: _protocal + '//interface.sina.cn/sports/client/manage_doc.d.json' // 普通页地址转成分享
  };
})();
