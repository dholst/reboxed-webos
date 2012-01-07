Yahoo = {
  geocode: function(location, success, failure) {
    new Ajax.Request("http://where.yahooapis.com/geocode", {
      method: "get",
      parameters: {
        appid: "WPa.RN7V34HTuIeClhDW1m6.ippi8LbvUl2wh4rvvNoc404G1smYIgBmnaZuC.Mc3xF2",
        q: location
      },
      onSuccess: Yahoo.geoLocateSuccess.bind(this, success),
      onFailure: Yahoo.geoLocateFailure.bind(this, failure)
    })
  },

  geoLocateSuccess: function(success, response) {
    var xml = response.responseXML;
    var result = xml.getElementsByTagName("Result")[0]
    success(this.getTextFromNode(result, "latitude"), this.getTextFromNode(result, "longitude"));
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
