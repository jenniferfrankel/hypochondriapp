(function($){
	$.fn.serializeObject = function(){
		var a = this.find("[name]").map(function(i, el) {
			var type = $(el).attr("type") || "text";
			var o = {};
			var val = $(el).val();

			switch (type) {
				case "checkbox" : val = !!val; break;
				case "number" : val = parseFloat(val); break;
				case "range" : val = parseFloat(val); break;
				case "date" : val = new Date(val); break;
			}

			o[$(el).attr('name')] = val;
			return o;
		});
		return _.reduce(a, function(a,b) {
			return _.extend({}, a, b);
		});
	};
})(jQuery);

