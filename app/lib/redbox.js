Redbox = {
  Images: {
    thumbnailUrl: function() {
      return "http://images.redbox.com/Images/Thumbnails";
    }
  },
  
  Account: {
    loginUrl: function() {
      return "https://www.redbox.com/ajax.svc/Account/Login/";
    },
    
    buildLoginRequest: function(username, password) {
      return Object.toJSON({
        userName: username,
        password: password,
        createPersistentCookie: false
      });
    }    
  },

  Cart: {
    addItemUrl: function(movieId) {
      return "https://www.redbox.com/ajax.svc/Cart/AddItem/" + movieId;
    },

    buildAddItemRequest: function(kioskId) {
      return Object.toJSON({
        buy: false,
        kiosk: kioskId
      })
    },

    refreshUrl: function() {
      return "https://www.redbox.com/ajax.svc/Cart/Refresh/";
    },

    buildRefreshRequest: function() {
      return "{}";
    },

    parseRefreshResponse: function(json) {
      var cart = new Cart();
      var cartJson = json.d.cart;
      cart.price = cartJson.Total;
      cart.tax = cartJson.Tax;
      cart.total = cartJson.GrandTotal;
      cart.canCheckout = cartJson.CanCheckout;
      cart.pickupBy = cartJson.PickupBy;
      return cart;
    }
  },

  Kiosk: {
    locateUrl: "http://www.redbox.com/ajax.svc/Kiosk/GetNearbyKiosks/",

    buildLocateRequest: function(lat, long, movieId) {
      return Object.toJSON({
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