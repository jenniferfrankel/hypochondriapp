define(["jquery", "parse", "underscore", "text!../Templates/faq.html"], function($, Parse, _, template) {
	return Parse.View.extend({

		pageTitle: "FAQ",

		initialize: function() {
			_.bindAll(this);
			var that = this;
			this.template = _.template(template);
		},

		render: function() {
			this.$el.html(this.template());
			return this;
		}
	});
});