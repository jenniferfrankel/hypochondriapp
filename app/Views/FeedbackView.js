define(["jquery", "parse", "underscore", "text!../Templates/Feedback.html"], function($, Parse, _, template) {
	return Parse.View.extend({

		pageTitle: "Feedback",
		tabId: "#settingsTab",
		backButtonText: "Settings",
		backLocation: "settings",

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