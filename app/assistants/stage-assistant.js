StageAssistant = Class.create({
  setup: function() {
    this.databaseOpened = this.databaseOpened.bind(this);
    Database.getInstance().open(this.databaseOpened);
  },

  databaseOpened: function() {
    new User("darrinholst@gmail.com", "i9uuZOEXEo8y");
    Mojo.Event.listen(document, Reboxed.Event.movieSyncComplete, this.syncComplete.bind(this));
    MovieSync.sync();
  },

  syncComplete: function() {
    //this.controller.pushScene("movies");
    this.controller.pushScene("reserve-movie");
  }
});
