BaseAssistant = Class.create({
  addSpinner: function(id) {
    this.controller.setupWidget(id, {spinnerSize: "large"}, this);
    var marginTop = (Mojo.Environment.DeviceInfo.maximumCardHeight / 2) - 64;
    $(id).setStyle({marginTop: marginTop + "px"});
  }
});