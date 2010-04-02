BaseAssistant = Class.create({
  setup: function() {
    this.controller.setupWidget("spinner", {spinnerSize: Mojo.Widget.spinnerLarge}, {});
  },

  spinnerOn: function(message) {
    var spinner = $$(".spinner").first()
    spinner.mojo.start();
    $$(".palm-scrim").first().show();

    var spinnerMessage = $("spinner-message");

    if(!spinnerMessage) {
      spinner.insert({after: '<div id="spinner-message" class="spinner-message palm-info-text"></div>'});
      spinnerMessage = $("spinner-message");
    }

    spinnerMessage.update(message || "");
  },

  spinnerOff: function() {
    if($("spinner-message")) {
      $("spinner-message").remove();
      $$(".spinner").first().mojo.stop();
      $$(".palm-scrim").first().hide();
    }
  },

  update: function(element, content) {
    this.controller.get(element).update(content);
  }
});