var FirstAssistant = Class.create(BaseAssistant, {
  activate: function($super) {
    $super()
    this.spinnerOn("Initializing database...")
    Database.getInstance().open(this.databaseOpened.bind(this))
  },

  databaseOpened: function() {
    Depot.initialize(this.depotOpened.bind(this))
  },

  depotOpened: function() {
    this.spinnerOff()
    FavoriteKiosks.get(function(){})
    this.initializeRedbox();

    var scene = "full-sync"

    if(new Mojo.Model.Cookie("fullSyncComplete").get()) {
      new MovieSync(true).sync(true)
      scene = "movies"
    }

    if(new Mojo.Model.Cookie("termsOfUseAccepted").get()) {
      this.controller.stageController.swapScene(scene)
    }
    else {
      this.controller.stageController.swapScene("terms", scene)
    }
  },

  initializeRedbox: function() {
    new Ajax.Request("http://reboxed.semicolonapps.com/api.js", {
      method: "get",

      onSuccess: function(response) {
        eval(response.responseText)
      },

      onComplete: function() {
        Redbox.initialize()
      }
    })
  }
})
