(function(){
  if (_require_config) {
    var requireJs = require.config(_require_config);
  }
  requireJs(['jQuery', 'utils', 'sharePage', 'sinaWeixinConfigReady', 'scrollToBottom', 'motu'],
    function (jQuery, utils, sharePage, sinaWeixinConfigReady, scrollToBottom) {

      var newApp = new NewApp(__pageConfig || {});

      var paginationConfig = {
        cateid: PAGEDATA.cateid || '2L', // 栏目列表
        cre: PAGEDATA.cre || 'sptapp', // 这两个参数主要用于描述产品位，需要statics=1激活这两个参数
        mod: PAGEDATA.mod || 'r',
        merge: PAGEDATA.merge || 3, // 显示推荐原因
        statics: PAGEDATA.statics || 1,
        this_page: PAGEDATA.this_page || 1, // 是否过滤当前页
        rfunc: PAGEDATA.rfunc || 105, // 应用场景参数
        app_type: PAGEDATA.app_type || 112 // 客户端类型: 110-新闻app，111-财经app，112-体育app
      };

      // 获取评论列表数据
      newApp.getCmnt({
        docID: __pageConfig.__docId,
        commentId: __pageConfig.__cmntId,
        hotNum: 6,
      });
      // 获取相关推荐数据
      newApp.getNews({
        pageurl: encodeURIComponent(__pageConfig.__docUrl),
        offset: (PAGEDATA.page * PAGEDATA.page_size),
        cateid: paginationConfig.cateid, // 栏目列表
        cre: paginationConfig.cre, // 这两个参数主要用于描述产品位，需要statics=1激活这两个参数
        mod: paginationConfig.mod,
        merge: paginationConfig.merge, // 显示推荐原因
        statics: paginationConfig.statics,
        this_page: paginationConfig.this_page, // 是否过滤当前页
        rfunc: paginationConfig.rfunc, // 应用场景参数
        app_type: paginationConfig.app_type
      });

      var scrollFunction = function () {
        // 判断是否还有更多数据
        if (!PAGEDATA.isMore) return;
        // 判断当前页面是否是最大页面（默认最多显示6页）
        if (PAGEDATA.page == 6) {
          PAGEDATA.isMore = false;
          $('#moreRecommendText').text('没有更多了哟');
          return;
        }
        // 获取相关推荐数据
        newApp.getNews({
          pageurl: encodeURIComponent(__pageConfig.__docUrl),
          offset: (PAGEDATA.page * PAGEDATA.page_size),
          cateid: paginationConfig.cateid, // 栏目列表
          cre: paginationConfig.cre, // 这两个参数主要用于描述产品位，需要statics=1激活这两个参数
          mod: paginationConfig.mod,
          merge: paginationConfig.merge, // 显示推荐原因
          statics: paginationConfig.statics,
          this_page: paginationConfig.this_page, // 是否过滤当前页
          rfunc: paginationConfig.rfunc, // 应用场景参数
          app_type: paginationConfig.app_type
        });
      };
      // 滚动到底部自动加载更多
      var scrollHelper1 = scrollToBottom({
        container: window,
        target: '#recommendList',
        triggerDistance: 100,
        callBack: scrollFunction,
        time: 30
      });
      scrollHelper1.start();

      $('#moreRecommendText').on('click', scrollFunction);

      // 传入分享参数
      PAGECTRL.wxReady({
        title: document.title, // 分享标题
        desc: window.location.href, // 分享描述
        imgUrl: document.images[0] && document.images[0].src, // 分享图标
        success: function () {
          // 用户确认分享后执行的回调函数
        },
        cancel: function () {
          // 用户取消分享后执行的回调函数
        }
      });
    });
})();
