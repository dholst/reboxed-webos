StageAssistant = Class.create({
  setup: function() {
    this.databaseOpened = this.databaseOpened.bind(this);
    Database.getInstance().open(this.databaseOpened);
  },

  databaseOpened: function() {
    this.controller.pushScene("movies");
  }
});
