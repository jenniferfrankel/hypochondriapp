define(
	["jquery", "parse", "underscore", "../Models/Category", "text!../Templates/AddCategory.html", "./FormView", "QueryHelper", "jquery.serializeobject"],
	function($, Parse, _, Category, template, FormView, queryHelper) {
	return FormView.extend({

		pageTitle: "Symptoms",
		tabId: "#symptomsTab",

		events : {
			"submit form" :  "handleSubmit",
			"click .cancel" : "onClickCancel"
		},

		initialize: function(){
			_.bindAll(this);
			this.template = _.template(template);
			this.pageTitle = "New Symptom";

			queryHelper.fetchCategories()
				.done(this.onCategoriesFetched)
				.always(this.render);
		},

		onCategoriesFetched: function(categories) {
			this.categories = categories;
		},

		onClickCancel: function() {
			window.location.hash = "categories";
		},

		getDataFromForm : function() {
			var formData = this.$("#categorysubmitform").serializeObject();
			var range = [];
			switch (formData["unit"]) {
				case "scale10" : formData.unit = "on a scale of 1-10", range = [1,10,5,1]; break;
				case "scale5" : formData.unit = "on a scale of 1-5", range = [1,5,3,1]; break;
				case "tempC" : formData.unit = "&deg; Celsius", range = [32.0,45.0,37.0,0.1]; break;
				case "tempF" : formData.unit = "&deg; Fahrenheit", range = [89.6,113.0,98.6,0.1]; break;
				case "bpm" : formData.unit = "bpm", range = [30,230,100,1]; break;
				case "glucosemmol" : formData.unit = "mmol/L", range = [1,12,5.5,0.1]; break;
				case "glucosemg" : formData.unit = "mg/dL", range = [20,220,100,1]; break;
			}
			formData["rangeMin"] = range[0];
			formData["rangeMax"] = range[1];
			formData["rangeDefault"] = range[2];
			formData["stepSize"] = range[3];
			console.log(formData);
			console.log("That was the formData");
			return _.pick(formData, ['name', 'unit', 'rangeMin', 'rangeMax', 'rangeDefault', 'stepSize']);
		},

		validateForm: function() {
			if (this.$("[name=name]").val().length < 1) {
				alert("You need to give the symptom a name.");
				return false;
			}
			if (this.$("[name=unit]").val().length < 1) {
				alert("You need to choose a unit.");
				return false;
			}
			if (!window.navigator.onLine) {
				alert("Ooops! You seem to be offline. Please go online to submit your new symptom.");
				return false;
			}
				
			return true;
		},

		saveToParse: function(data) {
			this.categories.create(data, {
				wait: true,
				success: this.onSendToParseComplete
			});
		},

		rangeValuesOk: function(max, min, step) {
			if (max > min && step < (max - min)) {
				return true;
			}
			else {
				return false;
			}
		}
	});
});