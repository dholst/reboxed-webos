ErrorDialogAssistant = Class.create(BaseAssistant, {
  initialize: function(callback) {
    this.callback = callback;
  },

  setup: function(widget) {
    this.widget = widget;
    this.ok = this.ok.bind(this);
    Mojo.Event.listen("error-message-callback", Mojo.Event.tap, this.ok);
  },

  ok: function() {
    Mojo.Event.stopListening("error-message-callback", Mojo.Event.tap, this.ok);
    this.widget.mojo.close();
    this.callback();
  }
});