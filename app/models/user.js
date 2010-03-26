User = Class.create({
  initialize: function(username, password) {
    new Ajax.Request(Redbox.Account.loginUrl(), {
      method: "post",
      contentType: "application/json",
      postBody: Redbox.Account.buildLoginRequest(username, password),
      onSuccess: this.loginSuccess.bind(this),
      onFailure: this.loginFailure.bind(this)
    });
  },

  loginSuccess: function(response) {
    Mojo.Log.info("Login success!");
    CURRENT_USER = this;
  },

  loginFailure: function(response) {
    Mojo.Log.info("Login failed, status:", response.getStatus());
  }
});
