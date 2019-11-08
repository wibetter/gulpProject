define( [ 'core'], function(youYi ) {
    'use strict';

    var getParam = function(key) {
        var params = location.search;
        if (params) {
            var arr = params.substr(1).split('&');
            for (var i = 0; i < arr.length; i++) {
                var data = arr[ i ].split( '=' );
                if ( data[ 0 ] === key ) {
                    return data[ 1 ];
                }
            }
        }
    };
    youYi.getParam = getParam;
    return getParam;
} );
