var Log = {
  items: [],

  debug: function(message) {
    Mojo.Log.info(message)
    this.items.push({message: message})

    if(this.items.length > 50) {
      this.items.splice(0, 1)
    }
  }
}
