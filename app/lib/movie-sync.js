MovieSync = {
  sync: function() {
    new Ajax.Request("http://redboxmovies.heroku.com/movies", {
      method: "get",
      onSuccess: this.syncMovies.bind(this),
      onFailure: this.syncFailure.bind(this)
    });
  },

  syncMovies: function(response) {
    this.syncMovie(response.responseJSON, 0);
  },

  syncMovie: function(movies, index) {
    if(index >= movies.length) {
      this.syncComplete();
    }
    else {
      var saveCallback = this.syncMovie.bind(this, movies, index + 1);
      var movieJson = movies[index];
      Movie.fromJson(movies[index]).save(saveCallback, saveCallback);
    }
  },

  syncFailure: function(response) {
    Mojo.Log.error("Sync failure", response.getStatus());
    this.syncComplete();
  },
  
  syncComplete: function() {
    Mojo.Event.send(document, Redbox.Event.movieSyncComplete, {});
  }
};
