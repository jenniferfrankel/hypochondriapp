define(["jquery", "parse", "underscore", "../Models/Category", "../Models/Symptom", "text!../Templates/AddSymptom.html", "jquery.serializeobject"], function($, Parse, _, Category, Symptom, template) {
	return Parse.View.extend({
		events : {
			"submit form" :  "handleSymptomSubmit"
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

		handleSymptomSubmit: function(event) {
			event.preventDefault();
			var that = this;
			this.$("[type=submit]").prop('disabled', true);
			var formData = this.$("#symptomsubmitform").serializeObject();
			var symptomData = _.pick(formData, ['comment', 'date', 'severity']);
			symptomData.duration = formData.seconds + 60*formData.minutes + 3600*formData.hours;
			symptomData.category = this.category;
			symptomData.user = Parse.User.current();
			symptomData.ACL = new Parse.ACL(Parse.User.current());
			var symptom = (!!this.symptom) ? this.symptom : new Symptom();
			symptom.save(symptomData, {
				success: function() {
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