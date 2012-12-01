define(["parse", "../Models/Symptom"], function(Parse, Symptom) {
	return Parse.Collection.extend({
		model : Symptom
	});
});