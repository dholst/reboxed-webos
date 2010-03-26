BaseAssistant = Class.create({
  addSpinner: function(id) {
    this.spinning = false;
    this.controller.setupWidget(id, {spinnerSize: "large"}, this);
    var marginTop = (Mojo.Environment.DeviceInfo.maximumCardHeight / 2) - 64;
    $(id).setStyle({marginTop: marginTop + "px"});
  },
  
  spinnerOn: function() {
    this.spinning = true;
    this.controller.modelChanged(this);
  },

  spinnerOff: function() {
    this.spinning = false;
    this.controller.modelChanged(this);
  }
});