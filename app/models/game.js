var Game = Class.create({
  save: function(success, failure) {
    Database.getInstance().execute(
      "insert into games(id, name, image, released, rating, description) values(?, ?, ?, ?, ?, ?)",
      [this.id, this.name, this.image, this.released.getTime(), this.rating, this.description],
      success,
      failure
    )
  }
})

Game.syncDate = function(result) {
  var onSuccess = function(resultSet) {
    var date = resultSet.rows.length > 1 ? new Date(resultSet.rows.item(1).released) : null
    result(date)
  }

  var onFailure = function(message) {
    result(null)
  }

  Database.getInstance().execute("select distinct released from games order by released desc", [], onSuccess, onFailure)
}

Game.paginate = function(offset, count, success, failure) {
  var onSuccess = function(resultSet) {
    var games = []

    for(var i = 0; i < resultSet.rows.length; i++) {
      games.push(Movie.fromJson(resultSet.rows.item(i)))
    }

    success(games)
  }

  var onFailure = function(message) {
    failure(message)
  }

  var sql = "select * from games g where " + this.currentWhere() + " order by released desc, name limit " + count + " offset " + offset
  Database.getInstance().execute(sql, [], onSuccess, onFailure);
}

Game.count = function(result) {
  var onSuccess = function(resultSet) {
    result(resultSet.rows.item(0).count);
  }

  var onFailure = function(message) {
    result(null);
  }

  Database.getInstance().execute("select count(*) as count from games g", [], onSuccess, onFailure);
}

Game.currentWhere = function() {
  return "g.released < " + new Date().getTime()
}

Game.fromJson = function(json) {
  var game = new Game()
  game.id = json.id
  game.name = json.name
  game.image = json.image ? json.image.gsub(" ", "%20") : undefined
  game.released = dateFrom(json.released)
  game.rating = json.rating
  game.description = json.description

  try {
    var day = ("0" + game.released.getDate()).slice(-2)
    var month = ("0" + (game.released.getMonth() + 1)).slice(-2)
    var year = game.released.getFullYear()
    game.releasedDisplay = month + "/" + day + "/" + year
  }
  catch(e) {
    game.releasedDisplay = "N/A"
  }

  function dateFrom(value) {
    var match = /(\d{4})-(\d{1,2})-(\d{1,2})/.exec(value)

    if(match) {
      return new Date(match[1], parseInt(match[2], 10) - 1, match[3])
    }
    else {
      return new Date(value)
    }
  }

  return game
}
