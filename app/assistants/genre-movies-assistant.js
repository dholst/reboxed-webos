GenreMoviesAssistant = Class.create(BaseMoviesAssistant, {
  initialize: function(genre, kiosk) {
    this.genre = genre
    this.kiosk = kiosk
    this.movies = []
    this.movieList = {items: []}
    this.movieSearchText = {value: ""}
    this.menuTitle = genre.name

    if(kiosk) {
      this.menuTitle = kiosk.vendor + ": " + this.menuTitle
    }
  },

  setup: function($super) {
    $super()
    this.setupWidgets()
    this.setupListeners()
  },

  setupWidgets: function() {
    var listAttributes = {
			listTemplate: "movies/movies",
      itemTemplate: "movies/movie",
      onItemRendered: this.itemRendered.bind(this),
      dividerTemplate: "movies/divider",
  		dividerFunction: this.divideMovies
    }

    var viewMenu = {items: [
      {},
      {items: [
        {label: this.menuTitle, width: 260, command: "n/a"},
        {label: "Search", iconPath: "images/search.png", command: "search"}
      ]},
      {}
    ]}

    this.controller.setupWidget("movies", listAttributes, this.movieList)
    this.controller.setupWidget(Mojo.Menu.viewMenu, {}, viewMenu)
    this.controller.setupWidget("search-text", {changeOnKeyPress: true, hintText: "Movie search..."}, this.movieSearchText)
    this.controller.setupWidget("search-cancel", {}, {buttonClass: "secondary", buttonLabel: "Cancel"})
    this.controller.setupWidget("search-submit", {}, {buttonLabel: "Search"})
  },

  setupListeners: function() {
  	this.dragHandler = this.dragHandler.bind(this)
    this.movieTapped = this.movieTapped.bind(this)
  	this.searchMovies = this.searchMovies.bind(this)
  	this.searchTextEntry = this.searchTextEntry.bind(this)

    this.controller.listen("movies", Mojo.Event.listTap, this.movieTapped)
  	this.controller.listen("search-cancel", Mojo.Event.tap, this.toggleMenuPanel)
  	this.controller.listen("search-submit", Mojo.Event.tap, this.searchMovies)
  	this.controller.listen("search-text", Mojo.Event.propertyChange, this.searchTextEntry)
  },

  ready: function() {
    Movie.findAllForGenre(this.genre, this.findSuccess.bind(this), this.findFailure.bind(this))
  },

  cleanup: function($super) {
    $super()
    this.controller.stopListening("movies", Mojo.Event.listTap, this.movieTapped)
  	this.controller.stopListening("search-cancel", Mojo.Event.tap, this.toggleMenuPanel)
  	this.controller.stopListening("search-submit", Mojo.Event.tap, this.searchMovies)
  	this.controller.stopListening("search-text", Mojo.Event.propertyChange, this.searchTextEntry)
  },

  activate: function() {
    $("search-text").mojo.setConsumesEnterKey(false)
  },

  findSuccess: function(movies) {
    this.movies.clear()

    movies.each(function(movie) {
      if(this.kiosk) {
        if(this.kiosk.movies.any(function(kioskMovie) {return kioskMovie.id === movie.id})) {
          this.movies.push(movie)
        }
      }
      else {
        this.movies.push(movie)
      }
    }.bind(this))

    this.movieList.items.push.apply(this.movieList.items, this.movies)
    this.controller.modelChanged(this.movieList)

    if(this.movies.length == 0) {
      this.controller.get("nothing-found").show()
    }
  },

  findFailure: function() {
  },

  searchTextEntry: function(event) {
    if(Mojo.Char.enter === event.originalEvent.keyCode) {
      this.searchMovies()
    }
  },

  divideMovies: function(movie) {
    return movie.releasedDisplay
  },

  handleCommand: function($super, event) {
    $super(event)

    if("search" === event.command && this.movies && this.movies.length) {
      this.toggleMenuPanel()
    }
  },

  searchMovies: function() {
    if(this.movieSearchText.value && this.movieSearchText.value.length) {
      this.controller.stageController.pushScene("search-movies", this.movieSearchText.value, this.movies, this.kiosk)
    }

    this.menuPanelOff()
  },

  menuPanelOn: function($super) {
	  this.movieSearchText.value = ""
	  this.controller.modelChanged(this.movieSearchText)
    $super("search-text")
  }
})