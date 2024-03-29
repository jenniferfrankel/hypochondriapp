define(
	["jquery", "parse", "underscore", "../Models/Category", "../Models/Symptom", "./AddSymptomView", "text!../Templates/SymptomList.html", "queryhelper", "jquery.flot", "jquery.flot.time", "moment"],
	function($, Parse, _, Category, Symptom, AddSymptomView, template, queryHelper) {
	return Parse.View.extend({

		backButtonText: "Symptoms",
		backLocation: "categories",
		tabId: "#symptomsTab",

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
			window.addEventListener("orientationchange", this.render, false);
		},

		onCategoryFetched: function(category) {
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
			// For the graph
			this.dataY = this.symptoms.pluck("severity");
			this.dataX = this.symptoms.map(function (symptom) {
				return new Date(symptom.get("date")).getTime();
			});
			this.dataX.sort(function(a,b){return b-a;});
		},

		showSpinner : function () {
			$("#spinner").show().spin('large');
		},

		stopSpinner : function () {
			$("#spinner").spin(false).hide();
		},

		getOrientation : function() {
			return !window.orientation ? 'portrait' : 'landscape';
		},

		render: function() {
			if (this.getOrientation() == 'landscape') {
				$(".bar-tab").hide();
				var width = _.max([1, (_.first(this.dataX) - _.last(this.dataX)) / (1000*60*60*24*30)]) * window.innerWidth;
				this.$el.html('<div id="graph" style="width:'+width+'px;height:'+(window.innerHeight-$(".bar-title").height()-12)+'px"></div>');
				if (this.dataX && this.dataY) {
					var data = [ _.zip(this.dataX, this.dataY)];
					var options = {
						xaxis: {
							mode: "time",
							timeformat: "%d/%m"
						},
						series: {
							lines: {show: true},
							points: {show: true}
						}
					};
					$.plot(this.$("#graph"), data, options);
				}
			} else {
				this.$el.html(this.template({
					symptoms : this.symptoms ? this.symptoms.toJSON() : [],
					category : this.category ? this.category.toJSON() : null
				}));
				$(".bar-tab").show();
			}
			return this;
		},

		editSymptom: function(event){
			// when a symptom is clicked on send a
			// hash address (containing category name and symptom id) to the router
			var symptomId = $(event.target).closest(".symptom").data("symptom-id");
			window.location.hash = "categories/"+this.categoryName+"/edit/"+symptomId;
			// var symptom = this.symptoms.get(symptomId);
			// var view = new AddSymptomView({
			// 	categoryName: this.categoryName,
			// 	symptom: symptom
			// });
			// $("#myModal").empty().append(view.render().$el);
			// $("#myModal").modal();
		},

		addSymptom: function(event){
			// when the add new button is clicked
			// create the add view
			window.location.hash = "categories/"+this.categoryName+"/addNew";
			// var view = new AddSymptomView({
			// 	categoryName: this.categoryName,
			// 	symptoms : this.symptoms
			// });
			// $("#myModal").empty().append(view.render().$el);
			// $("#myModal").modal();
		}
	});
});