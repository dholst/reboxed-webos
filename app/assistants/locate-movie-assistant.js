LocateMovieAssistant = Class.create(BaseAssistant, {
  initialize: function(movie) {
    this.movie = movie;
    this.kiosks = {items: []};
    this.button = {buttonLabel: "Locate"};
  },

  setup: function() {
    $("name").update(this.movie.name);
    this.controller.setupWidget("kiosks", {listTemplate: "locate-movie/kiosks", itemTemplate: "locate-movie/kiosk"}, this.kiosks);
    this.controller.setupWidget("address", {modelProperty: "address"}, this);
    this.controller.setupWidget("locate-address", {type: Mojo.Widget.activityButton}, this.button);

    this.controller.listen("kiosks", Mojo.Event.listTap, this.kioskTapped.bind(this));
    this.controller.listen("locate-address", Mojo.Event.tap, this.locateAddress.bind(this));

    this.spinnerOn("getting current location");
    this.locateGps();
  },

  kioskTapped: function(event) {
    if(event.originalEvent.target.hasClassName("reserve")) {
      this.controller.stageController.pushScene("reserve-movie", event.item, this.movie);
    }
  },

  locateGps: function() {
    this.controller.serviceRequest('palm://com.palm.location', {
      method: "getCurrentPosition",
      parameters: {maximumAge: 300},
      onSuccess: this.gpsSuccess.bind(this),
      onFailure: this.gpsFailure.bind(this)
    });
  },

  gpsSuccess: function(response) {
    this.locateKioskAt(response.latitude, response.longitude);
  },

  gpsFailure: function() {
    Mojo.Log.info("gps locate failed");
    this.spinnerOff();
    this.addressInputOn();
  },

  locateAddress: function() {
    console.log("locating " + this.address);
    this.disableButton();
    Yahoo.geocode(this.address, this.addressLocateSuccess.bind(this), this.addressLocateFailure.bind(this));
  },

  addressLocateSuccess: function(latitude, longitude) {
    console.log("found " + latitude + ", " + longitude)
    this.addressInputOff();
    this.locateKioskAt(latitude, longitude);
  },

  addressLocateFailure: function() {
    this.enableButton();
  },

  disableButton: function() {
    this.button.disabled = true;
    this.controller.modelChanged(this.button);
    this.controller.get("address-failure").hide();
  },

  enableButton: function() {
    this.button.disabled = false;
    this.controller.modelChanged(this.button);
    this.controller.get("locate-address").mojo.deactivate();
    this.controller.get("address-failure").show();
  },

  locateKioskAt: function(latitude, longitude) {
    this.spinnerOn("locating movie")
    Kiosk.locate(this.movie.id, latitude, longitude, this.kioskSuccess.bind(this), this.kioskFailure.bind(this));
  },

  kioskSuccess: function(kiosks) {
    this.spinnerOff();
    this.kiosks.items.push.apply(this.kiosks.items, kiosks);
    this.controller.modelChanged(this.kiosks);
  },

  kioskFailure: function() {
    Mojo.Log.info("kiosk locate failed");
  },

  addressInputOff: function() {
    this.controller.get("address-input").hide();
  },

  addressInputOn: function() {
    this.controller.get("address-input").show();
  }
})