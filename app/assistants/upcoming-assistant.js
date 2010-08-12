var UpcomingAssistant = Class.create(BaseMoviesAssistant, {
  initialize: function($super) {
    $super()
    this.movieList = {items: []}
  },

  setup: function($super) {
    $super()

    var listAttributes = {
			listTemplate: "movies/movies",
      itemTemplate: "movies/movie",
      onItemRendered: this.itemRendered.bind(this),
      dividerTemplate: "movies/divider",
  		dividerFunction: this.divideMovies
    }

    this.controller.setupWidget("movies", listAttributes, this.movieList)
    this.controller.listen("movies", Mojo.Event.listTap, this.movieTapped = this.movieTapped.bind(this))
    this.controller.listen("switch", Mojo.Event.tap, this.swapScene = this.swapScene.bind(this))
  },

  cleanup: function($super) {
    $super()
    this.controller.stopListening("movies", Mojo.Event.listTap, this.movieTapped)
    this.controller.stopListening("switch", Mojo.Event.tap, this.swapScene)
  },

  ready: function() {
    Movie.findUpcoming(function(movies) {
      this.movieList.items.push.apply(this.movieList.items, movies)
      this.controller.modelChanged(this.movieList)
    }.bind(this))
  },

  activate: function(reload) {
    if(reload) {
      this.controller.stageController.swapScene('upcoming')
    }
  },
  
  swapScene: function() {
    this.swapTo(["movies", "kiosks", "genres"])
  },

  movieTapped: function(event) {
    this.controller.stageController.pushScene("movie", event.item)
  },
})