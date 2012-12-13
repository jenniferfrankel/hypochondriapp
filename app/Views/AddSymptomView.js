define(
	["jquery", "parse", "underscore", "durationUtils", "../Models/Category", "../Models/Symptom", "text!../Templates/AddSymptom.html", "jquery.serializeobject"],
	function($, Parse, _, durationUtils, Category, Symptom, template) {
	return Parse.View.extend({
		events : {
			"submit form" :  "handleSymptomSubmit",
			"change input[name='severity']" : "onChangeSeverity",
			"change input[name='duration']" : "onChangeDuration"
		},

		initialize: function(options) {
			_.bindAll(this);
			this.template = _.template(template);
			this.symptom = options.symptom;
			this.symptoms = options.symptoms;

			if (this.symptom) {
				this.category = this.symptom.get("category");
			} else {
				var categoryQuery = new Parse.Query(Category);
				categoryQuery.equalTo("name", options.categoryName);
				categoryQuery.equalTo("user", Parse.User.current());
				categoryQuery.find({ success : this.onCategoryLoaded });
			}
		},

		onCategoryLoaded : function(categories) {
			this.category = _.first(categories);
			this.render();
		},

		render: function() {
			this.$el.html(this.template({
				isEdit: !!this.options.symptom,
				category: this.category ? this.category.toJSON() : {},
				symptom: this.symptom ? this.symptom.toJSON() : {},
				sliderValue: this.symptom ? durationUtils.secondsToSliderValue(this.symptom.get("duration")) : 450
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
			$('#severityVal').text(sevVal.toFixed(toFixed) + ' ');
		},

		onChangeDuration: function(event) {
			var durationEl = $(event.target);
			var sliderValue = durationEl.attr("value");
			var duration = durationUtils.sliderValueToSeconds(sliderValue);
			$('#human').text(durationUtils.humanizeSeconds(duration));
		},

		handleSymptomSubmit: function(event) {
			event.preventDefault();
			var $submitButton = this.$("[type=submit]");
			$submitButton.prop('disabled', true);
			var formData = this.$("#symptomsubmitform").serializeObject();
			var symptomData = _.pick(formData, ['comment', 'severity']);
			symptomData.date = moment(this.$("[type='date']").val()+"T"+this.$("[type='time']").val()).toDate();
			symptomData.duration = durationUtils.sliderValueToSeconds(formData.duration);
			symptomData.category = this.category;
			symptomData.user = Parse.User.current();
			symptomData.ACL = new Parse.ACL(Parse.User.current());

			var onSendToParseComplete = function() {
				$submitButton.prop('disabled', false);
				$("#myModal").modal('hide');
			};

			if (this.symptom) { // if we're editing...
				this.symptom.save(symptomData, {
					success: onSendToParseComplete
				});
			} else { // If we're creating a new one...
				this.symptoms.create(symptomData, {
					wait: true, // Make sure to wait for the server to agree
					success: onSendToParseComplete
				});
			}
		}
	});
});