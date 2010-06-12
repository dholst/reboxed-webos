StageAssistant = Class.create({
  setup: function() {
    Reboxed.Metrix.postDeviceData();
    Database.getInstance().open(this.databaseOpened.bind(this))
  },

  databaseOpened: function() {
    Depot.initialize(this.depotOpened.bind(this))
  },

  depotOpened: function() {
    this.initializeRedbox();

    var scene = "full-sync"

    if(new Mojo.Model.Cookie("fullSyncComplete").get()) {
      new MovieSync().sync()
      scene = "movies"
    }

    if(new Mojo.Model.Cookie("termsOfUseAccepted").get()) {
      this.controller.pushScene(scene)
    }
    else {
      this.controller.pushScene("terms", scene)
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
