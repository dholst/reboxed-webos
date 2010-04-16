LocateMovieAssistant = Class.create(BaseKiosksAssistant, {
  initialize: function($super, movie, address) {
    $super();
    this.movie = movie;
    this.addressText = {value: address};
    this.addressSubmitButton = {buttonLabel: "Locate"};
  },

  setupViewMenu: function() {
    this.controller.setupWidget(Mojo.Menu.viewMenu, {}, {items: [
      {},
      {items: [
        {label: this.movie.name, width: 260, command: "n/a"},
        {label: "Locate", iconPath: "images/compass.png", command: "locate"}
      ]},
      {}
    ]});
  },

  getAddressHintText: function() {
    return "Address...";
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
    this.controller.popupSubmenu({
      onChoose: this.kioskPopupTapped.bind(this, event.item),
      placeNear: event.originalEvent.target,
      items: [
        {label: "Reserve", command: "reserve"},
        {label: "Map", command: "map"}
      ]
    });
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
  },

  handleCommand: function($super, event) {
    $super(event);

    if("locate" === event.command) {
      this.toggleMenuPanel();
    }
  }
})