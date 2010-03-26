Cart = Class.create({
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

  //TODO: MAKE SURE THEY'RE THE SAME AS IN THE CART
  cart.movie = movie;
  cart.kiosk = kiosk;

  successCallback(cart);
}

Cart.failure = function(failureCallback, response) {
  Mojo.Log.info("cart failure, status:", response.getStatus());
  failureCallback();
}
