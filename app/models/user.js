User = Class.create({
  initialize: function(username, password) {
    var request = {
      userName: username,
      password: password,
      createPersistentCookie: false
    };

    new Ajax.Request("https://www.redbox.com/ajax.svc/Account/Login/", {
      method: "post",
      contentType: "application/json",
      postBody: Object.toJSON(request),
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
