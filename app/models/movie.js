Movie = Class.create({
  save: function(success, failure) {
    Mojo.Log.info("Saving", this.name);

    var saveSuccess = function() {
      success();
    }

    var saveFailure = function(message) {
      Mojo.Log.error("save failed", message);
      failure();
    }

    Database.getInstance().execute("insert into movies(id, name, image) values(?, ?, ?)", [this.id, this.name, this.image], saveSuccess, saveFailure);
  }
});

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
  return movie;
};