BaseGenresAssistant = Class.create(BaseAssistant, {
  initialize: function() {
    this.genreList = {items: []}
    this.menuTitle = "Genres"
  },

  setup: function($super) {
    $super()

    var listAttributes = {
      listTemplate: "genres/genres",
      itemTemplate: "genres/genre"
    }

    this.controller.setupWidget("genres", listAttributes, this.genreList)
    this.controller.setupWidget(Mojo.Menu.viewMenu, {}, {items: [
      {},
      {items: [
        {label: this.menuTitle, width: 320, command: "menu"},
      ]},
      {}
    ]})

    this.controller.listen("genres", Mojo.Event.listTap, this.genreTapped = this.genreTapped.bind(this))
  },

  cleanup: function($super) {
    $super()
    this.controller.stopListening("genres", Mojo.Event.listTap, this.genreTapped)
  },

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