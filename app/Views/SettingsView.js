define(["jquery", "underscore", "text!../Templates/Settings.html"], function($, _, template) {
	return Parse.View.extend({

		pageTitle: "Settings",

		tabId: "#settingsTab",

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