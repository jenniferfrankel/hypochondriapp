define(["jquery", "underscore", "text!../Templates/Releasenotes.html"], function($, _, template) {
	return Parse.View.extend({

		pageTitle: "Release notes",

		initialize: function() {
			_.bindAll(this);
			var that = this;
			this.template = _.template(template);
			$("#newButton").hide();
			this.hideBackButton = false;
			$("#symptomsTab").removeClass("active");
			$("#homeTab").removeClass("active");
			$("#settingsTab").addClass("active");
		},

		render: function() {
			this.$el.html(this.template());
			return this;
		}
	});
});