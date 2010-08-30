var ResyncAssistant = Class.create(BaseAssistant, {
  setup: function($super) {
    $super()
    this.noAppMenu()
  },
  
  ready: function() {
    this.spinnerOn("cleaning database, please wait...")

    Database.getInstance().clear(function() {
      new Mojo.Model.Cookie("fullSyncComplete").put(false)
      this.controller.stageController.swapScene("full-sync")
    }.bind(this))
  }
})