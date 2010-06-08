KioskGenresAssistant = Class.create(BaseGenresAssistant, {
  initialize: function($super, kiosk) {
    $super()
    this.kiosk = kiosk
    this.menuTitle = kiosk.vendor
  },

  ready: function() {
    this.spinnerOn("retrieving kiosk inventory");
    this.kiosk.loadInventory(this.inventorySuccess.bind(this), this.inventoryFailure.bind(this));
  },

  inventorySuccess: function() {
    Genre.findAll(function(genres) {
      this.spinnerOff()
      this.genreList.items.push.apply(this.genreList.items, genres)
      this.controller.modelChanged(this.genreList)
    }.bind(this))
  },

  inventoryFailure: function() {
    this.spinnerOff();
    this.controller.get("inventory-failure").show();
  },

  genreTapped: function(event) {
    this.controller.stageController.pushScene("genre-movies", event.item, this.kiosk)
  }
})