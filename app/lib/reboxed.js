Reboxed = Reboxed || {}

Reboxed.notify = function(message, refresh) {
  Mojo.Controller.getAppController().showBanner({messageText: message}, (refresh ? "refresh" : ""), "reboxed")
}

Reboxed.Metrix = new Metrix()