define(
	["jquery", "parse", "underscore", "jquery.serializeobject"],
	function($, Parse, _, template) {
		return Parse.View.extend({
			render: function(){
				this.$el.html(this.template());
				return this;
			},

			toggleSubmitButtonDisabled: function(isDisabled) {
				this.$("[type=submit]").prop('disabled', isDisabled);
			},

			hideModal: function() {
				// Remove focus from input fields to ensure
				// that keyboard field disappears when modal closes
				this.$("input").blur();
				$("#myModal").modal('hide');
			},

			onSendToParseComplete: function() {
				this.toggleSubmitButtonDisabled(false);
			},

			validateForm: function() {
				return true;
			},

			navigateBack: function() {
				window.history.back();
			},

			handleSubmit: function(event){
				event.preventDefault();
				if(this.validateForm()) {
					this.toggleSubmitButtonDisabled(true);
					var data = this.getDataFromForm();
					data.user = Parse.User.current();
					data.ACL = new Parse.ACL(Parse.User.current());
					this.saveToParse(data);
					this.navigateBack();
				}
			}
		});
	});