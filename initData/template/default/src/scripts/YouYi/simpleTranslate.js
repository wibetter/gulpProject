define( [  'core' ], function(youYi ) {
    'use strict';

    	// 获取浏览器厂商对应的 CSS3 属性
        var getCSS3Property =  ( function() {
        	var style = document.createElement('div').style;
        	var vendors = [ '', 'webkit', 'Moz', 'ms', 'O' ];
        	return function( property ) {
        		for (var i = 0, len = vendors.length; i < len; i++) {
        		    var item = vendors[ i ];
        		    if ( item ) {
        		    	var propertyArr = property.split('');
        		    	propertyArr[ 0 ] = propertyArr[ 0 ].toUpperCase();
        		    	property = propertyArr.join('');
        		    }
        		    var prop = item + property;
        		    if (prop in style) {
        		        return prop;
        		    }
        		}
        		return '';
        	};
        } )();


        // 通用数组获取 CSS 属性对象
        var getStyleByArr = function( keys, vals ) {
        	var style = {};
        	for (var i = 0, len = keys.length; i < len; i++) {
        		var key = keys[ i ];
        		style[ key ] = vals[ i ];
        	}
        	return style;
        };

        var guid = '_30bbde48_7e39_6b93_4bbb_9d07221b7cc9';

        var eventns = '.' + guid;

        // 获取 transform transition 对应浏览器厂商的属性名
    	var transformProperty = getCSS3Property( 'transform');
    	var transitionProperty = getCSS3Property( 'transition');

    	var defaults = {
    		wrap: null,
    		duration: 500,
    		end: 0,
    		direction: 'top',
    		cb: function() {

    		}
    	};


    	// 改变下拉对象 Y 坐标方法
    	// duration 为 0
    	var simpleTranslate = ( function() {

    		if ( transformProperty && transitionProperty ) {
    			return function( options ) {
    				options = $.extend( true, {}, defaults, options );
    				var wrap = options.wrap;
    				var transition = options.duration ? 'all ' + (options.duration / 1000) + 's ease-out' : '';
    				var style = options.direction === 'left' ? 'translate3d( ' + options.end  + 'px, 0, 0 )' : 'translate3d( 0, ' + options.end  + 'px, 0 )';
    				wrap.off( 'transitionend' + eventns );
    				wrap.on( 'transitionend' + eventns, function() {
    					options.cb();
    					wrap.off( 'transitionend' + eventns );
    				} );
    				wrap.css(
    					getStyleByArr(
    						[ transitionProperty, transformProperty ],
    						[ transition, style ]
    					)
    				);
    			};
    		} else {
    			return function( options ) {
    				options = $.extend( true, {}, defaults, options );
    				var wrap = options.wrap;
    				var style;
    				options.direction = options.direction || 'top';
    				style[ options.direction ] = options.end;
    				if ( options.duration ) {
    					wrap.stop().animate( style, options.duration, function() {
    						options.cb();
    					} );

    				} else {
    					wrap.css( style );
    					options.cb();
    				}

    			};
    		}
    	} )();

    youYi.simpleTranslate = simpleTranslate;
    return simpleTranslate;
} );
