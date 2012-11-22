(function($){
	// Initialize the Parse jQuery plugin with HypochondriApp's app ID and my REST API key
	$.parse.init({
		app_id: "M6BP3LK8ORschhjxTdpoWhWQzVz0VyndcvvQVi7e",
		rest_key : "oBbw4wZNrq0NTAUadxLlyvRyhuyRq33Z6zUNgmmT"
	});

	// Create a new name space for the HypochondriApp functions
	hypo = {
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

		handleSubmit: function(event){
			event.preventDefault();
			var formData = $("#submitform").serializeObject();
			formData.severity = parseInt(formData.severity,10);
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

		renderSymptoms: function(symptoms){
			var template = _.template($("#symptom-template").html());
			_.each(symptoms,function(symptom){
				$("#symptoms").prepend(template(symptom));
			});
		},

		renderSymptom: function(dataId){
			$("#content").spin();
			$.parse.get('Symptom/'+dataId)
				.success(function(data) {
					$("#content").spin(false);
					hypo.renderSymptoms([data]);
				});
		},

		route: function(){
			var hashParts = window.location.hash.split("/");
			var page = hashParts.length > 1 ? hashParts[1] : "";
			if (page === "addSymptom"){
				hypo.renderSymptomPage(hashParts[2]);
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
					console.log(data.results);
					var template = _.template($("#symptomList-template").html());
					$("#content").html(template(data));
				});
		},

		renderAddSymptomForm: function(category){
			var template = _.template($("#addSymptom-template").html());
			$("#content").html(template(category));
			$("#submitform").submit(hypo.handleSubmit);
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