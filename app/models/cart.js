Cart = Class.create({
  checkoutWith: function(card, verificationCode, success, failure) {
    Redbox.post(
      Redbox.Cart.reserveUrl(),
      Redbox.Cart.buildReserveRequest(this, card, verificationCode),
      this.checkoutSuccess.bind(this, success, failure),
      Cart.failure.bind(this, failure)
    )
  },

  checkoutSuccess: function(success, failure, response) {
    if(Redbox.Cart.parseReserveResponse(response.responseJSON)) {
      success();
    }
    else {
      failure();
    }
  }
});

Cart.create = function(kiosk, movie, success, failure) {
  Redbox.addToCart(kiosk.id, movie.id, )
}

Cart.addSuccess = function(kiosk, movie, successCallback, failureCallback, response) {
  Redbox.post(
    Redbox.Cart.refreshUrl(),
    Redbox.Cart.buildRefreshRequest(),
    Cart.refreshSuccess.bind(this, kiosk, movie, successCallback, failureCallback),
    Cart.failure.bind(this, failureCallback)
  )
}

Cart.refreshSuccess = function(kiosk, movie, successCallback, failureCallback, response) {
  var cart = Redbox.Cart.parseRefreshResponse(response.responseJSON);
  successCallback(cart);
}

Cart.failure = function(failureCallback, response) {
  failureCallback();
}
