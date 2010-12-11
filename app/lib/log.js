var Log = {
  items: [],

  debug: function(message) {
    Mojo.Log.info(message)
    this.items.splice(0, 0, {message: message})
  }
}
