FavoriteKiosks = Class.create({
  initialize: function(initialized) {
    Depot.get("favorite-kiosks", function(kiosks) {
      this.kiosks = kiosks || []

      this.kiosks = this.kiosks.map(function(json) {
        return new Kiosk(json)
      })

      if(initialized) {
        initialized(this);
      }
    }.bind(this))
  },

  add: function(kiosk) {
    this.kiosks.push(kiosk.toJson())
    this.save()
  },

  remove: function(kiosk) {
    this.kiosks = this.kiosks.reject(function(k) {
      return k.id == kiosk.id
    })

    this.save()
  },

  empty: function() {
    return this.kiosks.length == 0
  },

  save: function() {
    Depot.add("favorite-kiosks", this.kiosks)
  },

  contains: function(kiosk) {
    return this.kiosks.any(function(k) {return k.id == kiosk.id})
  }
})