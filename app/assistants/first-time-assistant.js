FirstTimeAssistant = Class.create({
  setup: function() {
    this.controller.listen(document, Redbox.Event.movieSyncComplete, this.syncComplete.bind(this));
    MovieSync.sync();
    //this.spike();
  },

  syncComplete: function() {
    this.controller.stageController.pushScene("movies");
  },

  spike: function() {
    new Mojo.Service.Request("palm://com.palm.downloadmanager/", {
      method: "download",
      parameters: {
        target: "http://192.168.2.106:3000/TheTwilightSagaNewMoon_3167.jpg",
        targetDir: "/media/internal/files/redbox-palm/cache",
        targetFilename: "TheTwilightSagaNewMoon_3167.jpg"
      },

      onSuccess: function(resp) {
        Mojo.Log.info("download onSuccess:", Object.toJSON(resp));
      }.bind(this),

      onFailure: function(resp) {
        Mojo.Log.info("download onFailure:", Object.toJSON(resp));
      }
    });
  }
});