GenresAssistant = Class.create(BaseGenresAssistant, {
  setup: function($super) {
    $super()
    this.controller.listen("switch", Mojo.Event.tap, this.swapScene = this.swapScene.bind(this))
  },

  cleanup: function($super) {
    $super()
    this.controller.stopListening("switch", Mojo.Event.tap, this.swapScene)
  },

  ready: function() {
    Genre.findAll(function(genres) {
      this.genreList.items.push.apply(this.genreList.items, genres)
      this.controller.modelChanged(this.genreList)
    }.bind(this))
  },

  swapScene: function() {
    this.swapTo(["movies", "kiosks", "upcoming"])
  },

  genreTapped: function(event) {
    this.controller.stageController.pushScene("genre-movies", event.item)
  }
})