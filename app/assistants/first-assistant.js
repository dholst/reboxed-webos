var FirstAssistant = Class.create(BaseAssistant, {
  activate: function($super) {
    $super()
    this.spinnerOn("Initializing database...")
    Database.getInstance().open(this.databaseOpened.bind(this), this.databaseNotOpened.bind(this))
  },

  databaseOpened: function() {
    Depot.initialize(this.depotOpened.bind(this), this.depotNotOpened.bind(this))
  },

  databaseNotOpened: function() {
    this.controller.stageController.swapScene("bail", "Unable to initialize database")
  },

  depotOpened: function() {
    this.spinnerOff()
    FavoriteKiosks.get(function(){})
    this.initializeRedbox();

    var scene = "full-sync"

    if(new Mojo.Model.Cookie("fullSyncComplete").get()) {
      new MovieSync(true).sync(true)
      new GameSync().sync()
      scene = "movies"
    }

    if(new Mojo.Model.Cookie("termsOfUseAccepted").get()) {
      this.controller.stageController.swapScene(scene)
    }
    else {
      this.controller.stageController.swapScene("terms", scene)
    }
  },

  depotNotOpened: function() {
    this.controller.stageController.swapScene("bail", "Unable to initialize depot")
  },

  initializeRedbox: function() {
    new Ajax.Request("http://reboxed-proxy.heroku.com/api4.js", {
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
