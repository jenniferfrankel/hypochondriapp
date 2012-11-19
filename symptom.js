hypo = {

	populateSymptoms: function(symptomType){
		console.log("Yeay!");
		$.ajax({
			url: 'https://api.parse.com/1/classes/Symptom?where={"name":"'+symptomType+'"}',
			headers: {
				"X-Parse-Application-Id": "M6BP3LK8ORschhjxTdpoWhWQzVz0VyndcvvQVi7e",
				"X-Parse-REST-API-Key": "oBbw4wZNrq0NTAUadxLlyvRyhuyRq33Z6zUNgmmT"
			},
			success: function(data){
				hypo.renderSymptoms(data.results);
			},
			error: function(){
				console.log('error');
			}
		});
	},

	handleSubmit: function(event){
		event.preventDefault();
		console.log($("#submitform").serializeArray());
		var o = hypo.objectify($("#submitform").serializeArray());
		o.severity = parseInt(o.severity,10);
		console.log(o);
		$.ajax({
			url: "https://api.parse.com/1/classes/Symptom",
			type: "POST",
			contentType: "application/json",
			headers: {
				"X-Parse-Application-Id": "M6BP3LK8ORschhjxTdpoWhWQzVz0VyndcvvQVi7e",
				"X-Parse-REST-API-Key": "oBbw4wZNrq0NTAUadxLlyvRyhuyRq33Z6zUNgmmT"
			},
			data: JSON.stringify(o),
			success: function(data){
				console.log(data);
				//renderSymptoms(data.results);
				hypo.renderSymptom(data.objectId);
			},
			error: function(){
				console.log('error');
			}
		});
	},

	objectify: function(array){
		var o = {};
		_.each(array,function(element){
			o[element.name] = element.value;
		});
		return o;
	},

	renderSymptoms: function(symptoms){
		var template = _.template($("#symptom-template").html());
		_.each(symptoms,function(symptom){
			$("#symptoms").prepend(template(symptom));
		});
	},

	renderSymptom: function(dataId){
		$.ajax({
			url: "https://api.parse.com/1/classes/Symptom/"+dataId,
			headers: {
				"X-Parse-Application-Id": "M6BP3LK8ORschhjxTdpoWhWQzVz0VyndcvvQVi7e",
				"X-Parse-REST-API-Key": "oBbw4wZNrq0NTAUadxLlyvRyhuyRq33Z6zUNgmmT"
			},
			success: function(data){
				hypo.renderSymptoms([data]);
			},
			error: function(){
				console.log('error');
			}
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
