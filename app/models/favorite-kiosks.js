FavoriteKiosks = {
  get: function(got) {
    var self = this

    if(self.kiosks) {
      got(self.kiosks)
    }
    else {
      Depot.get("favorite-kiosks", function(kiosks) {
        self.kiosks = kiosks || []

        self.kiosks = self.kiosks.map(function(json) {
          return new Kiosk(json)
        })

        got(self.kiosks)
      })
    }
  },

  add: function(kiosk) {
    var self = this

    self.get(function(kiosks) {
      kiosks.push(kiosk)
      self.save()
    })
  },

  remove: function(kiosk) {
    var self = this

    self.get(function(kiosks) {
      var newKiosks = kiosks.reject(function(k) {
        return k.id == kiosk.id
      })

      kiosks.clear()
      kiosks.push.apply(kiosks, newKiosks)
      self.save()
    })
  },

  save: function() {
    this.get(function(kiosks) {
      Depot.add("favorite-kiosks", kiosks.map(function(k) {return k.toJson()}))
    })
  }
}
