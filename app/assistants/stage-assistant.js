StageAssistant = Class.create({
  setup: function() {
    Database.getInstance().open(this.databaseOpened.bind(this))
  },

  databaseOpened: function() {
    Depot.initialize(this.depotOpened.bind(this))
  },

  depotOpened: function() {
    Redbox.initialize()

    var scene = "full-sync"

    if(new Mojo.Model.Cookie("fullSyncComplete").get()) {
      scene = "movies"
    }

    if(new Mojo.Model.Cookie("termsOfUseAccepted").get()) {
      this.controller.pushScene(scene)
    }
    else {
      this.controller.pushScene("terms", scene)
    }
  }
})
