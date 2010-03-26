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
