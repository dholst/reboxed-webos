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
    this.controller.listen("games", Mojo.Event.listTap, this.gameTapped = this.gameTapped.bind(this))
    this.controller.listen("search", Mojo.Event.tap, this.toggleMenuPanel)
  	this.controller.listen("search-cancel", Mojo.Event.tap, this.toggleMenuPanel)
  	this.controller.listen("search-submit", Mojo.Event.tap, this.searchGames = this.searchGames.bind(this))
  	this.controller.listen("search-text", Mojo.Event.propertyChange, this.searchTextEntry = this.searchTextEntry.bind(this))
  },

  cleanup: function($super) {
    $super()
    this.controller.stopListening("switch", Mojo.Event.tap, this.swapScenes)
    this.controller.stopListening("games", Mojo.Event.listTap, this.gameTapped)
    this.controller.stopListening("search", Mojo.Event.tap, this.toggleMenuPanel)
  	this.controller.stopListening("search-cancel", Mojo.Event.tap, this.toggleMenuPanel)
  	this.controller.stopListening("search-submit", Mojo.Event.tap, this.searchGames)
  	this.controller.stopListening("search-text", Mojo.Event.propertyChange, this.searchTextEntry)
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
  },

  gameTapped: function(event) {
    this.controller.stageController.pushScene("game", event.item)
  },

  searchTextEntry: function(event) {
    if(Mojo.Char.enter === event.originalEvent.keyCode) {
      this.searchGames()
    }
  },

  searchGames: function() {
    if(this.searchText.value && this.searchText.value.length) {
      this.controller.stageController.pushScene("search-games", this.searchText.value)
    }

    this.menuPanelOff()
  }
})
