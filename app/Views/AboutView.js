define(["jquery", "parse", "underscore", "text!../Templates/About.html"], function($, Parse, _, template) {
	return Parse.View.extend({
		
		initialize: function(options) {
			_.bindAll(this);
			this.template = _.template(template);
		},

		render: function() {
			this.$el.html(this.template());
			return this;
		}
	});
});