var Depot = {
  initialize: function(onSuccess) {
    Log.debug("initializing datastore")

    this.depot = new Mojo.Depot(
      {name: "ext:reboxed", version: 1, replace: false},
      function() {Log.debug("datastore initialized"); onSuccess()},
      function() {Log.debug("could not initialize datastore")}
    );
  },

  get: function(name, callback) {
    Log.debug("retrieving " + name + " from the datastore")
    this.depot.get(name, callback, function() {throw "depot get failure"})
  },

  add: function(name, value, callback) {
    Log.debug("adding " + name + " to the datastore")
    this.depot.add(name, value, callback, function() {throw "depot add failure"})
  }
}
