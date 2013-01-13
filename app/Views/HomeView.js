define(["jquery", "underscore", "parse", "text!../Templates/Home.html"], function($, _, Parse, template) {
	return Parse.View.extend({

		pageTitle: "HypochondriApp",
		
		tabId : "#homeTab",

		initialize: function() {
			_.bindAll(this);
			this.template = _.template(template);
			this.username = Parse.User.current().get("username");
		},

		render: function() {
			this.$el.html(this.template({"username": this.username}));
			return this;
		}
	});
});