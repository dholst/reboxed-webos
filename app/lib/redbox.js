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
    },

    parseLoginResponse: function(json) {
      return json.d.success;
    },

    getCardsUrl: function() {
      return "https://www.redbox.com/ajax.svc/Account/GetCards/"
    },

    buildGetCardsRequest: function() {
      return "{}";
    },

    parseGetCardsResponse: function(json) {
      var cards = [];
      var jsonCards = json.d;

      jsonCards.each(function(jsonCard) {
        var card = new Card();
        card.original = jsonCard;
        card.id = card.original.ID;
        card.number = card.original.CardNumber;
        card.alias = card.original.Alias;

        if(card.original.IsPreferred) {
          cards.unshift(card);
        }
        else {
          cards.push(card);
        }
      });

      return cards;
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
      cart.original = json.d.cart;

      cart.price = cart.original.Total;
      cart.tax = cart.original.Tax;
      cart.total = cart.original.GrandTotal;
      cart.canCheckout = cart.original.CanCheckout;
      cart.pickupBy = cart.original.PickupBy;

      cart.kiosk = new Kiosk();
      cart.kiosk.vendor = cart.original.Kiosk.Vendor;
      cart.kiosk.address = cart.original.Kiosk.Address;
      cart.kiosk.city = cart.original.Kiosk.City;
      cart.kiosk.state = cart.original.Kiosk.State;
      cart.kiosk.zip = cart.original.Kiosk.Zip;

      if(cart.original.Items.length > 0) {
        cart.movie = new Movie();
        cart.movie.name = cart.original.Items.last().Name;
        cart.movie.rating = cart.original.Items.last().Rating;
      }

      return cart;
    },

    reserveUrl: function() {
      return "https://www.redbox.com/ajax.svc/Cart/Reserve/";
    },

    buildReserveRequest: function(cart, card, verificationCode) {
      var request = {};
      request.Cart = cart.original;
      request.Card = card.original;
      request.Card.CVV = verificationCode;
      return Object.toJSON(request);
    },

    parseReserveResponse: function(json) {
      return json.d.msgs.length == 0;
    }
  },

  Kiosk: {
    locateUrl: "http://www.redbox.com/ajax.svc/Kiosk/GetNearbyKiosks/",

    buildLocateRequest: function(lat, long, movieId) {
      var json = {
        latitude: lat,
        longitude: long,
        radius: 50,
        maxKiosks: 50,
        mcdOnly: false,
        getInv: false,
        pageSize: 50,
        page: 1
      };

      if(movieId) {
        json.titleID = movieId;
      }

      return Object.toJSON(json);
    },

    parseLocateResponse: function(json) {
      var kiosks = [];
      var profiles = json.d.profiles;
      var states = json.d.states;

      profiles.each(function(profile, index) {
        var state = states[index];

        if(state.Online && (!state.Inv || (state.Inv.length && state.Inv.first().Qty))) {
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

/* cart refresh
 {
    "d": {
        "cart": {
            "KioskID": 20727,
            "Kiosk": {
                "ID": 20727,
                "Address": "1905 E 7th St",
                "City": "Atlantic",
                "State": "IA",
                "Zip": "50022-1916",
                "Label": null,
                "AddressLine2": null,
                "AddressDisplayName": "",
                "Indoor": true,
                "Vendor": "Walmart",
                "Attributes": {}
            },
            "KioskOnline": true,
            "Tax": "$0.07",
            "SubTotal": "$1.00",
            "Total": "$1.00",
            "GrandTotal": "$1.07",
            "Items": [{
                "ItemID": 0,
                "ProductID": 3172,
                "ProductTypeID": 1,
                "Name": "Brothers",
                "Img": "Brothers_3172.jpg",
                "Price": "$1.00",
                "FormatID": 1,
                "FormatName": "DVD",
                "Buy": false,
                "Status": 0,
                "EffectiveDate": {
                    "d": 634049172600000000,
                    "k": 1
                },
                "ExpireDate": null,
                "Rating": "R",
                "PromoCode": null,
                "CanCheckout": true,
                "Desc": "Captain Sam Cahill is embarking on his fourth tour of duty, leaving behind his beloved wife and two daughters. When Sam’s Blackhawk helicopter is shot down in the mountains of Afghanistan, the worst is presumed, leaving an enormous void in the family. Despite a dark history, Sam’s charismatic younger brother Tommy steps in to fill the family void.\r\n\r\nRated R by the Motion Picture Association of America for language and some disturbing violent content. \r\n\r\nWidescreen.\r\nClosed captioned.\r\nSpanish subtitles available.\r\n",
                "InitialNight": "$1.00",
                "ExtraNight": "$1.00",
                "Duration": 0
            }],
            "CanCheckout": true,
            "PickupBy": "March 25, 2010 9:00 PM",
            "ReceiptEmail": null,
            "Mobile": false,
            "InvoiceID": 0
        },
        "msgs": [],
        "msgKeys": [],
        "critical": false
    }
}
*/

/* cards
{
    "d": [{
        "ID": 49802438,
        "CardType": "Discover",
        "CardNumber": "XXXXXXXXXXXX9538",
        "CardNo4": "9538",
        "ExpMonth": "09",
        "ExpYear": "14",
        "Name": "Darrin Holst",
        "Zip": "50039",
        "CVV": null,
        "Alias": "Discover",
        "IsPreferred": true,
        "StoreCard": true
    }]
}
*/