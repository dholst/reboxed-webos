BaseGenresAssistant = Class.create(BaseAssistant, {
  initialize: function() {
    this.genreList = {items: []}
  },

  setup: function($super) {
    $super()

    var listAttributes = {
      listTemplate: "genres/genres",
      itemTemplate: "genres/genre"
    }

    this.controller.setupWidget("genres", listAttributes, this.genreList)
    this.controller.listen("genres", Mojo.Event.listTap, this.genreTapped = this.genreTapped.bind(this))
  },

  cleanup: function($super) {
    $super()
    this.controller.stopListening("genres", Mojo.Event.listTap, this.genreTapped)
  }
})