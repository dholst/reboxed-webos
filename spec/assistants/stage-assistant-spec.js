describe("Stage Assistant", function() {
  var assistant;

  beforeEach(function() {
    assistant = new StageAssistant();
    assistant.controller = new StageControllerStub();
  });

  it("should set the stage", function() {
    var database = jasmine.createSpyObj("database", ["open"]);
    spyOn(Database, "getInstance").andReturn(database);

    assistant.setup();

    expect(database.open).wasCalledWith(assistant.sync);
  });

  it("should request the movies database and sync", function() {
    spyOn(Ajax, "Request");

    assistant.sync();

    expect(Ajax.Request).wasCalledWith("http://strong-journey-44.heroku.com/movies", {
      method: "get",
      onSuccess: assistant.syncMovies,
      onFailure: assistant.syncFailure
    });
  });

  it("should sync the list of movies and push the scene", function() {
    spyOn(assistant, "syncMovie");
    spyOn(assistant.controller, "pushScene");

    assistant.syncMovies({responseJSON: ["movie1", "movie2"]});

    expect(assistant.syncMovie).wasCalledWith(jasmine.any(Function), ["movie1", "movie2"], 0);
    assistant.syncMovie.mostRecentCall.args[0]();
    expect(assistant.controller.pushScene).wasCalledWith("movies");
  });

  it("should stop syncing movies when at the end of the list", function() {
    var callback = jasmine.createSpy();

    assistant.syncMovie(callback, ["movie1", "movie2"], 2);

    expect(callback).wasCalled();
  });
  
  it("should save the movie", function() {
    var callback = jasmine.createSpy();
    var movie = jasmine.createSpyObj("movie", ["save"]);
    spyOn(Movie, "fromJson").andReturn(movie);
    
    assistant.syncMovie(callback, ["movie1", "movie2"], 0);
    
    expect(Movie.fromJson).wasCalledWith("movie1");
    expect(movie.save).wasCalledWith(jasmine.any(Function), jasmine.any(Function));
    expect(callback).wasNotCalled();
  });
});
