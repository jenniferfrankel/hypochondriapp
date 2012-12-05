define([
	"jquery","parse","underscore",
	"Views/CategoryListView",
	"Views/LogInView",
	"Views/AddCategoryView",
	"Views/AddSymptomView",
	"Views/GraphSymptomView",
	"Views/SymptomListView"
	],
function(
	$, Parse, _,
	CategoryListView,
	LogInView,
	AddCategoryView,
	AddSymptomView,
	GraphSymptomView,
	SymptomListView
	) {
	return Parse.Router.extend({
		/**
		 * A list of routes for this app.
		 */
		routes: {
			"": "home",
			"login": "login",
			"logout": "logout",
			"categories": "listCategories",
			"categories/addCategory": "addCategory",
			"categories/:categoryName": "listSymptoms",
			"categories/:categoryName/editSymptom/:symptomId": "addSymptom",
			"categories/:categoryName/symptomGraph": "symptomGraph",
			"*path": "defaultRoute"
		},

		initialize: function() {
			_.bindAll(this);
			Parse.history.start();
		},

		/**
		 * The default route. For now, just take the users to the categories list.
		 */
		home: function(){
			this.navigate("categories", {trigger: true, replace: true});
		},

		defaultRoute: function(){
			// TODO: Make this into a view
			$("#content").empty().html("404");
		},

		addCategory: function(){
			this.updateContent(new AddCategoryView());
		},

		/**
		 * List the available categories of symptoms
		 */
		listCategories: function(){
			this.updateContent(new CategoryListView());
		},

		/**
		 * Add a symptom
		 *
		 * @param categoryName - the name of the category we are adding a symptom to.
		 * @param symptomId - (optional) the id of the symptom to edit
		 */
		addSymptom: function(categoryName, symptomId){
			this.updateContent(new AddSymptomView({
				categoryName: categoryName,
				symptomId: symptomId
			}));
		},

		/**
		 * Show the list of symptoms for the specified category.
		 *
		 * @param categoryName - the name of the category of the symptoms we are listing.
		 */
		listSymptoms: function(categoryName) {
			this.updateContent(new SymptomListView(categoryName));
		},

		symptomGraph: function(categoryName) {
			this.updateContent(new GraphSymptomView(categoryName));
		},

		login: function() {
			if (!!Parse.User.current()) {
				// If we are logged in already, an the user goes to the login
				// page (somehow), just send them home.
				this.navigate("", {trigger: true, replace: true});
			} else {
				var that = this;
				var onLoginSuccess = function() {
					that.navigate(that.locationAfterLogin || "", {trigger: true, replace: true});
					that.locationAfterLogin = null;
				};
				var view = new LogInView({
					success: onLoginSuccess
				});
				this.updateContent(view, true);
			}
		},

		logout: function() {
			Parse.User.logOut();
			this.navigate("login", {trigger: true, replace: true});
		},

		/**
		 * Swap out the current contents with a new view. If a user is not
		 * logged in, they will be directed to the login/signup flow unless
		 * the allowWithoutLogin flag is passed.
		 *
		 * @param view - the view that should be rendered
		 * @param allowWithoutLogin - boolean to determine if we are skipping the login requirement.
		 */
		updateContent : function(view, allowWithoutLogin) {
			if (allowWithoutLogin || !!Parse.User.current()) {
				$("#content").empty().append(view.render().$el);
			} else {
				this.locationAfterLogin = window.location.hash;
				this.navigate("login", {trigger: true, replace: true});
			}
			if (window.history.length > 0) {
				$("#backButton").show();
			} else {
				$("#backButton").hide();
			}
		}
	});
});