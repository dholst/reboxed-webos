Card = Class.create({})

Card.getAll = function(success, failure) {
  Redbox.post(
    Redbox.Account.getCardsUrl(),
    Redbox.Account.buildGetCardsRequest(),
    Card.getAllSuccess.bind(this, success),
    failure
  )
}

Card.getAllSuccess = function(success, response) {
  success(Redbox.Account.parseGetCardsResponse(response.responseJSON))
}
