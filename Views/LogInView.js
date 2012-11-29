var HypoApp = (typeof HypoApp === "undefined") ? {} : HypoApp;
HypoApp.Views = (typeof HypoApp.Views === "undefined") ? {} : HypoApp.Views;

HypoApp.Views.LogInView = Parse.View.extend({
	events: {
		"submit form.login-form": "logIn",
		"submit form.signup-form": "signUp"
	},
	
	initialize: function(options) {
		_.bindAll(this);
		this.success = options.success;
		this.template = _.template($("#login-template").html());
	},

	logIn: function(e) {
		var that = this;
		var username = this.$("#login-username").val();
		var password = this.$("#login-password").val();
		
		Parse.User.logIn(username, password, {
			success: this.success,
			error: function(user, error) {
				that.$(".login-form .error").html("Invalid username or password. Please try again.").show();
				that.$(".login-form button").removeAttr("disabled");
			}
		});

		this.$(".login-form button").attr("disabled", "disabled");

		return false;
	},

	signUp: function(e) {
		var that = this;
		var username = this.$("#signup-username").val();
		var password = this.$("#signup-password").val();
		
		Parse.User.signUp(username, password, { ACL: new Parse.ACL() }, {
			success: this.success,
			error: function(user, error) {
				that.$(".signup-form .error").html(error.message).show();
				that.$(".signup-form button").removeAttr("disabled");
			}
		});

		this.$(".signup-form button").attr("disabled", "disabled");

		return false;
	},

	render: function() {
		this.$el.html(this.template());
		return this;
	}
});