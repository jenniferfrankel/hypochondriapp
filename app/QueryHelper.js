define(
["parse", "Models/Category", "Models/Symptom", "appCache"],
function(Parse, Category, Symptom, appCache) {
	return {
		fetchCategories : function() {
			var deferred = $.Deferred();
			this.validateCache();
			if (appCache.categories) {
				console.log("Using cached copy of categories");
				deferred.resolve(appCache.categories);
			} else {
				console.log("No cached copy of categories, fetching from parse");
				var categoryQuery = new Parse.Query(Category);
				categoryQuery.equalTo("user", Parse.User.current());
				var categories = categoryQuery.collection();
				categories.fetch({
					success: function() { deferred.resolve(categories); },
					error: function() { deferred.reject(); }
				});
				appCache.categories = categories;
			}
			return deferred;
		},

		fetchCategoryByName : function(categoryName) {
			var deferred = $.Deferred();
			var category;
			this.validateCache();
			if (appCache.categories) {
				category = appCache.categories.find(function(c) { return c.get("name") === categoryName; });
				if (category) {
					console.log("Using cached copy of category "+categoryName);
					deferred.resolve(category);
				}
			}

			if (!category) {
				console.log("No cached copy of category "+categoryName+", fetching from parse");
				var categoryQuery = new Parse.Query(Category);
				categoryQuery.equalTo("user", Parse.User.current());
				categoryQuery.equalTo("name", categoryName);
				categoryQuery.first({
					success: function(category) {
						if (category) {
							deferred.resolve(category);
						} else {
							deferred.reject();
						}
					},
					error: deferred.reject
				});
			}

			return deferred;
		},

		fetchSymptomsForCategory : function(category) {
			var deferred = $.Deferred();
			this.validateCache();
			if (appCache.symptoms[category.get("name")]) {
				console.log("Using cached copy of categories");
				deferred.resolve(appCache.symptoms[category.get("name")]);
			} else {
				console.log("No cached copy of symptoms for "+category.get("name")+", fetching from parse");
				
				var symptomQuery = new Parse.Query(Symptom);
				symptomQuery.equalTo("category", category);
				symptomQuery.include("category");
				var symptoms = symptomQuery.collection();
				symptoms.fetch({
					success: function() { deferred.resolve(symptoms); },
					error: function() { deferred.reject(); }
				});
				appCache.symptoms[category.get("name")] = symptoms;
			}
			return deferred;
		},

		validateCache : function() {
			// Check if user appCache.user === Parse.User.current()
			// If not, empty cache and set appCache.user = Parse.User.current()
			console.log("Cache was validated");
			if (appCache.username != Parse.User.current().getUsername()) {
				appCache.username = Parse.User.current().getUsername();
				this.emptyCache();
			}
		},

		emptyCache : function() {
			// Empty the cache
			console.log("Cache was emptied");
			appCache.symptoms = {};
			appCache.categories = null;
		},

		resetCache : function() {
			// Empty the cache and set username to null
			console.log("Cache was reset");
			appCache.username = null,
			appCache.symptoms = {};
			appCache.categories = null;
		}
	};
});
