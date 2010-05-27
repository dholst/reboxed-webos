Redbox = {
  initialize: function() {
    new Ajax.Request("http://www.redbox.com/", {
      method: "get",
      onSuccess: function(response) {
        var match = response.responseText.match(/__K.*value="(.*)"/)

        if(match && match.length > 1) {
          Redbox.key = match[1]
          console.log(Redbox.key)
        }
      }
    })
  },

  Images: {
    thumbnailUrl: function() {
      return "http://images.redbox.com/Images/Thumbnails"
    }
  },

  Account: {
    loginUrl: function() {
      return "https://www.redbox.com/ajax.svc/Account/Login/"
    },

    buildLoginRequest: function(username, password) {
      return Object.toJSON({
        userName: username,
        password: password,
        createPersistentCookie: false,
        '__K': Redbox.key
      })
    },

    parseLoginResponse: function(json) {
      return json.d.success
    },

    getCardsUrl: function() {
      return "https://www.redbox.com/ajax.svc/Account/GetCards/"
    },

    buildGetCardsRequest: function() {
      return Object.toJSON({
        '__K': Redbox.key
      })
    },

    parseGetCardsResponse: function(json) {
      var cards = []
      var jsonCards = json.d

      jsonCards.each(function(jsonCard) {
        var card = new Card()
        card.original = jsonCard
        card.id = card.original.ID
        card.number = card.original.CardNumber
        card.alias = card.original.Alias

        if(card.original.IsPreferred) {
          cards.unshift(card)
        }
        else {
          cards.push(card)
        }
      })

      return cards
    }
  },

  Cart: {
    addItemUrl: function(movieId) {
      return "https://www.redbox.com/ajax.svc/Cart/AddItem/" + movieId
    },

    buildAddItemRequest: function(kioskId) {
      return Object.toJSON({
        buy: false,
        kiosk: kioskId,
        '__K': Redbox.key
      })
    },

    refreshUrl: function() {
      return "https://www.redbox.com/ajax.svc/Cart/Refresh/"
    },

    buildRefreshRequest: function() {
      return Object.toJSON({
        '__K': Redbox.key
      })
    },

    parseRefreshResponse: function(json) {
      var cart = new Cart()
      cart.original = json.d.cart

      cart.price = cart.original.SubTotal
      cart.tax = cart.original.Tax
      cart.total = cart.original.GrandTotal
      cart.canCheckout = cart.original.CanCheckout
      cart.pickupBy = cart.original.PickupBy

      cart.kiosk = new Kiosk()
      cart.kiosk.vendor = cart.original.Kiosk.Vendor
      cart.kiosk.address = cart.original.Kiosk.Address
      cart.kiosk.city = cart.original.Kiosk.City
      cart.kiosk.state = cart.original.Kiosk.State
      cart.kiosk.zip = cart.original.Kiosk.Zip

      if(cart.original.Items.length > 0) {
        cart.movie = new Movie()
        cart.movie.name = cart.original.Items.last().Name
        cart.movie.rating = cart.original.Items.last().Rating
      }

      return cart
    },

    reserveUrl: function() {
      return "https://www.redbox.com/ajax.svc/Cart/Reserve/"
    },

    buildReserveRequest: function(cart, card, verificationCode) {
      var request = {}
      request.Cart = cart.original
      request.Card = card.original
      request.Card.CVV = verificationCode
      request['__K'] = Redbox.key

      return Object.toJSON(request)
    },

    parseReserveResponse: function(json) {
      return json.d.msgs.length == 0
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
        page: 1,
        '__K': Redbox.key
      };

      if(movieId) {
        json.titleID = movieId
      }

      return Object.toJSON(json)
    },

    parseLocateResponse: function(json) {
      var kiosks = []
      var profiles = json.d.profiles
      var states = json.d.states

      profiles.each(function(profile, index) {
        var state = states[index]

        if(state.Online && (!state.Inv || (state.Inv.length && state.Inv.first().Qty))) {
          kiosks.push(Redbox.Kiosk.buildFromJson(profile))
        }
      })

      return kiosks
    },

    inventoryUrl: "http://www.redbox.com/data.svc/TitleAvailability/",

    buildInventoryRequest: function(kioskId) {
      var json = {
        type: "TitleAvailability",
        pk: "ID",
        statements: [{filters: {KioskID: kioskId}}],
        '__K': Redbox.key
      }

      return Object.toJSON(json)
    },

    parseInventoryResponse: function(json) {
      var ids = []

      for(var i = 0; i < json.d.length; i++) {
        if(json.d[i].QtyRange) {
          ids.push(json.d[i].ID)
        }
      }

      return ids
    },

    buildFromJson: function(json) {
      var kiosk = new Kiosk()
      kiosk.id = json.ID
      kiosk.address = json.Addr
      kiosk.city = json.City
      kiosk.distance = json.Dist
      kiosk.latitude = json.Lat
      kiosk.longitude = json.Lng
      kiosk.name = json.Name
      kiosk.state = json.St
      kiosk.vendor = json.Vdr
      kiosk.zip = json.Zip
      kiosk.indoor = json.Ind
      kiosk.driveup_maybe = json.Drv
      return kiosk;
    }
  }
}
