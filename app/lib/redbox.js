Redbox = {
  Kiosk: {
    locateUrl: "http://www.redbox.com/ajax.svc/Kiosk/GetNearbyKiosks/",

    buildLocateRequest: function(lat, long, movieId) {
      var foo = Object.toJSON({
        latitude: lat,
        longitude: long,
        radius: 30,
        maxKiosks: 50,
        mcdOnly: false,
        getInv: false,
        pageSize: 50,
        page: 1,
        titleID: movieId
      });
      
      console.log(foo)
      return foo;
    },

    parseLocateResponse: function(json) {
      var kiosks = [];
      var profiles = json.d.profiles;
      var states = json.d.states;

      profiles.each(function(profile, index) {
        var state = states[index];

        if(state.Online && state.Inv.length && state.Inv.first().Qty) {
          kiosks.push(Redbox.Kiosk.buildFromJson(profile));
        }
      });

      return kiosks;
    },

    buildFromJson: function(json) {
      var kiosk = new Kiosk();
      kiosk.id = json.ID;
      kiosk.address = json.Addr;
      kiosk.city = json.City;
      kiosk.distance = json.Dist;
      kiosk.latitude = json.Lat;
      kiosk.longitude = json.Lng;
      kiosk.name = json.Name;
      kiosk.state = json.St;
      kiosk.vendor = json.Vdr;
      kiosk.zip = json.Zip;
      kiosk.indoor = json.Ind;
      kiosk.driveup_maybe = json.Drv;
      return kiosk;
    }
  }
}