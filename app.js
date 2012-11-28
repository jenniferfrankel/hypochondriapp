$(document).ready(function(){
	// Initialize Parse libraries with my app ID and javascript API key
	Parse.initialize("M6BP3LK8ORschhjxTdpoWhWQzVz0VyndcvvQVi7e", "NllvdChHyabrLUTVo2AoAxqO5pQRonDw0FL6jgDN");

	// Create a workspace for the app. This will partly be responsible for
	// routing the app to the right place, but also hold any state or
	// caches that we might need. It will create viewss, objects and collections
	// as neccessary when routing.
	// TODO: Move this to a separate file too.
	var Workspace = Parse.Router.extend({
		/**
		 * A list of routes for this app.
		 * TODO: Add a default route to capture anything that doesn't
		 *       match any of these routes.
		 */
		routes: {
			"": "home",
			"categories": "listCategories",
			"categories/:categoryName": "listSymptoms",
			"categories/:categoryName/addSymptom": "addSymptom"
		},

		/**
		 * The default route. For now, just take the users to the categories list.
		 */
		home: function(){
			console.log("home");
			this.navigate("categories", {trigger: true, replace: true});
		},

		/**
		 * List the available categories of symptoms
		 */
		listCategories: function(){
			console.log("listCategories");
			var categories = new HypoApp.Models.Categories();
			var view = new HypoApp.Views.CategoryListView({
				collection: categories
			});
			$("#content").empty().append(view.render().$el);
			categories.fetch();
		},

		/**
		 * Add a symptom.
		 * NOTE: We might want to move this functionality into the symptom
		 *       list view at som later point.
		 *
		 * @param categoryName - the name of the category we are adding a symptom to.
		 */
		addSymptom: function(categoryName){
			var categoryQuery = new Parse.Query(HypoApp.Models.Category);
			categoryQuery.equalTo("name", categoryName);
			var categories = categoryQuery.collection();

			var view = new HypoApp.Views.AddSymptomView({collection: categories});
			$("#content").empty().append(view.render().$el);
			categories.fetch();
		},

		/**
		 * Show the list of symptoms for the specified category.
		 *
		 * @param categoryName - the name of the category which symptoms we are listing.
		 */
		listSymptoms: function(categoryName){
			// Create a query to fetch the actual category object with the specified name
			var categoryQuery = new Parse.Query(HypoApp.Models.Category);
			categoryQuery.equalTo("name", categoryName);

			// A query to fetch the symptoms - this uses the category query as
			// an inner query to just pick the symptoms for that category.
			var symptomQuery = new Parse.Query(HypoApp.Models.Symptom);
			symptomQuery.matchesQuery("category", categoryQuery);
			symptomQuery.include("category");

			var categories = categoryQuery.collection();
			var symptoms = symptomQuery.collection();
			categories.fetch();
			symptoms.fetch();

			// We pass both the symptoms and the categories in to the view so
			// it can listen to any changes to either and re-render when
			// neccessary.
			var view = new HypoApp.Views.SymptomListView({
				symptoms : symptoms,
				categories : categories
			});

			// Update the content-div in the DOM
			$("#content").empty().append(view.render().$el);
		}

	});
	
	new Workspace();
	Parse.history.start();
});