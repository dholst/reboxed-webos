Kiosk = Class.create({
  initialize: function() {
    this.distanceRange = "FUMULLINS";
  },

  calculateDistanceRange: function() {
    if(this.distance < 1) {
      this.distanceRange = "less than 1 mile";
    }
    else if(this.distance < 5) {
      this.distanceRange = "less than 5 miles";
    }
    else if(this.distance < 15) {
      this.distanceRange = "less than 15 miles";
    }
    else if(this.distance < 30) {
      this.distanceRange = "less than 30 miles";
    }
    else {
      this.distanceRange = "more than 30 miles";
    }
  }
});

Kiosk.locate = function(id, lat, long, success, failure) {
  var trim = function(position) {
    var parts = ("" + position).split(".");
    parts[parts.length - 1] = (parts.last() + "000000").slice(0, 6);
    return parseFloat(parts.join("."));
  };

  lat = trim(lat);
  long = trim(long);

  new Ajax.Request(Redbox.Kiosk.locateUrl, {
    method: "post",
    contentType: "application/json",
    postBody: Redbox.Kiosk.buildLocateRequest(lat, long, id),
    onSuccess: function(response) {success(Redbox.Kiosk.parseLocateResponse(response.responseJSON))},
    onFailure: failure
  });
};
