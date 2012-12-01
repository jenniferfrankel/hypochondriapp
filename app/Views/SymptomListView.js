define(["jquery", "parse", "underscore", "../Models/Category", "../Models/Symptom", "./AddSymptomView", "moment"], function($, Parse, _, Category, Symptom, AddSymptomView) {
	return Parse.View.extend({
		events : {
			"click .symptom" :  "editSymptom"
		},

		initialize: function(categoryName) {
			_.bindAll(this);
			var that = this;
			this.template = _.template($("#symptomList-template").html());

			// Create a query to fetch the actual category object with the specified name
			var categoryQuery = new Parse.Query(Category);
			categoryQuery.equalTo("user", Parse.User.current());
			categoryQuery.equalTo("name", categoryName);

			// A query to fetch the symptoms - this uses the category query as
			// an inner query to just pick the symptoms for that category.
			var symptomQuery = new Parse.Query(Symptom);
			symptomQuery.matchesQuery("category", categoryQuery);
			symptomQuery.include("category");

			this.categories = categoryQuery.collection();
			this.symptoms = symptomQuery.descending("date").collection();
			this.symptoms.on("all", this.render);
			this.categories.on("all", this.render);
			this.categories.fetch();
			this.symptoms.fetch();

			this.addSymptomView = new AddSymptomView({
				categoryName: categoryName,
				onAddSuccess: function() {
					that.symptoms.fetch();
				}
			});
		},

		render: function(){
			var hasCategory = !!this.categories.first();
			this.$el.html(this.template({
				symptoms : this.symptoms.toJSON(),
				category : hasCategory ? this.categories.first().toJSON() : null
			}));
			this.$(".addSymptom").append(this.addSymptomView.render().$el);
			return this;
		},

		editSymptom: function(event){
			window.location.hash=$(event.target).closest(".symptom").data("edit-hash");
		}
	});
});