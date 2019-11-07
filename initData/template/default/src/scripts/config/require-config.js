/* 备注：
     * 1、scrollToBottom：用于实现页面滚动到底部时自动获取下一页数据
     * 2、utils：工具方法聚合;
     * 3、addViewInfo：APP内嵌时给body加一个标识，用于隐藏头部展示元素;
     * 4、projectBase 是通过page-config.js引入进来的全局变量
     *
     * @author: liudan6
 */

var _require_config = {
  baseUrl: window.PAGEDATA.projectBase + '/scripts',
  paths: {
    'jQuery': ['lib/jquery.11.3.min'],
    'doT': ['lib/doT.min'],
    'swiper': ['https://cdnjs.cloudflare.com/ajax/libs/Swiper/4.0.2/js/swiper.min', 'lib/swiper.min'],
    'lazyload': ['app/jquery.lazyload'],
    /* YouYi相关核心模块 */
    'core': ['YouYi/core'],
    'hash': ['YouYi/hash'],
    'getNodes': ['YouYi/getNodes'],
    'getParam': ['YouYi/getParam'],
    'getSize': ['YouYi/getSize'],
    'getGuid': ['YouYi/getGuid'],
    'loader': ['YouYi/loader'],
    'pullToRefresh': ['YouYi/pullToRefresh'],
    'scrollToBottom': ['YouYi/scrollToBottom'], // 滚动底部触发事件
    'simpleTranslate': ['YouYi/simpleTranslate'],
    'timeoutHandle': ['YouYi/timeoutHandle'],
    /* 添加ua以及相关app判断 */
    'addViewInfo': ['common/addViewInfo'],
    'flexible': ['app/flexible'],
    /* 业务相关代码 */
    'aplayer': ['app/aplayer'],
    'sinaWeixinConfigReady': ['app/sinaWeixinConfigReady'],
    'sharePage': ['function/sharePage'],
    'motu': ['function/motu'], // 魔图
    'wapCallNative': ['//e2.sinaimg.cn/ssfe/sports/commonUtils/scripts/common/wapCallNative'],
    /* H5页面与原生APP桥接类库 */
    'appBridge': ['common/appBridge'],
    'utils': ['common/utils'],
    'ajaxUtil': ['common/ajaxUtil'],
  },
  shim: {
    'sinaWeixinConfigReady': ['jQuery'],
    'sharePage': ['jQuery'],
    'aplayer': ['jQuery'],
    'lazyload': ['jQuery'],
    'aplayer': ['jQuery'],
  },
  waitSeconds: 0,
  urlArgs: 'v=#version#',
};

