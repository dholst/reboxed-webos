StageAssistant = Class.create({
  setup: function() {
    this.databaseOpened = this.databaseOpened.bind(this);
    Database.getInstance().open(this.databaseOpened);
  },

  databaseOpened: function() {
    Movie.count(function(count) {
      var scene = count ? "movies" : "first-time";
      this.controller.pushScene(scene);
    }.bind(this));
  }
});
