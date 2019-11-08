define( [ 'core', 'getGuid', 'timeoutHandle','jQuery' ], function( youYi, getGuid, timeoutHandle ) {
	'use strict';

	var ijax = function(url,data,cb){
	    var body = $('body');
	    var suffix = Math.abs((new Date()).getTime()) + '_' + Math.round(Math.random() * 1e8);
	    var id = "ijax_iframe_"+suffix;
	    var styleHidden = ' style="position:absolute;top:-9999px;height:0px;overflow:hidden;" ';
	    var ifm = $('<iframe'+ styleHidden +'frameborder="0" name="'+id+'" id="'+id+'"></iframe>');
	    data.callback = 'ijax_'+suffix;
	    var inputHtml = (function(data){
	        var html = [];
	        for(var name in data){
	            var val = data[name];
	            html.push('<textarea type="hidden" name="'+name+'" >'+val+'</textarea>');
	        }
	        return html.join('');
	    })(data);
	    window['ijax_'+suffix] = function(msg){
	        if(typeof cb === 'function'){
	          cb(msg);
	        }
	        setTimeout(function(){
	          ifm.remove();
	          form.remove();
	        },1e3);
	    };
	    var form = $('<form'+ styleHidden +'action="'+url+'?callback=ijax_'+suffix+'" method="post" target="'+id+'">'+inputHtml+'</form>');
	    body.append(ifm);
	    body.append(form);
	    form.submit();
	    return {
	    	inputHtml: inputHtml,
	    	form: form,
	    	iframe: ifm,
	    	callback: window['ijax_'+suffix]
	    };
	};

	youYi.ijax = ijax;
	return ijax;
} );
