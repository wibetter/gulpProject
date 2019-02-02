/**
 * 新浪微信SDK配置获取 /sinachannel_web/channel/branches/_demo/daichang/mobile/share
 */
// 微信二次分享
(function(win, lib){
  var sinaWeixinConfigReady = ( function () {

    // 是否是微信浏览器
    var isWeixinBrowser = (/micromessenger/i).test(navigator.userAgent);

    if( !isWeixinBrowser ) {
      return function() {
      };
    }

    // js 加载方法
    var jsLoad = ( function () {
      var doc = document
        , head = doc.getElementsByTagName('head')[0]
        , s = 'string'
        , f = false
        , push = 'push'
        , readyState = 'readyState'
        , onreadystatechange = 'onreadystatechange'
        , list = {}
        , ids = {}
        , delay = {}
        , scripts = {}
        , scriptpath
        , urlArgs

      function every(ar, fn) {
        for (var i = 0, j = ar.length; i < j; ++i) if (!fn(ar[i])) return f
        return 1
      }
      function each(ar, fn) {
        every(ar, function (el) {
          fn(el)
          return 1
        })
      }

      function jsLoad(paths, idOrDone, optDone) {
        paths = paths[push] ? paths : [paths]
        var idOrDoneIsDone = idOrDone && idOrDone.call
          , done = idOrDoneIsDone ? idOrDone : optDone
          , id = idOrDoneIsDone ? paths.join('') : idOrDone
          , queue = paths.length
        function loopFn(item) {
          return item.call ? item() : list[item]
        }
        function callback() {
          if (!--queue) {
            list[id] = 1
            done && done()
            for (var dset in delay) {
              every(dset.split('|'), loopFn) && !each(delay[dset], loopFn) && (delay[dset] = [])
            }
          }
        }
        setTimeout(function () {
          each(paths, function loading(path, force) {
            if (path === null) return callback()

            if (!force && !/^https?:\/\//.test(path) && scriptpath) {
              path = (path.indexOf('.js') === -1) ? scriptpath + path + '.js' : scriptpath + path;
            }

            if (scripts[path]) {
              if (id) ids[id] = 1
              return (scripts[path] == 2) ? callback() : setTimeout(function () { loading(path, true) }, 0)
            }

            scripts[path] = 1
            if (id) ids[id] = 1
            create(path, callback)
          })
        }, 0)
        return jsLoad
      }

      function create(path, fn) {
        var el = doc.createElement('script'), loaded
        el.onload = el.onerror = el[onreadystatechange] = function () {
          if ((el[readyState] && !(/^c|loade/.test(el[readyState]))) || loaded) return;
          el.onload = el[onreadystatechange] = null
          loaded = 1
          scripts[path] = 2
          fn()
        }
        el.async = 1
        el.src = urlArgs ? path + (path.indexOf('?') === -1 ? '?' : '&') + urlArgs : path;
        head.insertBefore(el, head.lastChild)
      }

      jsLoad.get = create

      jsLoad.order = function (scripts, id, done) {
        (function callback(s) {
          s = scripts.shift()
          !scripts.length ? jsLoad(s, id, done) : jsLoad(s, callback)
        }())
      }

      jsLoad.path = function (p) {
        scriptpath = p
      }
      jsLoad.urlArgs = function (str) {
        urlArgs = str;
      }
      jsLoad.ready = function (deps, ready, req) {
        deps = deps[push] ? deps : [deps]
        var missing = [];
        !each(deps, function (dep) {
          list[dep] || missing[push](dep);
        }) && every(deps, function (dep) {return list[dep]}) ?
          ready() : !function (key) {
            delay[key] = delay[key] || []
            delay[key][push](ready)
            req && req(missing)
          }(deps.join('|'))
        return jsLoad
      }

      jsLoad.done = function (idOrDone) {
        jsLoad([null], idOrDone)
      }

      return jsLoad
    } )();

    // 是否已经加载完成过
    var done = false;

    // 新浪微信初始化的配置
    var config;

    // 微信 sdk
    var _wx;

    // 全局回调方法名
    var name = 'cb_3eb0d6a6_7dae_e792_47d6_379feae19526';

    // 协议
    var protocol = document.location.protocol;

    // 新浪微信初始化的配置接口 及 微信 sdk js 地址
    var alljs = [protocol + '//mp.sina.cn/aj/wechat/gettoken?callback='+ name +'&url=' + encodeURIComponent( window.location.href ), protocol + '//res.wx.qq.com/open/js/jweixin-1.0.0.js'];

    return function( fn ) {

      // 新浪微信初始化的配置接口回调
      window[name] = function ( res ){
        config = res.data;
      };

      // 新浪微信初始化的配置 及 微信 sdk js 准备好时执行 cb
      function cb( wx ) {
        _wx = wx;
        done = true;

        if( typeof fn === 'function' ) {

          // 如果参数是一个函数，则调用，调用参数是 wx 及新浪微信配置
          fn( _wx, config );
        } else {

          // 如果参数是一个分享配置, 则直接设置分享回调
          _wx.config({
            appId: config.appid,
            timestamp: config.time,
            nonceStr: config.nonceStr,
            signature: config.signature,
            jsApiList: [ 'onMenuShareAppMessage', 'onMenuShareTimeline', 'onMenuShareQQ' ]
          });
          _wx.ready(function() {
            _wx.onMenuShareAppMessage( fn );
            _wx.onMenuShareTimeline( fn );
            _wx.onMenuShareQQ( fn );
          });
        }

      }

      // 已经加载过，直接使用
      if( done ){
        cb( _wx );
      } else {
        // 如果有 require 用 require 来加载
        if( typeof define === 'function' && typeof require === 'function' && define.amd ) {
          require( alljs , function( config, wx) {
            cb( wx );
          } );
        } else {
          jsLoad( alljs , 'all')
          jsLoad.ready('all', function() {
            cb( wx );
          });
        }
      }
    };
  } )();
  lib.wxReady = sinaWeixinConfigReady;
})(window, window.PAGECTRL || (window.PAGECTRL = {}));
