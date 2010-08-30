MovieAssistant = Class.create(BaseAssistant, {
  initialize: function($super, movie, kiosk) {
    $super()
    this.movie = movie
    this.kiosk = kiosk
    this.locateText = {value: ""}
//
//    var button
//
//    if(this.kiosk) {
//      button = {label: "Reserve", iconPath: "images/reserve.png", command: "reserve"}
//    }
//    else {
//      button = {label: "Locate", iconPath: "images/compass.png", command: "locate"}
//    }
//
//    this.viewMenu = {items: [
//      {},
//      {items: [
//        {label: movie.name, width: 260, command: "n/a"},
//        button
//      ]},
//      {}
//    ]}
  },

  setup: function($super) {
    $super()

    this.controller.update('header', this.movie.name)

    this.icon = this.controller.get('icon-placeholder')

    if(this.kiosk) {
      this.icon.id = "reserve"
    }
    else {
      this.icon.id = "locate"
    }

    this.update("content", Mojo.View.render({object: this.movie, template: "movie/movie"}))

    this.controller.setupWidget("locate-text", {changeOnKeyPress: true, hintText: "Use current location..."}, this.locateText)
    this.controller.setupWidget("locate-cancel", {}, {buttonClass: "secondary", buttonLabel: "Cancel"})
    this.controller.setupWidget("locate-submit", {}, {buttonLabel: "Locate"})

    this.imageCached = this.imageCached.bind(this)
    this.locateMovie = this.locateMovie.bind(this)
    this.locateTextEntry = this.locateTextEntry.bind(this)

    this.controller.listen(document, Reboxed.Event.imageCached, this.imageCached)
  	this.controller.listen("locate-cancel", Mojo.Event.tap, this.toggleMenuPanel)
  	this.controller.listen("locate-submit", Mojo.Event.tap, this.locateMovie)
  	this.controller.listen("locate-text", Mojo.Event.propertyChange, this.locateTextEntry)

    if(this.icon.id == "locate") {
      this.controller.listen("locate", Mojo.Event.tap, this.toggleMenuPanel)
    }
    else {
      this.controller.listen("reserve", Mojo.Event.tap, this.reserve = this.reserve.bind(this))
    }
  },

  activate: function($super, reload) {
    $("locate-text").mojo.setConsumesEnterKey(false)
    $super(reload)
  },

  cleanup: function() {
    this.controller.stopListening(document, Reboxed.Event.imageCached, this.imageCached)
  	this.controller.stopListening("locate-cancel", Mojo.Event.tap, this.toggleMenuPanel)
  	this.controller.stopListening("locate-submit", Mojo.Event.tap, this.locateMovie)
  	this.controller.stopListening("locate-text", Mojo.Event.propertyChange, this.locateTextEntry)

    if(this.icon.id == "locate") {
      this.controller.stopListening("locate", Mojo.Event.tap, this.toggleMenuPanel)
    }
    else {
      this.controller.stopListening("reserve", Mojo.Event.tap, this.reserve)
    }  },

  locateTextEntry: function(event) {
    if(Mojo.Char.enter === event.originalEvent.keyCode) {
      this.locateMovie()
    }
  },

  reserve: function() {
    this.controller.stageController.pushScene("reserve-movie", this.kiosk, this.movie)
  },
  
  locateMovie: function() {
    this.controller.stageController.pushScene("locate-movie", this.movie, this.locateText.value)
    this.menuPanelOff()
  },

  imageCached: function(event) {
    var img = this.controller.get("img-" + event.movie.id)

    if(img) {
      img.src = "file://" + event.movie.cacheDirectory + "/" + event.movie.image
    }
  },

  menuPanelOn: function($super){
    $super("locate-text")
	}
})