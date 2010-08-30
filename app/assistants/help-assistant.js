HelpAssistant = Class.create(BaseAssistant, {
  setup: function($super) {
    $super()
    this.noAppMenu()
    this.controller.update('app-name', Mojo.appInfo.title)
  	this.controller.update('app-details', Mojo.appInfo.version + " by " + Mojo.appInfo.vendor)
  	this.controller.listen('debug', Mojo.Event.tap, this.showDebug = this.showDebug.bind(this))
  },

  cleanup: function($super) {
    $super()
    this.controller.stopListening('debug', Mojo.Event.tap, this.showDebug)
  },

  showDebug: function() {
    this.controller.stageController.pushScene('debug')
  }
})
