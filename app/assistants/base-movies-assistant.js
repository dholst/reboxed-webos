BaseMoviesAssistant = Class.create(BaseAssistant, {
  setup: function($super) {
    $super();
    this.imageCached = this.imageCached.bind(this)
    this.controller.listen(document, Reboxed.Event.imageCached, this.imageCached);
  },

  cleanup: function() {
    this.controller.stopListening(document, Reboxed.Event.imageCached, this.imageCached);
  },

  imageCached: function(event) {
    var img = this.controller.get("img-" + event.movie.id);

    if(img) {
      img.src = "file://" + event.movie.cacheDirectory + "/" + event.movie.image;
    }
  },

  itemRendered: function(listWidget, movie, node) {
    if(!BaseMoviesAssistant.CACHED_IMAGES[movie.id]) {
      BaseMoviesAssistant.CACHED_IMAGES[movie.id] = true;
      movie.cacheImage();
    }
  },

  movieTapped: function(event) {
    this.controller.stageController.pushScene("movie", event.item);
  },
});

BaseMoviesAssistant.CACHED_IMAGES = {};
