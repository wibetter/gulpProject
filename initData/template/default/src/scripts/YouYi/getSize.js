define( ['core'], function(youYi ) {
    'use strict';
    var getSize = function( wrap ) {
    	return {
			width : parseInt(wrap.width(), 10),
			height : parseInt(wrap.height(), 10),
			innerWidth : parseInt(wrap.innerWidth(), 10),
			innerHeight : parseInt(wrap.innerHeight(), 10),
			outerWidth : parseInt(wrap.outerWidth(), 10),
			outerHeight : parseInt(wrap.outerHeight(), 10),
			paddingLeft : parseInt(wrap.css( 'paddingLeft' ), 10),
			paddingTop : parseInt(wrap.css( 'paddingTop' ), 10),
			paddingRight : parseInt(wrap.css( 'paddingRight' ), 10),
			paddingBottom : parseInt(wrap.css( 'paddingBottom' ), 10),
			marginLeft : parseInt(wrap.css( 'marginLeft' ), 10),
			marginTop : parseInt(wrap.css( 'marginTop' ), 10),
			marginRight : parseInt(wrap.css( 'marginRight' ), 10),
			marginBottom : parseInt(wrap.css( 'marginBottom' ), 10),
			borderLeftWidth : parseInt(wrap.css( 'borderLeftWidth' ), 10),
			borderTopWidth : parseInt(wrap.css( 'borderTopWidth' ), 10),
			borderRightWidth : parseInt(wrap.css( 'borderRightWidth' ), 10),
			borderBottomWidth : parseInt(wrap.css( 'borderBottomWidth' ), 10),
			isBorderBox: wrap.css( 'boxSizing' ) === 'border-box'
		};
    };
    youYi.getSize = getSize;
    return getSize;
});
