LocateMovieAssistant = Class.create(BaseAssistant, {
  initialize: function(movie) {
    this.movie = movie;
    this.kiosks = {items: []};
    this.button = {buttonLabel: "Locate"};
  },

  setup: function($super) {
    $super();

    var listAttributes = {
      listTemplate: "locate-movie/kiosks",
      itemTemplate: "locate-movie/kiosk",
      dividerTemplate: "locate-movie/divider",
  		dividerFunction: this.divide,
    }

    this.controller.setupWidget("kiosks", listAttributes, this.kiosks);
    this.controller.setupWidget("address", {modelProperty: "address"}, this);
    this.controller.setupWidget("locate-address", {type: Mojo.Widget.activityButton}, this.button);

    this.controller.listen("kiosks", Mojo.Event.listTap, this.kioskTapped.bind(this));
    this.controller.listen("locate-address", Mojo.Event.tap, this.locateAddress.bind(this));
  },

  ready: function() {
    this.controller.update("name", this.movie.name);
    this.spinnerOn("getting current location");
    this.locateGps();
  },

  divide: function(kiosk) {
    return kiosk.distanceRange;
  },

  kioskTapped: function(event) {
    this.controller.popupSubmenu({
      onChoose: this.kioskPopupTapped.bind(this, event.item),
      placeNear: event.originalEvent.target,
      items: [{label: 'Reserve', command: 'reserve'}]
    });
  },

  kioskPopupTapped: function(kiosk, command) {
    if(command === "reserve") {
      this.controller.stageController.pushScene("reserve-movie", kiosk, this.movie);
    }
  },

  locateGps: function() {
    this.controller.serviceRequest('palm://com.palm.location', {
      method: "getCurrentPosition",
      parameters: {
        responseTime: 1,
        maximumAge: 300
      },
      onSuccess: this.gpsSuccess.bind(this),
      onFailure: this.gpsFailure.bind(this)
    });
  },

  gpsSuccess: function(response) {
    console.log(Object.toJSON(response));
    this.locateKioskAt(response.latitude, response.longitude);
  },

  gpsFailure: function() {
    Mojo.Log.info("gps locate failed");
    this.spinnerOff();
    this.addressInputOn();
  },

  locateAddress: function() {
    Mojo.Log.info("locating " + this.address);
    this.disableButton();
    Yahoo.geocode(this.address, this.addressLocateSuccess.bind(this), this.addressLocateFailure.bind(this));
  },

  addressLocateSuccess: function(latitude, longitude) {
    Mojo.Log.info("found " + latitude + ", " + longitude)
    this.addressInputOff();
    this.locateKioskAt(latitude, longitude);
  },

  addressLocateFailure: function() {
    this.controller.get("gps-failure").hide();
    this.enableButton();
  },

  disableButton: function() {
    this.button.disabled = true;
    this.controller.modelChanged(this.button);
  },

  enableButton: function() {
    this.button.disabled = false;
    this.controller.modelChanged(this.button);
    this.controller.get("locate-address").mojo.deactivate();
    this.controller.get("address-failure").show();
  },

  locateKioskAt: function(latitude, longitude) {
    this.spinnerOn("locating movie");
    Kiosk.locate(this.movie.id, latitude, longitude, this.kioskSuccess.bind(this), this.kioskFailure.bind(this));
  },

  kioskSuccess: function(kiosks) {
    kiosks.each(function(kiosk) {
      kiosk.calculateDistanceRange();
      this.kiosks.items.push(kiosk);
    }.bind(this));

    this.spinnerOff();
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