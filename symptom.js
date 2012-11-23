(function($){
	// Initialize the Parse jQuery plugin with HypochondriApp's app ID and my REST API key
	$.parse.init({
		app_id: "M6BP3LK8ORschhjxTdpoWhWQzVz0VyndcvvQVi7e",
		rest_key : "oBbw4wZNrq0NTAUadxLlyvRyhuyRq33Z6zUNgmmT"
	});

	// Create a new name space for the HypochondriApp functions
	hypo = {
		// Templates
		templates: {
			addSymptom: _.template($("#addSymptom-template").html()),
			symptomList: _.template($("#symptomList-template").html()),
			addCategory: _.template($("#addCategory-template").html()),
			symptom: _.template($("#symptom-template").html())
		},

		/**
		* Get symptoms of the specified category and render a list of them.
		* @param categoryName the name of the category of the symptoms we are fetching
		*/
		populateSymptoms: function(categoryId){
			$("#content").spin();
			var query = {
				include: 'category',
				where: {
					category: {
						__type:'Pointer',
						className:'Category',
						objectId:categoryId
					}
				}
			};
			$.parse.get('Symptom', query)
				.success(function(data) {
					$("#content").spin(false);
					hypo.renderSymptoms(data.results);
				});
		},

		handleSymptomSubmit: function(event){
			event.preventDefault();
			var formData = $("#symptomsubmitform").serializeObject();
			formData.category = {
				__type:'Pointer',
				className:'Category',
				objectId:formData.category
			};
			$("#content").spin();
			$.parse.post('Symptom', formData)
				.success(function(data) {
					$("#content").spin(false);
					hypo.renderSymptom(data.objectId);
				});
		},

		handleCatgorySubmit: function(event){
			// Handles submission of new symptom category to db
			event.preventDefault();
			var formData = $("#categorysubmitform").serializeObject();
			$("#content").spin();
			$.parse.post('Category', formData)
				.success(function(data) {
					$("#content").spin(false);
					hypo.renderCategories();
				});
		},

		renderSymptoms: function(symptoms){
			_.each(symptoms,function(symptom){
				$("#symptoms").prepend(hypo.templates.symptom(symptom));
			});
		},

		renderCategories: function(){
			console.log("renderCategories");
		},

		renderSymptom: function(dataId){
			$("#content").spin();
			$.parse.get('Symptom/'+dataId, {include: "category"})
				.success(function(data) {
					$("#content").spin(false);
					hypo.renderSymptoms([data]);
				});
		},

		route: function(){
			var hashParts = window.location.hash.substring(1).split("/");
			var page = hashParts[0];
			if (page === "addSymptom"){
				hypo.renderSymptomPage(hashParts[1]);
			}
			else if (page === "addCategory"){
				hypo.renderAddCategoryForm();
			}
			else {
				hypo.renderCategoryList();
			}
		},

		renderCategoryList: function(){
			$("#content").spin();
			// Get available symptom types from db
			$.parse.get('Category')
				.success(function(data) {
					$("#content").spin(false);
					$("#content").html(hypo.templates.symptomList(data));
				});
		},

		renderAddCategoryForm: function(){
			$("#content").html(hypo.templates.addCategory());
			$("#categorysubmitform").submit(hypo.handleCatgorySubmit);
		},

		renderAddSymptomForm: function(category){
			console.log(category);
			$("#content").html(hypo.templates.addSymptom(category));
			$("#symptomsubmitform").submit(hypo.handleSymptomSubmit);
		},

		renderSymptomPage: function(categoryName){
			$.parse.get('Category', {where: {name:categoryName}})
				.success(function(data) {
					if (data.results.length === 0){
						return;
					}
					var category = data.results[0];
					hypo.renderAddSymptomForm(category);
					hypo.populateSymptoms(category.objectId);
				});
		}
	};
})(jQuery);