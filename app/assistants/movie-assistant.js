MovieAssistant = Class.create(BaseAssistant, {
  initialize: function(movie) {
    this.movie = movie;
  },

  setup: function($super) {
    $super();
    this.update("main", Mojo.View.render({object: this.movie, template: "movie/movie"}));
    this.controller.listen(document, Reboxed.Event.imageCached, this.imageCached = this.imageCached.bind(this));
    this.controller.setupWidget(Mojo.Menu.commandMenu, {}, {items: [{}, {label:"Locate", command:"locate"}]});
  },

  activate: function(cart) {
    if(cart) {
      this.controller.stageController.swapScene("reserved-movie", cart);
    }
  },

  cleanup: function() {
    this.controller.stopListening(document, Reboxed.Event.imageCached, this.imageCached);
  },

  handleCommand: function(event) {
    if("locate" === event.command) {
      this.controller.stageController.pushScene("locate-movie", this.movie);
    }
  },

  imageCached: function(event) {
    var img = this.controller.get("img-" + event.movie.id);

    if(img) {
      img.src = "file://" + event.movie.cacheDirectory + "/" + event.movie.image;
    }
  }
});