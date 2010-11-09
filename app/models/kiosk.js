Kiosk = Class.create({
  initialize: function(json) {
    if(json) {
      for(i in json) {
        this[i] = json[i]
      }
    }
  },

  toJson: function() {
    return {
      id: this.id,
      address: this.address,
      city: this.city,
      distance: this.distance,
      latitude: this.latitude,
      longitude: this.longitude,
      name: this.name,
      state: this.state,
      vendor: this.vendor,
      zip: this.zip,
      favorite: this.favorite
    }
  },

  calculateDistanceRange: function() {
    if(this.favorite) {
      this.distance = 0
      this.distanceRange = "Favorites"
    }
    else {
      var ranges = [1, 5, 10, 20, 30, 40, 50];
      var range;

      for(var i = 0; i < ranges.length; i++) {
        if(this.distance < ranges[i]) {
          range = ranges[i];
          break;
        }
      }

      if(range) {
        this.distanceRange = range + " mile" + (range == 1 ? "" : "s") + " or less"
      }
      else {
        this.distanceRange = "more than " + ranges.last() + " miles";
      }
    }

    return this.distanceRange;
  },

  loadInventory: function(success, failure) {
    new Ajax.Request(Redbox.Kiosk.inventoryUrl, {
      method: "post",
      contentType: "application/json",
      postBody: Redbox.Kiosk.buildInventoryRequest(this.id),
      onSuccess: this.loadInventorySuccess.bind(this, success, failure),
      onFailure: failure
    });
  },

  loadInventorySuccess: function(success, failure, response) {
    var ids = Redbox.Kiosk.parseInventoryResponse(response.responseJSON)

    var findAllSuccess = function(movies) {
      this.movies = movies
      success()
    }.bind(this)

    this.movies = Movie.findAll(ids, findAllSuccess, failure)
  }
})

Kiosk.locate = function(id, lat, long, success, failure) {
  var trim = function(position) {
    var parts = ("" + position).split(".")
    parts[parts.length - 1] = (parts.last() + "000000").slice(0, 6)
    return parseFloat(parts.join("."))
  }

  lat = trim(lat)
  long = trim(long)

  new Ajax.Request(Redbox.Kiosk.locateUrl, {
    method: "post",
    contentType: "application/json",
    postBody: Redbox.Kiosk.buildLocateRequest(lat, long, id),
    onSuccess: function(response) {success(Redbox.Kiosk.parseLocateResponse(response.responseJSON))},
    onFailure: failure
  });
}
