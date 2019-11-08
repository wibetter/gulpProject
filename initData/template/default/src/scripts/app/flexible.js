var getFlexible = function (lib) {
  var win = win || window;
  var doc = win.document;
  var docEl = doc.documentElement;
  var info = {};
  var dpr = 0;
  var rem = '12px';
  var tid;
  var fns = [];
  var flexible = lib.flexible || (lib.flexible = {});
  flexible.resize = function (fn) {
    fns.push(fn);
    fn(info);
  };
  var isIPhone = win.navigator.appVersion.match(/iphone/gi);
  var devicePixelRatio = win.devicePixelRatio;
  if (isIPhone) {
    if (devicePixelRatio >= 3 && (!dpr || dpr >= 3)) {
      dpr = 3;
    } else if (devicePixelRatio >= 2 && (!dpr || dpr >= 2)) {
      dpr = 2;
    } else {
      dpr = 1;
    }
  } else {
    dpr = 1;
  }

  function rem2px(d) {
    var val = parseFloat(d) * rem;
    if (typeof d === 'string' && d.match(/rem$/)) {
      val += 'px';
    }
    return val;
  }

  function px2rem(d) {
    var val = parseFloat(d) / rem;
    if (typeof d === 'string' && d.match(/px$/)) {
      val += 'rem';
    }
    return val;
  }

  function refreshRem() {
    var rect = docEl.getBoundingClientRect();
    var width = rect.width;
    /*
      iPhone4，5是42.7px，iPhone6是50px，iPhone6 Plus 是55.2px
     */
    // var height = win.innerHeight;
    var height = docEl.clientHeight;
    if (flexible.maxAspectRatio !== Infinity && flexible.maxAspectRatio < width / height) {
      width = height;
    }
    width = Math.min(width, flexible.maxWidth);
    rem = width * 100 / flexible.designWidth;
    docEl.style.fontSize = rem + 'px';
    flexible.rem = win.rem = rem;
    info = {
      dpr: dpr,
      rem: rem,
      width: width,
      height: height,
      remWidth: px2rem(width),
      remHeight: px2rem(height)
    };
    for (var i = 0, len = fns.length; i < len; i++) {
      fns[i](info);
    }
  }

  flexible.dpr = win.dpr = dpr;
  flexible.refreshRem = refreshRem;
  flexible.rem2px = rem2px;
  flexible.px2rem = px2rem;
  flexible.init = function (opt) {
    var defaults = {
      designWidth: 750,
      maxWidth: Infinity,
      maxAspectRatio: Infinity
    };
    opt = opt || {};
    for (var item in defaults) {
      flexible[item] = opt[item] || defaults[item];
    }

    // 设置 data-dpr 方便根据 dpr 设置样式
    docEl.setAttribute('data-dpr', dpr);

    // 重置 body 字体大小， 抵销设置 rem 导致的影响
    if (doc.readyState === 'complete') {
      doc.body.style.fontSize = 12 + 'px';
    } else {
      doc.addEventListener('DOMContentLoaded', function () {
        doc.body.style.fontSize = 12 + 'px';
      }, false);
    }

    // 绑定窗口变化的事件，refleshRem
    var evt = 'onorientationchange' in window ? 'orientationchange' : 'resize';
    win.addEventListener(evt, function () {
      clearTimeout(tid);
      tid = setTimeout(refreshRem, 100);
    }, false);
    win.addEventListener('pageshow', function (e) {
      if (e.persisted) {
        clearTimeout(tid);
        tid = setTimeout(refreshRem, 100);
      }
    }, false);

    // 首次 refleshRem
    refreshRem();
  };
  return flexible;
}(window);