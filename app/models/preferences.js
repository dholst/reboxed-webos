Preferences = {
  BLURAY: "show-bluray",
  DVD: "show-dvd",

  showBluray: function() {
    return this.getCookie(this.BLURAY, true)
  },

  setBluray: function(value) {
    this.setCookie(this.BLURAY, value)
  },

  showDvd: function() {
    return this.getCookie(this.DVD, true)
  },

  setDvd: function(value) {
    this.setCookie(this.DVD, value)
  },

  forceNewApi: function() {
    return false
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
    console.log("setting " + name + " to " + value);
    this.cookieFor(name).put(value)
  },

  cookieFor: function(name) {
    return new Mojo.Model.Cookie(name)
  }
}
