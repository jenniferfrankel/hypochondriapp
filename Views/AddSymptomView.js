var HypoApp = (typeof HypoApp === "undefined") ? {} : HypoApp;
HypoApp.Views = (typeof HypoApp.Views === "undefined") ? {} : HypoApp.Views;

HypoApp.Views.AddSymptomView = Parse.View.extend({
	events : {
		"submit form" :  "handleSymptomSubmit"
	},

	initialize: function(options){
		_.bindAll(this);
		this.collection = options.collection;
		this.collection.on("all", this.render);
		this.template = _.template($("#addSymptom-template").html());
	},

	render: function(){
		if (this.collection.length > 0) {
			var category = this.collection.first();
			this.$el.html(this.template({ category: category.toJSON() }));
		} else {
			this.$el.html("Nothing here yet!");
		}
		return this;
	},

	handleSymptomSubmit: function(event){
		event.preventDefault();
		var that = this;
		this.$("[type=submit]").prop('disabled', true);
		var formData = this.$("#symptomsubmitform").serializeObject();
		var symptomData = _.pick(formData, ['comment', 'date', 'severity']);
		symptomData.duration = formData.seconds + 60*formData.minutes + 3600*formData.hours;
		symptomData.category = this.collection.first();
		var symptom = new HypoApp.Models.Symptom(symptomData);
		symptom.save({
			success: function() {
				that.$("[type=submit]").prop('disabled', false);
				window.location.hash=$("#symptomsubmitform").attr("action");
			}
		});
	}
});