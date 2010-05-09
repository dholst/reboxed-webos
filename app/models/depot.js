var Depot = {
  initialize: function(onSuccess) {
    console.log("initializing datastore")

    this.depot = new Mojo.Depot(
      {name: "ext:reboxed", version: 1, replace: false},
      function() {console.log("datastore initialized"); onSuccess()},
      function() {console.log("could not initialize datastore")}
    );
  },

  get: function(name, callback) {
    console.log("retrieving " + name + " from the datastore")
    this.depot.get(name, callback, function() {throw "depot get failure"})
  },

  add: function(name, value, callback) {
    console.log("adding " + name + " to the datastore")
    this.depot.add(name, value, callback, function() {throw "depot add failure"})
  }
}
