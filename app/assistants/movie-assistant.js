MovieAssistant = Class.create(BaseAssistant, {
  initialize: function(movie) {
    this.movie = movie;
  },

  setup: function() {
    this.controller.listen(document, Reboxed.Event.imageCached, this.imageCached = this.imageCached.bind(this));
    this.controller.setupWidget(Mojo.Menu.commandMenu, {}, {items: [{}, {label:"Locate", command:"locate"}]});
  },

  ready: function() {
    //TODO: make this a template
    $("image").src = "file://" + this.movie.cacheDirectory + "/" + this.movie.image;

    this.update("name", this.movie.name)
    this.update("rating", this.movie.rating);
    this.update("released", this.movie.releasedDisplay);
    this.update("running-time", this.movie.runningTime);
    this.update("actors", this.movie.actors);
    this.update("genre", this.movie.genre);
    this.update("description", this.movie.description);
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