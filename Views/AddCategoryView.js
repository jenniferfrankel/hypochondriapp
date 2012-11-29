var HypoApp = (typeof HypoApp === "undefined") ? {} : HypoApp;
HypoApp.Views = (typeof HypoApp.Views === "undefined") ? {} : HypoApp.Views;

HypoApp.Views.AddCategoryView = Parse.View.extend({
	events : {
		"submit form" :  "handleCategorySubmit"
	},

	initialize: function(){
		_.bindAll(this);
		this.template = _.template($("#addCategory-template").html());
	},

	render: function(){
		this.$el.html(this.template());
		return this;
	},

	handleCategorySubmit: function(event){
		event.preventDefault();
		var that = this;
		this.$("[type=submit]").prop('disabled', true);
		var formData = this.$("#categorysubmitform").serializeObject();
		var categoryData = _.pick(formData, ['name', 'unit', 'rangeMin', 'rangeMax', 'stepSize']);
		var category = new HypoApp.Models.Category(categoryData);
		category.save({
			success: function() {
				that.$("[type=submit]").prop('disabled', false);
				window.location.hash=$("#categorysubmitform").attr("action");
			}
		});
	}
});