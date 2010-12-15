Cart = Class.create({
  checkout: function(card, verificationCode, success, failure) {
    Redbox.checkout(this, card, verificationCode, success, failure)
  }
})

Cart.create = function(kiosk, movie, success, failure) {
  Redbox.createCart(kiosk.id, movie.id, success, failure)
}

