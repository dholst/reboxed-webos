Genre = Class.create({
});

Genre.fromJson = function(json) {
  var genre = new Genre()
  genre.id = json.id
  genre.name = json.name
  return genre
}

Genre.findAll = function(onSuccess) {
  var success = function(resultSet) {
    var genres = []

    for(var i = 0; i < resultSet.rows.length; i++) {
      genres.push(Genre.fromJson(resultSet.rows.item(i)))
    }

    onSuccess(genres)
  }

  Database.getInstance().execute("select * from genres order by upper(name)", [], success, function() {})
}

Genre.addMovie = function(genre, movieId, onSuccess, onFailure) {
  var success = function(id) {
    if(id) {
      Genre.addMovieForGenreId(id, movieId, onSuccess, onFailure)
    }
    else {
      Genre.insertGenre(genre, movieId, onSuccess, onFailure)
    }
  }

  Genre.findIdFor(genre, success, onFailure)
}

Genre.findIdFor = function(name, onSuccess, onFailure) {
  var success = function(resultSet) {
    if(resultSet.rows.length != 1) {
      onSuccess(null)
    }
    else {
      onSuccess(resultSet.rows.item(0).id)
    }
  }

  var failure = function(message) {
    Mojo.Log.error("find id for genre failure", message)
    onFailure()
  }

  Database.getInstance().execute("select id from genres where name = ?", [name], success, failure)
}

Genre.insertGenre = function(genre, movieId, onSuccess, onFailure) {
  var success = function() {
    Genre.findIdFor(genre, function(id) {
        Genre.addMovieForGenreId(id, movieId, onSuccess, onFailure)
    }, onFailure);
  }

  var failure = function(message) {
    Mojo.Log.error("insert genre failure", message)
    onFailure()
  }

  Database.getInstance().execute("insert into genres(name) values(?)", [genre], success, failure)
}

Genre.addMovieForGenreId = function(genreId, movieId, onSuccess, onFailure) {
  var success = function() {
    onSuccess()
  }

  Database.getInstance().execute("insert into movies_genres(movie_id, genre_id) values(?, ?)", [movieId, genreId], success, onFailure)
}