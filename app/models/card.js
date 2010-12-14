Card = Class.create({})

Card.getAll = function(success, failure) {
  Redbox.Api.getCards(success, failure)
}
