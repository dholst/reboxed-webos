ReservedMovieAssistant = Class.create(BaseAssistant, {
  initialize: function(cart) {
    this.cart = cart;
  },

  setup: function($super) {
    $super();
    this.update("movie-name", this.cart.movie.name);
    this.update("reserved", Mojo.View.render({object: this.cart, template: "reserved-movie/details"}));
    this.controller.listen("find-another", Mojo.Event.tap, this.backToWhereYaCameFrom = this.backToWhereYaCameFrom.bind(this));
  },

  cleanup: function() {
    this.controller.stopListening("find-another", Mojo.Event.tap, this.backToWhereYaCameFrom);
  },

  handleCommand: function(event) {
	  if(Mojo.Event.back) {
	    event.stop();
      this.backToWhereYaCameFrom();
	  }
  },

  backToWhereYaCameFrom: function() {
    var scenes = this.controller.stageController.getScenes();
    var scene = scenes[0].sceneName;

    for(var i = scenes.length - 1; i >= 0; i--) {
      if(scenes[i].sceneName.endsWith("movies")) {
        scene = scenes[i].sceneName;
        break;
      }
    }

    this.controller.stageController.popScenesTo(scene);
  }
});
