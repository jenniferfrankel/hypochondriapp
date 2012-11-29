var HypoApp = (typeof HypoApp === "undefined") ? {} : HypoApp;
HypoApp.Views = (typeof HypoApp.Views === "undefined") ? {} : HypoApp.Views;

HypoApp.Views.SymptomListView = Parse.View.extend({

	events : {
		"click .symptom" :  "editSymptom"
	},

	initialize: function(categoryName) {
		_.bindAll(this);
		this.template = _.template($("#symptomList-template").html());

		// Create a query to fetch the actual category object with the specified name
		var categoryQuery = new Parse.Query(HypoApp.Models.Category);
		categoryQuery.equalTo("user", Parse.User.current());
		categoryQuery.equalTo("name", categoryName);

		// A query to fetch the symptoms - this uses the category query as
		// an inner query to just pick the symptoms for that category.
		var symptomQuery = new Parse.Query(HypoApp.Models.Symptom);
		symptomQuery.matchesQuery("category", categoryQuery);
		symptomQuery.include("category");

		this.categories = categoryQuery.collection();
		this.symptoms = symptomQuery.collection();
		this.symptoms.on("all", this.render);
		this.categories.on("all", this.render);
		this.categories.fetch();
		this.symptoms.fetch();
	},

	render: function(){
		var hasCategory = !!this.categories.first();
		this.$el.html(this.template({
			symptoms : this.symptoms.toJSON(),
			category : hasCategory ? this.categories.first().toJSON() : null
		}));
		return this;
	},

	editSymptom: function(event){
		window.location.hash=$(event.target).closest(".symptom").data("edit-hash");
	}
});