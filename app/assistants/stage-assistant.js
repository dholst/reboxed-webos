StageAssistant = Class.create({
  setup: function() {
    this.sync = this.sync.bind(this);
    Database.getInstance().open(this.sync);
  },

  sync: function() {
    this.syncMovies = this.syncMovies.bind(this);
    this.syncFailure = this.syncFailure.bind(this);

    new Ajax.Request("http://strong-journey-44.heroku.com/movies", {
      method: "get",
      onSuccess: this.syncMovies,
      onFailure: this.syncFailure
    });
  },

  syncMovies: function(response) {
    var movies = response.responseJSON;
    this.syncMovie(this.pushScene.bind(this), movies, 0);
  },

  syncMovie: function(callback, movies, index) {
    Mojo.Log.info("syncing movie", index + 1, "of", movies.length);

    if(index >= movies.length) {
      callback();
    }
    else {
      var saveCallback = this.syncMovie.bind(this, callback, movies, index + 1);
      var movieJson = movies[index];
      Movie.fromJson(movies[index]).save(saveCallback, saveCallback);
    }
  },

  syncFailure: function(response) {
    Mojo.Log.error("Sync failure", response.getStatus());
    this.pushScene();
  },

  pushScene: function() {
    this.controller.pushScene("movies");
  }
});
