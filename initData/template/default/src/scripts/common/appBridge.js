var isDebugModel = location.href.indexOf('debug=1') !== -1;
 isDebugModel&& !window.jsBridge && navigator.appVersion.toLowerCase().indexOf('android')>-1 && (window.jsBridge = {process: function(data){console.log(data)}});
(function(win, doc, undef){
    var EventFactory = function(){
        var eventMap = {};
        function initEvent(live){
            return {
                listener: [], // {func: Function, liveIndex: 0}
                isLive: live || false,
                liveEvents: [],
            };
        }
        function addListener(eventObj, listenFunc){
            var listenerProxy = eventObj.listener,
                exist = false,
                listenObj = {};
            exist = !listenerProxy.every(function(tmp){
                if(tmp.func !== listenFunc){
                    return true;
                }else{
                    listenObj = tmp;
                    return false;
                }
            });
            if(!exist){
                listenObj = {
                    func: listenFunc,
                    liveIndex: 0,
                };
                listenerProxy.push(listenObj);
            }
            return listenObj;
        }
        return {
            on: function(eventName, func, isLive){
                if(!this.eventMap){
                    this.eventMap = {};
                }
                eventMap = this.eventMap;
                var eventObj=null, listenerObj=null, isLive=isLive||false;
                if(!eventMap.hasOwnProperty(eventName)){
                    eventMap[eventName] = initEvent(isLive);
                }
                eventObj = eventMap[eventName];
                listenObj = addListener(eventMap[eventName], func);
                if(isLive && eventObj.liveEvents.length > 0 && listenObj.liveIndex < eventObj.liveEvents.length){
                    var i=listenObj.liveIndex,
                        len = eventObj.liveEvents.length;
                    eventObj.liveIndex = len;
                    for(;i<len;i++){
                        func.apply(window, eventObj.liveEvents[i]);
                    }
                    listenObj.liveIndex = eventObj.liveEvents.length;
                }
            },
            trigger: function(eventName, params, isLive){
                //isLive = typeof(isLive) === 'boolean' ? isLive : true;
                var eventObj = {};
                if(!this.eventMap){
                    this.eventMap = {};
                }
                eventMap = this.eventMap;
                if(util._type(params) !== 'array'){
                  params = [params];
                }
                if(!eventMap.hasOwnProperty(eventName)){
                    eventObj = eventMap[eventName] = initEvent(typeof(isLive) === 'boolean' ? isLive : true);
                    eventObj.liveEvents.push(params);
                }else{
                    eventObj = eventMap[eventName];
                    eventObj.listener.forEach(function(listenObj){
                        try{
                            listenObj.func.apply(window, params);
                        }catch(err){
                            console.error && console.error(err);
                        }
                    });
                    isLive ? eventObj.liveEvents.push(params) : '';
                }
            }
        };
    };
    var util = {
      _type: function(obj){
        var tmp = typeof(obj);
        return tmp === 'object' ? 
            (Object.prototype.toString.call(obj).match(/\[object (.*)\]/) ? RegExp.$1.toLowerCase() : 'other') :
            tmp;
      },
      _extend: function(src, target, cover){
        cover = cover || false;
        for(var i in target){
            target.hasOwnProperty(i) && !src.hasOwnProperty(i) || !cover ? src[i]=target[i] : '';
        }
      },
      generateUid: function(key){
        var code = ['A','z','C','E','d','H','j','v','k','L']
            ,timestamp = (new Date()).getTime();
        function getRandomCode(){
            var org = ''+(parseInt(Math.random()*10000));
            return [].map.call(org, function(item){
                return code[item];
            }).join('');
        }
        key = key || '';
        return key + getRandomCode() + timestamp;
      }
    }
    var newsAppBridge = {
      get cnf(){
        !this._cnf && (this._cnf={
          actionMap: ['unknow', 'comment', 'share', 'open_comment', 'collection', 'login','subscription','mpSubscription','constellation','skip','font-change', 'switch-daynight', 'update-constellation','car','scheme','appoint_match','appoint_query','reserved'],
          methods: ['comment', 'share', 'open_comment', 'collection', 'login','subscription','mpSubscription','constellation','skip','car','scheme','appoint_match','appoint_query','reserved'],
          clientEventMap: ['font-change', 'switch-daynight', 'update-constellation'],
          //clientEventMap: [],
          iframeProtocol: 'jsBridge://',
        });
        return this._cnf;
      },
      set cnf(val){
        if(util._type(val) === 'object'){
          !this._cnf && this.cnf;
          Object.keys(val).forEach(function(key){
            this._cnf[key] = val[key];
          });
        }
        return val;
      },
      init: function(cnf){
        cnf && (this.cnf=cnf);
        if(this.checkDepend()){
          this.initListen();
        };
      },
      initListen: function(){
        var cnf = this.cnf;
        var self = this;
        cnf.clientEventMap.forEach(function(clientEvent){
          if(clientEvent){
            var req = {
              method: "addEventListener",
              event: clientEvent,
              callback: "try{newsAppBridge.trigger('" + clientEvent + "',[data]);}catch(e){}",
            }
            self.on(clientEvent, self._proxy.bind(newsAppBridge, clientEvent));
            self._request(req);
          }
        });
        cnf.methods.forEach(function(method){
          self.on('call_'+method, self._proxy.bind(newsAppBridge, method));
        });
      },
      checkDepend: function(){
        var cnf = this.cnf;
        cnf.protolType = 'unknow';
        if(win.jsBridge && (util._type(win.jsBridge.process)==='function')){
          cnf.protolType = 'jsBridge';
          return this.enable = true;
        }else{
          var ua = navigator.userAgent.toLowerCase();
          if(ua.match(/iphone|ipod|ipad/)){
            cnf.protolType = 'iframe';
            return this.enable = true;
          }
        }
        return false;
        //return (this.enable = win.jsBridge && (util._type(win.jsBridge.process)==='function'));
      },
      _request: function(data, callback, timeout){
        if(!this.enable){
          return;
        }
        cnf = this.cnf;
        timeout = timeout || 3 * 1000;
        var callbackpref = 'h5appCallback';
        var iphonepref = 'jsBridge';
        var uniKey = util.generateUid();
        var iframe = null;
        var callbackKey = null;

        if(util._type(callback) === 'function'){
          callbackKey = callbackpref+uniKey;
          win[callbackKey] = (function(data){
            delete win[callbackKey];
            callback(data);
          }).bind(window);
          util._extend(data, {
            callback: 'try{window[\''+callbackKey+'\']([data])}catch(err){console.log(err)}',
          });
        };
        //alert('ready to send data'+JSON.stringify(data))
        data = JSON.stringify(data);
        if(cnf.protolType === 'jsBridge'){
          win.jsBridge.process(data);
        }else{
          var iphoneKey = iphonepref+uniKey;
          win[iphoneKey] = data;
          iframe = doc.createElement('iframe');
          iframe.src = cnf.iframeProtocol+iphoneKey;
          iframe.style.display = 'none';
          cnf.iframeProtocol && iphoneKey && doc.body.appendChild(iframe);
        }
      },
      _proxy: function(method, _data, cb){
        var cnf = this.cnf;
        if(!cnf.actionMap || cnf.actionMap.indexOf(method) === -1){
          return;
        }
        var req = {data:{action:method},callback: '', method:"requestCallback"},
            data = typeof(_data)!='undefined'&& _data || {};

        switch(method){
          case 'share':
            util._extend(req.data, {
              url   : data.url || location.href,
              title : data.title || doc.title,
              pic   : data.pic || 'http://mjs.sinaimg.cn/wap/online/public/images/addToHome/mil_114x114_v1.png',
              intro : data.intro || doc.title,
            });
          break;
          case 'comment':
            util._extend(req.data, {
              url   : data.url || location.href,
              newsid: data.cmntid || 'fxqaffy3538394',
              channel: data.ch || doc.title,
              mid   : '',
            });
          break;
          case 'login':
          case 'constellation':
          case 'car':
          break;
          case 'collection':
            util._extend(req.data, {newsid:"",title:"",url:"",isFavorited:""});
          break;
          case 'open_comment':
            util._extend(req.data, {
              url: location.href,
              newsid: 'fxqaffy3538394',
              channel: doc.title,
              title: 'test',
            });
          break;
          case 'mpSubscription':
          case 'subscription':
          case 'scheme':
          util._extend(req.data, data);
          break;
          case 'skip':
          util._extend(req.data, {
            url: data.url
          });
          break;
          //client event
          case 'font-change':
            this.trigger('call_setFontSize', data);
          break;
          case 'switch-daynight':
            this.trigger('call_dayNight', data);
          break;
          case 'update-constellation':
            this.trigger('call_upConstellation', data);
            //console.log('data:'+JSON.stringify(data)+' no ready ToDo!');
          break;
          // case 'appoint-result':
          //   this.trigger('call_appointMatchResult',data); 
          // break;
          case 'appoint_match':
          case 'appoint_query':
          case 'reserved':
            util._extend(req.data, data);
            break;
          default:
          return;
        }
        if(method === 'share' || method === 'appoint_match' || method === 'appoint_query' || method === 'reserved'){
          this._request(req, cb || function(data){console.log('app callback'+JSON.stringify(data))});
        }else{
          this._request(req);
        }
      }
    }
    util._extend(newsAppBridge, EventFactory());
    newsAppBridge.init(); 
    if( isDebugModel){
      win.appointMatchResult = function(data){
        console.log(JSON.stringify(data));
        alert('return match data : '+JSON.stringify(data));
      }

      win.appointMatchQuery = function(data){
        console.log(JSON.stringify(data));
        alert('return match data : '+JSON.stringify(data));
      }
      doc.getElementById('main') && doc.getElementById('main').addEventListener('click', function(e){
        var curTarget = e.target,
            _dataset = curTarget.dataset || {},
            _type = _dataset['type'],
            _infoType = (_type == 'scheme'||_type == 'appoint_match'||_type == 'appoint_query')?_dataset['infotype']:'',
            _info = _infoType && typeof(_testInfo)!='undefined' && [_testInfo[_infoType]] || [];

        _type == 'appoint_match' && _info.push(appointMatchResult);
        _type == 'appoint_query' && _info.push(appointMatchQuery);   

        if(curTarget && curTarget.nodeName=='BUTTON'){
          newsAppBridge.trigger('call_' + curTarget.getAttribute('data-type'), _info);
          // _type == 'appoint-match' && newsAppBridge.on('call_appointMatchResult',appointMatchResult, true);      
        }
      });
    }
    win.newsAppBridge = newsAppBridge;
  }(window, document, undefined));