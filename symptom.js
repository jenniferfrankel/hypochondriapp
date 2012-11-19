var populateSymptoms = function(symptomType){
	console.log("Yeay!");

	$.ajax({
		url: 'https://api.parse.com/1/classes/Symptom?where={"name":"'+symptomType+'"}',
		headers: {
			"X-Parse-Application-Id": "M6BP3LK8ORschhjxTdpoWhWQzVz0VyndcvvQVi7e",
			"X-Parse-REST-API-Key": "oBbw4wZNrq0NTAUadxLlyvRyhuyRq33Z6zUNgmmT"
		},
		success: function(data){
			renderSymptoms(data.results);
		},
		error: function(){
			console.log('error');
		}
	});
};

var handleSubmit = function(event){
	event.preventDefault();
	console.log($("#submitform").serializeArray());
	var o = objectify($("#submitform").serializeArray());
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
			renderSymptom(data.objectId);
		},
		error: function(){
			console.log('error');
		}
	});
};

var objectify = function(array){
	var o = {};
	_.each(array,function(element){
		o[element.name] = element.value;
	});
	return o;
};

var renderSymptoms = function(symptoms){
	var template = _.template($("#symptom-template").html());
	_.each(symptoms,function(symptom){
		$("#symptoms").prepend(template(symptom));
	});
};

var renderSymptom = function(dataId){
	$.ajax({
		url: "https://api.parse.com/1/classes/Symptom/"+dataId,
		headers: {
			"X-Parse-Application-Id": "M6BP3LK8ORschhjxTdpoWhWQzVz0VyndcvvQVi7e",
			"X-Parse-REST-API-Key": "oBbw4wZNrq0NTAUadxLlyvRyhuyRq33Z6zUNgmmT"
		},
		success: function(data){
			renderSymptoms([data]);
		},
		error: function(){
			console.log('error');
		}
	});

};

var route = function(){
	var hashParts = window.location.hash.split("/");
	var page = hashParts.length > 1 ? hashParts[1] : "";
	if (page === "symptomList"){
		renderSymptomList();
		// list of possible symptoms
	}
	else if (page === "addSymptom"){
		// page where you can add chosen symptom
		renderAddSymptomForm(hashParts[2]);
	}
	else {
		renderSymptomList();
	}
};

var renderSymptomList = function(){
	$("#content").html($("#symptomList-template").html());
};

var renderAddSymptomForm = function(symptomType){
	var template = _.template($("#addSymptom-template").html());
	$("#content").html(template({type:symptomType}));
	$("#submitform").submit(handleSubmit);
	populateSymptoms(symptomType);
};
