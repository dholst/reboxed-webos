FullSyncAssistant = Class.create(BaseAssistant, {
  setup: function() {
    this.spinnerOn("Preparing for first time use");
    Mojo.Event.listen(document, Reboxed.Event.movieSyncComplete, this.syncComplete.bind(this));
    MovieSync.sync();
  },

  syncComplete: function() {
    this.spinnerOff();
    this.controller.stageController.swapScene("movies");
  }
});
