MoviesAssistant = Class.create({
  initialize: function() {
    this.movies = {items: []};
  },

  setup: function() {
    this.controller.setupWidget('movies', {itemTemplate: 'movies/movie'}, this.movies);
    Movie.findAll(this.moviesFound.bind(this), function(){});
  },

  moviesFound: function(movies) {
    this.movies.items.clear();

    for(var i = 0; i < 10 && i < movies.length; i++) {
      this.movies.items.push(movies[i]);
    }

    this.controller.modelChanged(this.movies);
  }
});