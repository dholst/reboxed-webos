var Log = {
  items: [],

  debug: function(message) {
    console.log(message)
    this.items.push({message: message})
  }
}