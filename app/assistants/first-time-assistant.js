FirstTimeAssistant = Class.create({
  setup: function() {
    this.controller.listen(document, Redbox.Event.movieSyncComplete, this.syncComplete.bind(this));
    MovieSync.sync();
  },
  
  syncComplete: function() {
    this.controller.stageController.pushScene("movies");
  }
});