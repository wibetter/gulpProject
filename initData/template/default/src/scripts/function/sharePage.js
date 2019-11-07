define(['jQuery', 'doT', 'utils', 'ajaxUtil', 'wapCallNative', 'swiper', 'lazyload'], function (jQuery, doT, utils, ajaxUtil, WapCallNative, Swiper) {

  // 重置dot标签
  doT.templateSettings = {
    evaluate:    /\<\<([\s\S]+?)\>\>/g,
    interpolate: /\<\<=([\s\S]+?)\>\>/g,
    encode:      /\<\<!([\s\S]+?)\>\>/g,
    use:         /\<\<#([\s\S]+?)\>\>/g,
    define:      /\<\<##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\>\>/g,
    conditional: /\<\<\?(\?)?\s*([\s\S]*?)\s*\>\>/g,
    iterate:     /\<\<~\s*(?:\>\>|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\>\>)/g,
    varname: 'it',
    strip: true,
    append: true,
    selfcontained: false
  };

  var surportTouch = ('ontouchstart' in window ) || window.DocumentTouch &&  document instanceof DocumentTouch;
  var eventType = 'click';
  if(eventType == 'click' && surportTouch){
    eventType = 'touchstart'
  }

  //判断app或者browser
  var sorts = {};
  var viewType = (function() {
    var ua = navigator.userAgent;
    sorts.isAndroid = ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1; //android终端
    sorts.isiOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    sorts.isSafari = ua.indexOf("Safari") > -1 && ua.indexOf("Chrome") < 1 && ua.indexOf("QB") < 1;//判断是否Safari浏览器
    sorts.isChrome = ua.indexOf('CriOS') > -1;//判断是否新版chrome浏览器
    //sorts.isMicro = ua.match(/MicroMessenger/i) == 'micromessenger';//判断是否微信i浏览器
    sorts.isMicro = ua.indexOf('MicroMessenger') == -1 ? false : true;//判断是否微信i浏览器
    if ((/sinasports?/i).test(ua)) {
      return 'sinasports';
    } else {
      return 'browser';
    }
  })();

  // 设置dom高度(正文折叠效果)
  (function(){
    var artDom =  $('#js-art');
    var  artDomHeight = artDom.height();
    var  clientHeight = $(window).height();
    var lazyImgLenth = artDom.find('img.lazy').length;
    if (lazyImgLenth > 0) {
      artDomHeight += lazyImgLenth * 120;
    }
    if (artDomHeight > clientHeight * 1.5) {
      artDom.height(clientHeight);
    } else {
      artDom.height(artDomHeight * 0.7);
    }

    var isStop = false, imgObjTop = 0;
    setInterval(function(){
      if(!isStop) {
        imgObjTop = (imgObjTop == 5 ? 0 : 5);
        $(".btn-detail img").css({
          top: imgObjTop + 'px',
        });
      }
    }, 1000);

    $(".btn-detail").on('onmouseover', function(){
      isStop = true;
    }).on('onmouseout', function(){
      isStop = false;
    });

  })();

  // 设置懒加载
  $("img.lazy").lazyload({
    effect: 'fadeIn'
  }).removeClass('lazy');

  /* 热门评论，点赞事件 */
  window.agreeAction = function(_this, _channel, _newsid, _mid) {
    ajaxUtil({
      url: window.APIList.support,
      data: {
        channel: _channel, // 频道id
        newsid: _newsid,
        parent: _mid // 支持留言的mid
      },
      type: 'POST',
      dataType: 'json',
      name: 'pushSupport',
      success: function(d){
        var _self = $(_this);
        _self.find('.cmnt-ico_praise').css({
          'background': 'url(//n.sinaimg.cn/sports/imgStore/appSharePage/good-active.svg)',
          'background-size': '0.32rem 0.32rem'
        });
        var agreeCountObj = _self.find('.agreeCount');
        agreeCountObj.text(Number(agreeCountObj.text()) + 1);
      }
    });
  };

  var NewApp = window.NewApp = function(opt){
    this.opt = opt;
    this.opt.isLoadingData = false;
    var bd = $(document.body);

    var urlParas = utils.catchURLParams();

    // 判断当前URL中是否有渠道值
    if (urlParas['number'] || urlParas['qudao']) {
      window.PAGEDATA.number = urlParas['number'] || urlParas['qudao'];
    }

    // 获取当前页的通用链接
    WapCallNative.getAppLink(__pageConfig.__docUrl, false, function(applink){
      if (applink) {
        // 其中applink就是根据pageUrl生成的通用链接
        window.PAGEDATA.universalLink = applink;
      }
    });
    /* 正文折叠功能，点击查看更多内容 */
    $('[node-type=btnShow]').on('click', function () {
      $('#js-art').height('auto');
      $(this).hide();
    });
    /* 呼起APP事件 */
    bd.on('click', '[node-type=callApp]', function(){
      var $this = $(this);
      var link = $this.attr('doc-url');
      if (link && link !== '') {
        if (link == 'currentPage') {
          location.href = window.PAGEDATA.universalLink + '&number=' + window.PAGEDATA.number;
        } else if (link == 'appIndex') { // 呼起APP，打开APP首页
          location.href = window.PAGEDATA.appDownload + '?number=' + window.PAGEDATA.number;
        } else { // 根据当前指定url获取通用链接，呼起APP指定界面
          WapCallNative.getAppLink(link, false, function(applink){
            if (applink) {
              location.href = applink + '&number=' + window.PAGEDATA.number;
            }
          });
        }
      }
    });
    /* 相关推荐点击文章Card跳转事件 */
    bd.on('click', '[node-type=jump2page]', function(){
      var $this = $(this);
      var midLink = $this.attr('mid-url'); // mid-url取的是相关推荐中的surl字段
      var pcLink = $this.attr('doc-url'); // doc-url取的是相关推荐中的url字段
      if (pcLink && pcLink !== '') {
        ajaxUtil({
          url: window.APIList.appSharePageUrl,
          data: {
            url: pcLink, // 原始页面地址
          },
          type: 'GET',
          name: 'getAppSharePageUrl',
          success: function(d){
            if(d.data && d.data.midurl) {
              location.href = d.data.midurl;
            } else if (midLink && midLink != '') {
              location.href = midLink;
            }
          },
          fail: function(){
            location.href = midLink;
          }
        });
      }
    });

    /* 显示底部推荐轮播位 */
    var bottonBoxTempl = doT.template($("#bottonBoxTempl").text());
    $('#recommendListBox').append(bottonBoxTempl(window.PAGEDATA.bottomLinks));

    var mySwiper2 = new Swiper('#recommendListContainer', {
      direction: 'horizontal', // 水平切换选项
      loop: true, // 循环模式选项
      autoplay: {
        stopOnLastSlide: true,
      },
      // 如果需要分页器
      pagination: {
        el: '.pagination2',
      },
    })
  };
  NewApp.prototype = {
    getNews: function(optionData) {
      var self = this;
      if(self.opt.isLoadingData) return;
      var videoDom = $('.js-videoList');
      $('#moreRecommendText').hide();
      $('#loadRecommendText').show();
      self.opt.isLoadingData = true;
      ajaxUtil({
        url: window.APIList.recommend + '?length='+ PAGEDATA.page_size || 5,
        data: optionData,
        dataType: 'jsonp',
        name: 'getNews',
        success: function(d){
          self.opt.isLoadingData = false;
          $('#moreRecommendText').show();
          $('#loadRecommendText').hide();
          var recommendedListTempl = doT.template($("#recommendedListTempl").text());
          videoDom.append(recommendedListTempl(d));
          window.PAGEDATA.page++; // 页码加1
          // 设置懒加载
          $("img.lazy").lazyload({
            container: 'ul.js-videoList',
            effect: 'fadeIn'
          }).removeClass('lazy');
          if (PAGEDATA.page * PAGEDATA.page_size >= d.status.total ) {
            PAGEDATA.isMore = false;
            $('#moreRecommendText').text('没有更多了哟');
          }
        },
        fail: function(){
          this.opt.isLoadingData = false;
        }
      });
    },
    getCmnt: function(options){
      var cmntDom = $('.js-cmnt');
      var btnMoreDom = cmntDom.next('a');
      ajaxUtil({
        url: window.APIList.comment,
        data: options,
        dataType: 'jsonp',
        name: 'getCmnt',
        success: function(d){
          if(d && d.data && d.data.cmnt && d.data.cmnt.cmntlist){
            var cmntList = d.data.cmnt.cmntlist;
            if(cmntList.length == 0){
              // btnMoreDom.html('立即发表评论');
              $('#cmtListContainer').hide();
              return
            }
            var cmntListTempl = doT.template($("#cmntListTempl").text());
            cmntDom.html(cmntListTempl(cmntList));

            if (cmntList.length < 2) {
              $('#cmnt-pagination').hide();
            }

            var mySwiper1 = new Swiper('#cmtListBox', {
              direction: 'horizontal', // 水平切换选项
              loop: cmntList.length > 2 ? true : false, // 循环模式选项
              autoplay: {
                stopOnLastSlide: cmntList.length > 2 ? true : false,
              },
              // 如果需要分页器
              pagination: {
                el: '.pagination1',
              },
            })

          }
        }
      });
    },
    getVideoInfo: function(vid) {
      $.ajax({
        url: 'http://s.video.sina.com.cn/video/h5play',
        data: {
          video_id: vid,
        },
        dataType: 'jsonp',
        success: function(msg) {
          var videoInfo = msg.data.videos.mp4.sd;
          var videoSrc = videoInfo.file_api + '?vid=' + videoInfo.file_id + '&amp;tags=h5_jsplay';
          var images = msg.data.image;
          $('#sharePicPoster').attr('src', images);
          var data = {

            playerRatio: (9/16),

            videoAttr: {
              preload: "auto",
              src: videoSrc,
            },

            playerIcon : {
              width : '50px',
              height : '50px'
            },

            duration: "02:31",

            poster: images,

            isAdsorb : true,
            autoHeight : true,
            shadowBg : true

          }

          var apl = aPlayer.createPlayer(data);
        }
      });

    }
  }
});