Category = Class.create({
});

Category.fromJson = function(json) {
  var category = new Category()
  category.id = json.id
  category.name = json.name
  return category
}

Category.findAll = function(onSuccess) {
  var success = function(resultSet) {
    var categories = []

    for(var i = 0; i < resultSet.rows.length; i++) {
      categories.push(Category.fromJson(resultSet.rows.item(i)))
    }

    onSuccess(categories)
  }

  Database.getInstance().execute("select * from categories order by name", [], success, function() {})
}

Category.addMovie = function(category, movieId, onSuccess, onFailure) {
  Mojo.Log.info("movieId = " + movieId + ", category = " + category)

  var success = function(id) {
    if(id) {
      Category.addMovieForCategoryId(id, movieId, onSuccess, onFailure)
    }
    else {
      Category.insertCategory(category, movieId, onSuccess, onFailure)
    }
  }

  Category.findIdFor(category, success, onFailure)
}

Category.findIdFor = function(name, onSuccess, onFailure) {
  var success = function(resultSet) {
    if(resultSet.rows.length != 1) {
      onSuccess(null)
    }
    else {
      onSuccess(resultSet.rows.item(0).id)
    }
  }

  var failure = function(message) {
    Mojo.Log.error("find id for category failure", message)
    onFailure()
  }

  Database.getInstance().execute("select id from categories where name = ?", [name], success, failure)
}

Category.insertCategory = function(category, movieId, onSuccess, onFailure) {
  var success = function() {
    Category.findIdFor(category, function(id) {
        Category.addMovieForCategoryId(id, movieId, onSuccess, onFailure)
    }, onFailure);
  }

  var failure = function(message) {
    Mojo.Log.error("insert category failure", message)
    onFailure()
  }

  Database.getInstance().execute("insert into categories(name) values(?)", [category], success, failure)
}

Category.addMovieForCategoryId = function(categoryId, movieId, onSuccess, onFailure) {
  var success = function() {
    onSuccess()
  }

  Database.getInstance().execute("insert into movies_categories(movie_id, category_id) values(?, ?)", [movieId, categoryId], success, onFailure)
}