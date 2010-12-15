Card = Class.create({})

Card.getAll = function(success, failure) {
  Redbox.getCards(success, failure)
}
