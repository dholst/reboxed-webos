LocateMovieAssistant = Class.create(BaseKiosksAssistant, {
  initialize: function($super, movie, address) {
    $super();
    this.movie = movie;
    this.addressText = {value: address};
    this.addressSubmitButton = {buttonLabel: "Locate"};
  },

  getAddressHintText: function() {
    return "Address...";
  },

  setup: function($super) {
    $super()
    this.setUpGoBack();
    this.controller.update("header", this.kiosk ? this.kiosk.vendor : "Locate")
    this.controller.listen("locate", Mojo.Event.tap, this.toggleMenuPanel)
  },

  cleanup: function($super) {
    $super()
    this.cleanUpGoBack();
    this.controller.stopListening("locate", Mojo.Event.tap, this.toggleMenuPanel)
  },

  ready: function() {
    if(this.addressText.value && this.addressText.value.length) {
      this.spinnerOn("locating address");
      this.locateByAddress();
    }
    else {
      this.spinnerOn("getting current location");
      this.locateByGps();
    }
  },

  kioskTapped: function(event) {
    this.handleKioskTap(event, [
      {label: "Reserve", command: "reserve"},
      {label: "Map", command: "map"}
    ]);
  },

  kioskPopupTapped: function(kiosk, command) {
    if(command === "reserve") {
      this.controller.stageController.pushScene("reserve-movie", kiosk, this.movie);
    }
    else if(command === "map") {
      this.showOnMap(kiosk)
    }
  },

  gpsSuccess: function($super, response) {
    this.spinnerOn("locating movie");
    $super(response);
  }
})
