BaseAssistant = Class.create({
  spinnerOn: function(message) {
    if(!this.spinner) {
      this.spinner = {spinning: false};
      this.controller.setupWidget("spinner", {spinnerSize: "large"}, this.spinner);
    }

    this.spinner.spinning = true;
    this.controller.modelChanged(this.spinner);
    message = message || "Working...";
    var marginTop = (Mojo.Environment.DeviceInfo.maximumCardHeight / 2) - 64;
    var spinner = $$(".spinner").first()
    spinner.setStyle({marginTop: marginTop + "px"});

    var spinnerMessage = $("spinner-message");

    if(!spinnerMessage) {
      spinner.insert({after: '<div id="spinner-message" class="spinner-message palm-info-text"></div>'});
      spinnerMessage = $("spinner-message");
    }

    spinnerMessage.update(message);
  },

  spinnerOff: function() {
    this.spinner.spinning = false;
    this.controller.modelChanged(this.spinner);
    $("spinner-message").remove();
  }
});