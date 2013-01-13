define(
	["jquery", "parse", "underscore", "../Models/Category", "text!../Templates/CategoryList.html", "./AddCategoryView", "spinhelper", "appCache"],
	function($, Parse, _, Category, template, AddCategoryView, spinhelper, appCache) {
	return Parse.View.extend({

		pageTitle: "Symptoms",
		tabId: "#symptomsTab",

		initialize: function() {
			_.bindAll(this);
			var that = this;
			this.template = _.template(template);
			this.categories = this.fetchCategories();
			this.newButtonFn = this.addCategory;
			this.categories.on("all", this.render);
		},

		showSpinner : function () {
			$("#spinner").show().spin('large');
		},

		stopSpinner : function () {
			$("#spinner").spin(false).hide();
		},

		fetchCategories : function() {
			var categories;
			if (appCache.categories) {
				categories = appCache.categories;
			} else {
				var categoryQuery = new Parse.Query(Category);
				categoryQuery.equalTo("user", Parse.User.current());
				categories = categoryQuery.collection();
				this.showSpinner();
				categories.fetch({
					success: this.stopSpinner,
					error: this.stopSpinner
				});
				appCache.categories = categories;
			}
			return categories;
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
