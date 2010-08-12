KiosksAssistant = Class.create(BaseKiosksAssistant, {
  initialize: function($super) {
    $super()
    this.addressText = {value: ""}
    this.addressSubmitButton = {buttonLabel: "Search"}
  },

  getAddressHintText: function() {
    return "Use current location..."
  },

  setup: function($super) {
    $super()
    this.controller.listen('switch', Mojo.Event.tap, this.swapScene = this.swapScene.bind(this))
  },

  cleanup: function($super) {
    $super()
    this.controller.stopListening('switch', Mojo.Event.tap, this.swapScene)
  },

  ready: function() {
    this.getFavorites(function(favorites) {
      if(favorites.empty()) {
        this.menuPanelOn()
      }
      else {
        this.kioskSuccess(favorites.kiosks)
      }
    }.bind(this))
  },

  kioskTapped: function(event) {
    this.handleKioskTap(event, [
      {label: "Genres", command: "genres"},
      {label: "Movies", command: "movies"},
      {label: "Map", command: "map"}
    ])
  },

  kioskPopupTapped: function(kiosk, command) {
    if(command === "movies") {
      this.controller.stageController.pushScene("kiosk-movies", kiosk)
    }
    else if(command === "map") {
      this.showOnMap(kiosk)
    }
    else if(command === "genres") {
      this.controller.stageController.pushScene("kiosk-genres", kiosk)
    }
  },

  swapScene: function() {
    this.swapTo(["movies", "genres", "upcoming"])
  }
})