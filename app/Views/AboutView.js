define(["jquery", "parse", "underscore", "text!../Templates/About.html", "./ModalFormView"], function($, Parse, _, template, ModalFormView) {
	return ModalFormView.extend({
		events : {
			"click .closeAbout" : "close"
		},
		
		initialize: function(options) {
			_.bindAll(this);
			this.template = _.template(template);
		},

		render: function() {
			this.$el.html(this.template());
			return this;
		},

		close: function() {
			$("#myModal").modal('hide');
		}
	});
});