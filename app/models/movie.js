Movie = Class.create({
  initialize: function() {
    this.imageSource = "http://images.redbox.com/Images/Thumbnails";
    this.cacheDirectory = "/media/internal/files/redbox-palm/cache";
  },

  save: function(success, failure) {
    Mojo.Log.info("Saving", this.name);

    var saveSuccess = function() {
      success();
    }

    var saveFailure = function(message) {
      Mojo.Log.error("save failed", message);
      failure();
    }

    Database.getInstance().execute("insert into movies(id, name, image, released) values(?, ?, ?, ?)", [this.id, this.name, this.image, this.released.getTime()], saveSuccess, saveFailure);
  },

  cacheImage: function() {
    var movie = this;

    new Ajax.Request("file://" + this.cacheDirectory + "/" + this.image, {
      method: "get",

      onComplete: function(resp) {
        if(resp.getStatus() != 200) {
          DownloadManager.download(movie.imageSource + "/" + movie.image, movie.cacheDirectory, movie.image, function() {
            Mojo.Event.send(document, Redbox.Event.imageCached, {movie: movie});
          });
        }
      }
    });

  }
});

Movie.count = function(result) {
  var onSuccess = function(resultSet) {
    result(resultSet.rows.item(0).count);
  }

  var onFailure = function(message) {
    result(null);
  }

  Database.getInstance().execute("select count(*) as count from movies", [], onSuccess, onFailure);
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

  var sql = "select * from movies order by released desc, name limit " + count + " offset " + offset;
  Database.getInstance().execute(sql, [], onSuccess, onFailure);
};

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
    Mojo.Log.error("find failed", message)
    failure(message);
  }

  Database.getInstance().execute("select * from movies where id = ?", [id], onSuccess, onFailure);
};

Movie.fromJson = function(json) {
  var movie = new Movie();
  movie.id = json.id;
  movie.name = json.name;
  movie.image = json.image;
  movie.released = new Date(json.released);
  return movie;
};