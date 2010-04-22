HelpAssistant = Class.create(BaseAssistant, {
  initialize: function() {
  },

  setup: function($super) {
    $super();
    this.noAppMenu();
    this.controller.update('app-name', Mojo.appInfo.title);
  	this.controller.update('app-details', Mojo.appInfo.version + " by " + Mojo.appInfo.vendor);
  }
});
