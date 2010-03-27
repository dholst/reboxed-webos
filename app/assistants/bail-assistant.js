BailAssistant = Class.create({
  initialize: function(message) {
    this.message = message;
  },

  setup: function() {
    $$('.fullscreen-message').first().update(this.message);
  }
});
