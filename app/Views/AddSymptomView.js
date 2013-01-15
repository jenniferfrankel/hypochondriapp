define(
	["jquery", "parse", "underscore", "durationUtils", "../Models/Category", "../Models/Symptom", "text!../Templates/AddSymptom.html", "./FormView", "QueryHelper", "jquery.serializeobject"],
	function($, Parse, _, durationUtils, Category, Symptom, template, FormView, queryHelper) {
	return FormView.extend({

		tabId: "#symptomsTab",
		
		events : {
			"submit form" :  "handleSubmit",
			"click .delete" : "onClickDelete",
			"click .cancel" : "onClickCancel",
			"change input[name='severity']" : "onChangeSeverity",
			"change input[name='duration']" : "onChangeDuration"
		},

		initialize: function(categoryName, symptomId) {
			_.bindAll(this);
			this.template = _.template(template);
			this.categoryName = categoryName;
			this.symptomId = symptomId;
			var addOrEdit = symptomId ? "Edit " : "Add ";
			this.pageTitle = addOrEdit + categoryName;

			queryHelper.fetchCategoryByName(categoryName)
				.done(this.onCategoryFetched);

			// We 'debounce' the onChange event handlers to not make the UI
			// to sluggish when dragging the slider to fast. I.e., we wait
			// 50ms before we re-calcuate the values for severity and duration
			// before we update the UI. Conviniently handled by the debounce()
			// function in underscore.js (http://underscorejs.org/#debounce).
			this.onChangeSeverity = _.debounce(this.onChangeSeverity, 100);
			this.onChangeDuration = _.debounce(this.onChangeDuration, 100);
		},

		onClickDelete : function() {
			if (confirm("Are you sure you want to delete this symptom?")) {
				this.symptom.destroy();
				window.location.hash = "categories/"+this.categoryName+"/history";
			}
		},

		onClickCancel: function() {
			window.location.hash = "categories/"+this.categoryName+"/history";
		},

		validateForm: function() {
			// Check if the chosen date and time is in the future
			var date = this.$("[name=date]").val();
			var time = this.$("[name=time]").val();
			var dateANDtime = moment(date+"T"+time+":00");
			var now = moment();
			if (dateANDtime > now){
				console.log("date&time > now");
				if(confirm("You have chosen a future time/date for this symptom event. Do you wish to continue?")){
					return true;
				}
				else{
					return false;
				}
			}

			if (!window.navigator.onLine) {
				alert("Ooops! You seem to be offline. Please go online to submit your new event.");
				return false;
			}

			return true;
		},

		navigateBack: function() {
			window.location.hash = "categories/" + this.categoryName + "/history";
		},

		onCategoryFetched: function(category) {
			this.category = category;
			queryHelper.fetchSymptomsForCategory(category)
				.done(this.onSymptomsFetched)
				.always(this.render);
		},

		onSymptomsFetched: function(symptoms) {
			this.symptoms = symptoms;
			if (this.symptomId) {
				this.symptom = symptoms.get(this.symptomId);
			}
		},

		render: function() {
			this.$el.html(this.template({
				isEdit: !!this.symptomId,
				category: this.category ? this.category.toJSON() : {},
				symptom: this.symptom ? this.symptom.toJSON() : {},
				sliderValue: this.symptom ? durationUtils.secondsToSliderValue(this.symptom.get("duration")) : 443
			}));
			this.$("input[type=range]").change();
			
			return this;
		},

		onChangeSeverity: function(event) {
			var severityEl = $(event.target);
			var sevVal = parseFloat(severityEl.attr("value"));
			var stepSize = parseFloat(severityEl.attr("step"));
			var toFixed = 0;
			while (stepSize < 1) {
				toFixed += 1;
				stepSize *= 10;
			}
			this.$('#severityVal').text(sevVal.toFixed(toFixed) + ' ');
		},

		onChangeDuration: function(event) {
			var durationEl = $(event.target);
			var sliderValue = durationEl.attr("value");
			var duration = durationUtils.sliderValueToSeconds(sliderValue);
			this.$('#human').text(durationUtils.humanizeSeconds(duration));
		},

		getDataFromForm : function() {
			var formData = this.$("#symptomsubmitform").serializeObject();
			var symptomData = _.pick(formData, ['comment', 'severity']);
			symptomData.date = moment(this.$("[type='date']").val()+"T"+this.$("[type='time']").val()).toDate();
			symptomData.duration = durationUtils.sliderValueToSeconds(formData.duration);
			symptomData.category = this.category;
			return symptomData;
		},

		saveToParse: function(data) {
			if (this.symptom) { // if we're editing...
				this.symptom.save(data, {
					success: this.onSendToParseComplete
				});
			} else { // If we're creating a new one...
				this.symptoms.create(data, {
					wait: true, // Make sure to wait for the server to agree
					success: this.onSendToParseComplete
				});
			}
		}
	});
});