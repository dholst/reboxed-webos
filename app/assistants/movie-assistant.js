MovieAssistant = Class.create({
  initialize: function(movie) {
    this.movie = movie;
  },

  setup: function() {
    $('image').src = "file://" + this.movie.cacheDirectory + "/" + this.movie.image;
    $('name').update(this.movie.name)
    $('rating').update(this.movie.rating);
    $('released').update(this.movie.releasedDisplay);
    $('running-time').update(this.movie.runningTime);
    $('actors').update(this.movie.actors);
    $('genre').update(this.movie.genre);
    $('description').update(this.movie.description);
  }
});