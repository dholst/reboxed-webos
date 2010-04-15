KiosksAssistant = Class.create(BaseKiosksAssistant, {
  initialize: function($super) {
    $super();
    this.addressText = {value: ""};
    this.addressSubmitButton = {buttonLabel: "Search"};
  },

  setupViewMenu: function() {
    this.controller.setupWidget(Mojo.Menu.viewMenu, {}, {items: [
      {},
      {items: [
        {label: "Kiosks", width: 260, command: "movies"},
        {label: "Locate", iconPath: "images/compass.png", command: "locate"}
      ]},
      {}
    ]});
  },

  getAddressHintText: function() {
    return "Use current location...";
  },

  ready: function() {
    this.addDownArrowToMenuText();
    this.menuPanelOn();
  },

  kioskTapped: function(event) {
    this.controller.popupSubmenu({
      onChoose: this.kioskPopupTapped.bind(this, event.item),
      placeNear: event.originalEvent.target,
      items: [
        {label: "Movies", command: "movies"},
        {label: "Map", command: "map"}
      ]
    });
  },

  kioskPopupTapped: function(kiosk, command) {
    if(command === "movies") {
      this.controller.stageController.pushScene("kiosk-movies", kiosk);
    }
    else if(command === "map") {
      this.showOnMap(kiosk)
    }
  },

  handleCommand: function($super, event) {
    $super(event);

    if("locate" === event.command) {
      this.toggleMenuPanel();
    }
    else if("movies" === event.command) {
      this.swapTo(event.originalEvent.target, "movies");
    }
  }
});