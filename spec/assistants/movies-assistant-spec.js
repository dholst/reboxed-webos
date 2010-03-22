describe("Movies Assistant", function() {
  var assistant;

  beforeEach(function() {
    assistant = new MoviesAssistant();
    assistant.controller = new SceneControllerStub();
  });

  it("should setup the scene", function() {
    spyOn(Movie, "paginate");
    spyOn(assistant.controller, "setupWidget");
    spyOn(assistant.controller, "listen");

    assistant.setup();

    expect(assistant.controller.setupWidget).wasCalledWith("movies", jasmine.any(Object));
    assistant.controller.setupWidget.mostRecentCall.args[1].itemsCallback(null, 30, 10);
    expect(Movie.paginate).wasCalledWith(0, 30, jasmine.any(Function), jasmine.any(Function));
    expect(Movie.paginate).wasCalledWith(30, 10, jasmine.any(Function), jasmine.any(Function));
  });
});