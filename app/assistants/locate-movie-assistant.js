LocateMovieAssistant = Class.create(BaseAssistant, {
  initialize: function(movie, address) {
    this.movie = movie;
    this.addressText = {value: address};
    this.kiosks = {items: []};
    this.addressSubmitButton = {buttonLabel: "Locate"};
    this.viewMenu = {items: [
      {},
      {items: [
        {label: "Locate: " + movie.name, width: 260, command: "n/a"},
        {label: "Locate", iconPath: "images/pushpin.png", command: "locate"}
      ]},
      {}
    ]};

  },

  setup: function($super) {
    $super();

    var listAttributes = {
      listTemplate: "locate-movie/kiosks",
      itemTemplate: "locate-movie/kiosk",
      dividerTemplate: "locate-movie/divider",
  		dividerFunction: this.divide
    }

    this.setupMenuPanel();
    this.controller.setupWidget(Mojo.Menu.viewMenu, {}, this.viewMenu);
    this.controller.setupWidget("kiosks", listAttributes, this.kiosks);
    this.controller.setupWidget("address-text", {changeOnKeyPress: true, hintText: "Address..."}, this.addressText);
    this.controller.setupWidget("address-cancel", {}, {buttonClass: "secondary", buttonLabel: "Cancel"});
    this.controller.setupWidget("address-submit", {type: Mojo.Widget.activityButton}, this.addressSubmitButton);

    this.kioskTapped = this.kioskTapped.bind(this)
    this.toggleMenuPanel = this.toggleMenuPanel.bind(this);
    this.locateByAddress = this.locateByAddress.bind(this);
    this.addressTextEntry = this.addressTextEntry.bind(this);

    this.controller.listen("kiosks", Mojo.Event.listTap, this.kioskTapped);
    this.controller.listen(this.scrim, Mojo.Event.tap, this.toggleMenuPanel);
  	this.controller.listen("address-cancel", Mojo.Event.tap, this.toggleMenuPanel);
  	this.controller.listen("address-submit", Mojo.Event.tap, this.locateByAddress);
  	this.controller.listen("address-text", Mojo.Event.propertyChange, this.addressTextEntry);
  },

  cleanup: function($super) {
    $super();
    this.controller.stopListening("kiosks", Mojo.Event.listTap, this.kioskTapped);
    this.controller.stopListening(this.scrim, Mojo.Event.tap, this.toggleMenuPanel);
  	this.controller.stopListening("address-cancel", Mojo.Event.tap, this.toggleMenuPanel);
  	this.controller.stopListening("address-submit", Mojo.Event.tap, this.locateByAddress);
  	this.controller.stopListening("address-text", Mojo.Event.propertyChange, this.addressTextEntry);
  },

  ready: function() {
    if(this.addressText.value && this.addressText.value.length > 0) {
      this.spinnerOn("locating address");
      this.locateByAddress();
    }
    else {
      this.spinnerOn("getting current location");
      this.locateByGps();
    }
  },

  activate: function() {
    $("address-text").mojo.setConsumesEnterKey(false);
  },

  addressTextEntry: function(event) {
    if(Mojo.Char.enter === event.originalEvent.keyCode) {
      this.locateByAddress();
    }
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

  locateByGps: function() {
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
    this.spinnerOn("locating movie");
    this.locateKioskAt(response.latitude, response.longitude);
  },

  gpsFailure: function() {
    Mojo.Log.info("gps locate failed");
    this.menuPanelOn("Could not locate you, try entering an address");
  },

  locateByAddress: function() {
    this.disableButton();
    Yahoo.geocode(this.addressText.value, this.addressLocateSuccess.bind(this), this.addressLocateFailure.bind(this));
  },

  addressLocateSuccess: function(latitude, longitude) {
    Mojo.Log.info("found " + latitude + ", " + longitude)
    this.locateKioskAt(latitude, longitude);
  },

  addressLocateFailure: function() {
    Mojo.Log.info("address locate failed");
    this.menuPanelOn("Could not locate that address");
  },

  locateKioskAt: function(latitude, longitude) {
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
    this.menuPanelOff();
    this.spinnerOff();
    this.controller.modelChanged(this.kiosks);
  },

  kioskFailure: function() {
    this.menuPanelOff();
    this.spinnerOff();
    $("kiosks-error").show();
  },

  handleCommand: function(event) {
    if("locate" === event.command) {
      this.toggleMenuPanel();
    }
  },

  menuPanelOn: function($super, errorMessage) {
    this.spinnerOff();

    if(errorMessage) {
      this.showError(errorMessage)
    }
    else {
      this.clearError();
    }

    this.enableButton();
    $super();
  },

  disableButton: function() {
    this.addressSubmitButton.disabled = true;
    this.controller.modelChanged(this.addressSubmitButton);
    $("address-submit").mojo.activate();
  },

  enableButton: function() {
    this.addressSubmitButton.disabled = false;
    this.controller.modelChanged(this.addressSubmitButton);
    $("address-submit").mojo.deactivate();
  },

  showError: function(message) {
    $("locate-error-message").update(message);
    $("locate-error").show();
  },

  clearError: function() {
    $("locate-error-message").update("");
    $("locate-error").hide();
  }
})