Preferences = {
  BLURAY: "show-bluray",

  showBluray: function() {
    return this.getCookie(this.BLURAY, true)
  },

  setBluray: function(value) {
    this.setCookie(this.BLURAY, value)
  },

  getCookie: function(name, defaultValue) {
    var cookie = this.cookieFor(name)

    if(cookie.get() != undefined) {
      return cookie.get()
    }
    else {
      return defaultValue
    }
  },

  setCookie: function(name, value) {
    this.cookieFor(name).put(value)
  },

  cookieFor: function(name) {
    return new Mojo.Model.Cookie(name)
  }
}