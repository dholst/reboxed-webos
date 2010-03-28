FullSyncAssistant = Class.create(BaseAssistant, {
  ready: function() {
    this.progress = {value: 0};
    this.controller.setupWidget("progress", {}, this.progress);
    this.spinnerOn("preparing for first time use");
    $("spinner-message").insert({after: '<div id="progress-container"><div style="width: 65%; margin: auto;" id="progress" x-mojo-element="ProgressBar"></div></div>'});
    this.controller.instantiateChildWidgets($("progress-container"));

    new Ajax.Request("http://reboxed.semicolonapps.com/meta", {
      method: "get",
      onSuccess: this.sync.bind(this),
      onFailure: this.syncFailed.bind(this)
    });
  },

  sync: function(response) {
    this.moviesSynced = 0;
    this.moviesTotal = response.responseJSON.movies.count;
    this.listen();
    MovieSync.sync();
  },

  listen: function() {
    Mojo.Event.listen(document, Reboxed.Event.movieSyncProgress, this.syncProgress = this.syncProgress.bind(this));
    Mojo.Event.listen(document, Reboxed.Event.movieSyncComplete, this.syncComplete = this.syncComplete.bind(this));
    Mojo.Event.listen(document, Reboxed.Event.movieSyncFailed, this.syncFailed = this.syncFailed.bind(this));
  },

  stopListening: function() {
    Mojo.Event.stopListening(document, Reboxed.Event.movieSyncProgress, this.syncProgress);
    Mojo.Event.stopListening(document, Reboxed.Event.movieSyncComplete, this.syncComplete);
    Mojo.Event.stopListening(document, Reboxed.Event.movieSyncFailed, this.syncFailed);
  },

  syncProgress: function(event) {
    this.moviesSynced += (event.count || 0)
    this.progress.value = this.moviesSynced / this.moviesTotal;
    this.controller.modelChanged(this.progress)
  },

  syncFailed: function() {
    this.stopListening();
    this.controller.setupWidget();
    this.controller.stageController.swapScene("bail", "Initial movie sync failed.", "full-sync");
  },

  syncComplete: function() {
    this.stopListening();
    new Mojo.Model.Cookie("fullSyncComplete").put(true);
    this.controller.stageController.swapScene("movies");
  }
});
