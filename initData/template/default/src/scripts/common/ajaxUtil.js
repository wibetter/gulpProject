/* 对Ajax数据获取进行一个简单的封装:
 * 以便对所有ajax请求做统一管控
 * */
define(['jQuery'], function() {
  var ajaxUtil = function (opt) {
    opt.type = opt.type || 'GET'; // 保证opt.type不为空
    $.ajax({
      url: opt.url,
      data: opt.type.toUpperCase() == 'POST' ? opt.data : $.extend(true, opt.data, {
        '_': new Date().getTime(),
        dpc: 1,
      }), // dpc = 1,后端定义的一个字段，用于启动缓存
      type: opt.type,
      timeout: 10e3,
      dataType: opt.dataType || 'jsonp',
      cache: true,
      jsonpCallback: 'cb_' + opt.name + '_20190115',
      success: opt.success,
      error: function (err) {
        if (opt.fail && typeof opt.fail === 'function') {
          opt.fail(err);
        }
      }
    })
  };
  return ajaxUtil;
});
