define(["jquery", "parse", "underscore", "text!../Templates/Signup.html"], function($, Parse, _, template) {
	return Parse.View.extend({
		events: {
			"submit form.signup-form": "signUp"
		},
		
		initialize: function(options) {
			_.bindAll(this);
			this.success = options.success;
			this.template = _.template(template);
		},

		signUp: function(e) {
			e.preventDefault();
			var that = this;
			var email = this.$("#signup-email").val();
			var username = this.$("#signup-username").val();
			var password = this.$("#signup-password").val();
			this.$(".signup-form button").prop('disabled', true);
			
			Parse.User.signUp(username, password, { ACL: new Parse.ACL(), email: email }, {
				success: this.success,
				error: function(user, error) {
					that.$(".signup-form .error").html(error.message).show();
					that.$(".signup-form button").prop('disabled', false);
				}
			});
		},

		render: function() {
			this.$el.html(this.template());
			return this;
		}
	});
});