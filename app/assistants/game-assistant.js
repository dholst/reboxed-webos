var GameAssistant = Class.create(BaseAssistant, {
  initialize: function(game) {
    this.game = game
  },

  setup: function($super) {
    $super()
    this.controller.update("header", this.game.name)
    this.update("content", Mojo.View.render({object: this.game, template: "game/game"}))
    this.controller.listen(document, Reboxed.Event.imageCached, this.imageCached = this.imageCached.bind(this))
  },

  cleanup: function($super) {
    this.controller.stopListening(document, Reboxed.Event.imageCached, this.imageCached)
  },

  imageCached: function(event) {
    var img = this.controller.get("img-" + event.movie.id)

    if(img) {
      img.src = "file://" + event.movie.cacheDirectory + "/" + event.movie.image
    }
  }
})
