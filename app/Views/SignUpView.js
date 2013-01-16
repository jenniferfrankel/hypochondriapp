define(["jquery", "parse", "underscore", "text!../Templates/Signup.html"], function($, Parse, _, template) {
	return Parse.View.extend({

		pageTitle: "HypochondriApp",

		events: {
			"submit form.signup-form": "signUp",
			"click .cancel" : "onClickCancel"
		},
		
		initialize: function(options) {
			_.bindAll(this);
			this.success = options.success;
			this.template = _.template(template);
		},

		signUp: function(e) {
			e.preventDefault();
			if(this.validateForm()){
				var that = this;
				var email = this.$("#signup-email").val();
				var username = this.$("#signup-username").val().toLowerCase();
				var password = this.$("#signup-password").val();
				this.$(".signup-form button").prop('disabled', true);
				
				Parse.User.signUp(username, password, { ACL: new Parse.ACL(), email: email }, {
					success: this.success,
					error: function(user, error) {
						that.$(".signup-form .error").html(error.message).show();
						that.$(".signup-form button").prop('disabled', false);
					}
				});
			}
		},

		validateForm: function() {
			if (this.$("#signup-username").val().length < 1) {
				alert("You need to choose a username.");
				return false;
			}
			if (this.$("#signup-password").val().length < 1) {
				alert("You need to choose a password.");
				return false;
			}
			var regex = /^[\w\.\-\+]+\@([\w\-]+\.)+[a-zA-Z0-9]{2,4}$/;
			if (!regex.test(this.$("#signup-email").val())) {
				alert("You need to enter a valid email address");
				return false;
			}
			if (!window.navigator.onLine) {
				alert("Ooops! You seem to be offline. Please go online to sign up.");
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