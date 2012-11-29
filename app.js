$(document).ready(function(){
	// Initialize Parse libraries with my app ID and javascript API key
	Parse.initialize("M6BP3LK8ORschhjxTdpoWhWQzVz0VyndcvvQVi7e", "NllvdChHyabrLUTVo2AoAxqO5pQRonDw0FL6jgDN");

	// Create a workspace for the app. This will partly be responsible for
	// routing the app to the right place, but also hold any state or
	// caches that we might need. It will create views, objects and collections
	// as neccessary when routing.
	// TODO: Move this to a separate file too.
	var Workspace = Parse.Router.extend({
		/**
		 * A list of routes for this app.
		 */
		routes: {
			"": "home",
			"categories": "listCategories",
			"categories/addCategory": "addCategory",
			"categories/:categoryName": "listSymptoms",
			"categories/:categoryName/addSymptom": "addSymptom",
			"categories/:categoryName/editSymptom/:symptomId": "addSymptom",
			"*path": "defaultRoute"
		},

		/**
		 * The default route. For now, just take the users to the categories list.
		 */
		home: function(){
			console.log("home");
			this.navigate("categories", {trigger: true, replace: true});
		},

		defaultRoute: function(){
			// TODO: Make this into a view
			$("#content").empty().html("404");
		},

		addCategory: function(){
			this.updateContent(new HypoApp.Views.AddCategoryView());
		},

		/**
		 * List the available categories of symptoms
		 */
		listCategories: function(){
			this.updateContent(new HypoApp.Views.CategoryListView());
		},

		/**
		 * Add a symptom.
		 * NOTE: We might want to move this functionality into the symptom
		 *       list view at som later point.
		 *
		 * @param categoryName - the name of the category we are adding a symptom to.
		 * @param symptomId - (optional) the id of the symptom to edit
		 */
		addSymptom: function(categoryName, symptomId){
			this.updateContent(new HypoApp.Views.AddSymptomView({
				categoryName: categoryName,
				symptomId: symptomId
			}));
		},

		/**
		 * Show the list of symptoms for the specified category.
		 *
		 * @param categoryName - the name of the category of the symptoms we are listing.
		 */
		listSymptoms: function(categoryName) {
			this.updateContent(new HypoApp.Views.SymptomListView(categoryName));
		},

		updateContent : function(view) {
			$("#content").empty().append(view.render().$el);
		}

	});
	
	new Workspace();
	Parse.history.start();
});