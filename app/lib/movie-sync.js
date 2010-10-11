MovieSync = Class.create({
  initialize: function(notify) {
    Log.debug("syncing movies")
    this.notify = notify
    this.total_sunk = 0
  },

  sync: function(syncGenres) {
    this.movies_sunk = 0
    this.syncGenres = syncGenres

    Movie.syncDate(function(date) {
      var parameters = {}

      if(date) {
        parameters.since = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear()
      }
      else {
        // parameters.since = "10/01/2010"
      }

      new Ajax.Request("http://reboxed.semicolonapps.com/movies", {
        method: "get",
        parameters: parameters,
        onSuccess: this.syncMovies.bind(this),
        onFailure: this.syncFailure.bind(this),
        onException: this.syncFailure.bind(this)
      })
    }.bind(this))
  },

  syncMovies: function(response) {
    this.syncMovie(response.responseJSON, 0)
  },

  syncMovie: function(movies, index) {
    if(index >= movies.length) {
      if(this.movies_sunk == 0) {
        this.syncComplete()
      }
      else {
        Mojo.Event.send(document, Reboxed.Event.movieSyncProgress, {count: this.movies_sunk})
        this.sync()
      }
    }
    else {
      var syncNext = this.syncMovie.bind(this, movies, index + 1)

      var onSuccess = function() {
        this.movies_sunk++
        this.total_sunk++
        syncNext()
      }.bind(this)

      var onFailure = syncNext

      Movie.fromJson(movies[index]).save(onSuccess, onFailure)
    }
  },

  syncFailure: function(response) {
    Mojo.Event.send(document, Reboxed.Event.movieSyncFailed, {})
  },

  syncComplete: function() {
    Log.debug("found " + this.total_sunk + " new movies")

    if(this.notify && this.total_sunk) {
      Reboxed.notify("new movies available, tap to reload", true)
    }

    if(this.syncGenres) {
      GenreSync.sync()
    }

    Mojo.Event.send(document, Reboxed.Event.movieSyncComplete, {count: this.total_sunk})
  }
})
