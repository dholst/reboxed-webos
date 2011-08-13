BaseGenresAssistant = Class.create(BaseAssistant, {
  initialize: function($super) {
    $super()
    this.genreList = {items: []}
    this.showPreferences = true
  },

  setup: function($super) {
    $super()

    var listAttributes = {
      listTemplate: "genres/genres",
      itemTemplate: "genres/genre",
      renderLimit: 30
    }

    this.controller.setupWidget("genres", listAttributes, this.genreList)
    this.controller.listen("genres", Mojo.Event.listTap, this.genreTapped = this.genreTapped.bind(this))
  },

  cleanup: function($super) {
    $super()
    this.controller.stopListening("genres", Mojo.Event.listTap, this.genreTapped)
  }
})
