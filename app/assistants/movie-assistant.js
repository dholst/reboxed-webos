MovieAssistant = Class.create(BaseAssistant, {
  initialize: function(movie) {
    this.movie = movie;
    this.locateText = {value: ""};
    this.viewMenu = {items: [
      {},
      {items: [
        {label: movie.name, width: 260, command: "n/a"},
        {label: "Locate", iconPath: "images/compass.png", command: "locate"}
      ]},
      {}
    ]};
  },

  setup: function($super) {
    $super();
    this.setupMenuPanel();
    this.update("content", Mojo.View.render({object: this.movie, template: "movie/movie"}));

    this.controller.setupWidget(Mojo.Menu.viewMenu, {}, this.viewMenu);
    this.controller.setupWidget("locate-text", {changeOnKeyPress: true, hintText: "Use current location..."}, this.locateText);
    this.controller.setupWidget("locate-cancel", {}, {buttonClass: "secondary", buttonLabel: "Cancel"});
    this.controller.setupWidget("locate-submit", {}, {buttonLabel: "Locate"});

    this.imageCached = this.imageCached.bind(this)
    this.toggleMenuPanel = this.toggleMenuPanel.bind(this);
    this.locateMovie = this.locateMovie.bind(this);
    this.locateTextEntry = this.locateTextEntry.bind(this);

    this.controller.listen(document, Reboxed.Event.imageCached, this.imageCached);
    this.controller.listen(this.scrim, Mojo.Event.tap, this.toggleMenuPanel);
  	this.controller.listen("locate-cancel", Mojo.Event.tap, this.toggleMenuPanel);
  	this.controller.listen("locate-submit", Mojo.Event.tap, this.locateMovie);
  	this.controller.listen("locate-text", Mojo.Event.propertyChange, this.locateTextEntry);
  },

  activate: function(cart) {
    $("locate-text").mojo.setConsumesEnterKey(false);

    if(cart) {
      this.controller.stageController.swapScene("reserved-movie", cart);
    }
  },

  cleanup: function() {
    this.controller.stopListening(document, Reboxed.Event.imageCached, this.imageCached);
    this.controller.stopListening(this.scrim, Mojo.Event.tap, this.toggleMenuPanel);
  	this.controller.stopListening("locate-cancel", Mojo.Event.tap, this.toggleMenuPanel);
  	this.controller.stopListening("locate-submit", Mojo.Event.tap, this.locateMovie);
  	this.controller.stopListening("locate-text", Mojo.Event.propertyChange, this.locateTextEntry);
  },

  locateTextEntry: function(event) {
    if(Mojo.Char.enter === event.originalEvent.keyCode) {
      this.locateMovie();
    }
  },

  handleCommand: function($super, event) {
    $super(event);
    
    if("locate" === event.command) {
      this.toggleMenuPanel();
    }
  },

  locateMovie: function() {
    this.controller.stageController.pushScene("locate-movie", this.movie, this.locateText.value);
    this.menuPanelOff();
  },

  imageCached: function(event) {
    var img = this.controller.get("img-" + event.movie.id);

    if(img) {
      img.src = "file://" + event.movie.cacheDirectory + "/" + event.movie.image;
    }
  }
});