ReserveMovieAssistant = Class.create({
  initialize: function(kiosk, movie) {
    this.kiosk = kiosk;
    this.movie = movie;
    this.spinning = true;
  },

  setup: function() {
    this.controller.setupWidget("reserve-spinner", {spinnerSize: "large"}, this);
    var marginTop = (Mojo.Environment.DeviceInfo.maximumCardHeight / 2) - 64;
    $("reserve-spinner").setStyle({marginTop: marginTop + "px"});
    Cart.create(this.kiosk, this.movie, this.cartCreated.bind(this), this.cartFailed.bind(this));

    //
    // TESTING
    //
    /*
    this.movie.name = "The FUMULLINS Saga";
    this.kiosk.vendor = "McDonalds";
    this.kiosk.address = "123 FU Way";
    this.kiosk.city = "Bouton";
    this.kiosk.state = "IA";
    this.kiosk.zip = "50039"
    this.cartCreated({price: "$1.00", tax: "$0.07", total: "$1.07"});
    */
  },

  cartCreated: function(cart) {
    this.cart = cart;
    this.spinning = false;
    this.controller.modelChanged(this);
    $("reserve-form").update(Mojo.View.render({object: this, template: "reserve-movie/details"}));
  },

  cartFailed: function() {
    Mojo.Log.info("cart creation failed");
  }
});
