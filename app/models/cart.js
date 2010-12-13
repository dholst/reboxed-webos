Cart = Class.create({
  checkout: function(card, verificationCode, success, failure) {
    Redbox.checkout(card, verificationCode, success, failure)
  }
})

Cart.create = function(kiosk, movie, success, failure) {
  Redbox.Api.createCart(kiosk.id, movie.id, success, failure)
}

