Redbox.Api2 = {
  findKiosks: function(lat, lng, movieId, success, failure) {
    var self = this

    self.post(
      self.locateKioskUrl(),
      self.buildLocateKioskRequest(lat, lng, movieId),
      function(response) {success(self.parseLocateKioskResponse(response.responseJSON))},
      failure
    )
  },

  getInventory: function(kioskId, success, failure) {
    var self = this

    self.post(
      self.kioskInventoryUrl(),
      self.buildKioskInventoryRequest(kioskId),
      function(response) {success(self.parseKioskInventoryResponse(response.responseJSON))},
      failure
    )
  },

  login: function(username, password, success, failure) {
    var self = this

    self.post(
      self.loginUrl(),
      self.buildLoginRequest(username, password),
      function(response) {(self.parseLoginResponse(response.responseJSON) ? success : failure)()},
      failure
    )
  },

  createCart: function(kioskId, movieId, success, failure) {
    var self = this

    self.post(
      self.addMovieUrl(),
      self.buildAddMovieRequest(movieId),
      function(response) {
        if(self.parseAddMovieResponse(response.responseJSON)) {
          self.selectKiosk(kioskId, success, failure)
        }
        else {
          failure()
        }
      },
      failure
    )
  },

  selectKiosk: function(kioskId, success, failure) {

  },

  getCart: function(success, failure) {
    var self = this

    self.post(
      self.getCartUrl(),
      self.buildGetCartRequest(),
      function(response) {success(self.parseGetCartResponse(response.responseJSON))},
      failure
    )
  },

  getCards: function(success, failure) {
    var self = this

    self.post(
      self.getCardsUrl(),
      self.buildGetCardsRequest(),
      function(response) {success(self.parseGetCardsResponse(response.responseJSON))},
      failure
    )
  },

  checkout: function(cart, card, cvc, success, failure) {
    var self = this

    self.post(
      self.checkoutUrl(),
      self.buildCheckoutRequest(cart, card, cvc),
      function(response) {(self.parseCheckoutResponse(response.responseJSON) ? success : failure)()},
      failure
    )
  },

  post: function(url, body, success, failure, sendCookie) {
    Log.debug("redbox request: " + body)

    var parameters = {
      method: "post",
      contentType: "application/json",
      postBody: body,
      onSuccess: success,
      onFailure: failure,
      onComplete: function(response) {
        Log.debug("redbox response: " + response.responseText)
        Log.debug("redbox headers: " + response.getAllHeaders())
      }
    }

    new Ajax.Request(url, parameters)
  },

  loginUrl: function() {
    return this.secureEndpoint + "Account/Login/"
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
    return this.secureEndpoint + "Account/GetCards/";
  },

  buildGetCardsRequest: function() {
    return Object.toJSON({
      '__K': "UNKNOWN"
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
  },

  addMovieUrl: function(movieId) {
    return this.endpoint + "Cart/AddItem/"
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

  //refreshUrl: function() {
  //return "https://www.redbox.com/ajax.svc/Cart/Refresh/"
  //},

  //buildRefreshRequest: function() {
  //return Object.toJSON({
  //'applyCredit': false,
  //'__K': Redbox.key
  //})
  //},

  //parseRefreshResponse: function(json) {
  //var cart = new Cart()
  //cart.original = json.d.cart

  //cart.price = cart.original.SubTotal || cart.original.DiscountedSubTotal
  //cart.tax = cart.original.Tax
  //cart.total = cart.original.GrandTotal
  //cart.canCheckout = cart.original.CanCheckout
  //cart.pickupBy = cart.original.PickupBy

  //cart.kiosk = new Kiosk()
  //cart.kiosk.vendor = Redbox.Kiosk.buildNameFrom(cart.original.Kiosk.Vendor, cart.original.Kiosk.Name)
  //cart.kiosk.address = cart.original.Kiosk.Address
  //cart.kiosk.city = cart.original.Kiosk.City
  //cart.kiosk.state = cart.original.Kiosk.State
  //cart.kiosk.zip = cart.original.Kiosk.Zip

  //if(cart.original.Items.length > 0) {
  //cart.movie = new Movie()
  //cart.movie.name = cart.original.Items.last().Name
  //cart.movie.rating = cart.original.Items.last().Rating
  //}

  //return cart
  //},

  //reserveUrl: function() {
  //return "https://www.redbox.com/ajax.svc/Cart/Reserve/"
  //},

  //buildReserveRequest: function(cart, card, verificationCode) {
  //var request = {}
  //request.Cart = cart.original
  //request.Card = card.original
  //request.Card.CVV = verificationCode
  //request['__K'] = Redbox.key

  //return Object.toJSON(request)
  //},

  //parseReserveResponse: function(json) {
  //return json.d.msgs.length == 0
  //}
  //},

  selectUrl: function(kioskId) {
    return this.endpoint + "Store/SelectStore/" + kioskId
  },

  buildSelectRequest: function() {
    return Object.toJSON({
      '__K': "UNKNOWN"
    })
  },

  locateKioskUrl: function() {
    return this.endpoint + "Store/GetStores/"
  },

  buildLocateKioskRequest: function(lat, lng, movieId) {
    var json = {
      filters: {
        proximity: {
          lat: lat,
          lng: lng,
          radius: 50
        }
      },

      resultOptions: {
        max: 50,
        profile: true,
        status: true,
        proximity: true,
        user: true
      },

      "__K": "UNKNOWN"
    }

    if(movieId) {
      json.resultOptions.inventory = true
      json.resultOptions.inventoryProducts = [movieId]
    }

    return Object.toJSON(json)
  },

  parseLocateKioskResponse: function(json) {
    var self = this
    var kiosks = []

    json.d.data.each(function(kiosk) {
      if(kiosk.status.online && (!kiosk.inventory || (kiosk.inventory.products.length && kiosk.inventory.products.first().stock))) {
        kiosks.push(self.buildKiosk(kiosk))
      }
    })

    return kiosks
  },

  kioskInventoryUrl: function() {
    return this.endpoint + "Store/GetStores/"
  },

  buildKioskInventoryRequest: function(kioskId) {
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

  parseKioskInventoryResponse: function(json) {
    var ids = []

    json.d.data.first().inventory.products.each(function(product) {
      if(product.stock) {
        ids.push(product.id)
      }
    })

    return ids
  },

  buildKiosk: function(json) {
    var kiosk = new Kiosk()
    kiosk.id = json.id
    kiosk.address = json.profile.addr
    kiosk.city = json.profile.city
    kiosk.distance = json.proximity.dist
    kiosk.latitude = json.proximity.lat
    kiosk.longitude = json.proximity.lng
    kiosk.name = json.profile.name
    kiosk.state = json.profile.state
    kiosk.vendor = this.buildName(json.profile.vendor, json.profile.name)
    kiosk.zip = json.profile.zip
    return kiosk;
  },

  buildName: function(vendor, name) {
    name = name || ""
    name = name.replace("Machine ", "")

    if(name.length) {
      name = " - " + name
    }

    return vendor + name
  },

  secureEndpoint: "https://www.redbox.com/api/",
    endpoint: "http://www.redbox.com/api/"
}

