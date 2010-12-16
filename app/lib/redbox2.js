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
      self.getMoviesInCartUrl(),
      self.buildGetMoviesInCartRequest(),
      function(response) {self.removeMovieFromCart(self.parseGetMoviesInCartResponse(response.responseJSON), kioskId, movieId, success, failure)},
      failure
    )
  },

  removeMovieFromCart: function(movies, kioskId, movieId, success, failure) {
    var self = this

    if(movies.length) {
      self.post(
        self.removeMovieUrl(),
        self.buildRemoveMovieRequest(movies.shift()),
        self.removeMovieFromCart.bind(self, movies, kioskId, movieId, success, failure),
        failure
      )
    }
    else {
      self.addMovieToCart(kioskId, movieId, success, failure)
    }
  },

  addMovieToCart: function(kioskId, movieId, success, failure) {
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
    var self = this

    self.post(
      self.selectKioskUrl(kioskId),
      self.buildSelectKioskRequest(),
      function(response) {
        if(self.parseSelectKioskResponse(response.responseJSON)) {
          self.getCart(success, failure)
        }
        else {
          failure()
        }
      },
      failure
    )
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
    Log.debug("redbox request: " + url + " - " + body)

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

    if(json.d && json.d.data)
      var jsonCards = json.d.data

    json.d.data.each(function(jsonCard) {
      var card = new Card()
      card.original = jsonCard
      card.id = card.original.id
      card.number = card.original.num
      card.alias = card.original.alias

      if(card.original.pref) {
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
    return json.d && json.d.success && json.d.data && json.d.data.session && json.d.data.session.items && json.d.data.session.items.length == 1
  },

  selectKioskUrl: function(kioskId) {
    return this.secureEndpoint + "Store/SelectStore/" + kioskId
  },

  buildSelectKioskRequest: function() {
    return Object.toJSON({
      "__K": "UNKNOWN"
    })
  },

  getMoviesInCartUrl: function() {
    return this.getCartUrl()
  },

  buildGetMoviesInCartRequest: function() {
    return this.buildGetCartRequest()
  },

  parseGetMoviesInCartResponse: function(json) {
    var items = []

    if(json.d && json.d.success && json.d.data && json.d.data.cart && json.d.data.cart.items.length) {
      for(var i = 0; i < json.d.data.cart.items.length; i++) {
        items.push(json.d.data.cart.items[i].productRef)
      }
    }

    return items
  },

  removeMovieUrl: function() {
    return this.secureEndpoint + "Cart/RemoveItem/"
  },

  buildRemoveMovieRequest: function(movieId) {
    return Object.toJSON({
      "productRef": movieId,
      "productType": 1,
      "runView": false,
      "__K": "UNKNOWN"
    })
  },

  parseSelectKioskResponse: function(json) {
    return json.d && json.d.success && json.d.data
  },

  getCartUrl: function() {
    return this.secureEndpoint + "Cart/GetView/"
  },

  buildGetCartRequest: function() {
    return Object.toJSON({
      "__K": "UNKNOWN"
    })
  },

  parseGetCartResponse: function(json) {
    var cart = null

    if(json.d && json.d.success && json.d.data && json.d.data.cart && json.d.data.cart.items.length == 1 && json.d.data.cart.items[0].canCheckout) {
      cart = new Cart()
      cart.original = json.d.data.cart

      cart.price = cart.original.discountedSubTotal || cart.original.subTotal
      cart.tax = cart.original.tax
      cart.total = cart.original.grandTotal
      cart.pickupBy = cart.original.pickupBy

      cart.movie = new Movie()
      cart.movie.name = cart.original.items[0].name
      cart.movie.rating = cart.original.items[0].rating
    }

    return cart
  },

  checkoutUrl: function() {
    return this.secureEndpoint + "Cart/Checkout/"
  },

  buildCheckoutRequest: function(cart, card, verificationCode) {
    var request = cart.original
    request.card = card.original
    request.card.cvv = verificationCode
    request['__K'] = "UNKNOWN"

    return Object.toJSON(request)
  },

  parseCheckoutResponse: function(json) {
    if(json.d && json.d.success && json.d.data && json.d.data.cart && json.d.data.cart.errors) {
      return !json.d.data.cart.errors.errs || json.d.data.cart.errors.errs.length == 0
    }
    else {
      return false
    }
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

