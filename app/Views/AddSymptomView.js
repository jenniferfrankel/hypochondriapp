define(["jquery", "parse", "underscore", "../Models/Category", "../Models/Symptom", "text!../Templates/AddSymptom.html", "jquery.serializeobject"], function($, Parse, _, Category, Symptom, template) {
	return Parse.View.extend({
		events : {
			"submit form" :  "handleSymptomSubmit",
			"change input[name='severity']" : "onChangeSeverity",
			"change input[name='duration']" : "onChangeDuration"


		},

		initialize: function(options) {
			_.bindAll(this);
			this.onAddSuccess = options.onAddSuccess;
			this.template = _.template(template);
			var categoryQuery = new Parse.Query(Category);
			categoryQuery.equalTo("name", options.categoryName);
			categoryQuery.equalTo("user", Parse.User.current());
			categoryQuery.find({ success : this.onCategoryLoaded });

			if (options.symptomId) {
				var symptomQuery = new Parse.Query(Symptom);
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
				isEdit: !!this.options.symptomId,
				category: this.category ? this.category.toJSON() : {},
				symptom: this.symptom ? this.symptom.toJSON() : {}
			}));
			this.delegateEvents();
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
			var durVal = durationEl.attr("value");
			var duration = 0;
			if (durVal < 300) {
				duration = Math.ceil((59/300) * durVal);
				$("#human").text(duration + ' second' + (duration > 1 ? 's' : ''));
				// save duration to Parse object properly
			}
			else if (durVal > 600) {
				duration = Math.ceil((23/300) * (durVal - 599));
				$('#human').text(duration + ' hour' + (duration > 1 ? 's' : ''));
				duration = duration*3600;
			}
			else {
				duration = Math.ceil((59/300) * (durVal-299));
				$('#human').text(duration + ' minute' + (duration > 1 ? 's' : ''));
				duration = duration*60;
			}
		},

		handleSymptomSubmit: function(event) {
			event.preventDefault();
			var that = this;
			this.$("[type=submit]").prop('disabled', true);
			var formData = this.$("#symptomsubmitform").serializeObject();
			var symptomData = _.pick(formData, ['comment', 'date', 'severity', 'duration']);
			//symptomData.duration = duration;
			symptomData.category = this.category;
			symptomData.user = Parse.User.current();
			symptomData.ACL = new Parse.ACL(Parse.User.current());
			var symptom = (!!this.symptom) ? this.symptom : new Symptom();
			symptom.save(symptomData, {
				success: function() {
					console.log("symptom successfully added to db");
					if (that.onAddSuccess) {
						that.onAddSuccess();
					}
					that.$("[type=submit]").prop('disabled', false);
					window.location.hash=$("#symptomsubmitform").attr("action");
				}
			});
		}
	});
});