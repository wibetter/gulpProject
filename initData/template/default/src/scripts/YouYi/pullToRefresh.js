define(['core', 'simpleTranslate', 'getNodes', 'getGuid'], function (youYi, simpleTranslate, getNodes, getGuid) {
  'use strict';

  // 判断是否支持触屏
  var surportTouch = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;

  // 获取浏览器厂商对应的 CSS3 属性
  var getCSS3Property = (function () {
    var style = document.createElement('div').style;
    var vendors = ['', 'webkit', 'Moz', 'ms', 'O'];
    return function (property) {
      for (var i = 0, len = vendors.length; i < len; i++) {
        var item = vendors[i];
        if (item) {
          var propertyArr = property.split('');
          propertyArr[0] = propertyArr[0].toUpperCase();
          property = propertyArr.join('');
        }
        var prop = item + property;
        if (prop in style) {
          return prop;
        }
      }
      return '';
    };
  })();

  // 获取触摸事件的 Y 坐标
  var getPageY = function (e) {
    if (typeof e.pageY !== 'undefined') {
      return e.pageY;
    }
    if (surportTouch && e.originalEvent.touches) {
      return e.pageY || e.originalEvent.touches[0].screenY;
    }
    return 0;
  };

  // 通用数组获取 CSS 属性对象
  var getStyleByArr = function (keys, vals) {
    var style = {};
    for (var i = 0, len = keys.length; i < len; i++) {
      var key = keys[i];
      style[key] = vals[i];
    }
    return style;
  };

  // 获取 transform transition 对应浏览器厂商的属性名
  var transformProperty = getCSS3Property('transform');
  var transitionProperty = getCSS3Property('transition');

  // 改变下拉对象 Y 坐标方法
  // duration 为 0
  var slide = (function () {

    if (transformProperty && transitionProperty) {
      return function (wrap, duration, end) {
        var transition = duration ? 'all ' + (duration / 1000) + 's ease-out' : '';
        wrap.css(
          getStyleByArr(
            [transitionProperty, transformProperty],
            [transition, 'translate3d(0, ' + end + 'px, 0 )']
          )
        );
      };
    } else {
      return function (wrap, duration, end) {
        if (duration) {
          wrap.stop().animate({
            top: end
          }, duration);

        } else {
          wrap.css({
            top: end
          });
        }

      };
    }
  })();

  function PullToRefresh(options) {
    var self = this;

    // - 唯一标识，用于绑定事件，存储数据等
    self.guid = getGuid();
    self.eventns = '.' + self.guid;

    // - 自定义事件
    self.proxy = $({});

    // 上次移动到距离，用算移动差
    self.lastMovingOffset = 0;
    self.isReached = false;

    // 每次修改 Y 坐标后的值
    self.endOffset = 0;

    // 是否正在触摸

    // 是否正在下拉
    self.isPulling = false;

    // 触摸点
    self.touchPoints = 0;

    // 是否正在刷新中
    self.isRefreshing = false;

    self.opt = $.extend(true, {

      wrap: 'body',

      // 是否支持多指下拉，安卓很多机器支持得不好（原因为 touchstart 后对应的 touchend没触发 ）
      multipleTouchEnabled: true,

      // 刷新距离，下拉到此距离时，释放就会触发刷新
      offsetToRefresh: 66,

      // 刷新时保持的距离，用于显示 ‘加载中’
      offsetOnRefresh: 66,

      // 收起时间
      slideUpTime: 500,

      // 从上达到刷新距离时执行
      upReach: function () {
      },

      // 阻力，值越小越难下拉
      friction: 0.65,

      // 从下达到刷新距离时执行
      downReach: function () {
      },

      // 松手并且达到设置距离
      onRefresh: function () {

      },

      // 下拉开始
      onPullStart: function () {

      },

      // 下拉移动
      onPullMove: function () {

      },

      // 下拉结束
      onPullEnd: function () {

      },

      // 回到初始位置
      onReset: function () {

      }

    }, options);
    self._init();
  }

  PullToRefresh.prototype = {
    slideUp: function () {
      var self = this;
      var opt = self.opt;
      var end = 0;
      var wrap = self.dom.wrap;
      // 如果还在下拉，则不收起
      if (self.isPulling) {
        return;
      }
      self.isRefreshing = false;
      self.isReached = false;

      wrap.on('transitionend' + self.eventns, function () {
        wrap.off('transitionend' + self.eventns);
      });

      // wrap, duration, end
      simpleTranslate({
        wrap: wrap,
        duration: opt.slideUpTime,
        end: end,
        direction: 'top',
        cb: function () {
          opt.onReset.call(self);
        }
      });

      self.endOffset = end;

    },
    _init: function () {
      var self = this;

      // 缓存节点
      self.dom = getNodes(self.opt.wrap);

      // 绑定触摸事件
      self._bind();
    },
    _bind: function () {
      var self = this;
      var wrap = self.dom.wrap;
      wrap.on('touchstart' + self.eventns, function (e) {
        self._touchstart(e);
      });
      wrap.on('touchend' + self.eventns, function (e) {
        self._touchend(e);
      });
      wrap.on('touchmove' + self.eventns, function (e) {
        self._touchmove(e);
      });

    },
    destroy: function () {
      var self = this;
      var wrap = self.dom.wrap;
      wrap.on('touchstart' + self.eventns);
      wrap.on('touchend' + self.eventns);
      wrap.on('touchmove' + self.eventns);
    },
    _touchstart: function (e) {
      var self = this;

      /*if ( self.isPulling ) {
          return;
      }*/
      if (!window.scrollY) {
        self.lastMovingOffset = getPageY(e);
      }
      self.touchPoints++;

      // self.isPulling = true;
    },
    _touchend: function (e) {
      var self = this;
      var opt = self.opt;
      var end = self.endOffset;

      self.touchPoints -= 1;

      if (opt.multipleTouchEnabled && self.touchPoints !== 0) {
        return;
      }
      self.isPulling = false;

      var pullEnd = function () {

        end = self.endOffset;

        // 松手并且达到设置距离，则刷新，否则收回到原始位置
        if (self.isReached) {
          end = opt.offsetOnRefresh;
          opt.onRefresh.call(self);
          self.isRefreshing = true;
        } else {
          end = 0;
        }

        // wrap, duration, end
        simpleTranslate({
          wrap: self.dom.wrap,
          duration: opt.slideUpTime,
          end: end,
          direction: 'top'
        });


        self.endOffset = end;

        opt.onPullEnd.call(self);
      };


      pullEnd();
    },
    _touchmove: function (e) {
      var self = this;
      var opt = self.opt;
      var dist = 0;
      var translate = 0;

      self.movingOffset = getPageY(e);
      dist = self.movingOffset - self.lastMovingOffset;

      // scrollY 不为 0 时，可以正常触摸操作；
      // 如果向上滑动（在 dist< 0）,并且已经停止了下拉刷新滑动（!self.isPulling）也可以这触摸操作，如滚动
      // 其它情况都表示要下拉刷新的滑动，包括向上滑动

      if (window.scrollY !== 0 || (dist < 0 && !self.isPulling)) {
        return;
      }
      e.preventDefault();

      if (dist > 0) {

        // 下拉
        translate = self.endOffset + Math.pow(dist, opt.friction);
      } else {

        // 上拉
        translate = self.endOffset - Math.pow(-dist, opt.friction);
      }

      // 正在刷新时，上拉不要超过加载线
      if (self.isRefreshing) {
        translate = Math.max(translate, opt.offsetOnRefresh);
      }

      // wrap, duration, end
      simpleTranslate({
        wrap: self.dom.wrap,
        duration: 0,
        end: translate,
        direction: 'top'
      });

      // 如果还在刷新中，则不处理 upReach， downReach 等回调
      if (!self.isRefreshing) {
        if (translate > opt.offsetToRefresh && !self.isReached) {

          self.isReached = true;
          opt.upReach.call(self);
        }

        if (translate < opt.offsetToRefresh && self.isReached) {

          self.isReached = false;
          opt.downReach.call(self);
        }
      }

      self.endOffset = translate;
      self.isPulling = true;
      self.lastMovingOffset = self.movingOffset;

    }
  };
  youYi.PullToRefresh = PullToRefresh;
  return PullToRefresh;

});
