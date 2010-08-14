FullSyncAssistant = Class.create(BaseAssistant, {
  setup: function($super) {
    $super()
    this.noAppMenu()
  },

  ready: function() {
    this.progress = {value: 0}
    this.controller.setupWidget("progress", {}, this.progress)
    this.spinnerOn("seeding movies, please wait...")
    $("spinner-message").insert({after: '<div id="progress-container"><div style="width: 65%; margin: auto;" id="progress" x-mojo-element="ProgressBar"></div></div>'})
    this.controller.instantiateChildWidgets($("progress-container"))

    new Ajax.Request("http://reboxed.semicolonapps.com/meta", {
      method: "get",
      onSuccess: this.sync.bind(this),
      onFailure: this.syncFailed.bind(this)
    })
  },

  sync: function(response) {
    this.moviesSynced = 0
    this.moviesTotal = response.responseJSON.movies.count
    this.listen()
    new MovieSync(false).sync()
  },

  listen: function() {
    this.controller.listen(document, Reboxed.Event.movieSyncProgress, this.syncProgress = this.syncProgress.bind(this))
    this.controller.listen(document, Reboxed.Event.movieSyncComplete, this.syncComplete = this.syncComplete.bind(this))
    this.controller.listen(document, Reboxed.Event.movieSyncFailed, this.syncFailed = this.syncFailed.bind(this))
    this.controller.listen(document, Reboxed.Event.genreSeedProgress, this.seedProgress = this.seedProgress.bind(this))
    this.controller.listen(document, Reboxed.Event.genreSeedFailed, this.seedFailed = this.seedFailed.bind(this))
    this.controller.listen(document, Reboxed.Event.genreSeedComplete, this.seedComplete = this.seedComplete.bind(this))
  },

  stopListening: function() {
    this.controller.stopListening(document, Reboxed.Event.movieSyncProgress, this.syncProgress)
    this.controller.stopListening(document, Reboxed.Event.movieSyncComplete, this.syncComplete)
    this.controller.stopListening(document, Reboxed.Event.movieSyncFailed, this.syncFailed)
    this.controller.stopListening(document, Reboxed.Event.genreSeedProgress, this.seedProgress)
    this.controller.stopListening(document, Reboxed.Event.genreSeedFailed, this.seedFailed)
    this.controller.stopListening(document, Reboxed.Event.genreSeedComplete, this.seedComplete)
  },

  syncProgress: function(event) {
    this.moviesSynced += (event.count || 0)
    this.updateProgress(this.moviesSynced / this.moviesTotal)
  },

  syncFailed: function() {
    this.stopListening()
    this.controller.stageController.swapScene("bail", "sync failed", "full-sync")
  },

  syncComplete: function() {
    new Mojo.Model.Cookie("fullSyncComplete").put(true)
    this.spinnerOn("seeding genres, please wait...")
    Genres.seed()
  },

  seedProgress: function(event) {
    this.updateProgress(event.complete / event.total)
  },

  seedFailed: function() {
    this.nextScene()
  },

  seedComplete: function() {
    this.nextScene()
  },

  updateProgress: function(value) {
    this.progress.value = value
    this.controller.modelChanged(this.progress)
  },

  nextScene: function() {
    this.stopListening()
    this.controller.stageController.swapScene("movies")
  }
})
