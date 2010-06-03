CategorySync = {
  sync: function() {
    Movie.findAllUncategorized(this.syncThese, function() {})
  },

  syncThese: function(movies) {
    var categories = {}

    movies.each(function(movie) {
      var genres = movie.genre.split(",")

      genres.each(function(genre) {
        genre = genre.strip()

        if(genre.length) {
          var movie_ids = categories[genre]

          if(!movie_ids) {
            movie_ids = []
            categories[genre] = movie_ids
          }

          movie_ids.push(movie.id)
        }
      })
    })

    $H(categories).each(function(item) {
      console.log(item[0] + " -> " + item[1].length)
    })
  }
}
