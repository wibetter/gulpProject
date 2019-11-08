/* 添加ua以及相关app判断 */

define(function() {
  'use strict';

  var ua = window.navigator.userAgent.toLowerCase(),
    isNews = (/sinanews?/i).test(ua),
    isSports = (/sinasports?/i).test(ua),
    viewInfo = {
      ua: ua,
      type: '',
      isNews: isNews,
      isSports: isSports
    };
  var $body = document.querySelector(".data");
  if (isNews || isSports) {
    $body.classList.add('view-app');
    viewInfo.type = 'app';
  } else {
    $body.classList.add('view-wap');
    viewInfo.type = 'wap';
  }

  window.viewInfo = viewInfo;
  return viewInfo;
} );
