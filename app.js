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
			this.template = _.template($("#categoryList-template").html());
		},
		render: function(){
			this.$el.html(this.template({categories: this.collection.toJSON()}));
			return this;
		}
	});

	var SymptomListView = Parse.View.extend({
		initialize: function(options){
			_.bindAll(this);
			this.symptoms = options.symptoms;
			this.symptoms.on("all", this.render);
			this.categories = options.categories;
			this.categories.on("all", this.render);
			this.template = _.template($("#symptomList-template").html());
		},
		render: function(){
			var hasCategory = !!this.categories.first();
			this.$el.html(this.template({
				symptoms : this.symptoms.toJSON(),
				category : hasCategory ? this.categories.first().toJSON() : null
			}));
			return this;
		}
	});

	var AddSymptomView = Parse.View.extend({
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
			var formData = this.$("#symptomsubmitform").serializeObject();
			var symptom = new Symptom({
				comment: formData.comment,
				date: formData.date,
				duration: formData.seconds + 60*formData.minutes + 3600*formData.hours,
				severity: formData.severity,
				category: this.collection.first()
			});
			symptom.save();
			window.location.hash=$("#symptomsubmitform").attr("action");
		}
	});

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
			var categories = new Categories();
			var view = new CategoryListView({
				collection: categories
			});
			$("#content").empty().append(view.render().$el);
			categories.fetch();
		},

		addSymptom: function(categoryName){
			var categoryQuery = new Parse.Query(Category);
			categoryQuery.equalTo("name", categoryName);
			var categories = categoryQuery.collection();

			var view = new AddSymptomView({collection: categories});
			$("#content").empty().append(view.render().$el);
			categories.fetch();
		},

		listSymptoms: function(categoryName){
			console.log("listSymptoms" + categoryName);
			var categoryQuery = new Parse.Query(Category);
			categoryQuery.equalTo("name", categoryName);

			var symptomQuery = new Parse.Query(Symptom);
			symptomQuery.matchesQuery("category", categoryQuery);
			symptomQuery.include("category");

			var categories = categoryQuery.collection();
			var symptoms = symptomQuery.collection();

			var view = new SymptomListView({
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