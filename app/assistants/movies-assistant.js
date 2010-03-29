MoviesAssistant = Class.create({
  initialize: function() {
    MovieSync.sync();
    this.cachedImages = {};
  },

  setup: function() {
    this.controller.setupWidget("movies", {
      renderLimit: 10,
      lookahead: 7,
			listTemplate: "movies/movies",
      itemTemplate: "movies/movie",
      onItemRendered: this.itemRendered.bind(this),
<<<<<<< HEAD
      itemsCallback: this.itemsCallback.bind(this),
      dividerTemplate: "movies/divider",
  		dividerFunction: this.divide
    };
=======
      itemsCallback: this.itemsCallback.bind(this)
    });
>>>>>>> message when no kiosks found

    this.controller.listen("movies", Mojo.Event.listTap, this.movieTapped = this.movieTapped.bind(this));
    this.controller.listen(document, Reboxed.Event.imageCached, this.imageCached = this.imageCached.bind(this));

    this.paginate(0, 30);
  },
<<<<<<< HEAD

  divide: function(movie) {
    return movie.releasedDisplay;
  },

=======
  
>>>>>>> message when no kiosks found
  cleanup: function() {
    this.controller.stopListening(document, Reboxed.Event.imageCached, this.imageCached);
    this.controller.stopListening("movies", Mojo.Event.listTap, this.movieTapped);
  },

  movieTapped: function(event) {
    this.controller.stageController.pushScene("movie", event.item);
  },

  imageCached: function(event) {
    var img = this.controller.get("img-" + event.movie.id);

    if(img) {
      img.src = "file://" + event.movie.cacheDirectory + "/" + event.movie.image;
    }
  },

  itemRendered: function(listWidget, movie, node) {
    if(!this.cachedImages[movie.id]) {
      this.cachedImages[movie.id] = true;
      movie.cacheImage();
    }
  },

  itemsCallback: function(listWidget, offset, count) {
    Mojo.Log.info("need", count, "more at", offset);
    this.paginate(offset, count);
  },

  paginate: function(offset, count) {
    Movie.paginate(offset, count, this.moviesFound.bind(this, offset), this.findError.bind(this));
  },

  moviesFound: function(offset, movies) {
    $("movies").mojo.noticeUpdatedItems(offset, movies);
    Movie.count(function(count){$("movies").mojo.setLength(count)}.bind(this));
  },

  findError: function() {
    Mojo.Log.error("paginate error");
  }
});