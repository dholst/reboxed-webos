Kiosk = Class.create({
});

Kiosk.locate = function(id, lat, long, success, failure) {
  var trim = function(position) {
    var parts = ("" + position).split(".");
    parts[parts.length - 1] = (parts.last() + "000000").slice(0, 6);
    return parseFloat(parts.join("."));
  };

  lat = trim(lat);
  long = trim(long);
  console.log("locating " + id + " at " + lat + ", " + long);

  var request = {
    latitude: lat,
    longitude: long,
    radius: 30,
    maxKiosks: 50,
    mcdOnly: false,
    getInv: false,
    pageSize: 50,
    page: 1,
    titleID: id
  };

  new Ajax.Request(Redbox.Kiosk.locateUrl, {
    method: "post",
    contentType: "application/json",
    postBody: Redbox.Kiosk.buildLocateRequest(lat, long, id),
    onSuccess: function(response) {success(Redbox.Kiosk.parseLocateResponse(response.responseJSON))},
    onFailure: failure
  });
};
