var Redbox = {
  initialize: function() {
    new Ajax.Request("http://www.redbox.com/", {
      method: "get",
      onSuccess: function(response) {
        var match = response.responseText.match(/rb\.api\.key *= * [',"](.*?)[',"]/)
        Log.debug(match)

        if(match && match.length > 1) {
          Redbox.key2 = match[1]
          Log.debug(Redbox.key2)
        }

        match = response.responseText.match(/__K.*value="(.*)"/)
        Log.debug(match)

        if(match && match.length > 1) {
          Redbox.key = match[1]
          Log.debug(Redbox.key)
        }
      }
    })
  },

  getApi: function() {
    if(Preferences.forceNewApi() || !Redbox.key) {
      return Redbox.Api2
    }
    else {
      return Redbox.Api1
    }
  },

  findKiosks: function(lat, lng, movieId, success, failure) {
    this.getApi().findKiosks(lat, lng, movieId, success, failure)
  },

  getInventory: function(kioskId, success, failure) {
    this.getApi().getInventory(kioskId, success, failure)
  },

  login: function(username, password, success, failure) {
    this.getApi().login(username, password, success, failure)
  },

  createCart: function(kioskId, movieId, success, failure) {
    this.getApi().createCart(kioskId, movieId, success, failure)
  },

  getCards: function(success, failure) {
    this.getApi().getCards(success, failure)
  },

  checkout: function(cart, card, verificationCode, success, failure) {
    this.getApi().checkout(cart, card, verificationCode, success, failure)
  },

  Images: {
    thumbnailUrl: function() {
      return "http://images.redbox.com/Images/Thumbnails"
    }
  }
}

