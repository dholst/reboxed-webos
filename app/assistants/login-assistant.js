LoginAssistant = Class.create({
  initialize: function() {
    this.user = {username: "", password: ""};
    this.button = {buttonLabel: "Login", disabled: true};
    this.rememberMe = {};
    this.readCookie();
  },

  setup: function() {
    this.controller.setupWidget("username", {modelProperty: "username", changeOnKeyPress: true, focus: true}, this.user);
    this.controller.setupWidget("password", {modelProperty: "password", changeOnKeyPress: true}, this.user);
    this.controller.setupWidget("login", {type: Mojo.Widget.activityButton}, this.button);
    this.controller.setupWidget("remember-me", {}, this.rememberMe);

    this.controller.listen("username", Mojo.Event.propertyChange, this.propertyChanged.bind(this));
		this.controller.listen("password", Mojo.Event.propertyChange, this.propertyChanged.bind(this));
    this.controller.listen("login", Mojo.Event.tap, this.login.bind(this));
  },

  activate: function() {
    $("password").mojo.setConsumesEnterKey(false);
    this.propertyChanged();
  },

  propertyChanged: function(event) {
    if(this.user.username.length && this.user.password.length) {
      this.enableButton();

      if(Mojo.Char.enter === event.originalEvent.keyCode) {
        this.login();
      }
    }
    else {
      this.disableButton();
    }
  },

  login: function() {
    this.disableButton();
    this.controller.get("login").mojo.activate();
    User.login(this.user.username, this.user.password, this.loginSuccess.bind(this), this.loginFailure.bind(this));
  },

  loginSuccess: function() {
    this.writeCookie();
    this.controller.stageController.popScene();
  },

  loginFailure: function() {
    this.controller.get("login-failure").show();
    this.enableButton();
  },

  disableButton: function() {
    this.button.disabled = true;
    this.controller.modelChanged(this.button);
  },

  enableButton: function() {
    this.button.disabled = false;
    this.controller.modelChanged(this.button);
    this.controller.get("login").mojo.deactivate();
  },

  readCookie: function() {
    this.cookie = new Mojo.Model.Cookie(LoginAssistant.COOKIE);
    var data = this.cookie.get();

    if(data) {
      this.rememberMe.value = true;
      this.user.username = Mojo.Model.decrypt(LoginAssistant.KEY, data.username);
      this.user.password = Mojo.Model.decrypt(LoginAssistant.KEY, data.password);
    }
  },

  writeCookie: function() {
    if(this.rememberMe.value) {
      this.cookie.put({
        username: Mojo.Model.encrypt(LoginAssistant.KEY, this.user.username),
        password: Mojo.Model.encrypt(LoginAssistant.KEY, this.user.password)
      });
    }
    else {
      this.cookie.remove();
    }
  }
});

LoginAssistant.COOKIE = "login";
LoginAssistant.KEY = "5BE2A2A349E579EA08F51ED77C0176D717A86AD89764C0722C6D76324BB77459"
