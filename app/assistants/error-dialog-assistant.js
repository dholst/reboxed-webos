ErrorDialogAssistant = Class.create(BaseAssistant, {
  initialize: function($super, assistant, callback) {
    $super()
    this.controller = assistant.controller;
    this.callback = callback;
  },

  setup: function($super, widget) {
    $super();
    this.widget = widget;
    this.ok = this.ok.bind(this);
    this.controller.listen("error-message-callback", Mojo.Event.tap, this.ok);
  },

  ok: function() {
    this.controller.stopListening("error-message-callback", Mojo.Event.tap, this.ok);
    this.widget.mojo.close();
    this.callback();
  }
});