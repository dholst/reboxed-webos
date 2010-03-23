describe("Movie", function() {
  var movie;

  beforeEach(function() {
    movie = Movie.fromJson({
      id: 1234, 
      name: "name", 
      image: "image", 
      released: "2010-03-20",
      rating: "rating"
    });
  });

  it("should have created a movie from json", function() {
    expect(movie.id).toEqual(1234);
    expect(movie.name).toEqual("name");
    expect(movie.image).toEqual("image");
    expect(movie.releasedDisplay).toEqual("03/20/2010");
  });

  describe("database", function() {
    var callback;
    var database;

    beforeEach(function() {
      callback = jasmine.createSpy();
      database = new DatabaseStub();
      spyOn(Database, "getInstance").andReturn(database);
      spyOn(database, "execute");
    });

    describe("reading", function() {
      it("should execute count sql", function() {
        Movie.count();
        expectSql("select count(*) as count from movies");
      });

      it("should return count", function() {
        Movie.count(callback);
        databaseSuccess([{count: 5}]);
        expect(callback).wasCalledWith(5);
      });

      it("should return null for count on error", function() {
        Movie.count(callback);
        databaseFailure();
        expect(callback).wasCalledWith(null);
      });

      it("should execute find sql", function() {
        Movie.find(1234);
        expectSql("select * from movies where id = ?", [1234]);
      });

      it("should build a movie when found", function() {
        Movie.find(1234, callback);
        databaseSuccess([{id: 1234}]);
        expect(callback).wasCalledWith(jasmine.any(Movie));
        expect(callback.mostRecentCall.args[0].id).toEqual(1234);
      });

      it("should call failure when no rows found", function() {
        Movie.find(1234, null, callback);
        expect(database.execute).wasCalled();
        databaseSuccess([]);
        expect(callback).wasCalled();
      });

      it("should call failure when 2 rows found", function() {
        Movie.find(1234, null, callback);
        databaseSuccess([{}, {}]);
        expect(callback).wasCalled();
      });

      it("should call failure when there was a database failure", function() {
        Movie.find(1234, null, callback);
        databaseFailure();
        expect(callback).wasCalled();
      });

      it("should execute pagination sql", function() {
        Movie.paginate(0, 10);
        expectSql("select * from movies order by released desc, name limit 10 offset 0");
      });

      it("should create movies when paginating", function() {
        spyOn(Movie, "fromJson").andReturn("movie");

        Movie.paginate(0, 10, callback);
        databaseSuccess(["movie1", "movie2"]);

        expect(callback).wasCalledWith(["movie", "movie"]);
      });
    });

    describe("saving", function() {
      it("should execute sql", function() {
        movie.save();
        expectSql(
          "insert into movies(id, name, image, released, rating) values(?, ?, ?, ?, ?)", 
          [movie.id, movie.name, movie.image, movie.released.getTime(), movie.rating]
        );
      });

      it("should callback on success", function() {
        movie.save(callback);
        databaseSuccess();
        expect(callback).wasCalled();
      });

      it("should callback on failure", function() {
        movie.save(null, callback);
        databaseFailure();
        expect(callback).wasCalled();
      });
    });

    function expectSql(sql, values) {
      values = values || [];
      expect(database.execute).wasCalledWith(sql, values, jasmine.any(Function), jasmine.any(Function));
    }

    function databaseSuccess(rows) {
      database.execute.mostRecentCall.args[2](rows ? new ResultSetStub(rows) : undefined);
    }

    function databaseFailure(message) {
      message = message || "error";
      database.execute.mostRecentCall.args[3](message);
    }
  });
});