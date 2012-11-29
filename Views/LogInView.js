var HypoApp = (typeof HypoApp === "undefined") ? {} : HypoApp;
HypoApp.Views = (typeof HypoApp.Views === "undefined") ? {} : HypoApp.Views;

HypoApp.Views.LogInView = Parse.View.extend({
	events: {
		"submit form.login-form": "logIn",
		"submit form.signup-form": "signUp"
	},
	
	initialize: function() {
		_.bindAll(this);
		this.template = _.template($("#login-template").html());
	},

	logIn: function(e) {
		var self = this;
		var username = this.$("#login-username").val();
		var password = this.$("#login-password").val();
		
		Parse.User.logIn(username, password, {
			success: function(user) {
				window.location.hash = "";
			},

			error: function(user, error) {
				self.$(".login-form .error").html("Invalid username or password. Please try again.").show();
				this.$(".login-form button").removeAttr("disabled");
			}
		});

		this.$(".login-form button").attr("disabled", "disabled");

		return false;
	},

	signUp: function(e) {
		var self = this;
		var username = this.$("#signup-username").val();
		var password = this.$("#signup-password").val();
		
		Parse.User.signUp(username, password, { ACL: new Parse.ACL() }, {
			success: function(user) {
				window.location.hash = "";
			},

			error: function(user, error) {
				self.$(".signup-form .error").html(error.message).show();
				this.$(".signup-form button").removeAttr("disabled");
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