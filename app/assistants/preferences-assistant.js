var PreferencesAssistant = Class.create(BaseAssistant, {
  initialize: function() {
    this.bluray = {}
    this.originalBlurayValue = Preferences.showBluray();
    this.bluray.value = this.originalBlurayValue;
  },

  setup: function($super) {
    $super()
    this.controller.setupWidget("bluray", {}, this.bluray)
    this.controller.listen("bluray", Mojo.Event.propertyChange, this.setBluray = this.setBluray.bind(this))
  },

  cleanup: function($super) {
    $super()
    this.controller.stopListening("bluray", Mojo.Event.propertyChange, this.setBluray)
  },
  
  setBluray: function() {
    Preferences.setBluray(this.bluray.value)
  },

  handleCommand: function($super) {
    if(Mojo.Event.back) {
      event.stop();
      var reload = this.originalBlurayValue != this.bluray.value
      this.controller.stageController.popScene(reload)
    }
    else {
      $super()
    }
  }
})