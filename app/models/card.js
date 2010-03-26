Card = Class.create({
});

Card.getAll = function(success, failure) {
  new Ajax.Request(Redbox.Account.getCardsUrl(), {
    method: "post",
    contentType: "application/json",
    postBody: Redbox.Account.buildGetCardsRequest(),
    onSuccess: Card.getAllSuccess.bind(this, success),
    onFailure: failure
  });
};

Card.getAllSuccess = function(success, response) {
  success(Redbox.Account.parseGetCardsResponse(response.responseJSON));
};