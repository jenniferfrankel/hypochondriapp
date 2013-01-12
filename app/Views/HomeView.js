define(["jquery", "underscore", "parse", "text!../Templates/Home.html"], function($, _, Parse, template) {
	return Parse.View.extend({

		pageTitle: "HypochondriApp",

		initialize: function() {
			_.bindAll(this);
			var that = this;
			this.template = _.template(template);
			$("#newButton").hide();
			this.hideBackButton = true;
			$("#symptomsTab").removeClass("active");
			$("#settingsTab").removeClass("active");
			$("#homeTab").addClass("active");
			this.username = Parse.User.current().get("username");
		},

		render: function() {
			this.$el.html(this.template({"username": this.username}));
			return this;
		}
	});
});