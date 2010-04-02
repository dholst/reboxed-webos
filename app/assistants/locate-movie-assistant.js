LocateMovieAssistant = Class.create(BaseAssistant, {
  initialize: function(movie) {
    this.movie = movie;
    this.kiosks = {items: []};
    this.addressLocateButton = {buttonLabel: "Locate"};
  },

  setup: function($super) {
    $super();

    var listAttributes = {
      listTemplate: "locate-movie/kiosks",
      itemTemplate: "locate-movie/kiosk",
      dividerTemplate: "locate-movie/divider",
  		dividerFunction: this.divide
    }

    this.controller.setupWidget("kiosks", listAttributes, this.kiosks);
    this.controller.setupWidget("address", {modelProperty: "address", hintText: "Enter address..."}, this);
    this.controller.setupWidget('address-submit', {type: Mojo.Widget.activityButton}, this.addressLocateButton);
    this.controller.setupWidget("the-address-drawer", {}, this.addressDrawer = {open: false});

    this.controller.listen("kiosks", Mojo.Event.listTap, this.kioskTapped = this.kioskTapped.bind(this));
    this.controller.listen("address-submit", Mojo.Event.tap, this.locateAddress = this.locateAddress.bind(this));
    this.controller.listen("address-drawer", Mojo.Event.tap, this.toggleAddressDrawer = this.toggleAddressDrawer.bind(this));
  },

  cleanup: function() {
    this.controller.stopListening("kiosks", Mojo.Event.listTap, this.kioskTapped);
    this.controller.stopListening("locate-address", Mojo.Event.tap, this.locateAddress);
    this.controller.stopListening("address-drawer", Mojo.Event.tap, this.toggleAddressDrawer);
  },

  toggleAddressDrawer: function(event) {
    if (this.addressDrawer.open === true) {
      this.hideAddressDrawer();
    }
    else {
      this.showAddressDrawer();
    }
  },

  showAddressDrawer: function() {
    $("the-address-drawer").show();
    this.addressDrawer.open = true;
    $("address-drawer").className = "opened";
    this.controller.modelChanged(this.addressDrawer);
  },

  hideAddressDrawer: function() {
    $("the-address-drawer").hide();
    this.addressDrawer.open = false;
    $("address-drawer").className = "closed";
    this.controller.modelChanged(this.addressDrawer);
    $("gps-failure").hide();
    $("address-failure").hide();
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
    this.spinnerOn("locating movie");
    this.locateKioskAt(response.latitude, response.longitude);
  },

  gpsFailure: function() {
    Mojo.Log.info("gps locate failed");
    this.spinnerOff();
    $("gps-failure").show();
    this.showAddressDrawer();
  },

  locateAddress: function() {
    Mojo.Log.info("locating " + this.address);
    this.addressLocateButton.disabled = true;
    this.controller.modelChanged(this.addressLocateButton);
    $("gps-failure").hide();
    $("address-failure").hide();
    Yahoo.geocode(this.address, this.addressLocateSuccess.bind(this), this.addressLocateFailure.bind(this));
  },

  addressLocateSuccess: function(latitude, longitude) {
    Mojo.Log.info("found " + latitude + ", " + longitude)
    this.locateKioskAt(latitude, longitude);
  },

  addressLocateFailure: function() {
    this.spinnerOff();
    this.enableButton();
    $("address-failure").show();
  },

  locateKioskAt: function(latitude, longitude) {
    $("nothing-found").hide();
    $("kiosks-error").hide();
    this.kiosks.items.clear();
    this.controller.modelChanged(this.kiosks);
    Kiosk.locate(this.movie.id, latitude, longitude, this.kioskSuccess.bind(this), this.kioskFailure.bind(this));
  },

  kioskSuccess: function(kiosks) {
    kiosks.each(function(kiosk) {
      kiosk.calculateDistanceRange();
      this.kiosks.items.push(kiosk);
    }.bind(this));

    $("nothing-found")[kiosks.length ? "hide" : "show"]()
    this.spinnerOff();
    this.enableButton();

    this.controller.modelChanged(this.kiosks);
  },

  kioskFailure: function() {
    this.spinnerOff();
    this.enableButton();
    $("kiosks-error").show();
  },

  enableButton: function() {
    this.addressLocateButton.disabled = false;
    this.controller.modelChanged(this.addressLocateButton);
    $("address-submit").mojo.deactivate();
  }
})