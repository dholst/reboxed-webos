StageAssistant = Class.create({
  setup: function() {
    Database.getInstance().open(this.databaseOpened.bind(this));
  },

  databaseOpened: function() {
    Movie.count(function(count) {
      var scene = count ? "movies" : "full-sync";
      this.controller.pushScene(scene);
    }.bind(this));
  }
});
