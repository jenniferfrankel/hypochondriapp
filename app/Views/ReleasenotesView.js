define(["parse", "jquery", "underscore", "text!../Templates/Releasenotes.html"], function(Parse, $, _, template) {
	return Parse.View.extend({

		pageTitle: "Release notes",
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