var HypoApp = (typeof HypoApp === "undefined") ? {} : HypoApp;
HypoApp.Models = (typeof HypoApp.Models === "undefined") ? {} : HypoApp.Models;

// Define Symptom and Category objects and collections
HypoApp.Models.Symptom = Parse.Object.extend("Symptom");
HypoApp.Models.Symptoms = Parse.Collection.extend({
		model : HypoApp.Models.Symptom
	});
HypoApp.Models.Category = Parse.Object.extend("Category");
HypoApp.Models.Categories = Parse.Collection.extend({
		model : HypoApp.Models.Category
	});