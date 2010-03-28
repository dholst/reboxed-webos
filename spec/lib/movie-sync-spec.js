describe("Movie Sync", function() {
  it("should request new movies", function() {
    spyOn(Ajax, "Request");

    MovieSync.sync();

    expect(Ajax.Request).wasCalledWith("http://reboxed.semicolonapps.com/movies", {
      method: "get",
      onSuccess: jasmine.any(Function),
      onFailure: jasmine.any(Function)
    });
  });
  
  it("should send complete event on ajax failure", function() {
    spyOn(Ajax, "Request");
    spyOn(Mojo.Event, "send");

    MovieSync.sync();

    Ajax.Request.mostRecentCall.args[1].onFailure({getStatus: function(){return 404;}});
    expect(Mojo.Event.send).wasCalledWith(document, Reboxed.Event.movieSyncComplete, {});
  });

  it("should start the sync recursion", function() {
    spyOn(Ajax, "Request");
    spyOn(MovieSync, "syncMovie");

    MovieSync.sync();
    Ajax.Request.mostRecentCall.args[1].onSuccess({responseJSON: ["movie1", "movie2"]});

    expect(MovieSync.syncMovie).wasCalledWith(["movie1", "movie2"], 0);
  });

  it("should save the movie", function() {
    var movie = jasmine.createSpyObj("movie", ["save"]);
    spyOn(Movie, "fromJson").andReturn(movie);

    MovieSync.syncMovie(["movie1", "movie2"], 0);

    expect(Movie.fromJson).wasCalledWith("movie1");
    expect(movie.save).wasCalledWith(jasmine.any(Function), jasmine.any(Function));
  });

  it("should send an event when done syncing", function() {
    spyOn(Mojo.Event, "send");

    MovieSync.syncMovie(["movie1", "movie2"], 2);

    expect(Mojo.Event.send).wasCalledWith(document, Reboxed.Event.movieSyncComplete, {});
  });
});
