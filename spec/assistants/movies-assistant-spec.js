describe("Movies Assistant", function() {
  var assistant;

  beforeEach(function() {
    assistant = new MoviesAssistant();
    assistant.controller = new SceneControllerStub();
  });

  it("should setup the scene", function() {
    spyOn(assistant.controller, "setupWidget");
    spyOn(assistant, "moreMovies");

    assistant.setup();

    expect(assistant.controller.setupWidget).wasCalledWith("movies", {itemCallback: jasmine.any(Function), lookahead: 10, itemTemplate: "movies/movie"}, assistant.movies);
    expect(assistant.moreMovies).wasCalledWith(null, 0, 10);
  });
  
  it("should paginate", function() {
    spyOn(Movie, "paginate");
    
    assistant.moreMovies(null, 0, 10);
    
    expect(Movie.paginate).wasCalledWith(0, 10, jasmine.any(Function), jasmine.any(Function));
  });
  
  it("should add movies to model when found and notify controller", function() {
    spyOn(assistant.controller, "modelChanged");
    
    assistant.foundMoreMovies(["movie1", "movie2"]);
    
    expect(assistant.movies.items).toEqual(["movie1", "movie2"]);
    expect(assistant.controller.modelChanged).wasCalledWith(assistant.movies);
  });
});