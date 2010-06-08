GenresAssistant = Class.create(BaseGenresAssistant, {
  ready: function() {
    this.addDownArrowToMenuText()

    Genre.findAll(function(genres) {
      this.genreList.items.push.apply(this.genreList.items, genres)
      this.controller.modelChanged(this.genreList)
    }.bind(this))
  },

  handleCommand: function($super, event) {
    $super(event)

    if("menu" === event.command) {
      this.swapTo(event.originalEvent.target, ["kiosks", "movies"])
    }
  },

  genreTapped: function(event) {
    this.controller.stageController.pushScene("genre-movies", event.item)
  }
})