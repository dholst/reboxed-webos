SearchMoviesAssistant = Class.create(BaseMoviesAssistant, {
  initialize: function(query) {
    this.query = query;
    this.movies = {items: []};
    this.viewMenu = {items: [
      {},
      {items: [
        {label: "Movie Search: " + this.query, width: 320, command: "n/a"},
      ]},
      {}
    ]};
  },

  setup: function($super) {
    $super();

    var listAttributes = {
      renderLimit: 10,
			listTemplate: "movies/movies",
      itemTemplate: "movies/movie",
      onItemRendered: this.itemRendered.bind(this)
    };

    this.controller.setupWidget("movies", listAttributes, this.movies);
    this.controller.setupWidget(Mojo.Menu.viewMenu, {}, this.viewMenu);
    this.controller.listen("movies", Mojo.Event.listTap, this.movieTapped = this.movieTapped.bind(this));
  },

  ready: function() {
    this.spinnerOn();
    Movie.search(this.query, this.moviesFound.bind(this), this.searchError.bind(this));
  },

  cleanup: function($super) {
    $super();
    this.controller.stopListening("movies", Mojo.Event.listTap, this.movieTapped);
  },

  moviesFound: function(movies) {
    this.spinnerOff();
    this.movies.items.push.apply(this.movies.items, movies);
    this.controller.modelChanged(this.movies);

    if(!movies.length) {
      $("nothing-found").show();
    }
  },

  searchError: function(message) {
    Mojo.Log.error(message);
  }
});
