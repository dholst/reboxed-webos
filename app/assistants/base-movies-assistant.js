BaseMoviesAssistant = Class.create(BaseAssistant, {
  initialize: function($super) {
    $super()
    this.showPreferences = true
  },

  setup: function($super) {
    $super()
    this.imageCached = this.imageCached.bind(this)
    this.controller.listen(document, Reboxed.Event.imageCached, this.imageCached)
  },

  cleanup: function() {
    this.controller.stopListening(document, Reboxed.Event.imageCached, this.imageCached)
  },

  imageCached: function(event) {
    var img = this.controller.get("img-" + event.movie.id)

    if(img) {
      img.src = "file://" + event.movie.cacheDirectory + "/" + event.movie.image
    }
  },

  itemRendered: function(listWidget, movie, node) {
    if(!BaseMoviesAssistant.CACHED_IMAGES[movie.id]) {
      BaseMoviesAssistant.CACHED_IMAGES[movie.id] = true
      movie.cacheImage()
    }
  },

  movieTapped: function(event) {
    if(this.wasMovieImageTapped(event)) {
      this.controller.stageController.pushScene("movie", event.item, this.kiosk)
    }
    else {
      this.movieTappedPopup(event)
    }
  },

  wasMovieImageTapped: function(event) {
    return event.originalEvent.target.tagName.toLowerCase() == 'img'
  },

  movieTappedPopup: function(event) {
    var popupItems = [{label: "Details", command: "details"}]

    if(this.kiosk) {
      popupItems.push({label: "Reserve", command: "reserve"})
    }
    else {
      popupItems.push({label: "Locate", command: "locate"})
    }

    var onChoose = function(movie, command) {
      if("details" === command) {
        this.controller.stageController.pushScene("movie", movie, this.kiosk)
      }
      else if("locate" === command) {
        this.controller.stageController.pushScene("locate-movie", movie)
      }
      else if("reserve" === command) {
        this.controller.stageController.pushScene("reserve-movie", this.kiosk, movie, this.currentScene())
      }
    }.bind(this)

    this.controller.popupSubmenu({
      onChoose: onChoose.bind(this, event.item),
      placeNear: event.originalEvent.target,
      items: popupItems
    })
  },
  
  divideMovies: function(movie) {
    return movie.releasedDisplay
  }  
})

BaseMoviesAssistant.CACHED_IMAGES = {}
