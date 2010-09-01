Yahoo = {
  geocode: function(location, success, failure) {
    new Ajax.Request("http://local.yahooapis.com/MapsService/V1/geocode", {
      method: "get",
      parameters: {
        appid: "WPa.RN7V34HTuIeClhDW1m6.ippi8LbvUl2wh4rvvNoc404G1smYIgBmnaZuC.Mc3xF2",
        location: location
      },
      onSuccess: Yahoo.geoLocateSuccess.bind(this, success),
      onFailure: Yahoo.geoLocateFailure.bind(this, failure)
    })
  },

  geoLocateSuccess: function(success, response) {
    var xml = response.responseXML;
    success(this.getTextFromNode(xml, "Latitude"), this.getTextFromNode(xml, "Longitude"));
  },

  getTextFromNode: function(doc, tag) {
    var elements = doc.getElementsByTagName(tag);

    if(elements.length > 0) {
      return elements[0].textContent;
    }
  },

  geoLocateFailure: function(failure, response) {
    Log.debug("geolocate failed, status: " + response.getStatus());
    failure();
  }
};
