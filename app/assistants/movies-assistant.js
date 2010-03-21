MoviesAssistant = Class.create({
  initialize: function() {
    this.movies = {items: []};
  },

  setup: function() {
    var listAttributes = {
      itemCallback: this.moreMovies.bind(this),
      lookahead: 10,
      itemTemplate: "movies/movie"
    };

    this.controller.setupWidget("movies", listAttributes, this.movies);
  },

  moreMovies: function(widget, offset, count) {
    console.log("offset: " + offset + ", count: " + count);
  }
});