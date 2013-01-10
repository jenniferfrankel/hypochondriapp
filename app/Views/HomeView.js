define(["jquery", "underscore", "text!../Templates/Home.html"], function($, _, template) {
	return Parse.View.extend({

		pageTitle: "HypochondriApp",

		initialize: function() {
			_.bindAll(this);
			var that = this;
			this.template = _.template(template);
			$("#newButton").hide();
			this.hideBackButton = true;
		},

		render: function() {
			this.$el.html(this.template());
			return this;
		}
	});
});
