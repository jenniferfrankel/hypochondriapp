define(["jquery", "parse", "underscore", "text!../Templates/ResetPassword.html"], function($, Parse, _, template) {
	return Parse.View.extend({

		pageTitle: "HypochondriApp",

		events: {
			"submit form.resetPassword-form": "requestPWreset",
			"click .cancel" : "onClickCancel"
		},
		
		initialize: function() {
			_.bindAll(this);
			this.template = _.template(template);
		},

		requestPWreset: function(e) {
			e.preventDefault();
			if(this.validateForm()){
				var that = this;
				var email = this.$("#reset-email").val();
				this.$(".resetPassword-form button").prop('disabled', true);

				Parse.User.requestPasswordReset(email, {
					success: function() {
						alert("Your reset password request has been sent.");
						window.location.hash = "login";
					},
					error: function(data) {
						console.log(data);
						alert("Oops, there was an error: "+data.message);
						this.$(".resetPassword-form button").prop('disabled', false);
					}
				});
			}
		},

		validateForm: function() {
			var regex = /^[\w\.\-\+]+\@([\w\-]+\.)+[a-zA-Z0-9]{2,4}$/;
			if (!regex.test(this.$("#reset-email").val())) {
				alert("You need to enter a valid email address.");
				return false;
			}
			if (!window.navigator.onLine) {
				alert("Ooops! You seem to be offline. Please go online to send the request.");
				return false;
			}
			return true;
		},

		onClickCancel: function() {
			window.location.hash = "login";
		},

		render: function() {
			this.$el.html(this.template());
			return this;
		}
	});
});