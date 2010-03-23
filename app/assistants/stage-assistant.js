StageAssistant = Class.create({
  setup: function() {
    this.databaseOpened = this.databaseOpened.bind(this);
    Database.getInstance().open(this.databaseOpened);
  },

  databaseOpened: function() {
    Mojo.Event.listen(document, Redbox.Event.movieSyncComplete, this.syncComplete.bind(this));
    MovieSync.sync();
  },

  syncComplete: function() {
    this.controller.pushScene("movies");
  }
});
