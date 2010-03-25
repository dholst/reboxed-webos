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

  new Ajax.Request("http://www.redbox.com/ajax.svc/Kiosk/GetNearbyKiosks/", {
    method: "post",
    contentType: "application/json",
    postBody: Object.toJSON(request),
    onSuccess: function(response) {success(Kiosk.parseKiosks(response.responseJSON))},
    onFailure: failure
  });
};

Kiosk.parseKiosks = function(json) {
  var kiosks = [];
  var profiles = json.d.profiles;
  var states = json.d.states;

  profiles.each(function(profile, index) {
    var state = states[index];

    if(state.Online && state.Inv.length && state.Inv.first().Qty) {
      kiosks.push(Kiosk.fromJson(profile));
    }
  });

  return kiosks;
};

Kiosk.fromJson = function(json) {
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

/*
 {
    "d": {
        "profiles": [{
            "_Idx": 1,
            "ID": 12904,
            "Addr": "1215 141St St",
            "City": "Perry",
            "Dist": 4.9,
            "Lat": 41.831700,
            "Lng": -94.092009,
            "Name": "",
            "St": "IA",
            "Vdr": "Hy-Vee",
            "Zip": "50220-8127",
            "Ind": true,
            "Drv": true
        },
        {
            "_Idx": 2,
            "ID": 10365,
            "Addr": "325 1st St.",
            "City": "Perry",
            "Dist": 5.7,
            "Lat": 41.829233,
            "Lng": -94.106499,
            "Name": "",
            "St": "IA",
            "Vdr": "McDonalds",
            "Zip": "50220-1933",
            "Ind": false,
            "Drv": true
        },
        {
            "_Idx": 3,
            "ID": 22920,
            "Addr": "1815 S Story St",
            "City": "Boone",
            "Dist": 15.0,
            "Lat": 42.036025,
            "Lng": -93.879602,
            "Name": "",
            "St": "IA",
            "Vdr": "Walmart",
            "Zip": "50036-5230",
            "Ind": true,
            "Drv": true
        }],
        "states": [{
            "KioskID": 12904,
            "Online": true,
            "Inv": [{
                "ID": 3160,
                "Qty": 0
            }]
        },
        {
            "KioskID": 10365,
            "Online": true,
            "Inv": [{
                "ID": 3160,
                "Qty": 1
            }]
        },
        {
            "KioskID": 22920,
            "Online": true,
            "Inv": [{
                "ID": 3160,
                "Qty": 0
            }]
        }],
        "page": 1,
        "pageSize": 50,
        "totalKiosks": 19
    }
}
}],
*/