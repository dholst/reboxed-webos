BaseKiosksAssistant = Class.create(BaseAssistant, {
  initialize: function($super) {
    $super()
    this.kiosks = {items: []}
    this.showPreferences = true
  },

  setup: function($super) {
    $super();

    var listAttributes = {
      listTemplate: "kiosks/kiosks",
      itemTemplate: "kiosks/kiosk",
      dividerTemplate: "kiosks/divider",
  		dividerFunction: this.divide,
      onItemRendered: this.itemRendered.bind(this)
    }

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
    this.controller.listen("locate", Mojo.Event.tap, this.toggleMenuPanel);
  },

  cleanup: function($super) {
    $super();
    this.controller.stopListening("kiosks", Mojo.Event.listTap, this.kioskTapped);
  	this.controller.stopListening("address-cancel", Mojo.Event.tap, this.toggleMenuPanel);
  	this.controller.stopListening("address-submit", Mojo.Event.tap, this.locate);
  	this.controller.stopListening("address-text", Mojo.Event.propertyChange, this.addressTextEntry);
    this.controller.stopListening("locate", Mojo.Event.tap, this.toggleMenuPanel);
  },

  activate: function($super, resync) {
    $("address-text").mojo.setConsumesEnterKey(false);
    $super(resync)
  },

  addressTextEntry: function(event) {
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
    Log.debug("gps locate failed");
    this.menuPanelOn("Could not locate you, try entering an address");
  },

  locateByAddress: function() {
    Yahoo.geocode(this.addressText.value, this.addressLocateSuccess.bind(this), this.addressLocateFailure.bind(this));
  },

  addressLocateSuccess: function(latitude, longitude) {
    Log.debug("found " + latitude + ", " + longitude)
    this.locateKioskAt(latitude, longitude);
  },

  addressLocateFailure: function() {
    Log.debug("address locate failed");
    this.menuPanelOn("Could not locate that address");
  },

  locateKioskAt: function(latitude, longitude) {
    this.debug("locating kiosk at " + latitude + ", " + longitude)
    this.kiosks.items.clear();
    this.controller.modelChanged(this.kiosks);
    Kiosk.locate(this.movie ? this.movie.id : null, latitude, longitude, this.kioskSuccess.bind(this), this.kioskFailure.bind(this), this);
  },

  kioskSuccess: function(kiosks) {
    var self = this

    self.debug("found " + kiosks.length + " kiosks")

    FavoriteKiosks.get(function(favorites) {
      self.debug("found " + favorites.length + " favorite kiosks")

      kiosks.each(function(kiosk) {
        kiosk.favorite = favorites.any(function(k) {return k.id == kiosk.id})
        kiosk.calculateDistanceRange()
        self.kiosks.items.push(kiosk)
        self.debug("adding kiosk " + kiosk.id)
      })

      $("nothing-found")[kiosks.length ? "hide" : "show"]()
      self.menuPanelOff()
      self.spinnerOff()
      self.sortKiosks()
      self.controller.modelChanged(self.kiosks)
    })
  },

  sortKiosks: function() {
    this.kiosks.items.sort(function(a, b) {
      return a.distance - b.distance
    })
  },

  kioskFailure: function() {
    this.menuPanelOff();
    this.spinnerOff();
    $("kiosks-error").show();
  },

  menuPanelOn: function($super, errorMessage) {
    this.spinnerOff()

    if(errorMessage) {
      this.showError(errorMessage)
    }
    else {
      this.clearError()
    }

    this.enableButton()

    $super()

  	$("address-text").mojo.focus.delay(.5)
  },

  enableButton: function() {
    this.addressSubmitButton.disabled = false
    this.controller.modelChanged(this.addressSubmitButton)
    $("address-submit").mojo.deactivate()
  },

  disableButton: function() {
    this.addressSubmitButton.disabled = true
    this.controller.modelChanged(this.addressSubmitButton)
    $("address-submit").mojo.activate()
  },

  clearError: function() {
    $("locate-error-message").update("")
    $("locate-error").hide()
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
    })
  },

  handleKioskTap: function(event, subMenuItems) {
    if(event.originalEvent.target.hasClassName('star')) {
      event.originalEvent.target.toggleClassName('on')
      event.item.favorite = event.originalEvent.target.hasClassName('on')
      FavoriteKiosks[event.item.favorite ? "add" : "remove"](event.item)
    }
    else {
      this.controller.popupSubmenu({
        onChoose: this.kioskPopupTapped.bind(this, event.item),
        placeNear: event.originalEvent.target,
        items: subMenuItems
      })
    }
  },

  itemRendered: function(listWidget, itemModel, itemNode) {    
    if(itemModel.favorite) {
      itemNode.down(".star").addClassName("on")
    }
  }
})
