var HypoApp = (typeof HypoApp === "undefined") ? {} : HypoApp;
HypoApp.Views = (typeof HypoApp.Views === "undefined") ? {} : HypoApp.Views;

HypoApp.Views.CategoryListView = Parse.View.extend({
	initialize: function(options){
		_.bindAll(this);
		this.collection = options.collection;
		this.collection.on("all", this.render);
		this.template = _.template($("#categoryList-template").html());
	},
	render: function(){
		this.$el.html(this.template({categories: this.collection.toJSON()}));
		return this;
	}
});