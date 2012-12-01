define(["parse", "../Models/Category"], function(Parse, Category) {
	return Parse.Collection.extend({
		model : Category
	});
});