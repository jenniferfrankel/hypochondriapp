(function($){
	$.parse.init({
		app_id: "M6BP3LK8ORschhjxTdpoWhWQzVz0VyndcvvQVi7e",
		rest_key : "oBbw4wZNrq0NTAUadxLlyvRyhuyRq33Z6zUNgmmT"
	});

	hypo = {
		populateSymptoms: function(symptomType){
			console.log("Yeay!");
			$("#content").spin();
			$.parse.get('Symptom', {where: {name: symptomType}})
				.success(function(data) {
					$("#content").spin(false);
					hypo.renderSymptoms(data.results);
				});
		},

		handleSubmit: function(event){
			event.preventDefault();
			var formData = $("#submitform").serializeObject();
			formData.severity = parseInt(formData.severity,10);
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
			if (page === "symptomList"){
				hypo.renderSymptomList();
				// list of possible symptoms
			}
			else if (page === "addSymptom"){
				// page where you can add chosen symptom
				hypo.renderAddSymptomForm(hashParts[2]);
			}
			else {
				hypo.renderSymptomList();
			}
		},

		renderSymptomList: function(){
			$("#content").html($("#symptomList-template").html());
		},

		renderAddSymptomForm: function(symptomType){
			var template = _.template($("#addSymptom-template").html());
			$("#content").html(template({type:symptomType}));
			$("#submitform").submit(hypo.handleSubmit);
			hypo.populateSymptoms(symptomType);
		}

	};
})(jQuery);