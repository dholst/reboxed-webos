User = Class.create({
});

User.login = function(username, password, success, failure) {
  new Ajax.Request(Redbox.Account.loginUrl(), {
    method: "post",
    contentType: "application/json",
    postBody: Redbox.Account.buildLoginRequest(username, password),
    onSuccess: User.loginSuccess.bind(this, success, failure),
    onFailure: User.loginFailure.bind(this, failure)
  });
};

User.loginSuccess = function(success, failure, response) {
  var wasSuccessful = Redbox.Account.parseLoginResponse(response.responseJSON);

  if(wasSuccessful) {
    User.current = new User();
    success();
  }
  else {
    User.loginFailure(failure, response);
  }
};

User.loginFailure = function(failure, response) {
  Log.debug("Login failed, status:", response.getStatus());
  failure();
};
