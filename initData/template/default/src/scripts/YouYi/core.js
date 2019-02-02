define( function() {
    'use strict';

    ( function( con ) {

        // the dummy function
        function dummy() {}

        // console methods that may exist
        for ( var methods = 'assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn'.split( ',' ), func; ( func = methods.pop() ); ) {
            con[ func ] = con[ func ] || dummy;
        }
    } )( window.console = window.console || {} );

    var youYi = {};
    window.youYi = youYi;

    return youYi;
} );
