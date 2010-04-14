BaseKiosksAssistant = Class.create(BaseAssistant, {
  initialize: function($super) {
    $super();
    this.kiosks = {items: []};
  },

  setup: function($super) {
    $super();

    var listAttributes = {
      listTemplate: "kiosks/kiosks",
      itemTemplate: "kiosks/kiosk",
      dividerTemplate: "kiosks/divider",
  		dividerFunction: this.divide
    }

    this.setupViewMenu();
    this.controller.setupWidget("kiosks", listAttributes, this.kiosks);
    this.controller.setupWidget("address-text", {changeOnKeyPress: true, hintText: this.getAddressHintText()}, this.addressText);
    this.controller.setupWidget("address-cancel", {}, {buttonClass: "secondary", buttonLabel: "Cancel"});
    this.controller.setupWidget("address-submit", {type: Mojo.Widget.activityButton}, this.addressSubmitButton);

    this.kioskTapped = this.kioskTapped.bind(this)
    this.locate = this.locate.bind(this);
    this.addressTextEntry = this.addressTextEntry.bind(this);

    this.controller.listen("kiosks", Mojo.Event.listTap, this.kioskTapped);
  	this.controller.listen("address-cancel", Mojo.Event.tap, this.toggleMenuPanel);
  	this.controller.listen("address-submit", Mojo.Event.tap, this.locate);
  	this.controller.listen("address-text", Mojo.Event.propertyChange, this.addressTextEntry);
  },

  cleanup: function($super) {
    $super();
    this.controller.stopListening("kiosks", Mojo.Event.listTap, this.kioskTapped);
  	this.controller.stopListening("address-cancel", Mojo.Event.tap, this.toggleMenuPanel);
  	this.controller.stopListening("address-submit", Mojo.Event.tap, this.locate);
  	this.controller.stopListening("address-text", Mojo.Event.propertyChange, this.addressTextEntry);
  },

  activate: function() {
    $("address-text").mojo.setConsumesEnterKey(false);
  },

  addressTextEntry: function() {
    if(Mojo.Char.enter === event.originalEvent.keyCode) {
      this.locate();
    }
  },

  divide: function(kiosk) {
    return kiosk.distanceRange;
  },

  locate: function() {
    this.disableButton();

    if(this.addressText.value && this.addressText.value.length) {
      this.locateByAddress();
    }
    else {
      this.locateByGps();
    }
  },

  locateByGps: function() {
    this.controller.serviceRequest("palm://com.palm.location", {
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
    this.locateKioskAt(response.latitude, response.longitude);
  },

  gpsFailure: function() {
    Mojo.Log.info("gps locate failed");
    this.menuPanelOn("Could not locate you, try entering an address");
  },

  locateByAddress: function() {
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
    Kiosk.locate(this.movie ? this.movie.id : null, latitude, longitude, this.kioskSuccess.bind(this), this.kioskFailure.bind(this));
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

  	$("address-text").mojo.focus.delay(.5);
  },

  enableButton: function() {
    this.addressSubmitButton.disabled = false;
    this.controller.modelChanged(this.addressSubmitButton);
    $("address-submit").mojo.deactivate();
  },

  disableButton: function() {
    this.addressSubmitButton.disabled = true;
    this.controller.modelChanged(this.addressSubmitButton);
    $("address-submit").mojo.activate();
  },

  clearError: function() {
    $("locate-error-message").update("");
    $("locate-error").hide();
  },

  showOnMap: function(kiosk) {
    this.controller.serviceRequest("palm://com.palm.applicationManager", {
     	method: "open",
     	parameters: {
     	  id: "com.palm.app.maps",
       	params: {
      	  query: kiosk.address + " " + kiosk.city + ", " + kiosk.state + " " + kiosk.zip
       	}
     	}
    });
  }
});