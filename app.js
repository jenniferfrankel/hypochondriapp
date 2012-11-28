$(document).ready(function(){
	// Initialize Parse libraries with my app ID and javascript API key
	Parse.initialize("M6BP3LK8ORschhjxTdpoWhWQzVz0VyndcvvQVi7e", "NllvdChHyabrLUTVo2AoAxqO5pQRonDw0FL6jgDN");	

	var Workspace = Parse.Router.extend({
		routes: {
			"": "home",
			"categories": "listCategories",
			"categories/:categoryName": "listSymptoms",
			"categories/:categoryName/addSymptom": "addSymptom"
		},

		home: function(){
			console.log("home");
			this.navigate("categories", {trigger: true, replace: true});
		},

		listCategories: function(){
			console.log("listCategories");
			var categories = new HypoApp.Models.Categories();
			var view = new HypoApp.Views.CategoryListView({
				collection: categories
			});
			$("#content").empty().append(view.render().$el);
			categories.fetch();
		},

		addSymptom: function(categoryName){
			var categoryQuery = new Parse.Query(HypoApp.Models.Category);
			categoryQuery.equalTo("name", categoryName);
			var categories = categoryQuery.collection();

			var view = new HypoApp.Views.AddSymptomView({collection: categories});
			$("#content").empty().append(view.render().$el);
			categories.fetch();
		},

		listSymptoms: function(categoryName){
			console.log("listSymptoms" + categoryName);
			var categoryQuery = new Parse.Query(HypoApp.Models.Category);
			categoryQuery.equalTo("name", categoryName);

			var symptomQuery = new Parse.Query(HypoApp.Models.Symptom);
			symptomQuery.matchesQuery("category", categoryQuery);
			symptomQuery.include("category");

			var categories = categoryQuery.collection();
			var symptoms = symptomQuery.collection();

			var view = new HypoApp.Views.SymptomListView({
				symptoms : symptoms,
				categories : categories
			});
			$("#content").empty().append(view.render().$el);
			categories.fetch();
			symptoms.fetch();
		}

	});
	var workspace = new Workspace();
	Parse.history.start();
});