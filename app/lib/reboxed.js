Reboxed = Reboxed || {}

Reboxed.Metrix = new Metrix()

Reboxed.notify = function(message, refresh) {
  Mojo.Controller.getAppController().showBanner({messageText: message}, (refresh ? "refresh" : ""), "reboxed")
}