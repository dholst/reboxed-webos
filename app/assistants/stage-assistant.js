StageAssistant = Class.create({
  setup: function() {
    this.databaseOpened = this.databaseOpened.bind(this);
    Database.getInstance().open(this.databaseOpened);
  },

  databaseOpened: function() {
    new User("darrinholst@gmail.com", "i9uuZOEXEo8y");
    Mojo.Event.listen(document, Redbox.Event.movieSyncComplete, this.syncComplete.bind(this));
    MovieSync.sync();
  },

  syncComplete: function() {
    var movie = new Movie();
    movie.name = "FUMULLINS"
    var kiosk = new Kiosk();
    this.controller.pushScene("reserve-movie", kiosk, movie);
  }
});
