var HypoApp = (typeof HypoApp === "undefined") ? {} : HypoApp;
HypoApp.Views = (typeof HypoApp.Views === "undefined") ? {} : HypoApp.Views;

HypoApp.Views.GraphSymptomView = Parse.View.extend({

//	events : {
//		"click .symptom" :  "editSymptom"
//	},

	initialize: function(categoryName) {
		_.bindAll(this);
		var that = this;
		// FIX: plot does not seem to accept the width and height from the template!!
		this.template = _.template($("#graphSymptom-template").html());

		// Create a query to fetch the actual category object with the specified name
		var categoryQuery = new Parse.Query(HypoApp.Models.Category);
		categoryQuery.equalTo("user", Parse.User.current());
		categoryQuery.equalTo("name", categoryName);

		// A query to fetch the symptoms - this uses the category query as
		// an inner query to just pick the symptoms for that category.
		var symptomQuery = new Parse.Query(HypoApp.Models.Symptom);
		symptomQuery.matchesQuery("category", categoryQuery);
		symptomQuery.include("category");

		// extract the severity value and timestamp for each symptom event

		this.categories = categoryQuery.collection();
		this.symptoms = symptomQuery.ascending("date").collection();
		this.symptoms.on("all", this.render);
		this.categories.on("all", this.render);
		this.categories.fetch();
		this.symptoms.fetch({
			success: function() {
				console.log("severityList?");
				that.dataY = that.symptoms.pluck("severity");
				that.dataX = that.symptoms.map(function (symptom) {
					console.log(symptom.get("date"));
					return new Date(symptom.get("date")).getTime();
				});
				that.render();
			}
		});
	},

	render: function(){
		this.$el.html(this.template());

		if (this.dataX && this.dataY) {
			var data = [
				_.zip(this.dataX, this.dataY) // Series 1
			];

			var options = {
				xaxis: {
					mode: "time",
					timeformat: "%d/%m"
				},
				series: {
					lines: {show: true},
					points: {show: true}
				}
			};

			// Draw graph
			$.plot(this.$("#placeholder"), data, options);
		}
		return this;
	}
});