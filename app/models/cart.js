Cart = Class.create({
  checkoutWith: function(card, verificationCode, success, failure) {
    var postBody = Redbox.Cart.buildReserveRequest(this, card, verificationCode);

    new Ajax.Request(Redbox.Cart.reserveUrl(), {
      method: "post",
      contentType: "application/json",
      postBody: Redbox.Cart.buildReserveRequest(this, card, verificationCode),
      onSuccess: this.checkoutSuccess.bind(this, success, failure),
      onFailure: Cart.failure.bind(this, failure)
    });
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
  new Ajax.Request(Redbox.Cart.addItemUrl(movie.id), {
    method: "post",
    contentType: "application/json",
    postBody: Redbox.Cart.buildAddItemRequest(kiosk.id),
    onSuccess: Cart.addSuccess.bind(this, kiosk, movie, success, failure),
    onFailure: Cart.failure.bind(this, failure)
  });
}

Cart.addSuccess = function(kiosk, movie, successCallback, failureCallback, response) {
  new Ajax.Request(Redbox.Cart.refreshUrl(), {
    method: "post",
    contentType: "application/json",
    postBody: Redbox.Cart.buildRefreshRequest(),
    onSuccess: Cart.refreshSuccess.bind(this, kiosk, movie, successCallback, failureCallback),
    onFailure: Cart.failure.bind(this, failureCallback)
  });
}

Cart.refreshSuccess = function(kiosk, movie, successCallback, failureCallback, response) {
  var cart = Redbox.Cart.parseRefreshResponse(response.responseJSON);
  successCallback(cart);
}

Cart.failure = function(failureCallback, response) {
  Log.debug("cart failure, status: " + response.getStatus());
  Log.debug(response.responseJSON);
  Log.debug(Object.toJSON(response));
  failureCallback();
}
