Redbox = {
  Api: {
    findKiosks: function(lat, lng, movieId, success, failure) {
      this.post(
        Redbox.Kiosk.locateUrl,
        Redbox.Kiosk.buildLocateRequest(lat, lng, movieId),
        function(response) {success(Redbox.Kiosk.parseLocateResponse(response.responseJSON))},
        failure
      )
    },

    getInventory: function(kioskId, success, failure) {
      this.post(
        Redbox.Kiosk.inventoryUrl,
        Redbox.Kiosk.buildInventoryRequest(this.id),
        function(response) {success(Redbox.Kiosk.parseInventoryResponse(response.responseJSON))},
        failure
      )
    },

    login: function(username, password, success, failure) {
      this.post(
        Redbox.Account.loginUrl(),
        Redbox.Account.buildLoginRequest(username, password),
        function(response) {(Redbox.Account.parseLoginResponse(response.responseJSON) ? success : failure)()},
        failure
      )
    },

    createCart: function(kioskId, movieId, success, failure) {
      this.post(
        Redbox.Kiosk.selectUrl(kioskId),
        Redbox.Kiosk.buildSelectRequest(),
        this.addMovieToCart.bind(this, movieId, success, failure),
        failure
      )
    },

    addMovieToCart: function(movieId, success, failure) {
      this.post(
        Redbox.Cart.addMovieUrl(),
        Redbox.Cart.buildAddMovieRequest(),
        this.getCart.bind(this, success, failure),
        failure
      )
    },

    getCart: function(success, failure) {

    },

    post: function(url, body, success, failure, sendCookie) {
      new Ajax.Request(url, {
        method: "post",
        requestHeaders: {"Cookie": "RB_2.0=1"},
        contentType: "application/json",
        postBody: body,
        onSuccess: success,
        onFailure: failure,
        onComplete: function(response) {
          Log.debug("redbox response: " + response.responseText)
          //Log.debug("redbox headers: " + response.getAllHeaders())
        }
      })
    }
  },

  initialize: function() {
  },

  Images: {
    thumbnailUrl: function() {
      return "http://images.redbox.com/Images/Thumbnails"
    }
  },

  Account: {
    loginUrl: function() {
      return "https://www.redbox.com/api/Account/Login/"
    },

    buildLoginRequest: function(username, password) {
      return Object.toJSON({
        userName: username,
        password: password,
        createPersistentCookie: false,
        '__K': "UNKNOWN"
      })
    },

    parseLoginResponse: function(json) {
      return json.d.data.loggedIn
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
    addMovieUrl: function(movieId) {
      return "http://www.redbox.com/api/Cart/AddItem/"
    },

    buildAddMovieRequest: function(movieId) {
      return Object.toJSON({
        "productRef": movieId,
        "productType": 1,
        "runView": false,
        "__K": "UNKNOWN"
      })
    },

    parseAddMovieResponse: function(json) {
      return json.d.success
    },

    refreshUrl: function() {
      return "https://www.redbox.com/ajax.svc/Cart/Refresh/"
    },

    buildRefreshRequest: function() {
      return Object.toJSON({
        'applyCredit': false,
        '__K': Redbox.key
      })
    },

    parseRefreshResponse: function(json) {
      var cart = new Cart()
      cart.original = json.d.cart

      cart.price = cart.original.SubTotal || cart.original.DiscountedSubTotal
      cart.tax = cart.original.Tax
      cart.total = cart.original.GrandTotal
      cart.canCheckout = cart.original.CanCheckout
      cart.pickupBy = cart.original.PickupBy

      cart.kiosk = new Kiosk()
      cart.kiosk.vendor = Redbox.Kiosk.buildNameFrom(cart.original.Kiosk.Vendor, cart.original.Kiosk.Name)
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
    selectUrl: function(kioskId) {
      return "http://www.redbox.com/api/Store/SelectStore/" + kioskId
    },

    buildSelectRequest: function() {
      return Object.toJSON({
        '__K': "UNKNOWN"
      })
    },

    locateUrl: "http://www.redbox.com/api/Store/GetStores/",

    buildLocateRequest: function(lat, lng, movieId) {
      var json = {
        resultOptions: {
          profile: true,
          status: true,
          proximity: true,
          max: 50
        },

        filters: {
          proximity: {
            lat: lat,
            lng: lng,
            radius: 50
          },

          "__K": "UNKNOWN"
        }
      }

      if(movieId) {
        json.resultOptions.inventory = true
        json.resultOptions.inventoryProducts = [movieId]
      }

      return Object.toJSON(json)
    },

    parseLocateResponse: function(json) {
      var kiosks = []

      json.d.data.each(function(kiosk) {
        if(kiosk.status.online && (!kiosk.inventory || (kiosk.inventory.products.length && kiosk.inventory.products.first().stock))) {
          kiosks.push(Redbox.Kiosk.buildFromJson(kiosk))
        }
      })

      return kiosks
    },

    inventoryUrl: "http://www.redbox.com/api/Store/GetStores/",

    buildInventoryRequest: function(kioskId) {
      var json = {
        filters: {
          ids: [kioskId]
        },

        resultOptions: {
          inventory: true
        },

        "__K": "UNKNOWN"
      }

      return Object.toJSON(json)
    },

    parseInventoryResponse: function(json) {
      var ids = []

      json.d.data.first().inventory.products.each(function(product) {
        if(product.stock) {
          ids.push(product.id)
        }
      })

      return ids
    },

    buildFromJson: function(json) {
      var kiosk = new Kiosk()
      kiosk.id = json.id
      kiosk.address = json.profile.addr
      kiosk.city = json.profile.city
      kiosk.distance = json.proximity.dist
      kiosk.latitude = json.proximity.lat
      kiosk.longitude = json.proximity.lng
      kiosk.name = json.profile.name
      kiosk.state = json.profile.state
      kiosk.vendor = Redbox.Kiosk.buildNameFrom(json.profile.vendor, json.profile.name)
      kiosk.zip = json.profile.zip
      return kiosk;
    },

    buildNameFrom: function(vendor, name) {
      name = name || ""
      name = name.replace("Machine ", "")

      if(name.length) {
        name = " - " + name
      }

      return vendor + name
    }
  }
}
