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
			$("#myModal").modal('hide');
		},

		onSendToParseComplete: function() {
			this.toggleSubmitButtonDisabled(false);
			this.hideModal();
		},

		handleSubmit: function(event){
			event.preventDefault();
			this.toggleSubmitButtonDisabled(true);

			var data = this.getDataFromForm();
			data.user = Parse.User.current();
			data.ACL = new Parse.ACL(Parse.User.current());

			this.saveToParse(data);
		}
	});
});