MoviesAssistant = Class.create(BaseMoviesAssistant, {
  initialize: function() {
    this.movieSearchText = {value: ""};
  },

  setup: function($super) {
    $super();
    this.setupWidgets();
    this.setupListeners();

    Reboxed.Metrix.checkBulletinBoard(this.controller);
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

    var viewMenu = {items: [
      {},
      {items: [
        {label: "Movies", width: 260, command: "kiosks"},
        {label: "Search", iconPath: "images/search.png", command: "search"}
      ]},
      {}
    ]};

    this.controller.setupWidget("movies", listAttributes);
    this.controller.setupWidget(Mojo.Menu.viewMenu, {}, viewMenu);
    this.controller.setupWidget("search-text", {changeOnKeyPress: true, hintText: "Movie search..."}, this.movieSearchText);
    this.controller.setupWidget("search-cancel", {}, {buttonClass: "secondary", buttonLabel: "Cancel"});
    this.controller.setupWidget("search-submit", {}, {buttonLabel: "Search"});
  },

  setupListeners: function() {
  	this.dragHandler = this.dragHandler.bind(this);
    this.movieTapped = this.movieTapped.bind(this);
  	this.searchMovies = this.searchMovies.bind(this);
  	this.searchTextEntry = this.searchTextEntry.bind(this);

    this.controller.listen("movies", Mojo.Event.listTap, this.movieTapped);
  	this.controller.listen("search-cancel", Mojo.Event.tap, this.toggleMenuPanel);
  	this.controller.listen("search-submit", Mojo.Event.tap, this.searchMovies);
  	this.controller.listen("search-text", Mojo.Event.propertyChange, this.searchTextEntry);
  },

  ready: function() {
    this.addDownArrowToMenuText();
  },

  cleanup: function($super) {
    $super();
    this.controller.stopListening("movies", Mojo.Event.listTap, this.movieTapped);
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

    if("search" === event.command) {
      this.toggleMenuPanel();
    }
    else if("kiosks" === event.command) {
      this.swapTo(event.originalEvent.target, ["genres", "kiosks"]);
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
    $super("search-text");
  }
});