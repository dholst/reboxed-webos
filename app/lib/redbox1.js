Redbox.Api1 = {
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
      self.addMovieUrl(movieId),
      self.buildAddMovieRequest(kioskId),
      function(response) {
        if(self.parseAddMovieResponse(response.responseJSON)) {
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
    Log.debug("redbox request: " + body)

    new Ajax.Request(url, {
      method: "post",
      contentType: "application/json",
      postBody: body,
      onSuccess: success,
      onFailure: failure,
      onComplete: function(response) {
        Log.debug("redbox response: " + response.responseText)
        Log.debug("redbox headers: " + response.getAllHeaders())
      }
    })
  },

  /***********************************************************/
  /* LOGIN                                                   */
  /***********************************************************/
  loginUrl: function() {
    return this.https + "www.redbox.com/ajax.svc/Account/Login/"
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

  /***********************************************************/
  /* CARDS                                                   */
  /***********************************************************/
  getCardsUrl: function() {
    return this.https + "www.redbox.com/ajax.svc/Account/GetCards/"
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
  },

  /***********************************************************/
  /* ADD MOVIE TO CART                                       */
  /***********************************************************/
  addMovieUrl: function(movieId) {
    return this.https + "www.redbox.com/ajax.svc/Cart/AddItem/" + movieId
  },

  buildAddMovieRequest: function(kioskId) {
    return Object.toJSON({
      buy: false,
      kiosk: kioskId,
      '__K': Redbox.key
    })
  },

  parseAddMovieResponse: function(json) {
    return true
  },

  /***********************************************************/
  /* GET CART                                                */
  /***********************************************************/
  getCartUrl: function() {
    return this.https + "www.redbox.com/ajax.svc/Cart/Refresh/"
  },

  buildGetCartRequest: function() {
    return Object.toJSON({
      '__K': Redbox.key
    })
  },

  parseGetCartResponse: function(json) {
    var cart = new Cart()
    cart.original = json.d.cart

    cart.price = cart.original.SubTotal || cart.original.DiscountedSubTotal
    cart.tax = cart.original.Tax
    cart.total = cart.original.GrandTotal
    cart.canCheckout = cart.original.CanCheckout
    cart.pickupBy = cart.original.PickupBy

    cart.kiosk = new Kiosk()
    cart.kiosk.vendor = this.buildName(cart.original.Kiosk.Vendor, cart.original.Kiosk.Name)
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

  /***********************************************************/
  /* CHECKOUT                                                */
  /***********************************************************/
  checkoutUrl: function() {
    return this.https + "www.redbox.com/ajax.svc/Cart/Reserve/"
  },

  buildCheckoutRequest: function(cart, card, verificationCode) {
    var request = {}
    request.Cart = cart.original
    request.Card = card.original
    request.Card.CVV = verificationCode
    request['__K'] = Redbox.key

    return Object.toJSON(request)
  },

  parseCheckoutResponse: function(json) {
    return json.d.msgs.length == 0
  },

  /***********************************************************/
  /* LOCATE KIOSK                                            */
  /***********************************************************/
  locateKioskUrl: function() {
    return this.http + "www.redbox.com/ajax.svc/Kiosk/GetNearbyKiosks/"
  },

  buildLocateKioskRequest: function(lat, lng, movieId) {
    var json = {
      latitude: lat,
      longitude: lng,
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

  parseLocateKioskResponse: function(json) {
    var self = this
    var kiosks = []
    var profiles = json.d.profiles
    var states = json.d.states

    profiles.each(function(profile, index) {
      var state = states[index]

      if(state.Online && (!state.Inv || (state.Inv.length && state.Inv.first().Qty))) {
        kiosks.push(self.buildKiosk(profile))
      }
    })

    return kiosks
  },

  /***********************************************************/
  /* KIOSK INVENTORY                                         */
  /***********************************************************/
  kioskInventoryUrl: function() {
    return this.http + "www.redbox.com/data.svc/TitleAvailability/"
  },

  buildKioskInventoryRequest: function(kioskId) {
    var json = {
      type: "TitleAvailability",
      pk: "ID",
      statements: [{filters: {KioskID: kioskId}}],
      '__K': Redbox.key
    }

    return Object.toJSON(json)
  },

  parseKioskInventoryResponse: function(json) {
    var ids = []

    for(var i = 0; i < json.d.length; i++) {
      if(json.d[i].QtyRange) {
        ids.push(json.d[i].ID)
      }
    }

    return ids
  },

  buildKiosk: function(json) {
    var kiosk = new Kiosk()
    kiosk.id = json.ID
    kiosk.address = json.Addr
    kiosk.city = json.City
    kiosk.distance = json.Dist
    kiosk.latitude = json.Lat
    kiosk.longitude = json.Lng
    kiosk.name = json.Name
    kiosk.state = json.St
    kiosk.vendor = this.buildName(json.Vdr, json.Name)
    kiosk.zip = json.Zip
    kiosk.indoor = json.Ind
    kiosk.driveup_maybe = json.Drv
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

  http: "http://",
    https: "https://"
}
