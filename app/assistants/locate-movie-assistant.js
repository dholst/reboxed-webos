LocateMovieAssistant = Class.create({
  initialize: function(movie) {
    this.movie = movie;
  },

  setup: function() {
    console.log("Location " + this.movie.name);
  }
})