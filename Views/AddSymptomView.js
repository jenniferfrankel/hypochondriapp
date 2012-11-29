var HypoApp = (typeof HypoApp === "undefined") ? {} : HypoApp;
HypoApp.Views = (typeof HypoApp.Views === "undefined") ? {} : HypoApp.Views;

HypoApp.Views.AddSymptomView = Parse.View.extend({
	events : {
		"submit form" :  "handleSymptomSubmit"
	},

	initialize: function(options) {
		_.bindAll(this);
		this.template = _.template($("#addSymptom-template").html());
		var categoryQuery = new Parse.Query(HypoApp.Models.Category);
		categoryQuery.equalTo("name", options.categoryName);
		categoryQuery.find({ success : this.onCategoryLoaded });

		if (options.symptomId) {
			var symptomQuery = new Parse.Query(HypoApp.Models.Symptom);
			symptomQuery.get(options.symptomId, { success : this.onSymptomLoaded });
		}
	},

	onSymptomLoaded : function(symptom) {
		console.log("Got symptom");
		this.symptom = symptom;
		this.render();
	},

	onCategoryLoaded : function(categories) {
		console.log("Got category");
		this.category = _.first(categories);
		this.render();
	},

	render: function() {
		this.$el.html(this.template({
			isEdit: this.options.symptomId,
			category: this.category ? this.category.toJSON() : {},
			symptom: this.symptom ? this.symptom.toJSON() : {}
		}));
		return this;
	},

	handleSymptomSubmit: function(event) {
		event.preventDefault();
		var that = this;
		this.$("[type=submit]").prop('disabled', true);
		var formData = this.$("#symptomsubmitform").serializeObject();
		var symptomData = _.pick(formData, ['comment', 'date', 'severity']);
		symptomData.duration = formData.seconds + 60*formData.minutes + 3600*formData.hours;
		symptomData.category = this.category;
		var symptom = (!!this.symptom) ? this.symptom : new HypoApp.Models.Symptom();
		symptom.save(symptomData, {
			success: function() {
				that.$("[type=submit]").prop('disabled', false);
				window.location.hash=$("#symptomsubmitform").attr("action");
			}
		});
	}
});