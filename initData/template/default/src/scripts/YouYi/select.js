define( [ 'core' ], function( youYi ) {
 	'use strict';
 	var Util = {
 	  $: function(id) {
 	    return document.getElementById(id);
 	  },
 	  //Event
 	  addEvent: function(obj, eventType, func) {
 	    if (obj.attachEvent) {
 	      obj.attachEvent('on' + eventType, func);
 	    } else {
 	      obj.addEventListener(eventType, func, false)
 	    }
 	  },
 	  delEvent: function(obj, eventType, func) {
 	    if (obj.detachEvent) {
 	      obj.detachEvent('on' + eventType, func)
 	    } else {
 	      obj.removeEventListener(eventType, func, false)
 	    }
 	  },
 	  hasClass : function(el, clz) {
 	    if (!el) {
 	      return false;
 	    }
 	    return el.className.match(new RegExp('(\\s|^)' + clz + '(\\s|$)'));
 	  },
 	  addClass : function(el, clz) {
 	    if (!Util.hasClass(el, clz)) {
 	      el.className = el.className.replace(/(^\s*)|(\s*$)/g, '') + ' ' + clz;
 	    }
 	  },
 	  removeClass : function(el, clz) {
 	    if (Util.hasClass(el, clz)) {
 	      var reg = new RegExp('(\\s|^)' + clz + '(\\s|$)');
 	      el.className = el.className.replace(reg, ' ');
 	    }
 	  },
 	  readStyle: function(i, I) {
 	    if (i.style[I]) {
 	      return i.style[I]
 	    } else if (i.currentStyle) {
 	      return i.currentStyle[I]
 	    } else if (document.defaultView && document.defaultView.getComputedStyle) {
 	      var l = document.defaultView.getComputedStyle(i, null);
 	      return l.getPropertyValue(I)
 	    } else {
 	      return null
 	    }
 	  },
 	  absPosition: function(obj, parentObj) {
 	    var left = obj.offsetLeft;
 	    var top = obj.offsetTop;
 	    var tempObj = obj.offsetParent;
 	    var sss = '';
 	    try {
 	      while (tempObj.id != document.body && tempObj.id != document.documentElement && tempObj != parentObj && tempObj != null) {
 	        sss += tempObj.tagName + ' , ';
 	        tempObj = tempObj.offsetParent;
 	        left += tempObj.offsetLeft;
 	        top += tempObj.offsetTop;
 	      }
 	    } catch (e) {};
 	    return {
 	      left: left,
 	      top: top
 	    };
 	  },
 	  stopDefault: function(e) {
 	    if (e.preventDefault) {
 	      e.preventDefault();
 	    } else {
 	      e.returnValue = false;
 	    }
 	  },
 	  create: function(tagName, className, parent,pos) {
 	    tagName = tagName || 'div';
 	    var div = document.createElement(tagName);
 	    div.className = className || '';
 	    if (parent) {
 	      var first = parent.firstChild;
 	      if(first && pos && pos ==='prepend'){
 	        parent.insertBefore(div, first);
 	      }else{
 	        parent.appendChild(div);
 	      }
 	    }
 	    return div;
 	  }
 	};
 	var Select = function(wrap, opt){
 		var self = this;
 		var opt = self.opt = $.extend({
 		  prefix: 'select',
 		  triggerEvent:'mouseover'
 		}, opt)
 		var clzPrefix = opt.prefix + '-';
 		self.ele = $(wrap)[0];

 		self.status = 'close';

 		self.parentObj = self.ele.parentNode;
 		while (Util.readStyle(self.parentObj, 'display') != 'block') {
 		  if (self.parentObj.parentNode) {
 		    self.parentObj = self.parentObj.parentNode
 		  } else {
 		    break
 		  }
 		}

 		self.parentObj.style.position = 'relative';

 		var sp = Util.absPosition(self.ele, self.parentObj);

 		self.ele.style.visibility = 'hidden';

 		self._div = Util.create('div', clzPrefix + 'wrap', self.parentObj,'prepend');

 		self._div.style.position = 'relative';
 		Util.addEvent(self._div, 'click', function(){
 		  self.click();
 		});

 		self._div_count = Util.create('div', clzPrefix + 'cont', self._div);
 		self._div_title = Util.create('div', clzPrefix + 'title', self._div_count);
 		self._div_button = Util.create('div', clzPrefix + 'button', self._div_count);
 		self._div_list = Util.create('div', clzPrefix + 'list', self._div);
 		self._div_list.style.display = 'none';

 		if(opt.triggerEvent === 'mouseover'){
 		  var timeoutId = null;
 		  Util.addEvent(self._div, 'mouseover', function(){
 		    clearTimeout(timeoutId);
 		    self.open();
 		  });
 		  Util.addEvent(self._div, 'mouseout', function(){
 		    clearTimeout(timeoutId);
 		    timeoutId = setTimeout(function(){
 		      self.close();
 		    },300);
 		  });
 		}

 		self._div_listCont = Util.create('div', clzPrefix + 'list-cont', self._div_list);
 		self.list = [];
 		var temp;
 		for (var i = 0; i < self.ele.options.length; i++) {
 		  temp = Util.create('p', '', self._div_listCont);
 		  self.list.push(temp);

 		  temp.innerHTML = self.ele.options[i].innerHTML;
 		  if (self.ele.selectedIndex === i) {
 		    self._div_title.innerHTML = temp.innerHTML;
 		  }
 		  temp.num = i;
 		  temp.onmouseover = function() {
 		    self.showSelectIndex(this.num)
 		  };
 		  temp.onclick = function() {
 		    self.select(this.innerHTML)
 		  };
 		}
 		self.ele.style.display = 'none';
 	};
 	Select.prototype = {
 		showSelectIndex: function(num) {
 		  var self = this;
 		  if (typeof (num) === 'undefined') {
 		    num = self.ele.selectedIndex;
 		  }
 		  if (typeof (self.showIndex) !== 'undefined') {
 		    self.list[self.showIndex].className = '';
 		  }
 		  self.showIndex = num;
 		  self.list[self.showIndex].className = 'selected';
 		},
 		select: function(txt) {
 		  var self = this;
 		  for (var i = 0; i < self.ele.options.length; i++) {
 		    if (self.ele.options[i].innerHTML === txt) {
 		      self.ele.selectedIndex = i;
 		      if (self.ele.onchange) {
 		        self.ele.onchange();
 		      }
 		      self._div_title.innerHTML = txt;
 		      break;
 		    }
 		  }
 		},
 		setIndex: function(num) {
 		  var self = this;
 		  if (num < 0 || num >= self.list.length) {
 		    return
 		  }
 		  self.ele.selectedIndex = num;
 		  if (self.ele.onchange) {
 		    self.ele.onchange();
 		  }
 		  self._div_title.innerHTML = self.list[num].innerHTML;
 		},
 		clickClose: function(e) {
 		  var self = this;
 		  var thisObj = e.target ? e.target : event.srcElement;
 		  var self = this;
 		  do {
 		    if (thisObj === self._div) {
 		      return
 		    }
 		    if (thisObj.tagName === 'BODY') {
 		      break;
 		    }
 		    thisObj = thisObj.parentNode;
 		  } while (thisObj.parentNode);
 		  self.close();
 		},
 		keyDown: function(e) {
 		  var self = this;
 		  var num = self.showIndex;
 		  if (e.keyCode === 38) { //up
 		    num--;
 		    if (num < 0) {
 		      num = self.list.length - 1;
 		    }
 		    self.showSelectIndex(num);
 		    Util.stopDefault(e);
 		  }
 		  if (e.keyCode === 40) { //down
 		    num++;
 		    if (num >= self.list.length) {
 		      num = 0;
 		    }
 		    self.showSelectIndex(num);
 		    Util.stopDefault(e);
 		  }
 		  if (e.keyCode === 13 || e.keyCode === 9) { //enter || tab
 		    self.setIndex(num);
 		    Util.stopDefault(e);
 		    self.close();
 		  }
 		  if (e.keyCode === 27) { //esc
 		    self.close();
 		  }
 		},
 		open: function() {
 		  var self = this;
 		  self.showSelectIndex();
 		  self._div_list.style.display = 'block';
 		  self.status = 'open';
 		  self.__closeFn = function(e) {
 		    self.clickClose(e)
 		  };
 		  self.__keyFn = function(e) {
 		    self.keyDown(e)
 		  };
 		  Util.addEvent(document, 'click', self.__closeFn);
 		  Util.addEvent(document, 'keydown', self.__keyFn);
 		  var dropdownClz = self.opt.prefix + '-dropdown';
 		  Util.addClass(self._div,dropdownClz);
 		},
 		close: function() {
 		  var self = this;
 		  self._div_list.style.display = 'none';
 		  self.status = 'close';
 		  Util.delEvent(document, 'click', self.__closeFn);
 		  Util.delEvent(document, 'keydown', self.__keyFn);
 		  var dropdownClz = self.opt.prefix + '-dropdown';
 		  Util.removeClass(self._div,dropdownClz);
 		},
 		click: function() {
 		  var self = this;
 		  if (self.status === 'open') {
 		    self.close();
 		  } else {
 		    self.open();
 		  }
 		}
 	};


 	youYi.Select = Select;
 	return Select;
 } );

