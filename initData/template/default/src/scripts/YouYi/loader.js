define( [ 'core', 'getGuid', 'timeoutHandle' ], function(youYi, getGuid, timeoutHandle ) {
	'use strict';

	function Loader( options ) {
		var self = this;

		// - 唯一标识，用于绑定事件，存储数据等
		self.guid = getGuid();

		// - 自定义事件
		self.proxy = $( {} );
		self.opt = $.extend( true, {

			// 数据接口，和 jquery ajax 的参数一致
			read: {
			},

			// 检测数据返回的正确性
			hasRightResult: function( data ) {
				try {
					if ( data.result.status.code === 0 ) {
						return true;
					}
				} catch ( e ) {
					return false;
				}
			},

			// 在 ajax 无法返回所需的数据时，可以利用些配置把数据添加到实例中
			getData: function() {
			},

			// 如果有已经过载好的数据，可以使用这个参数传进来，不会再请求接口；
			// 注意调用 read() 之后，该 loadedData 会清空
			loadedData: null,

			// 链接错误或网络错误时的超时时间
			timeout: 20e3,
			error: $.noop,
			success: $.noop,
			beforeRead: $.noop
		}, options );
		self._loadBind();
	}
	Loader.prototype = {

		_loadBind: function() {
			var self = this;
			var opt = self.opt;
			self.proxy.on( 'load-success', function( e, data ) {
				opt.success.apply( self, [ data ] );
			} );
			self.proxy.on( 'load-error', function( e, data ) {
				opt.error.apply( self, [ data ] );
			} );
			self.proxy.on( 'load-before', function() {
				opt.beforeRead.call( self );
			} );
		},

		// **获取数据**
		read: function() {
			var self = this;
			var opt = self.opt;
			var optRead = opt.read;
			var onSuccess = function( data ) {

				// 告知超时处理器，已经加载成功
				if ( self.timeoutHandle ) {
					self.timeoutHandle.success();
				}

				self.data = data = ( opt.getData.call( self, data ) ) || data;

				if ( opt.hasRightResult( data ) ) {

					// 在数据正确时才认为加载成功
					self.proxy.trigger( 'load-success', [ data ] );
				} else {
					self.proxy.trigger( 'load-error', [ {
						error: 'data error',
						data: data,
						self: self
					} ] );
				}
			};

			// 如果有加载好的数据，不再请求接口
			if ( opt.loadedData ) {
				onSuccess( opt.loadedData );
				self.proxy.trigger( 'load-loadedData', [ {
					data: opt.loadedData,
					self: self
				} ] );
				opt.loadedData = null;

				return;
			}

			// 默认ajax参数
			var defaults = {
				url: '',
				data: {},
				success: function( data ) {
					onSuccess( data );
				},
				error: function(e) {

					var error = e.statusText === 'timeout' ? 'timeout error' : 'error';

					// 如果没有响应头，可能请求没有发出，请求是jsonp, 请求地址错误，请求域名错误等原因，
					// 此时 jQuery ajax 的 timeout 会不起作用，会触发自定义的 timeout 设置
					if (  e.getAllResponseHeaders && typeof e.getAllResponseHeaders === 'function' && e.getAllResponseHeaders() ) {

						// 告知超时处理器，已经加载成功
						self.timeoutHandle.success();

						// 手动trigger load-error
						self.event.trigger( 'load-error', [ {
							error: error,
							data: e,
							self: self
						} ] );
					}

				}
			};

			// 触发加载前事件
			self.proxy.trigger( 'load-before' );

			// 合并默认设置与自定义设置
			optRead = $.extend( defaults, optRead );

			// 每次加载前清空超时处理器
			if ( self.timeoutHandle ) {
				self.timeoutHandle.success();
			}

			// 超时处理器
			self.timeoutHandle = timeoutHandle( function() {
				self._ajax = $.ajax( optRead );
			}, function() {

				// 请求超时
				self.proxy.trigger( 'load-error', [ {
							error: 'timeout error',
							data: {},
							self: self
						} ] );

				// 并且停止请求
				self._ajax.abort();
			}, opt.timeout );
		}
	};
	youYi.Loader = Loader;
	return Loader;
} );
