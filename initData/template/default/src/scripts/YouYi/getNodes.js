/**
    var dom = getNodes('#wrap','node-type');
 */
define( [ 'core', 'jQuery'], function(youYi ) {
    'use strict';

    function getNodes( wrap, attr ) {
        var $ = jQuery;
        attr = attr || 'node-type';
        wrap = $( wrap );
        var nodes = $( '[' + attr + ']', wrap );
        var nodesObj = {};
        nodesObj.wrap = wrap;
        var list = {};
        nodes.each( function() {
            var item = $( this );
            nodesObj[ item.attr( attr ) ] = item;
            if ( !list[ item.attr( attr ) ] ) {
                list[ item.attr( attr ) ] = [];
            }
            list[ item.attr( attr ) ].push( this );
        });
        $.each( list, function( i, n ) {
            list[ i ] = $( [].slice.call( n ) );
        });
        nodesObj._list = list;
        return nodesObj;
    }
    youYi.getNodes = getNodes;
    return getNodes;
} );
