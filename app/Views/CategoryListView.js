define(
	["jquery", "parse", "underscore", "../Models/Category", "text!../Templates/CategoryList.html", "./AddCategoryView", "spinhelper", "QueryHelper"],
	function($, Parse, _, Category, template, AddCategoryView, spinhelper, queryHelper) {
	return Parse.View.extend({

		pageTitle: "Symptoms",
		tabId: "#symptomsTab",

		initialize: function() {
			_.bindAll(this);
			var that = this;
			this.template = _.template(template);
			this.newButtonFn = this.addCategory;

			this.showSpinner();
			queryHelper.fetchCategories()
				.done(this.onCategoriesFetched)
				.always(this.stopSpinner)
				.always(this.render);
		},

		onCategoriesFetched: function(categories) {
			this.categories = categories;
			this.categories.on("all", this.render);
		},

		showSpinner : function () {
			$("#spinner").show().spin('large');
		},

		stopSpinner : function () {
			$("#spinner").spin(false).hide();
		},

		render: function() {
			this.$el.html(this.template({categories: this.categories ? this.categories.toJSON() : [] }));
			return this;
		},

		addCategory: function() {
			// when add new button is clicked
			// go to AddCategoryView via Workspace router
			window.location.hash = "categories/addCategory";
		}
	});
});
