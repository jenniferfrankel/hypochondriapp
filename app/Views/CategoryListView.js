define(["jquery", "parse", "underscore", "../Models/Category", "text!../Templates/CategoryList.html", "spinhelper"], function($, Parse, _, Category, template, spinhelper) {
	return Parse.View.extend({
		initialize: function() {
			_.bindAll(this);
			var that = this;
			this.template = _.template(template);
			var categoryQuery = new Parse.Query(Category);
			categoryQuery.equalTo("user", Parse.User.current());
			this.categories = categoryQuery.collection();
			this.categories.on("all", this.render);
			var stopSpinner = function() {
				$("#spinner").spin(false).hide();
			};

			$("#spinner").show().spin('large');
			this.categories.fetch({
				success: stopSpinner,
				error: stopSpinner
			});
		},

		render: function() {

			this.$el.html(this.template({categories: this.categories.toJSON()}));
			return this;
		}
	});
});
