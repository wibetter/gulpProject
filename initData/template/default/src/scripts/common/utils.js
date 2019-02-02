/*  工具方法类库  */
define(['core','jQuery'], function (youYi) {
  'use strict';

  // 获取元素宽高
  var getWinSize = function () {
    var win = $(window);
    return {
      width: win.width(),
      height: win.height()
    };
  };

  //获取元素的y坐标
  var getYVal = function( node ){
    var top = 0;
    var height = 0;
    var bottom = 0;
    if(node.length){
      top = node.offset().top;
      height = node.innerHeight();
      bottom = top + height;
    }
    return {
      top:top,
      bottom:bottom
    }
  };

  // 判断一个对象是否是函数
  var isFunction = function (fn) {
    return typeof fn === 'function';
  };

  var toLocaleString = function (timestamp) {
    var time = new Date(timestamp * 1000);
    return time.getFullYear() + "年" + (time.getMonth() + 1) +
      "月" + time.getDate() + "日&nbsp;&nbsp;" + time.getHours() +
      " : " + time.getMinutes();
  };

  // 判断图片字段格式是否正确
  var isPicture = function () {
    var strFilter = ".jpeg|.gif|.jpg|.png|.bmp|.pic|";
    if (this.indexOf(".") > -1) {
      var p = this.lastIndexOf(".");
      var strPostfix = this.substring(p, this.length) + '|';
      strPostfix = strPostfix.toLowerCase();
      if (strFilter.indexOf(strPostfix) > -1) {
        return this.substring(0, this.length);
      } else {
        return window._defaultLogo_; // 返回默认图片
      }
    } else {
      return window._defaultLogo_;
    }
  };
  var isPictureWindow = function (curImg) {
    var strFilter = ".jpeg|.gif|.jpg|.png|.bmp|.pic|";
    if (curImg && curImg.indexOf(".") > -1) {
      var p = curImg.lastIndexOf(".");
      var strPostfix = curImg.substring(p, this.length) + '|';
      strPostfix = strPostfix.toLowerCase();
      if (strFilter.indexOf(strPostfix) > -1) {
        return curImg;
      } else {
        return window._defaultLogo_; // 返回默认图片
      }
    } else {
      return window._defaultLogo_;
    }
  };

  /* 时间格式化：时间戳 => 时间格式“2018.06.14” */
  var timeFormat = function (time) {

    if (!time) {
      return "";
    }
    var toPerfect = function (num) {
      var res = num < 10 ? '0' + num : num;
      return res;
    }

    var date = new Date(parseInt(time) * 1000),
      Y = date.getFullYear(),
      M = date.getMonth() + 1,
      D = date.getDate();
    return Y + '.' + toPerfect(M) + '.' + toPerfect(D);
  };

  /* 根据时间格式“2018.06.14”/ '2018-06-14'获取当前周次 */
  var getWeekday = function (time) {
    if (!time) {
      return "";
    }
    var d = new Date(time);
    var weekday = ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
    return weekday[d.getDay()];
  };

  /* 获取当前URL上的params */
  var catchURLParams = function () {
    var params = {};
    if (location.search.indexOf('?') < 0) {
      // 当前url中没有任何参数
      return params;
    }
    var currentUrl = location.search.substring(1); // 去掉当前第一个“？”
    if (currentUrl.indexOf('?') > 0) {
      var endIndex = currentUrl.indexOf('?');
      currentUrl = currentUrl.substring(0, endIndex);
    }
    var items = currentUrl.split('&');
    for (var i = 0, size = items.length; i < size; i++) {
      var item = items[i].split('='),
        key = item[0],
        value = item[1];
      params[key] = value;
    }
    return params;
  }

  /* number数字转换成中文数字 */
  var numberToChinese = function (number) {
    var chinses = number;
    switch (number) {
      case 1 :
        chinses = '一';
        break;
      case 2:
        chinses = '二';
        break;
      case 3:
        chinses = '三';
        break;
      case 4:
        chinses = '四';
        break;
      case 5:
        chinses = '五';
        break;
      case 6:
        chinses = '六';
        break;
      case 7:
        chinses = '七';
        break;
      case 8:
        chinses = '八';
        break;
      case 9:
        chinses = '九';
        break;
      case 10:
        chinses = '十';
        break;
    }
    return chinses;
  };

  var isAndroid = function () {
    return navigator.appVersion.toLowerCase().indexOf('android')>-1;
  };

  // 评论数格式转换
  var agreeDataFormat = function (agreeData) {
    if (agreeData && agreeData <= 9999) {
      return agreeData;
    } else if (agreeData && agreeData > 9999) {
      return Math.floor(agreeData / 1000) / 10 + 'w';
    }
  };
  // 评论时间格式转换
  var agreeTimeFormat = function (agreeTime) {
    agreeTime = agreeTime.replace(/-/g, '/'); // 兼容IOS系统
    var date = new Date(agreeTime),
      Y = date.getFullYear(),
      times = date.getTime(); // 返回 1970 年 1 月 1 日至今的毫秒数。
    var now = new Date(),
      nowYear = now.getFullYear(),
      nowTimes = now.getTime();
    var oneHour = 1000 * 60 * 60, // 一个小时的毫秒数
    oneDay = oneHour * 24; // 一天的毫秒数
    var actionTimes = nowTimes - times;
    if (actionTimes < oneHour) {
      return Math.floor(actionTimes / (1000 * 60)) + '分钟前';
    } else if (actionTimes < oneDay) {
      return Math.floor(actionTimes / oneHour) + '小时前';
    } else if (nowYear == Y) {
      return agreeTime.substring(5);
    } else {
      return agreeTime;
    }
  };
  // 告知安卓APP不可绑定滑动事件的区域窗口
  var androidBridgeBounds = function(bounds) {
    window.newsAppBridge.trigger('call_reserved', [{
      '__dataType': 'horizontalScroll',
      'bounds': bounds
    }, function(){
      // 回调，在这里不需要
    }]);
  };

  /* ghsJSONP 工具类  */
  var ghsJSONP = function(url, callback) {
    var script = document.createElement('script');
    script.setAttribute('src', url + "?callback="+callback);
    document.getElementsByTagName('head')[0].appendChild(script);
  };

  youYi.getWinSize = getWinSize;
  youYi.isFunction = isFunction;
  youYi.isPictureWindow = isPictureWindow;
  youYi.timeFormat = timeFormat;
  youYi.getWeekday = getWeekday;
  youYi.catchURLParams = catchURLParams;
  youYi.numberToChinese = numberToChinese;
  youYi.toLocaleString = toLocaleString;
  youYi.agreeDataFormat = agreeDataFormat;
  youYi.agreeTimeFormat = agreeTimeFormat;
  youYi.getYVal = getYVal;
  youYi.isAndroid = isAndroid;
  youYi.androidBridgeBounds = androidBridgeBounds;
  youYi.ghsJSONP = ghsJSONP;
  String.prototype.IsPicture = isPicture;

  return {
    getWinSize: getWinSize,
    isFunction: isFunction,
    isPicture: isPicture,
    timeFormat: timeFormat,
    getWeekday: getWeekday,
    agreeDataFormat: agreeDataFormat,
    agreeTimeFormat: agreeTimeFormat,
    toLocaleString: toLocaleString,
    catchURLParams: catchURLParams,
    getYVal: getYVal,
    isAndroid: isAndroid,
    androidBridgeBounds: androidBridgeBounds,
    ghsJSONP: ghsJSONP
  };
});