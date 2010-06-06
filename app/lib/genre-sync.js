GenreSync = {
  sync: function() {
    if(!GenreSync.syncing) {
      GenreSync.syncing = true
      Movie.findAllUncategorized(this.syncMovies, function() {GenreSync.syncing = false})
    }
  },

  syncMovies: function(movies) {
    var movieGenres = []

    movies.each(function(movie) {
      var genres = movie.genre.split(",")

      genres.each(function(genre) {
        genre = genre.strip()

        if(GenreSync.shouldSyncGenre(genre)) {
          movieGenres.push([movie.id, genre])
        }
      })
    })

    GenreSync.syncMovie(movieGenres, 0)
  },

  shouldSyncGenre: function(genre) {
    return genre.length > 0 && genre.toLowerCase() != 'top 20 movies'
  },

  syncMovie: function(movieGenres, index) {
    if(index >= movieGenres.length) {
      GenreSync.syncing = false
      return
    }

    var movieId = movieGenres[index][0]
    var genre = movieGenres[index][1]

    Genre.addMovie(genre, movieId, GenreSync.syncMovie.curry(movieGenres, index + 1))
  }
}
