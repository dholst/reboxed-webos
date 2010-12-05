var GamesAssistant = Class.create(BaseMoviesAssistant, {
  initialize: function($super) {
    $super()
    this.searchText = {value: ""}
  },

  setup: function($super) {
    $super()
    this.setupWidgets()
    this.setupListeners()
  },

  ready: function() {
    this.spinnerOn("retrieving games...")
  },

  setupWidgets: function() {
    var listAttributes = {
      renderLimit: 10,
      lookahead: 20,
      listTemplate: "games/games",
      itemTemplate: "games/game",
      onItemRendered: this.itemRendered.bind(this),
      itemsCallback: this.itemsCallback.bind(this),
      dividerTemplate: "games/divider",
      dividerFunction: this.divideGames
    }

    this.controller.setupWidget("games", listAttributes)
    this.controller.setupWidget("search-text", {changeOnKeyPress: true, hintText: "Game search..."}, this.searchText)
    this.controller.setupWidget("search-cancel", {}, {buttonClass: "secondary", buttonLabel: "Cancel"})
    this.controller.setupWidget("search-submit", {}, {buttonLabel: "Search"})
  },

  setupListeners: function() {
    this.controller.listen("switch", Mojo.Event.tap, this.swapScenes = this.swapScenes.bind(this))
  },

  cleanup: function($super) {
    $super()
    this.controller.stopListening("switch", Mojo.Event.tap, this.swapScenes)
  },

  activate: function($super, reload) {
    $super(reload)
    $("search-text").mojo.setConsumesEnterKey(false)
  },

  itemsCallback: function(listWidget, offset, count) {
    Log.debug("Getting " + count + " games at offset " + offset)
    Game.paginate(
      offset,
      count,

      function(games) {
        $("games").mojo.noticeUpdatedItems(offset, games)
        Game.count(function(count){$("games").mojo.setLength(count)})
        this.spinnerOff()
      }.bind(this),

      function(message) {
        Mojo.Log.error("damn, database error:", message)
      }
    )
  },

  swapScenes: function() {
    this.swapTo(["movies", "kiosks", "genres", "upcoming"])
  },

  divideGames: function(movie) {
    return movie.releasedDisplay
  }
})
