Cart = Class.create({
  checkout: function(card, verificationCode, success, failure) {
    Redbox.Api.checkout(this, card, verificationCode, success, failure)
  }
})

Cart.create = function(kiosk, movie, success, failure) {
  Redbox.Api.createCart(kiosk.id, movie.id, success, failure)
}

