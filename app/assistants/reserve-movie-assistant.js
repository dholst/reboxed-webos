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
    //Cart.create(this.kiosk, this.movie, this.cartCreated.bind(this), this.cartFailed.bind(this));
    this.cartCreated({price: "$1.00", tax: "$0.07", total: "$1.07"});
  },

  cartCreated: function(cart) {
    $("movie-price").update(cart.price);
    $("movie-tax").update(cart.tax);
    $("movie-total").update(cart.total);

    this.spinning = false;
    this.controller.modelChanged(this);

    $("reserve-form").show();
  },

  cartFailed: function() {
    Mojo.Log.info("cart creation failed");
  }
});
