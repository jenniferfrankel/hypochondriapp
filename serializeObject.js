(function($){
	$.fn.serializeObject = function(){
		var o = {};
		_.each(this.serializeArray(),function(element){
			var v = element.value;
			o[element.name] = $.isNumeric(v) ? parseFloat(v) : v;
		});
		return o;
	};
})(jQuery);