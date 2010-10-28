Movie = Class.create({
  initialize: function() {
    this.imageSource = Redbox.Images.thumbnailUrl();
    this.cacheDirectory = "/media/internal/files/.reboxed/.cache";
  },

  save: function(success, failure) {
    Database.getInstance().execute(
      "insert into movies(id, name, image, released, rating, description, running_time, actors, genre, yahoo_rating) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [this.id, this.name, this.image, this.released.getTime(), this.rating, this.description, this.runningTime, this.actors, this.genre, this.yahooRating],
      success,
      failure
    );
  },

  update: function(success, failure) {
    Database.getInstance().execute(
      "update movies set released = ? where id = ?",
      [this.released.getTime(), this.id],
      success,
      failure
    )
  },

  cacheImage: function() {
    var movie = this;

    new Ajax.Request("file://" + this.cacheDirectory + "/" + this.image, {
      method: "get",

      onComplete: function(resp) {
        if(resp.getStatus() != 200) {
          DownloadManager.download(movie.imageSource + "/" + movie.image, movie.cacheDirectory, movie.image, function() {
            Mojo.Event.send(document, Reboxed.Event.imageCached, {movie: movie});
          });
        }
      }
    });
  }
});

Movie.syncDate = function(result) {
  var onSuccess = function(resultSet) {
    var date = resultSet.rows.length > 1 ? new Date(resultSet.rows.item(1).released) : null;
    result(date);
  };

  var onFailure = function(message) {
    result(null);
  };

  Database.getInstance().execute("select distinct released from movies order by released desc", [], onSuccess, onFailure);
};

Movie.count = function(result) {
  var onSuccess = function(resultSet) {
    result(resultSet.rows.item(0).count);
  }

  var onFailure = function(message) {
    result(null);
  }

  Database.getInstance().execute("select count(*) as count from movies m where " + this.blurayWhere(), [], onSuccess, onFailure);
};

Movie.paginate = function(offset, count, success, failure) {
  var onSuccess = function(resultSet) {
    var movies = [];

    for(var i = 0; i < resultSet.rows.length; i++) {
      movies.push(Movie.fromJson(resultSet.rows.item(i)));
    }

    success(movies);
  }

  var onFailure = function(message) {
    failure(message);
  }

  var sql = "select * from movies m where " + this.blurayWhere() + " and " + this.currentWhere() + " order by released desc, name limit " + count + " offset " + offset;
  Database.getInstance().execute(sql, [], onSuccess, onFailure);
};

Movie.search = function(query, success, failure) {
  var onSuccess = function(resultSet) {
    var movies = [];

    for(var i = 0; i < resultSet.rows.length; i++) {
      movies.push(Movie.fromJson(resultSet.rows.item(i)));
    }

    success(movies);
  }

  var onFailure = function(message) {
    failure(message);
  }

  var sql = "select * from movies m where name like '%" + query + "%' and " + this.blurayWhere() + " and " + this.currentWhere() + " order by released desc, name limit 200"
  Database.getInstance().execute(sql, [], onSuccess, onFailure);
};

Movie.upcomingCount = function(result) {
  var onSuccess = function(resultSet) {
    result(resultSet.rows.item(0).count);
  }

  var onFailure = function(message) {
    result(null);
  }

  Database.getInstance().execute("select count(*) as count from movies m where " + this.blurayWhere() + " and m.released > " + new Date().getTime(), [], onSuccess, onFailure);
};

Movie.findUpcoming = function(success, failure) {
  var onSuccess = function(resultSet) {
    var movies = []

    for(var i = 0; i < resultSet.rows.length; i++) {
      movies.push(Movie.fromJson(resultSet.rows.item(i)))
    }

    success(movies)
  }

  var onFailure = function(message) {
    Log.debug(message)
    failure(message)
  }

  var sql = "select m.* from movies m where " + this.blurayWhere() + " and m.released > " + new Date().getTime() + " order by released asc, name"
  Database.getInstance().execute(sql, [], onSuccess, onFailure)
};

Movie.findAllForGenre = function(genre, success, failure) {
  var onSuccess = function(resultSet) {
    var movies = []

    for(var i = 0; i < resultSet.rows.length; i++) {
      movies.push(Movie.fromJson(resultSet.rows.item(i)))
    }

    success(movies)
  }

  var onFailure = function(message) {
    Log.debug(message)
    failure(message)
  }

  var sql = "select m.* from movies m, genres g, movies_genres mg where m.id = mg.movie_id and g.id = mg.genre_id and g.id = ? and " + this.blurayWhere() + " and " + this.currentWhere() + " order by released desc, name limit 200"
  Database.getInstance().execute(sql, [genre.id], onSuccess, onFailure)
}

Movie.find = function(id, success, failure) {
  var onSuccess = function(resultSet) {
    if(resultSet.rows.length != 1) {
      failure("expected to find 1 row, but found " + resultSet.rows.length);
    }
    else {
      success(Movie.fromJson(resultSet.rows.item(0)));
    }
  }

  var onFailure = function(message) {
    Log.debug("find failed " + message)
    failure(message);
  }

  Database.getInstance().execute("select * from movies m where id = ?", [id], onSuccess, onFailure);
};

Movie.findAll = function(ids, success, failure) {
  var onSuccess = function(resultSet) {
    var results = [];

    for(var i = 0; i < resultSet.rows.length; i++) {
      results.push(Movie.fromJson(resultSet.rows.item(i)));
    }

    success(results)
  }

  var onFailure = function(message) {
    Log.debug("find all failed " + message)
    failure(message);
  }

  if(ids.length) {
    Database.getInstance().execute("select * from movies m where id in (" + ids.join(",") + ") and " + this.blurayWhere() + " order by released desc, name", [], onSuccess, onFailure);
  }
  else {
    success([]);
  }
}

Movie.findAllUncategorized = function(success, failure) {
  var onSuccess = function(resultSet) {
    var results = []

    for(var i = 0; i < resultSet.rows.length; i++) {
      var movie = new Movie()
      movie.id = resultSet.rows.item(i).id
      movie.genre = resultSet.rows.item(i).genre
      results.push(movie)
    }

    success(results)
  }

  var onFailure = function(messae) {
    Log.debug("find uncategorized failed", message)
    failure(message)
  }

  Database.getInstance().execute("select m.id, m.genre from movies m left outer join movies_genres mg on mg.movie_id = m.id where mg.movie_id is null", [], onSuccess, onFailure)
}

Movie.blurayWhere = function() {
  if(Preferences.showBluray()) {
    return "1 = 1"
  }
  else {
    return "m.name not like '%BLU-RAY%'"
  }
}

Movie.currentWhere = function() {
  return "m.released < " + new Date().getTime()
}

Movie.fromJson = function(json) {
  var movie = new Movie();
  movie.id = json.id;
  movie.name = json.name;
  movie.image = json.image ? json.image.gsub(" ", "%20") : undefined;
  movie.released = dateFrom(json.released);
  movie.rating = json.rating;
  movie.runningTime = json.running_time;
  movie.actors = json.actors;
  movie.genre = json.genre;
  movie.yahooRating = json.yahoo_rating;
  movie.description = json.description;

  try {
    var day = ("0" + movie.released.getDate()).slice(-2);
    var month = ("0" + (movie.released.getMonth() + 1)).slice(-2);
    var year = movie.released.getFullYear();
    movie.releasedDisplay = month + "/" + day + "/" + year;
  }
  catch(e) {
    movie.releasedDisplay = "N/A";
  }

  function dateFrom(value) {
    var match = /(\d{4})-(\d{1,2})-(\d{1,2})/.exec(value)

    if(match) {
      return new Date(match[1], parseInt(match[2], 10) - 1, match[3]);
    }
    else {
      return new Date(value);
    }
  }

  return movie;
};