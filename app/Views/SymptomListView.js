define(
	["jquery", "parse", "underscore", "../Models/Category", "../Models/Symptom", "./AddSymptomView", "text!../Templates/SymptomList.html", "QueryHelper", "moment"],
	function($, Parse, _, Category, Symptom, AddSymptomView, template, queryHelper) {
	return Parse.View.extend({
		events : {
			"click .symptom" :  "editSymptom",
			"click #addSymptomButton" : "addSymptom"
		},

		initialize: function(categoryName) {
			_.bindAll(this);
			var that = this;
			this.template = _.template(template);
			this.categoryName = categoryName;
			this.pageTitle = categoryName;
			this.newButtonFn = this.addSymptom;

			this.showSpinner();
			queryHelper.fetchCategoryByName(categoryName)
				.done(this.onCategoryFetched)
				.fail(this.stopSpinner)
				.always(this.render);
			
			this.showAdd = true;
		},

		onCategoryFetched : function(category) {
			this.category = category;
			queryHelper.fetchSymptomsForCategory(category)
				.done(this.onSymptomsFetched)
				.always(this.stopSpinner)
				.always(this.render);
		},

		onSymptomsFetched: function(symptoms) {
			this.symptoms = symptoms;
			this.symptoms.on("all", this.render);
			this.symptoms.comparator = function(symptom) {
				return -symptom.get("date").getTime();
			};
		},

		showSpinner : function () {
			$("#spinner").show().spin('large');
		},

		stopSpinner : function () {
			$("#spinner").spin(false).hide();
		},

		render: function(){
			this.$el.html(this.template({
				symptoms : this.symptoms ? this.symptoms.toJSON() : [],
				category : this.category ? this.category.toJSON() : null
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
				categoryName: this.categoryName,
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