describe("Movie", function() {
  var movie;

  beforeEach(function() {
    movie = Movie.fromJson({id: 1234, name: "name", image: "image"});
  });

  it("should have created a movie from json", function() {
    expect(movie.id).toEqual(1234);
    expect(movie.name).toEqual("name");
    expect(movie.image).toEqual("image");
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
      it("should execute some sweet sql", function() {
        Movie.find(1234);

        var expectedSql = "select * from movies where id = ?";
        var expectedValues = [1234];
        expect(database.execute).wasCalledWith(expectedSql, expectedValues, jasmine.any(Function), jasmine.any(Function));
      });

      it("should construct a movie on success", function() {
        Movie.find(1234, callback);

        expect(database.execute).wasCalled();
        database.execute.mostRecentCall.args[2](new ResultSetStub([{id: 1234}]));
        expect(callback).wasCalledWith(jasmine.any(Movie));
        expect(callback.mostRecentCall.args[0].id).toEqual(1234);
      });

      it("should call failure when no rows found", function() {
        Movie.find(1234, null, callback);

        expect(database.execute).wasCalled();
        database.execute.mostRecentCall.args[2](new ResultSetStub([]));
        expect(callback).wasCalled();
      });

      it("should call failure when 2 rows found", function() {
        Movie.find(1234, null, callback);

        expect(database.execute).wasCalled();
        database.execute.mostRecentCall.args[2](new ResultSetStub([{}, {}]));
        expect(callback).wasCalled();
      });
      
      it("should call failure when there was a database failure", function() {
        Movie.find(1234, null, callback);

        expect(database.execute).wasCalled();
        database.execute.mostRecentCall.args[3]();
        expect(callback).wasCalled();
      });
    });

    describe("saving", function() {
      it("should execute some sweet sql", function() {
        movie.save();

        var expectedSql = "insert into movies(id, name, image) values(?, ?, ?)";
        var expectedValues = [movie.id, movie.name, movie.image];
        expect(database.execute).wasCalledWith(expectedSql, expectedValues, jasmine.any(Function), jasmine.any(Function));
      });

      it("should callback on success", function() {
        movie.save(callback);

        expect(database.execute).wasCalled();
        database.execute.mostRecentCall.args[2]();
        expect(callback).wasCalled();
      });

      it("should callback on failure", function() {
        movie.save(null, callback);

        expect(database.execute).wasCalled();
        database.execute.mostRecentCall.args[3]();
        expect(callback).wasCalled();
      });
    });
  });

});