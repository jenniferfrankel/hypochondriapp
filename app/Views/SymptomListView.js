define(["jquery", "parse", "underscore", "../Models/Category", "../Models/Symptom", "./AddSymptomView", "text!../Templates/SymptomList.html", "moment"], function($, Parse, _, Category, Symptom, AddSymptomView, template) {
	return Parse.View.extend({
		events : {
			"click .symptom" :  "editSymptom",
			"click #addSymptomButton" : "addSymptom"
		},

		pageTitle: "&hellip;",

		initialize: function(categoryName) {
			_.bindAll(this);
			var that = this;
			this.template = _.template(template);
			this.categoryName = categoryName;
			this.pageTitle = categoryName;

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
			this.symptoms = symptomQuery.collection();
			this.symptoms.comparator = function(symptom) {
				return -symptom.get("date").getTime();
			};
			this.symptoms.on("all", this.render);
			this.categories.on("all", this.render);
			var stopSpinner = function() {
				console.log("stop spinner");
				$("#spinner").spin(false).hide();
			};

			$("#spinner").show().spin('large');
			this.categories.fetch();
			this.symptoms.fetch({
				success: stopSpinner,
				error: stopSpinner
			});

			$("#newButton").off("click");
			$("#newButton").click(function(event) {
				event.preventDefault();
				that.addSymptom();
			});

			this.showAdd = true;
		},

		render: function(){
			var hasCategory = !!this.categories.first();
			this.$el.html(this.template({
				symptoms : this.symptoms.toJSON(),
				category : hasCategory ? this.categories.first().toJSON() : null
			}));

			if (this.symptoms && this.showAdd) {
				var view = new AddSymptomView({
					categoryName: this.categoryName,
					symptoms : this.symptoms
				});
				$("#myModal").empty().append(view.render().$el);
				$("#myModal").modal();
				this.showAdd = false;
			}

			return this;
		},

		editSymptom: function(event){
			// when a symptom is clicked on
			// create Add/Edit-View and send in that whole symptom object
			var symptomId = $(event.target).closest(".symptom").data("symptom-id");
			var symptom = this.symptoms.get(symptomId);
			var view = new AddSymptomView({
				symptom: symptom
			});
			$("#myModal").empty().append(view.render().$el);
			$("#myModal").modal();
		},

		addSymptom: function(event){
			// when the add new button is clicked
			// create the add view
			var view = new AddSymptomView({
				categoryName: this.categoryName,
				symptoms : this.symptoms
			});
			$("#myModal").empty().append(view.render().$el);
			$("#myModal").modal();
		}
	});
});