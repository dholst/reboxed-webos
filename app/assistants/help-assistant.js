HelpAssistant = Class.create(BaseAssistant, {
  setup: function($super) {
    $super()
    this.setUpGoBack();
    this.noAppMenu()
    this.controller.update('app-name', Mojo.appInfo.title)
    this.controller.update('app-details', Mojo.appInfo.version + " by " + Mojo.appInfo.vendor)
    this.controller.listen('send-debug-log', Mojo.Event.tap, this.sendDebugLog = this.sendDebugLog.bind(this))
  },

  cleanup: function($super) {
    $super()
    this.cleanUpGoBack();
    this.controller.stopListening('debug', Mojo.Event.tap, this.sendDebugLog)
  },

  sendDebugLog: function() {
    this.controller.serviceRequest("palm://com.palm.applicationManager", {
      method: "open",

      parameters: {
        id: "com.palm.app.email",
        params: {
          summary: "Reboxed debug log",
          recipients: [{contactDisplay: "Reboxed", role: 1, type: "email", value: "reboxedapp@gmail.com"}],
          text: $A(Log.items).map(function(o) {return o.message}).join("|")
        }
      }
    })
  }
})
