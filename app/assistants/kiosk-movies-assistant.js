KioskMoviesAssistant = Class.create(BaseMoviesAssistant, {
  initialize: function(kiosk) {
    this.kiosk = kiosk;
    this.movieList = {items: []};
    this.movieSearchText = {value: ""};
  },

  setup: function($super) {
    $super();
    this.setupWidgets();
    this.setupListeners();
  },

  setupWidgets: function() {
    var listAttributes = {
			listTemplate: "movies/movies",
      itemTemplate: "movies/movie",
      onItemRendered: this.itemRendered.bind(this),
      dividerTemplate: "movies/divider",
  		dividerFunction: this.divideMovies
    };

    var viewMenu = {items: [
      {},
      {items: [
        {label: this.kiosk.vendor, width: 260, command: "n/a"},
        {label: "Search", iconPath: "images/search.png", command: "search"}
      ]},
      {}
    ]};

    this.controller.setupWidget("movies", listAttributes, this.movieList);
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
    this.spinnerOn("retrieving kiosk inventory");
    this.kiosk.loadInventory(this.inventorySuccess.bind(this), this.inventoryFailure.bind(this));
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

  inventorySuccess: function() {
    this.movieList.items.push.apply(this.movieList.items, this.kiosk.movies);
    this.controller.modelChanged(this.movieList);
    this.spinnerOff();
  },

  inventoryFailure: function() {
    this.spinnerOff();
    this.controller.get("inventory-failure").show();
  },

  searchTextEntry: function(event) {
    if(Mojo.Char.enter === event.originalEvent.keyCode) {
      this.searchMovies();
    }
  },

  divideMovies: function(movie) {
    return movie.releasedDisplay;
  },

  handleCommand: function($super, event) {
    $super(event);

    if("search" === event.command && this.kiosk.movies && this.kiosk.movies.length) {
      this.toggleMenuPanel();
    }
  },

  searchMovies: function() {
    if(this.movieSearchText.value && this.movieSearchText.value.length) {
      this.controller.stageController.pushScene("search-movies", this.movieSearchText.value, this.kiosk.movies);
    }

    this.menuPanelOff();
  },

  menuPanelOn: function($super) {
	  this.movieSearchText.value = "";
	  this.controller.modelChanged(this.movieSearchText);
    $super("search-text");
  }
});