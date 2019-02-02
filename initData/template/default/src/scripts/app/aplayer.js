function fullScreen(element) {
  if(element.requestFullscreen) {
    element.requestFullscreen();
  } else if(element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if(element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if(element.msRequestFullscreen) {
    element.msRequestFullscreen();
  } else if(element.webkitEnterFullscreen){
    element.webkitEnterFullscreen();
  }
};
function getDurNum(time){
  var _type = typeof(time);
  var result;

  function strToTime(time){
    var strArr = time.split(":");
    var tResult = NaN;
    switch(strArr.length){
      case 1:
        tResult = parseInt(strArr[0]);
        break;
      case 2:
        tResult = parseInt(strArr[1]) + parseInt(strArr[0])*60;
        break;
      case 3:
        tResult = parseInt(strArr[2]) + parseInt(strArr[1]*60) + parseInt(strArr[0]*3600);
        break;
      default:
        console.warn('type of duration error');
        break;
    }
    return tResult;
  }
  switch(_type){
    case 'string':
    case 'String':
      result = strToTime(time);
      break;
    case 'number':
    case 'Number':
      result = time;
      break ;
    default :
      result = false;
      break;
  }
  return result;
};
function getDurStr(timeNum){
  if(typeof(timeNum) != 'number' ){return timeNum;}
  var h = Math.floor(timeNum/3600);
  var min = Math.floor((timeNum - h*3600)/60);
  var sec = timeNum % 60;
  min = min < 10 ? '0' + min : min;
  sec = sec < 10 ? '0' + sec : sec;

  if( h == 0 ){
    return min + ':' + sec;
  }else{
    return h + ':' + min + ':' + sec;
  }
};

// controller 
function PlayerTool(con , config){
  var $con	= $(con);
  this.config	= config;
  this.container	= $con;
  this.index	=	$con.attr('index');
  this.duration	= $con.find('.aDuration');
  this.iconWrap	= $con.find('.aplayerIconWrap');
  this.icon	=	$con.find('.aplayerIcon');
  this.posterWrap	= $con.find('.aposter_wrap');
  this.poster	=	$con.find('.aposter');
  this.video	=	$con.find('video');
  this.playerDurTotal = $con.find('.dur_total');
  this.playBar	=	$con.find('.aplayer_bar');
  return this;
}

PlayerTool.prototype = {
  setAttr	:	function(targetSelector , attrObj){
    var _type = typeof(attrObj);
    if( _type.toLowerCase() != 'object'){
      console.warn('attr should be object');
      return false;
    }
    var target = this.container.find(targetSelector);
    for(var keys in attrObj){
      target.data(keys,attrObj[keys]);
    }
  },
  addDom	:	function(con , dom){
    try{
      this.container.find(con).append(dom);
    }catch(e){
      console.log(e);
    }
  },
  /*
   *  str	时长
   * 	当前播放器的时间设置
   */
  setDuration	:	function(str){
    if(!str){console.warn('need a time string'); return}
    var dur = getDurStr(str) + '';
    this.duration[0].innerText = dur;
    this.duration.data('dur',getDurNum(dur));
    this.playerDurTotal.get(0).innerText = dur;
  },
  ended	:	function(cb){
    this.video[0].addEventListener('ended',function(){
      if(window.adEnd){
        window.videoBindEnd = true;
        window.adEnd();
      }else{
        cb&&cb();
      }
    },0)
  },
  /*
   * 更改播放源
   * data {
   * 	src is video source
   * 	poster is poster source
   *  duration is video duration
   * }
   */
  changePlaySource	:	function(data , cb){
    if(!data.src || !data.poster){console.warn('need new video source and poster source'); return;}
    var oVideo = this.video[0];
    var oPoster = this.poster[0];
//		aPlayer._changePlayerStatus();

    //重置video的日志统计发送
    //替换新的source duration
    oVideo.src = data.src;
    oVideo.dataset.firstframe = 0;
    this.playBar.find('.aplayer_durCur').css('width','0');
    this.playBar.find('.aplayer_durLoaded').css('width','0');
    this.playBar.find('.dur_now').text('00:00');
    this.poster[0].src = data.poster;
    this.container.find('.aShadowBg').css({'background-image':"url("+ data.poster +")"});
    if(data.duration){
      this.setDuration(data.duration);
    }
    this.resetVideo();
    // callback
    var cbType = typeof(cb);
    if(cbType.toLowerCase() == 'function'){
      cb();
    }
  },
  loadingStatus	:	function(){
    window.aPlayer && aPlayer._changePlayerStatus(this.container , 'loading' , this.config);
  },
  //重置视频为初始状态
  resetVideo	:	function(){
    var oVideo = this.video[0];
    this.posterWrap.css({'display':'block'});
    this.iconWrap.css({'display':'block'});
    this.container.removeClass('playing');
    this.playBar.find('.aplayer_durCur').css('width','0');
    this.playBar.find('.aplayer_durLoaded').css('width','0');
    var newDurStr = getDurStr(this.duration.data('dur'));
    this.duration.length && (this.duration[0].innerText = newDurStr);
    this.playerDurTotal.get(0) && (this.playerDurTotal.get(0).innerText = newDurStr);
    try{
      if(oVideo.readyState != 0){
        oVideo.currentTime = 0;
      }else{
        oVideo.addEventListener('readyStateChange',function(){
          this.currentTime = 0;
        },0);
      }
    }catch(e){
      oVideo.currentTime = 0;
      console.warn('视频文件没有准备好 , 临时跳过初始化时间事件');
    }
    oVideo.pause();
    window.h5MediaLog ? window.h5MediaLog.resetVideoLog(oVideo) : '';
  },
  play	:	function(){
    var ua = window.navigator.userAgent;
    var isPhone = ua.indexOf("iPhone") > -1;
    var isIPad = ua.indexOf("iPad") > -1;
    if((isIPad || isPhone) && ua.indexOf("QQBrowser") > -1){
      aPlayer._startPlay(this.container , this.config);
      this.video[0].play();
    }else{
      aPlayer._startThisPlayer(this.container);
//			this.video[0].play();
    }

  }
}



//view & model?

var APlayer = function(){
  this.ua	=	"";
  this.playerEleList	=	[];
  this.playerCfgList	=	[];
  this.playerSum	=	0;
  this.barTimer;
  this._uaList=	{
    isIOS	:	false,
    isUC	:	false,
    isLieBao:	false,
    isQQBrowser	:	false,
    isBaidu	:	false
  }
  this.init();
}
APlayer.prototype = {
  showList	:	function(index){
    console.log(this.playerEleList[index]);
  },
  //解决ios下QQ浏览器播放过视频后，其他浏视频定位不准的问题
  _restartVideo: function(player){
    var $player = $(player);
    $player.children("video")[0].currentTime = 0;
  },
  _sendCount: function(addr){
    if(!addr){
      return;
    }

    var len = addr.length;
    var i = 0;

    for(i = 0; i < len; i++){
      if(this._hasSended(addr[i])){
        continue;
      }

      var imgHTML = "<img src='" + addr[i] + "' />";
      var img = $(imgHTML);

      this._insertToSended(addr[i]);
    }
  },
  _getIndex: function(ele){
    return $(ele).attr("data-index");
  },
  _changePlayerFlag: function(player, playing){
    var $player = $(player);
    if(playing){
      $player.addClass("playing");
    }else{
      $player.removeClass("playing");
    }
  },
  _fadeOutCtrl	:	function($player){
    var playBar = $player.find('.aplayer_bar'),
      playButton = $player.find('.aplayer_button'),
      ovideo	=	$player.find('video');
    clearTimeout(this.barTimer);
//		playBar.removeClass('fadeOut');
    playBar.css({'opacity':'1','z-index':'1'});
//		playButton.css({'opacity':'1','z-index':'1'});
    if(!this.bindedPlayBtn){
      this.bindedPlayBtn = true;
      playButton.on('click',function(e){
        var $this = $(this);
        var oEvent = e || event;
        if($this.hasClass('pause')){
          ovideo.get(0).pause();
          $this.css({'opacity':'0','z-index':'-1'});
        }
        oEvent.stopPropagation();
      })
    }
    //非ios下的uc 不显示控制条
    if(!this._uaList.isIOS && this._uaList.isUC){
      playBar.css('display','none');
    }
    this.barTimer = setTimeout(function(){
      playBar.addClass('fadeOut');
      playButton.css({'opacity':'0','z-index':'-1'});
    },3000)
  },
  _bindPlayerBar	: function(player , config){
    var $player = $(player),
      durations = $player.find('.aDuration').data('dur'),
      video = $player.children("video"),
      _this = this,
      curTime = $player.find('.dur_now'),
      totalTime = $player.find('.dur_total'),
      durCurrent = $player.find('.aplayer_durCur'),
      durTotal = $player.find('.aplayer_durTotal'),
      durTotalLen = durTotal.width(),
      durBtn = $player.find('.aplayer_durPoint'),
      scaleBtn = $player.find(".aplayer_scale"),
      playButton = $player.find('.aplayer_button'),
      playBar = $player.find('.aplayer_bar');

    video.on('click',function(){
//			_this._fadeOutCtrl($player);
      playBar.toggleClass('fadeOut');
      clearTimeout(_this.barTimer);
      if(playBar.hasClass('fadeOut')){
        playButton.css({'opacity':'0','z-index':'-1'});
      }else{
        playButton.css({'opacity':'1','z-index':'1'});
        _this.barTimer = setTimeout(function(){
          playBar.addClass('fadeOut');
          playButton.css({'opacity':'0','z-index':'-1'});
        },3000);
      }
    });


    if(config.duration){
      durations = getDurNum(config.duration);
    }else{
      durations = false;
    }
    video.get(0).controls = !!!config.duration;
    video.get(0).dataset.hasctrl = !!!config.duration;
    scaleBtn.on('click',function(){
      fullScreen(video.get(0));
//			video.get(0).webkitRequestFullScreen&&video.get(0).webkitRequestFullScreen();
    })
//		console.log($player ,curTime , totalTime ,durCurrent ,durBtn)

    durBtn.on('touchstart',function(e){
      var oEvent = e || event;
      if(!oEvent.target.classList.contains('aplayer_durPoint')){return ;};
      clearTimeout(_this.barTimer);
      var moveLeft = parseInt(oEvent.touches[0].clientX , durTotal.get(0).offsetLeft);
      durations = $player.find('.aDuration').data('dur');
      oEvent.stopPropagation();
    });
    durBtn.on('touchmove',function(e){
      var oEvent = e || event;
      var moveLeft = parseInt(oEvent.touches[0].clientX - durTotal.get(0).offsetLeft);
      var curPercent = moveLeft / durTotalLen;
      moveLeft >= durTotalLen && (moveLeft = durTotalLen);
      durCurrent.css({"width" : moveLeft})
      curPercent = Math.min(1 , Math.max(0 , curPercent));
      video.get(0).currentTime = Math.floor(durations * curPercent);
      oEvent.stopPropagation();
      //隐藏按钮
    });
    durBtn.on('touchend',function(e){
      var oEvent = e || event;

      _this.barTimer = setTimeout(function(){
        playBar.addClass('fadeOut');
        playButton.css({'opacity':'0','z-index':'-1'});
      },3000);
      oEvent.stopPropagation();
    });
  },
  _bindPlayerEvent: function(player , config){
    var $player = $(player);
    var durations = $player.find('.aDuration').data('dur');
    var video = $player.children("video");
    var _this = this;
    var playBar = $player.find('.aplayer_bar');
    var curTime = $player.find('.dur_now');
    var durBtn = $player.find('.aplayer_durPoint');
    var durCurrent = $player.find('.aplayer_durCur');
    var durTotal = $player.find('.aplayer_durTotal');
    var durTotalLen = durTotal.width();
    var ovideo = video[0];
    var durLoaded = $player.find('.aplayer_durLoaded');
    video.on('play',function(){
      _this._fadeOutCtrl($player);
    });

    video.on("pause", function(e){
      _this._changePlayerFlag(player, false);
      _this._changePlayerStatus(player, "canplay" , config);
      this.style.position = 'static';
      console.log('pause');
    });

    video.on("ended", function(e){
      if(this.dataset.ad == 'true'){
        return ;
      }
      _this._changePlayerFlag(player, false);
      _this._changePlayerStatus(player, "canplay" , config);
      this.style.position = 'static';
      this.dataset.firstframe = 0;
    });

    video.on("playing", function(e){
//			if( _this._uaList.isLieBao || _this._uaList.isBaidu){//_this._uaList.isQQBrowser ||
//				setTimeout(function(){
//					_this._restartVideo(player);
//				}, 100);
//			}

      _this._changePlayerFlag(player, true);
      //不是ios下的uc，不是猎豹, 不是ios下的QQ浏览器
      if(!(_this._uaList.isIOS && _this._uaList.isUC) && !_this._uaList.isLieBao && !(_this._uaList.isIOS && _this._uaList.isQQBrowser)){
        _this._changePlayerStatus(player, "playing" , config);
      }

      var index = _this._getIndex(player);

      _this._sendCount(_this.playerCfgList[index].addPlayCount);
    });
    video.on("waiting", function(e){
//			if( _this._uaList.isLieBao || _this._uaList.isBaidu){//_this._uaList.isQQBrowser ||
//				setTimeout(function(){
//					_this._restartVideo(player);
//				}, 100);
//			}
      if(this.dataset.ad == 'true'){
        return;
      }
      _this._changePlayerFlag(player, true);
      //不是ios下的uc，不是猎豹, 不是ios下的QQ浏览器
      if(!(_this._uaList.isIOS && _this._uaList.isUC) && !_this._uaList.isLieBao && !(_this._uaList.isIOS && _this._uaList.isQQBrowser)){
        _this._changePlayerStatus(player, "loading" , config);
      }

      var index = _this._getIndex(player);

      _this._sendCount(_this.playerCfgList[index].addPlayCount);
    });
    var loadPercent;
    video.on('timeupdate',function(){
      if(this.dataset.ad == 'true'){
        return;
      }
      if(!video.data('firstframe')){
        this.dataset.firstframe = 1;
        _this._autoHeight(player,config.autoHeight , config);
        durations = $player.find('.aDuration').data('dur');
        var miaopaiLog = video.data('playcount');
        if(miaopaiLog != '0'){
          var img = new Image();
          window.miaopaiLog = img;
          img.src = miaopaiLog;
          img.onload = function(){
            img.onload = null;
            window.miaopaiLog = null;
          }
        }
        playBar.addClass('fadeOut');
        var vid = video[0].dataset.vid;
        if(vid){
          var script = document.createElement('script');
          script.src = 'http://count.video.sina.com.cn/videoView?video_id='+ (video[0].dataset.vpid || vid || '') +'&vid='+ (video[0].dataset.fcid || vid || '');
          document.body.appendChild(script);
          script.onload = function(){
            document.body.removeChild(script);
          }
          var vInfos = 'http://s.api.sina.cn/statics/img/v.jpg?vid='+ vid + '&tid=' + ( video[0].dataset.tid || '') + '&did=' + ( video[0].dataset.did || '') + '&cid=' + ( video[0].dataset.cid || '') + '&sid=' + ( video[0].dataset.sid || '');
          var vImg = new Image();
          vImg.src = vInfos;
          window.vImg = vImg;
          vImg.onload = function(){
            vImg.onload = null;
            window.vImg = null;
          }
        }
      }
      var percent = video.get(0).currentTime / durations;
      percent = Math.min(1 , Math.max(0 , percent));
      var moveLeft =Math.ceil(percent * 100);
      curTime.text(getDurStr(Math.ceil(this.currentTime)));

      durCurrent.css({"width" : moveLeft + '%'});
      try{
        if(ovideo.buffered.length){
          loadPercent = Math.min(1 , Math.max(0 , ovideo.buffered.end(0) / durations));
          durLoaded.css({'width':(Math.ceil(loadPercent*100) + '%')})
        }
      }catch(e){
        console.log(e.message);
      }
    });
    _this._bindPlayerBar(player , config);

  },
  _startThisPlayer: function(player){
    var $player = $(player);
//		this._fixedEvent($player);
    var oVideo = $player.children("video")[0];
    var hasNoSrc = (oVideo.src == '' || oVideo.src == location.origin+location.pathname+location.search);
    var dataSrc = oVideo.dataset.src;
    var hasNoDataSrc = (dataSrc == '');
    if(hasNoSrc && hasNoDataSrc){
      console.warn('video src or data-src must be setted');
      return false;
    }
    var pin ;
    var needRd;
    if(hasNoSrc && !hasNoDataSrc){
      dataSrc.indexOf('?') == -1 ? pin = '?' : pin = '&';
      (dataSrc.indexOf('time=') == -1 || dataSrc.indexOf('rd=') == -1 )? needRd = true : needRd = false;
      if(needRd){
        dataSrc = dataSrc + pin + 'time=' + (+new Date()) + '&rd=' + Math.random();
      }
      oVideo.src = dataSrc;
    }
    if(window.playAd && window.playAd()){console.log('既然有广告 , 那么先不播放视频');return ;};
    oVideo.play();
  },
  /**
   *
   * @param {Object} player 		播放器对象
   * @param {Object} isAutoHeight 是否自动高度
   * @param {Object} config 		播放器相关参数
   *  自动高度时设置容器与食品高度auto,不自动高度时重新计算高度设置在容器与视频中
   *
   */
  _autoHeight	:	function(player , isAutoHeight , config){
    var $player = $(player);
    var video = $player.find('video');
    if(isAutoHeight){
      video.css({"height":"auto"});
      var h = video.height();
      $player.css({"height":h});
    }else{
      var h = this._calculateH(player , config);
      $player.css({"height":h});
      video.css({"height":h});
    }
  },/**
   *
   * @param {Object} player	播放器对象
   * @param {Object} status 播放状态标识
   * @param {Object} config 播放参数
   * 根据status改变播放器状态 , 播放参数config主要用作是否播放时自动高度
   *
   */
  _changePlayerStatus: function(player, status , config){
    switch(status){
      case "playing":
        this._showPlayIcon(player, false);
        this._showLoading(player, false);
        this._showVideo(player, true);
        this._autoHeight(player,config.autoHeight , config);
        break;
      case "canplay":
        this._showPlayIcon(player, true);
        this._showLoading(player, false);
        this._showVideo(player, false);
        this._autoHeight(player , false , config);
        break;
      case "loading":
        this._showPlayIcon(player, false);
        this._showLoading(player, true);
        this._showVideo(player, false);
        this._autoHeight(player , false , config);
        break;
      default:
        //跟canplay相同
        this._showPlayIcon(player, true);
        this._showLoading(player, false);
        this._showVideo(player, false);
        this._autoHeight(player , false , config);
        break;
    }
  },
  _showLoading: function(player, show){
    var dis = show?"inline-block":"none";
    var $player = $(player);

    $player.children(".aloading").css("display", dis);
  },
  _showPlayIcon: function(player, show){
    var dis = show?"inline-block":"none";
    var $player = $(player);
    $player.children(".aposter_wrap").css("display", dis);
    $player.children('.aplayerIconWrap').css("display", dis == 'inline-block' ? 'list-item' : 'none');
  },
  _startPlay	:	function(player , config){
    if(player.hasClass('playing')){
      return;
    }

    this.playerEleList.each(function(){
      $(this).children('video')[0].pause();
    });

    if(!(this._uaList.isUC || this._uaList.isLieBao || this._uaList.isQQBrowser)){
      player.addClass('playing');
      this._changePlayerStatus(player, "loading", config);
    }

    if(this._uaList.isQQBrowser && this._uaList.isIOS){
      this._changePlayerStatus(player, "playing", config);
    }

//		if(this._isUC || this._isQQBrowser){
//			this._reloadVideo(player);
//		}

    this._startThisPlayer(player);

  },
  _showVideo	:	function(player , isShow){
    var $player	=	$(player);
    var video = $player.children("video");
    if(isShow){
      video.css({"margin":"0 auto"});
    }else{
      video.css("margin", "0 0 0 1000%");
    }
  },
  _confirmBroswer	:	function(){
    var ua = this.ua;
    var isIPhone = false;
    var isIPad = false;
    isIPhone = ua.indexOf("iPhone") > -1;
    isIPad = ua.indexOf("iPad") > -1;
    this._uaList.isIOS	=	isIPhone || isIPad;
    this._uaList.isUC	=	/UCBrowser/i.test(ua);
    this._uaList.isLieBao	=	ua.indexOf("LieBao") > -1;
    this._uaList.isQQBrowser=	ua.indexOf("QQBrowser") > -1;
    this._uaList.isBaidu	=	ua.indexOf("baidubrowser") > -1;
    this._uaList.isWeixin	=	ua.indexOf('micromessenger') > -1;

  },
  _calculateH	:	function(con , config){
    var h;
    h = Math.round($(con).width() * config.playerRatio);
    return h;
  },
  /**
   * renderPlayer , baseOn playRatio
   * @param {Object} con
   * @param {Object} index
   */
  _renderPlayer	:	function(con,index){
    var config	=	this.playerCfgList[index];
    config.playerRatio = config.playerRatio || 9/16;

    if(!config.videoAttr){
      console.warn("video's attribute must be setted");
      return;
    }

    var videoAttrStr	=	"";
    var src = config.videoAttr.src ||config.videoAttr['data-src'] || 'none';
    if(src=='none'){
      console.warn('video need src first!');
      return;
    }
    for(var attr in config.videoAttr){
      if(attr == 'src' || attr == 'data-src'){
        continue ;
      }
      videoAttrStr	+=	attr + '="' + config.videoAttr[attr] + '" ';

    }
    videoAttrStr += ' data-src="'+ src +'" ';

    if(config.videoAttr.preload == 'auto'){
      videoAttrStr += ' src="'+ src +'" ';
    }
    console.log(videoAttrStr)
    var h = this._calculateH(con , config);
    !config.poster && (config.poster = 'http://n.sinaimg.cn/default/dae7ff0c/20160810/poster_default.png');
    var iconW 	=	config.playerIcon&&config.playerIcon.width||'60px',
      iconH 	=	config.playerIcon&&config.playerIcon.height||'60px',
      iconSrc	=	config.playerIcon&&config.playerIcon.src||'http://mjs.sinaimg.cn/wap/module/newPlayer/201604111824/images/play.png';

    var domHTML	=	"<div class='aloading'>";
    domHTML		+=	"</div>";
    domHTML		+=	'<video width="100%" webkit-playsinline playsinline style="height:' + h + 'px;max-height:'+ window.innerWidth +'px;"  data-index=' + index + ' ' + videoAttrStr + '>';
    domHTML		+=	"当前浏览器不支持最新的video播放";
    domHTML		+=	"</video>";
    // video control here
    domHTML		+=	"<div class='aplayer_button pause'>";
    domHTML		+=	"<span class='aplayer_button_span'></span>";
    domHTML		+=	"</div>";
    if(config.duration){
      domHTML		+=	"<div class='aplayer_bar'>";
      domHTML		+=	"<div class='aplayer_timeBar'>";
      domHTML		+=	"<time class='dur_now'>00:00</time>";
      domHTML		+=	"</div>";
      domHTML		+=	"<div class='aplayer_durBar'>";
      domHTML		+=	"<div class='aplayer_durTotal'>";
      domHTML		+=	"<div class='aplayer_durCur'>";
      domHTML		+=	"<div class='aplayer_durPoint'>";
      domHTML		+=	"</div>";
      domHTML		+=	"</div>";
      domHTML		+=	"<div class='aplayer_durLoaded'>";
      domHTML		+=	"</div>";
      domHTML		+=	"</div>";
      domHTML		+=	"</div>";
      domHTML		+=	"<div class='aplayer_timeBar'>";
      domHTML		+=	"<time class='dur_total'>" + (config.duration || '0') + "</time>";
      domHTML		+=	"</div>";
      domHTML		+=	"<div class='aplayer_scale'>";
      domHTML		+=	"<span class='aplayer_scaleBtn'></span>";
      domHTML		+=	"</div>";
      domHTML		+=	"</div>";
    }
    //video control end
    // if(config.poster){
    if(config.shadowBg){
      domHTML	+=	"<div class='aposter_wrap aShadowBg' style='background:url("+ config.poster +");background-size:cover;'>";
      domHTML	+=	"<img class='aposter' src='" + config.poster + "'>";
    }else{
      domHTML	+=	"<div class='aposter_wrap'>";
      domHTML	+=	"<img class='aposter' src='" + config.poster + "' style='width:100%;height:auto;'>";
    }
    domHTML	+=	"</div>"
    // }
    domHTML		+=	"<div class='aplayerIconWrap'>";
    domHTML		+=	"<div class='aplay' style='text-align:center;line-height:1;'>";
    domHTML		+=	"<img class='aplayerIcon' style='width:"+ iconW +";height:"+ iconH +";' src='" + iconSrc + "'>";
    if(config.duration){
      if(typeof(config.duration) == 'number'){
        var dur =	getDurStr(config.duration);
      }else{
        var dur =	config.duration;
      }
      domHTML		+=	"<span class='aDuration' data-dur=" + getDurNum(dur) + ">";
      domHTML		+=	dur;
      domHTML		+=	"</span>";
    }
    if(config.playTimes){
      domHTML		+=	"<div class='playTimes'>";
      domHTML		+=	config.playTimes;
      domHTML		+=	"</div>";
    }
    domHTML		+=	"</div>";
    domHTML		+=	"</div>";
    domHTML		+=	"</div>";


    if(this._uaList.isLieBao){
      this._showVideo(con , false);
    }
    var $html = $(domHTML);
    $(con).attr('data-index',index).css({'height':h,'line-height':h+'px','text-align':'center','min-height':h}).append($html);

    this._bindPlayerEvent(con , config);

  },
  _bindReset	:	function(){
    var _this = this;
    window.addEventListener('resize',function(){
      _this._resizePlayer();
    },false)
  },
  _resizePlayer	:	function(){
    var tempThis = this;
    this.playerEleList.forEach(function(item, index){
      var config = tempThis.playerCfgList[index];

      var $item = $(item);
      var h = Math.round($item.width() * config.playerRatio);
      if(h == 0){
        $item.children("video").css("width", "100%");
      }else{
        $item.css({"height": h+"px",'line-height':h+'px'});
        $item.children("video").css("height", h+"px");
      }
//			console.log($item.siblings(".aplayer"))
      if(tempThis._isLieBao){
        var v = $item.children("video");
        var m = v.css("margin");
        v.css("margin", m);
      }
    });
  },
  _fixedEvent	:	function(con){
    if(window.scrollY - con.offset().top >= 0){
      con.children('video').css({'position':'fixed','top':'0','left':'0','width':'100%','z-index':'901'});
    }else{
      con.children('video').css({'position':'static','top':'0','left':'0','width':'100%','z-index':'auto'});
    }
  },
  _adsorb	:	function(con){
    var _this = this;
    var $con = $(con);
    window.addEventListener('scroll',function(){
      if(!con.classList.contains('playing')){
        return;
      }
      _this._fixedEvent($con);
    },false);
  },
  createPlayer	:	function(config){
    var _this	=	this;
    this.playerEleList = $('[data-aplayer]');
    this.playerCfgList.push(config);
    if(!config){
      console.warn('config mast be setted');
      return;
    };
    var con	=	this.playerEleList[this.playerSum];
    this._renderPlayer(con,this.playerSum);
    if(config.isAdsorb){
      this._adsorb(con);
    }
    $(con).on('click',function(){
      _this._startPlay($(this) , config);
    });
    this.playerSum++;
    var playerObj = new PlayerTool(con , config);
    return playerObj;
  },
  init	:	function(){
    this.ua	=	window.navigator.userAgent;
    this._confirmBroswer();
    this._bindReset();
  }
}
var aPlayer = new APlayer();