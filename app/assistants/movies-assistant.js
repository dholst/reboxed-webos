MoviesAssistant = Class.create(BaseMoviesAssistant, {
  initialize: function($super) {
    $super()
    this.movieSearchText = {value: ""}
  },

  setup: function($super) {
    $super()
    this.setupWidgets()
    this.setupListeners()

    Reboxed.Metrix.checkBulletinBoard(this.controller, 67)
  },

  ready: function() {
    this.spinnerOn("retrieving movies...")
  },

  setupWidgets: function() {
    var listAttributes = {
      renderLimit: 10,
      lookahead: 20,
			listTemplate: "movies/movies",
      itemTemplate: "movies/movie",
      onItemRendered: this.itemRendered.bind(this),
      itemsCallback: this.itemsCallback.bind(this),
      dividerTemplate: "movies/divider",
  		dividerFunction: this.divideMovies
    }

    this.controller.setupWidget("movies", listAttributes)
    this.controller.setupWidget("search-text", {changeOnKeyPress: true, hintText: "Movie search..."}, this.movieSearchText)
    this.controller.setupWidget("search-cancel", {}, {buttonClass: "secondary", buttonLabel: "Cancel"})
    this.controller.setupWidget("search-submit", {}, {buttonLabel: "Search"})
  },

  setupListeners: function() {
  	this.dragHandler = this.dragHandler.bind(this)
    this.movieTapped = this.movieTapped.bind(this)
  	this.searchMovies = this.searchMovies.bind(this)
  	this.searchTextEntry = this.searchTextEntry.bind(this)
    this.swapScenes = this.swapScenes.bind(this)

    this.controller.listen("movies", Mojo.Event.listTap, this.movieTapped)
    this.controller.listen("switch", Mojo.Event.tap, this.swapScenes)
    this.controller.listen("search", Mojo.Event.tap, this.toggleMenuPanel)
  	this.controller.listen("search-cancel", Mojo.Event.tap, this.toggleMenuPanel)
  	this.controller.listen("search-submit", Mojo.Event.tap, this.searchMovies)
  	this.controller.listen("search-text", Mojo.Event.propertyChange, this.searchTextEntry)
  },

  cleanup: function($super) {
    $super()
    this.controller.stopListening("movies", Mojo.Event.listTap, this.movieTapped)
    this.controller.stopListening("switch", Mojo.Event.tap, this.swapScenes)
    this.controller.stopListening("search", Mojo.Event.tap, this.toggleMenuPanel)
  	this.controller.stopListening("search-cancel", Mojo.Event.tap, this.toggleMenuPanel)
  	this.controller.stopListening("search-submit", Mojo.Event.tap, this.searchMovies)
  	this.controller.stopListening("search-text", Mojo.Event.propertyChange, this.searchTextEntry)
  },

  activate: function($super, reload) {
    $("search-text").mojo.setConsumesEnterKey(false)

    $super(reload)

    if(true == reload) {
      this.refresh()
    }
  },

  refresh: function() {
    this.controller.stageController.swapScene("movies")
  },

  searchTextEntry: function(event) {
    if(Mojo.Char.enter === event.originalEvent.keyCode) {
      this.searchMovies()
    }
  },

  itemsCallback: function(listWidget, offset, count) {
    Log.debug("Getting " + count + " movies at offset " + offset)
    Movie.paginate(
      offset,
      count,

      function(movies) {
        $("movies").mojo.noticeUpdatedItems(offset, movies)
        Movie.count(function(count){$("movies").mojo.setLength(count)})
        this.spinnerOff()
      }.bind(this),

      function(message) {
        Mojo.Log.error("damn, database error:", message)
      }
    )
  },

  swapScenes: function() {
    this.swapTo(["kiosks", "genres", "games", "upcoming"])
  },

  searchMovies: function() {
    if(this.movieSearchText.value && this.movieSearchText.value.length) {
      this.controller.stageController.pushScene("search-movies", this.movieSearchText.value)
    }

    this.menuPanelOff()
  }
})
