var HypoApp = (typeof HypoApp === "undefined") ? {} : HypoApp;
HypoApp.Views = (typeof HypoApp.Views === "undefined") ? {} : HypoApp.Views;

HypoApp.Views.SymptomListView = Parse.View.extend({
	initialize: function(options){
		_.bindAll(this);
		this.symptoms = options.symptoms;
		this.symptoms.on("all", this.render);
		this.categories = options.categories;
		this.categories.on("all", this.render);
		this.template = _.template($("#symptomList-template").html());
	},
	render: function(){
		var hasCategory = !!this.categories.first();
		this.$el.html(this.template({
			symptoms : this.symptoms.toJSON(),
			category : hasCategory ? this.categories.first().toJSON() : null
		}));
		return this;
	}
});