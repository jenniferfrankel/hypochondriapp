define(["jquery", "parse", "underscore", "../Models/Category", "text!../Templates/AddCategory.html", "jquery.serializeobject"], function($, Parse, _, Category, template) {
	return Parse.View.extend({
		events : {
			"submit form" :  "handleCategorySubmit"
		},

		initialize: function(options){
			_.bindAll(this);
			this.template = _.template(template);
			this.categories = options.categories;
		},

		render: function(){
			this.$el.html(this.template());
			return this;
		},

		toggleSubmitButtonDisabled: function(isDisabled) {
			this.$("[type=submit]").prop('disabled', isDisabled);
		},

		handleCategorySubmit: function(event){
			event.preventDefault();
			var that = this;
			that.toggleSubmitButtonDisabled(true);
			var formData = this.$("#categorysubmitform").serializeObject();
			var rangeDefault = Math.floor(((formData.rangeMin + formData.rangeMax) / 2) / formData.stepSize) * formData.stepSize;
			formData.rangeDefault = rangeDefault;
			var categoryData = _.pick(formData, ['name', 'unit', 'rangeMin', 'rangeMax', 'rangeDefault', 'stepSize']);
			categoryData.user = Parse.User.current();
			categoryData.ACL = new Parse.ACL(Parse.User.current());

			var onSendToParseComplete = function() {
				that.toggleSubmitButtonDisabled(false);
				$("#myModal").modal('hide');
			};

			this.categories.create(categoryData, {
				wait: true,
				success: onSendToParseComplete
			});
		}
	});
});