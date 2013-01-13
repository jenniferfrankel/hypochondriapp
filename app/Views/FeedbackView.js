define(["jquery", "underscore", "text!../Templates/Feedback.html"], function($, _, template) {
	return Parse.View.extend({

		pageTitle: "Feedback",

		initialize: function() {
			_.bindAll(this);
			this.template = _.template(template);
		},

		render: function() {
			this.$el.html(this.template());
			return this;
		}
	});
});