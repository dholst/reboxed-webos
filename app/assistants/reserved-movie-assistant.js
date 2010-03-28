ReservedMovieAssistant = Class.create(BaseAssistant, {
  initialize: function(cart) {
    this.cart = cart;
  },

  setup: function() {
    this.update("movie-name", this.cart.movie.name);
    this.update("reserved", Mojo.View.render({object: this.cart, template: "reserved-movie/details"}));
    this.controller.listen("find-another", Mojo.Event.tap, function(){this.controller.stageController.popScene()}.bind(this));
  }
});
