StageAssistant = Class.create({
  setup: function() {
    Database.getInstance().open(this.databaseOpened.bind(this));
  },

  databaseOpened: function() {
    var scene = "full-sync";

    if(new Mojo.Model.Cookie("fullSyncComplete").get()) {
      scene = "movies";
    }

    this.controller.pushScene(scene);
  }
});
