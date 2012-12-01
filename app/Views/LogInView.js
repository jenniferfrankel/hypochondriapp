define(["jquery", "parse", "underscore", "text!../Templates/Login.html"], function($, Parse, _, template) {
	return Parse.View.extend({
		events: {
			"submit form.login-form": "logIn",
			"submit form.signup-form": "signUp"
		},
		
		initialize: function(options) {
			_.bindAll(this);
			this.success = options.success;
			this.template = _.template(template);
		},

		logIn: function(e) {
			e.preventDefault();
			var that = this;
			var username = this.$("#login-username").val();
			var password = this.$("#login-password").val();
			
			Parse.User.logIn(username, password, {
				success: this.success,
				error: function(user, error) {
					that.$(".login-form .error").html("Invalid username or password. Please try again.").show();
					that.$(".login-form button").prop('disabled', false);
				}
			});

			this.$(".login-form button").prop('disabled', true);
		},

		signUp: function(e) {
			e.preventDefault();
			var that = this;
			var username = this.$("#signup-username").val();
			var password = this.$("#signup-password").val();
			
			Parse.User.signUp(username, password, { ACL: new Parse.ACL() }, {
				success: this.success,
				error: function(user, error) {
					that.$(".signup-form .error").html(error.message).show();
					that.$(".signup-form button").prop('disabled', false);
				}
			});

			this.$(".signup-form button").prop('disabled', true);
		},

		render: function() {
			this.$el.html(this.template());
			return this;
		}
	});
});