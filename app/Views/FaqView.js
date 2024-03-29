define(["jquery", "parse", "underscore", "text!../Templates/Faq.html"], function($, Parse, _, template) {
	return Parse.View.extend({

		pageTitle: "FAQ",
		tabId: "#settingsTab",
		backButtonText: "Settings",
		backLocation: "settings",

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