define(["jquery", "parse", "underscore", "../Models/Category", "text!../Templates/CategoryList.html", "./AddCategoryView", "spinhelper"], function($, Parse, _, Category, template, AddCategoryView, spinhelper) {
	return Parse.View.extend({

		pageTitle: "Symptoms",

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

			this.categories.on("all", this.render);
			this.hideBackButton = true;
			$("#newButton").show();
			$("#newButton").off("click");
			$("#newButton").click(function(event) {
				event.preventDefault();
				that.addCategory();
			});
		},

		render: function() {

			this.$el.html(this.template({categories: this.categories.toJSON()}));
			return this;
		},

		addCategory: function() {
			// when add new button is clicked
			// create addCategoryView and display in modal
			var view = new AddCategoryView({
				categories: this.categories
			});
			$("#myModal").empty().append(view.render().$el);
			$("#myModal").modal();
		}
	});
});
