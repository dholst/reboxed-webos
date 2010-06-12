Reboxed = Reboxed || {}

Reboxed.notify = function(message) {
  Mojo.Controller.getAppController().showBanner({messageText: message}, "", "reboxed")
}

Reboxed.Metrix = new Metrix()