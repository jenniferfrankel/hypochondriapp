(function($){
	$.fn.serializeObject = function(){
		var o = {};
		_.each(this.serializeArray(),function(element){
			o[element.name] = element.value;
		});
		return o;
	};
})(jQuery);