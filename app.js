$(document).ready(function(){
	// Initialize Parse libraries with my app ID and javascript API key
	Parse.initialize("M6BP3LK8ORschhjxTdpoWhWQzVz0VyndcvvQVi7e", "NllvdChHyabrLUTVo2AoAxqO5pQRonDw0FL6jgDN");
	
	

	

	

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

			var view = new AddSymptomView({collection: categories});
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