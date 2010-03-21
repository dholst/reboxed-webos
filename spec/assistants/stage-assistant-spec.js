describe("Stage Assistant", function() {
  var assistant;
  var database;

  beforeEach(function() {
    assistant = new StageAssistant();
    assistant.controller = new StageControllerStub();
    database = jasmine.createSpyObj("database", ["open"]);
    spyOn(Database, "getInstance").andReturn(database);
    spyOn(assistant.controller, "pushScene");
    spyOn(Movie, "count");
  });

  it("should push first time scene if first time", function() {
    assistant.setup();

    expect(database.open).wasCalledWith(jasmine.any(Function));
    database.open.mostRecentCall.args[0]();
    expect(Movie.count).wasCalledWith(jasmine.any(Function));
    Movie.count.mostRecentCall.args[0](0);
    expect(assistant.controller.pushScene).wasCalledWith("first-time");
  });
  
  it("should push movies scene if movies exist", function() {
    assistant.setup();

    expect(database.open).wasCalledWith(jasmine.any(Function));
    database.open.mostRecentCall.args[0]();
    expect(Movie.count).wasCalledWith(jasmine.any(Function));
    Movie.count.mostRecentCall.args[0](100);
    expect(assistant.controller.pushScene).wasCalledWith("movies");
  });
  
});
