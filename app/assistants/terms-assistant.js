TermsAssistant = Class.create(BaseAssistant, {
  initialize: function(nextScene) {
    this.nextScene = nextScene;
  },

  setup: function() {
    this.controller.listen("accept-terms", Mojo.Event.tap, this.accept = this.accept.bind(this));
  },

  accept: function() {
    new Mojo.Model.Cookie("termsOfUseAccepted").put(true);
    this.controller.stageController.swapScene(this.nextScene);
  }
});
