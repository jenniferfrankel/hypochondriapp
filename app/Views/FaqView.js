define(["jquery", "underscore", "text!../Templates/faq.html"], function($, _, template) {
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