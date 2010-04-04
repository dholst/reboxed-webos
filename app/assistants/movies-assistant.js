MoviesAssistant = Class.create(BaseMoviesAssistant, {
  initialize: function() {
    MovieSync.sync();
    this.movieSearchText = {value: ""};
    this.viewMenu = {items: [
      {},
      {items: [
        {label: "All Movies", width: 260, command: "n/a"},
        {label: "Search", iconPath: "images/search.png", command: "search"}
      ]},
      {}
    ]};
  },

  setup: function($super) {
    $super();
    this.setupMenuPanel();
    this.setupWidgets();
    this.setupListeners();
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
    };

    this.controller.setupWidget("movies", listAttributes);
    this.controller.setupWidget(Mojo.Menu.viewMenu, {}, this.viewMenu);
    this.controller.setupWidget("search-text", {changeOnKeyPress: true, hintText: "Movie search..."}, this.movieSearchText);
    this.controller.setupWidget("search-cancel", {}, {buttonClass: "secondary", buttonLabel: "Cancel"});
    this.controller.setupWidget("search-submit", {}, {buttonLabel: "Search"});
  },

  setupListeners: function() {
  	this.dragHandler = this.dragHandler.bind(this);
    this.movieTapped = this.movieTapped.bind(this);
    this.toggleMenuPanel = this.toggleMenuPanel.bind(this);
  	this.searchMovies = this.searchMovies.bind(this);
  	this.searchTextEntry = this.searchTextEntry.bind(this);

    this.controller.listen("movies", Mojo.Event.listTap, this.movieTapped);
  	this.controller.listen(this.scrim, Mojo.Event.tap, this.toggleMenuPanel);
  	this.controller.listen("search-cancel", Mojo.Event.tap, this.toggleMenuPanel);
  	this.controller.listen("search-submit", Mojo.Event.tap, this.searchMovies);
  	this.controller.listen("search-text", Mojo.Event.propertyChange, this.searchTextEntry);
  },

  cleanup: function($super) {
    $super();
    this.controller.stopListening("movies", Mojo.Event.listTap, this.movieTapped);
  	this.controller.stopListening(this.scrim, Mojo.Event.tap, this.toggleMenuPanel);
  	this.controller.stopListening("search-cancel", Mojo.Event.tap, this.toggleMenuPanel);
  	this.controller.stopListening("search-submit", Mojo.Event.tap, this.searchMovies);
  	this.controller.stopListening("search-text", Mojo.Event.propertyChange, this.searchTextEntry);
  },

  activate: function() {
    $("search-text").mojo.setConsumesEnterKey(false);
  },

  searchTextEntry: function(event) {
    if(Mojo.Char.enter === event.originalEvent.keyCode) {
      this.searchMovies();
    }
  },

  divideMovies: function(movie) {
    return movie.releasedDisplay;
  },

  itemsCallback: function(listWidget, offset, count) {
    Movie.paginate(
      offset,
      count,

      function(movies) {
        $("movies").mojo.noticeUpdatedItems(offset, movies);
        Movie.count(function(count){$("movies").mojo.setLength(count)});
      },

      function(message) {
        Mojo.Log.error("damn, database error:", message);
      }
    );
  },

  handleCommand: function($super, event) {
    $super(event);
    
    if (event.type === Mojo.Event.command && event.command === "search") {
      this.toggleMenuPanel();
    }
  },

  searchMovies: function() {
    if(this.movieSearchText.value && this.movieSearchText.value.length) {
      this.controller.stageController.pushScene("search-movies", this.movieSearchText.value);
    }

    this.menuPanelOff();
  },

  menuPanelOn: function($super) {
	  this.movieSearchText.value = "";
	  this.controller.modelChanged(this.movieSearchText);
    $super();
  }
});