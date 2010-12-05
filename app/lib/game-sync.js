GameSync = Class.create({
  initialize: function(notify) {
    Log.debug("syncing games")
    this.notify = notify
    this.total_synced = 0
  },

  sync: function() {
    this.games_synced = 0

    Game.syncDate(function(date) {
      var parameters = {}

      if(date) {
        parameters.since = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear()
      }
      else {
        //parameters.since = "11/01/2010"
      }

      new Ajax.Request("http://reboxed.semicolonapps.com/games", {
        method: "get",
        parameters: parameters,
        onSuccess: this.syncGames.bind(this),
        onFailure: this.syncFailure.bind(this),
        onException: this.syncFailure.bind(this)
      })
    }.bind(this))
  },

  syncGames: function(response) {
    this.syncGame(response.responseJSON, 0)
  },

  syncGame: function(games, index) {
    if(index >= games.length) {
      if(this.games_synced == 0) {
        this.syncComplete()
      }
      else {
        Mojo.Event.send(document, Reboxed.Event.gameSyncProgress, {count: this.games_synced})
        this.sync()
      }
    }
    else {
      var syncNext = this.syncGame.bind(this, games, index + 1)

      var onSuccess = function() {
        this.games_synced++
        this.total_synced++
        syncNext()
      }.bind(this)

      var onFailure = syncNext

      Game.fromJson(games[index]).save(onSuccess, onFailure)
    }
  },

  syncFailure: function(response) {
    Mojo.Event.send(document, Reboxed.Event.gameSyncFailed, {})
  },

  syncComplete: function() {
    Log.debug("found " + this.total_synced + " new games")
    Mojo.Event.send(document, Reboxed.Event.gameSyncComplete, {count: this.total_synced})
  }
})
