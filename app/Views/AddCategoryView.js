define(
	["jquery", "parse", "underscore", "../Models/Category", "text!../Templates/AddCategory.html", "./ModalFormView", "jquery.serializeobject"],
	function($, Parse, _, Category, template, ModalFormView) {
	return ModalFormView.extend({
		events : {
			"submit form" :  "handleSubmit"
		},

		initialize: function(options){
			_.bindAll(this);
			this.template = _.template(template);
			this.categories = options.categories;
		},

		getDataFromForm : function() {
			var formData = this.$("#categorysubmitform").serializeObject();
			var rangeDefault = Math.floor(((formData.rangeMin + formData.rangeMax) / 2) / formData.stepSize) * formData.stepSize;
			formData.rangeDefault = rangeDefault;
			return _.pick(formData, ['name', 'unit', 'rangeMin', 'rangeMax', 'rangeDefault', 'stepSize']);
		},

		saveToParse: function(data) {
			this.categories.create(data, {
				wait: true,
				success: this.onSendToParseComplete
			});
		}
	});
});