define([
	"jquery","parse","underscore", "spin",
	"Views/CategoryListView",
	"Views/LogInView",
	"Views/SignUpView",
	"Views/AddCategoryView",
	"Views/GraphSymptomView",
	"Views/SymptomListView",
	"Views/HomeView",
	"Views/SettingsView",
	"Views/ReleasenotesView",
	"Views/FaqView",
	"Views/FeedbackView"
	],
function(
	$, Parse, _, spin,
	CategoryListView,
	LogInView,
	SignUpView,
	AddCategoryView,
	GraphSymptomView,
	SymptomListView,
	HomeView,
	SettingsView,
	ReleasenotesView,
	FaqView,
	FeedbackView
	) {
	return Parse.Router.extend({
		/**
		 * A list of routes for this app.
		 */
		routes: {
			"": "listCategories",
			"login": "login",
			"logout": "logout",
			"signup": "signup",
			"home": "home",
			"settings": "settings",
			"categories": "listCategories",
			"categories/addCategory": "addCategory",
			"categories/:categoryName/history": "listSymptoms",
			"categories/:categoryName/symptomGraph": "symptomGraph",
			"settings/releasenotes" : "releasenotes",
			"settings/faq" : "faq",
			"settings/feedback" : "feedback",
			"*path": "defaultRoute"
		},

		initialize: function() {
			_.bindAll(this);
			Parse.history.start();
			
			$("#backButton").click(function(event) {
				event.preventDefault();
				window.history.back();
			});
		},

		/**
		 * The default route. For now, just take the users to the categories list.
		 */
		home: function(){
			this.updateContent(new HomeView());
			//this.navigate("categories", {trigger: true, replace: true});
		},

		settings: function(){
			this.updateContent(new SettingsView());
		},

		releasenotes: function(){
			this.updateContent(new ReleasenotesView());
		},

		faq: function(){
			this.updateContent(new FaqView());
		},

		feedback: function(){
			this.updateContent(new FeedbackView());
		},

		defaultRoute: function(){
			// TODO: Make this into a view
			$("#content").empty().html("404");
		},

		about: function(){
			//this.updateContent(new AboutView());
			var view = new AboutView();
			$("#myModal").empty().append(view.render().$el);
			$('#myModal').modal();
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

		signup: function() {
			var that = this;
			var onSignupSuccess = function() {
				// TODO: Take user to tutorial
				that.navigate("categories", {trigger: true, replace: true});
			};
			var signUpView = new SignUpView({
				success: onSignupSuccess
			});
			this.updateContent(signUpView, true);
			$("#myModal").modal('hide');
		},

		login: function() {
			if (!!Parse.User.current()) {
				// If we are logged in already, an the user goes to the login
				// page (somehow), just send them home.
				this.navigate("categories", {trigger: true, replace: true});
			} else {
				var that = this;
				var onLoginSuccess = function() {
					$('#myModal').modal('hide');
					that.navigate(that.locationAfterLogin || "", {trigger: true, replace: true});
					that.locationAfterLogin = null;
				};
				var view = new LogInView({
					success: onLoginSuccess
				});
				//this.updateContent(view, true);
				$("#myModal").empty().append(view.render().$el);
				$('#myModal').modal();
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
				$(".content").empty().append(view.render().$el);
			} else {
				this.locationAfterLogin = window.location.hash;
				this.navigate("login", {trigger: true, replace: true});
			}
			
			// This is a fix for non-working drop-down menus on iPad and iPhone (from https://github.com/twitter/bootstrap/issues/2975#issuecomment-6659992)
			$('body').on('touchstart.dropdown', '.dropdown-menu', function (e) { e.stopPropagation(); });
			
			this.updatePageTitle(view);
			this.updateBackButton(view);
			this.updateNewButton(view);
			this.updateActiveTab(view);
		},

		updatePageTitle : function(view) {
			$("#page-title").html(view.pageTitle);
		},

		updateBackButton : function(view) {
			var hasHistory = window.history.length > 0;
			var isRootView = view.tabId;
			$("#backButton").toggle(hasHistory && !isRootView);
		},

		updateNewButton : function(view) {
			if (view.newButtonFn) {
				$("#newButton").show().off("click").click(function(event) {
					event.preventDefault();
					view.newButtonFn();
				});
			} else {
				$("#newButton").hide();
			}
		},

		updateActiveTab : function(view) {
			if (view.tabId) {
				$(".bar-tab .tab-item").removeClass("active");
				$(view.tabId).addClass("active");
			}
		}
	});
});