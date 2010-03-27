FullSyncAssistant = Class.create(BaseAssistant, {
  ready: function() {
    this.spinnerOn("preparing for first time use");
    Mojo.Event.listen(document, Reboxed.Event.movieSyncComplete, this.syncComplete.bind(this));
    Mojo.Event.listen(document, Reboxed.Event.movieSyncFailed, this.syncFailed.bind(this));
    MovieSync.sync();
  },

  syncFailed: function() {
    this.controller.stageController.swapScene("bail", "Sync failed, try again later.");
  },

  syncComplete: function() {
    this.controller.stageController.swapScene("movies");
  }
});
