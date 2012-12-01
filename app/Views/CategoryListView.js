define(["jquery", "parse", "underscore", "../Models/Category", "text!../Templates/CategoryList.html"], function($, Parse, _, Category, template) {
	return Parse.View.extend({
		initialize: function() {
			_.bindAll(this);
			this.template = _.template(template);
			var categoryQuery = new Parse.Query(Category);
			categoryQuery.equalTo("user", Parse.User.current());
			this.categories = categoryQuery.collection();
			this.categories.on("all", this.render);
			this.categories.fetch();
		},

		render: function() {
			this.$el.html(this.template({categories: this.categories.toJSON()}));
			return this;
		}
	});
});
