define( ['core', 'getNodes'], function(youYi, getNodes ) {
    'use strict';
    var render = (function() {
        var escapeRules = {
            '&': '&#38;',
            '<': '&#60;',
            '>': '&#62;',
            '"': '&#34;',
            "'": '&#39;',
            '/': '&#47;'
        };

        function _escape(code, doNotSkipEncoded) {
            var matchHTML = doNotSkipEncoded ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
            return code && typeof code === 'string' ? code.replace(matchHTML, function(m) {
                return escapeRules[ m ] || m;
            }) : code;
        }

        var toStr = {}.toString;
        var isArray = Array.isArray || function(arr) {
            return toStr.call(arr) === '[object Array]';
        };
        var arrayToString = function( html ){
        	if( isArray( html ) ) {
        		return html.join('');
        	} else {
        		return html;
        	}
        };
        var _for = function(list, fn) {
            var html = [];
            var i;
            if (isArray(list)) {
            	var len = list.length;
                for ( i = 0; i < len; i++) {
                    html.push( arrayToString( fn(list[ i ], i) ));
                }
            } else {
                for ( i in list) {
                    html.push( arrayToString( fn(list[ i ], i) ));
                }
            }
            return arrayToString( html );
        };
        return function(data, getHtml, options ) {
        	var instance = {
        		update: {}
        	};
        	options = $.extend( true, {
        		nodeType: 'node-type',
        		defaultUpdate: function( nodes, val ){
        			nodes.html( val.toString() );
        		}
        	}, options );
        	if ( typeof getHtml === 'function' ) {
	            return arrayToString( getHtml(data, _escape, _for) );
        	} else {
        		var domList;
        		if( getHtml._list ) {
        			domList = getHtml._list;
        		} else {
	        		domList = getNodes( getHtml, options.nodeType )._list;
        		}
        		for ( var i in domList ) {
        			var nodes = domList[ i ];
        			var val = new Function( 'data', 'return data.' + i )( data );
        			var update = options.defaultUpdate;
        			if ( options.update && options.update[ i ] ) {
        				update = options.update[ i ];
        			}
        			update( nodes, val, {
    					nodes: domList,
    					d: data,
    					e: _escape,
    					f: _for
    				});
    				( function( nodes, i, update ) {

    					instance.update[i] = function( data ){
    						var val = new Function( 'data', 'return data.' + i )( data );
    						return update( nodes, val, {
    							nodes: domList,
    							d: data,
    							e: _escape,
    							f: _for
    						} );
    					};

    				} )( nodes, i, update );
        		}
        	}

        	return instance;
        };
    })();
    youYi.render = render;
    return render;
});
