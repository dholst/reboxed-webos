CategorySync = {
  sync: function() {
    if(!CategorySync.syncing) {
      CategorySync.syncing = true
      Movie.findAllUncategorized(this.syncMovies, function() {CategorySync.syncing = false})
    }
  },

  syncMovies: function(movies) {
    var movieCategories = []

    movies.each(function(movie) {
      var genres = movie.genre.split(",")

      genres.each(function(genre) {
        genre = genre.strip()

        if(genre.length) {
          movieCategories.push([movie.id, genre])
        }
      })
    })

    CategorySync.syncMovie(movieCategories, 0)
  },

  syncMovie: function(movieCategories, index) {
    if(index >= movieCategories.length) {
      CategorySync.syncing = false
      return
    }

    var movieId = movieCategories[index][0]
    var category = movieCategories[index][1]

    Category.addMovie(category, movieId, CategorySync.syncMovie.curry(movieCategories, index + 1))
  }
}
