LocateMovieAssistant = Class.create({
  initialize: function(movie) {
    this.movie = movie;
    this.kiosks = {items: []};
    this.spinning = true;
  },

  setup: function() {
    $("name").update(this.movie.name);
    this.controller.setupWidget("kiosks", {listTemplate: "locate-movie/kiosks", itemTemplate: "locate-movie/kiosk"}, this.kiosks);
    this.addSpinner();
    this.locate();
  },

  addSpinner: function() {
    this.controller.setupWidget("spinner", {spinnerSize: "large"}, this);
    var marginTop = (Mojo.Environment.DeviceInfo.maximumCardHeight / 2) - 64;
    $("spinner").setStyle({marginTop: marginTop + "px"});
  },

  locate: function() {
    this.controller.serviceRequest('palm://com.palm.location', {
      method: "getCurrentPosition",
      parameters: {
        maximumAge: 300
      },
      onSuccess: this.gpsSuccess.bind(this),
      onFailure: this.gpsFailure.bind(this)
    });
  },

  gpsSuccess: function(response) {
    console.log(Object.toJSON(response));
    response.latitude = 41.853056209834;
    response.longitude = -94.02111123432;
    Kiosk.locate(this.movie.id, response.latitude, response.longitude, this.kioskSuccess.bind(this), this.kioskFailure.bind(this));
  },

  kioskSuccess: function(kiosks) {
    this.spinning = false;
    this.controller.modelChanged(this);
    this.kiosks.items.push.apply(this.kiosks.items, kiosks);
    this.controller.modelChanged(this.kiosks);
  },

  gpsFailure: function() {

  },

  kioskFailure: function() {

  }
})