var SearchGamesAssistant = Class.create(BaseMoviesAssistant, {
  initialize: function($super, query) {
    $super()
    this.query = query
    this.games = {items: []}
  },

  setup: function($super) {
    $super()

    var listAttributes = {
      renderLimit: 10,
      listTemplate: "games/games",
      itemTemplate: "games/game",
      onItemRendered: this.itemRendered.bind(this)
    }

    this.controller.setupWidget("games", listAttributes, this.games)
    this.controller.listen("games", Mojo.Event.listTap, this.gameTapped = this.gameTapped.bind(this))
    this.controller.update("header", "Search: " + this.query)
  },

  cleanup: function($super) {
    $super()
    this.controller.stopListening("games", Mojo.Event.listTap, this.gameTapped)
  },

  ready: function() {
    this.spinnerOn()
    this.searchAllGames()
  },

  searchAllGames: function() {
    Game.search(this.query, this.gamesFound.bind(this), this.searchError.bind(this))
  },

  gamesFound: function(games) {
    this.spinnerOff()
    this.games.items.push.apply(this.games.items, games)
    this.controller.modelChanged(this.games)

    if(!games.length) {
      $("nothing-found").show()
    }
  },

  searchError: function(message) {
    Log.debug(message)
  }
})
