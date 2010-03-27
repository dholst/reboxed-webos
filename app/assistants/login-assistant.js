LoginAssistant = Class.create({
  initialize: function() {
    this.user = {username: "", password: ""};
    this.button = {buttonLabel: "Login", disabled: true};
  },

  setup: function() {
    this.controller.setupWidget("username", {modelProperty: "username", changeOnKeyPress: true, focus: true}, this.user);
    this.controller.setupWidget("password", {modelProperty: "password", changeOnKeyPress: true}, this.user);
    this.controller.setupWidget("login", {type: Mojo.Widget.activityButton}, this.button);

    this.controller.listen("username", Mojo.Event.propertyChange, this.propertyChanged.bind(this));
		this.controller.listen("password", Mojo.Event.propertyChange, this.propertyChanged.bind(this));
    this.controller.listen("login", Mojo.Event.tap, this.login.bind(this));
  },

  propertyChanged: function() {
    if(this.user.username.length && this.user.password.length) {
      this.enableButton();
    }
    else {
      this.disableButton();
    }
  },

  login: function() {
    this.disableButton();
    User.login(this.user.username, this.user.password, this.loginSuccess.bind(this), this.loginFailure.bind(this));
  },

  loginSuccess: function() {
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
  }
});
