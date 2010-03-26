LoginAssistant = Class.create({
  initialize: function() {
    this.user = {};
    this.button = {buttonLabel: "Sign In"};
  },

  setup: function() {
    this.controller.setupWidget("username", {modelProperty: "username", focus: true}, this.user);
    this.controller.setupWidget("password", {modelProperty: "password"}, this.user);
    this.controller.setupWidget("login", {type: Mojo.Widget.activityButton}, this.button);

    this.login = this.login.bind(this);
    this.controller.listen("login", Mojo.Event.tap, this.login);
  },

  login: function() {
    this.disableButton();
    User.login(this.user.username, this.user.password, this.loginSuccess.bind(this), this.loginFailure.bind(this));
  },

  loginSuccess: function() {
    this.controller.stageConroller.popScene();
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
