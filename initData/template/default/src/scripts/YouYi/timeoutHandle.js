/**
    timeoutHandle(function(handle) {
      // 需要监听可能超时的事件
      doSomething(function(){
        // 成功通知
        handle.success();
      });
    }, function() {
      // 超时执行的事件
      alert('超时了');
    }, config.timeout);
 */
define( [  'core' ], function(youYi ) {
    'use strict';

    var isFn = function( fn ) {
        return typeof fn === 'function';
    };
    var getHandle = function( timeoutFn, time ) {
        var isTimeout = false;
        var timerId = setTimeout( function() {
            isTimeout = true;

            // 超时时执行
            if ( isFn( timeoutFn ) ) {
                timeoutFn.call( this );
            }
        }, time );
        return {
            isTimeout: function() {

                // 返回超时状态
                return isTimeout;
            },
            success: function() {

                // 成功后清除 超时处理
                if ( timerId ) {
                    clearTimeout( timerId );
                }
            }
        };
    };

    var timeoutHandle = function( doFn, timeoutFn, time ) {

        // 通知对象，是否超时handle.isTimeout() 通知事件没有超时 handle.success();
        var handle = getHandle( timeoutFn, time );

        // 处理可能超时的事件
        if ( isFn( doFn ) ) {
            doFn.call( this, handle );
        }

        return handle;
    };
    youYi.timeoutHandle = timeoutHandle;
    return timeoutHandle;
} );
