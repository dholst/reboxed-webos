MoviesAssistant = Class.create({
  initialize: function() {
    MovieSync.sync();
    this.panelOpen = false;
    this.movieSearchText = {value: ""};
    this.cachedImages = {};
    this.movies = {items: []};

    this.viewMenu = [
      {label: "All Movies", width: 260, command: "n/a"},
      {label: "Search", iconPath: "images/search.png", command: "search"}
    ];
  },

  setup: function() {
    this.setupMenu();
    this.setupMovieList();
    this.setupSearchPanel();
    this.paginate(0, 30);
  },

  setupMenu: function() {
    this.controller.setupWidget(Mojo.Menu.viewMenu, {}, {
      items:[
        {},
        {items: this.viewMenu},
        {}
      ]
    });
  },

  setupMovieList: function() {
    this.controller.setupWidget("all-movies", {
      renderLimit: 10,
      lookahead: 20,
			listTemplate: "movies/movies",
      itemTemplate: "movies/movie",
      onItemRendered: this.itemRendered.bind(this),
      itemsCallback: this.itemsCallback.bind(this),
      dividerTemplate: "movies/divider",
  		dividerFunction: this.divide
    });

    this.controller.setupWidget("movies", {
      renderLimit: 10,
			listTemplate: "movies/movies",
      itemTemplate: "movies/movie",
      onItemRendered: this.itemRendered.bind(this),
      dividerTemplate: "movies/divider",
  		dividerFunction: this.divide
    }, this.movies);

    this.movieTapped = this.movieTapped.bind(this);
    this.controller.listen("movies", Mojo.Event.listTap, this.movieTapped);
    this.controller.listen("all-movies", Mojo.Event.listTap, this.movieTapped);
    this.controller.listen(document, Reboxed.Event.imageCached, this.imageCached = this.imageCached.bind(this));
  },

  setupSearchPanel: function() {
    this.controller.setupWidget("search-text", {hintText: "Movie search..."}, this.movieSearchText);
    this.controller.setupWidget("search-cancel", {}, {buttonClass: "secondary", buttonLabel: "Cancel"});
    this.controller.setupWidget("search-submit", {}, {buttonLabel: "Search"});
    this.controller.setupWidget("search-all", {}, {buttonLabel: "All"});

    this.menuPanel = this.controller.sceneElement.querySelector('div[x-mojo-menupanel]');
  	this.scrim = this.controller.sceneElement.querySelector('div[x-mojo-menupanel-scrim]');

  	this.menuPanelVisibleTop = this.menuPanel.offsetTop;
  	this.menuPanel.style.top = (0 - this.menuPanel.offsetHeight - this.menuPanel.offsetTop)+'px';
  	this.menuPanelHiddenTop = this.menuPanel.offsetTop;

    this.menuPanel.hide();
  	this.scrim.hide();
  	this.scrim.style.opacity = 0;

    this.toggleMenuPanel = this.toggleMenuPanel.bind(this);
  	this.dragHandler = this.dragHandler.bind(this);
  	this.searchMovies = this.searchMovies.bind(this);

  	this.controller.listen(this.scrim, Mojo.Event.tap, this.toggleMenuPanel);
  	this.controller.listen("search-cancel", Mojo.Event.tap, this.toggleMenuPanel);
  	this.controller.listen("search-submit", Mojo.Event.tap, this.searchMovies);
  },

  divide: function(movie) {
    return movie.releasedDisplay;
  },

  cleanup: function() {
    this.controller.stopListening(document, Reboxed.Event.imageCached, this.imageCached);
    this.controller.stopListening("movies", Mojo.Event.listTap, this.movieTapped);
  },

  movieTapped: function(event) {
    this.controller.stageController.pushScene("movie", event.item);
  },

  imageCached: function(event) {
    var img = this.controller.get("img-" + event.movie.id);

    if(img) {
      img.src = "file://" + event.movie.cacheDirectory + "/" + event.movie.image;
    }
  },

  itemRendered: function(listWidget, movie, node) {
    if(!this.cachedImages[movie.id]) {
      this.cachedImages[movie.id] = true;
      movie.cacheImage();
    }
  },

  itemsCallback: function(listWidget, offset, count) {
    Mojo.Log.info("need", count, "more at", offset);
    this.paginate(offset, count);
  },

  paginate: function(offset, count) {
    Movie.paginate(offset, count, this.moviesFound.bind(this, offset), this.findError.bind(this));
  },

  moviesFound: function(offset, movies) {
    $("all-movies").mojo.noticeUpdatedItems(offset, movies);
    Movie.count(function(count){$("all-movies").mojo.setLength(count)}.bind(this));
  },

  searchMoviesFound: function(movies) {
    this.movies.items.clear();
    this.movies.items.push.apply(this.movies.items, movies);
    this.hideAllMovies();
    this.controller.modelChanged(this.movies);
    this.menuPanelOff();
  },

  findError: function() {
    Mojo.Log.error("paginate error");
  },

  handleCommand: function(event) {
    if (event.type === Mojo.Event.command) {
      switch (event.command) {
        case "search":
          this.toggleMenuPanel();
          break;
      }
    }
  },

  searchMovies: function() {
    if(this.movieSearchText.value && this.movieSearchText.value.length > 0) {
      Movie.search(this.movieSearchText.value, this.searchMoviesFound.bind(this), this.findError.bind(this));
    }
    else {
      this.menuPanelOff();
      this.showAllMovies();
    }
  },

  hideAllMovies: function() {
    $("all-movies").hide();
    $("movies").show();
  },

  showAllMovies: function() {
    $("all-movies").show();
    $("movies").hide();
  },

	animateMenuPanel : function(panel, reverse, callback){
		Mojo.Animation.animateStyle(panel, 'top', 'bezier', {
			from: this.menuPanelHiddenTop,
			to: this.menuPanelVisibleTop,
			duration: 0.12,
			curve: 'over-easy',
			reverse: reverse,
			onComplete: callback
		});
	},

	menuPanelOn : function(){
		this.panelOpen = true;
		this.scrim.style.opacity = 0;
		this.scrim.show();
		this.disableSceneScroller();

		Mojo.Animation.Scrim.animate(this.scrim, 0, 1, function() {
		  this.menuPanel.show();
			this.animateMenuPanel(this.menuPanel, false, Mojo.doNothing);
		}.bind(this));
	},

	menuPanelOff :function(){
		this.panelOpen = false;
		this.enableSceneScroller();
		this.animateMenuPanel(this.menuPanel, true, function() {
			this.menuPanel.hide();
			Mojo.Animation.Scrim.animate(this.scrim, 1, 0, this.scrim.hide.bind(this.scrim));
		}.bind(this));
	},

	toggleMenuPanel: function(e){
	  this[this.panelOpen ? "menuPanelOff" : "menuPanelOn"]()
	},

  disableSceneScroller : function() {
		this.controller.listen(this.controller.sceneElement, Mojo.Event.dragStart, this.dragHandler);
	},

	dragHandler: function(event) {
		event.stop(); //prevents the scene from scrolling.
	},

	enableSceneScroller : function() {
		this.controller.stopListening(this.controller.sceneElement, Mojo.Event.dragStart, this.dragHandler);
	}
});