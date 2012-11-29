var HypoApp = (typeof HypoApp === "undefined") ? {} : HypoApp;
HypoApp.Views = (typeof HypoApp.Views === "undefined") ? {} : HypoApp.Views;

HypoApp.Views.CategoryListView = Parse.View.extend({
	
	initialize: function() {
		_.bindAll(this);
		this.template = _.template($("#categoryList-template").html());
		this.categories = new HypoApp.Models.Categories();
		this.categories.on("all", this.render);
		this.categories.fetch();
	},

	render: function() {
		this.$el.html(this.template({categories: this.categories.toJSON()}));
		return this;
	}
});