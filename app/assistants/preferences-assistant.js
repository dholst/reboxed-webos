var PreferencesAssistant = Class.create(BaseAssistant, {
  initialize: function($super) {
    $super();
    this.bluray = {};
    this.originalBlurayValue = Preferences.showBluray();
    this.bluray.value = this.originalBlurayValue;

    this.dvd = {};
    this.originalDvdValue = Preferences.showDvd();
    this.dvd.value = this.originalDvdValue;
  },

  setup: function($super) {
    $super();
    this.controller.setupWidget("bluray", {}, this.bluray);
    this.controller.setupWidget("dvd", {}, this.dvd);
    this.controller.listen("bluray", Mojo.Event.propertyChange, this.setBluray = this.setBluray.bind(this));
    this.controller.listen("dvd", Mojo.Event.propertyChange, this.setDvd = this.setDvd.bind(this));
    this.controller.listen("go-back", Mojo.Event.tap, this.goBack = this.goBack.bind(this));
  },

  cleanup: function($super) {
    $super();
    this.controller.stopListening("bluray", Mojo.Event.propertyChange, this.setBluray);
    this.controller.stopListening("dvd", Mojo.Event.propertyChange, this.setDvd);
    this.controller.stopListening("go-back", Mojo.Event.tabp, this.goBack);
  },

  setBluray: function() {
    this.persistPreferences();
    this.checkIfBothUnchecked(this.dvd);
  },

  setDvd: function() {
    this.persistPreferences();
    this.checkIfBothUnchecked(this.bluray);
  },

  checkIfBothUnchecked: function(oneToTurnOn) {
    if(!this.bluray.value && !this.dvd.value) {
      oneToTurnOn.value = true;
      this.persistPreferences();
      this.controller.modelChanged(this.dvd);
      this.controller.modelChanged(this.bluray);
    }
  },

  persistPreferences: function() {
    Preferences.setDvd(this.dvd.value);
    Preferences.setBluray(this.bluray.value);
  },

  goBack: function() {
    var reload = (this.originalBlurayValue != this.bluray.value || this.originalDvdValue != this.dvd.value);
    this.controller.stageController.popScene(reload);
  },

  handleCommand: function($super) {
    if(Mojo.Event.back) {
      event.stop();
      this.goBack();
    }
    else {
      $super();
    }
  }
})
