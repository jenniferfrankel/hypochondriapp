$(document).ready(function(){
	// Initialize Parse libraries with my app ID and javascript API key
	Parse.initialize("M6BP3LK8ORschhjxTdpoWhWQzVz0VyndcvvQVi7e", "NllvdChHyabrLUTVo2AoAxqO5pQRonDw0FL6jgDN");
	
	// Define Symptom and Category objects and collections
	var Symptom = Parse.Object.extend("Symptom");
	var Symptoms = Parse.Collection.extend({
		model : Symptom
	});
	var Category = Parse.Object.extend("Category");
	var Categories = Parse.Collection.extend({
		model : Category
	});

	var CategoryListView = Parse.View.extend({
		initialize: function(options){
			_.bindAll(this);
			this.collection = options.collection;
			this.collection.on("all", this.render);
			this.template = _.template($("#symptomList-template").html());
		},
		render: function(){
			this.$el.html(this.template({categories: this.collection.toJSON()}));
			return this;
		}
	});

	var Workspace = Parse.Router.extend({
		routes: {
			"": "home",
			"categories": "listCategories",
			"categories/:categoryName": "listSymptoms"
		},

		home: function(){
			console.log("home");
			this.navigate("categories", {trigger: true, replace: true});
		},

		listCategories: function(){
			console.log("listCategories");
			var categories = new Categories();
			var view = new CategoryListView({
				collection: categories
			});
			$("#content").empty().append(view.render().$el);
			categories.fetch();
		},

		listSymptoms: function(categoryName){
			console.log("listSymptoms" + categoryName);
		}

	});
	var workspace = new Workspace();
	Parse.history.start();
});