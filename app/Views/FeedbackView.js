define(["jquery", "parse", "underscore", "text!../Templates/Feedback.html"], function($, Parse, _, template) {
	return Parse.View.extend({
		events : {
			"click .button" : "onSubmit"
		},

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
		},

		onSubmit : function(e) {
			e.preventDefault();
			formData = {
				"entry.0.single" : this.$("form textarea").val(),
				"entry.2.single" : Parse.User.current().get("username"),
				"entry.3.single" : Parse.User.current().get("email"),
				"submit":"Submit"
			};
			var url = "https://docs.google.com/spreadsheet/formResponse?formkey=dG8wZUVjaDQzSkRuVUN1OUlxMHAyLVE6MQ";
			$.post(url, formData).
				always(this.onSubmitComplete);
		},

		onSubmitComplete : function() {
			this.$("form textarea").val("");
			alert("Thanks for your feedback!");
			window.history.back();
		}
	});
});