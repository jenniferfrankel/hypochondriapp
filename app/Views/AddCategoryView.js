define(["jquery", "parse", "underscore", "../Models/Category", "text!../Templates/AddCategory.html", "jquery.serializeobject"], function($, Parse, _, Category, template) {
	return Parse.View.extend({
		events : {
			"submit form" :  "handleCategorySubmit"
		},

		initialize: function(){
			_.bindAll(this);
			this.template = _.template(template);
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
			categoryData.user = Parse.User.current();
			categoryData.ACL = new Parse.ACL(Parse.User.current());
			var category = new Category(categoryData);
			category.save({
				success: function() {
					that.$("[type=submit]").prop('disabled', false);
					window.location.hash=$("#categorysubmitform").attr("action");
				}
			});
		}
	});
});