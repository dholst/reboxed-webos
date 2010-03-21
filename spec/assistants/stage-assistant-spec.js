describe("Stage Assistant", function() {
  var assistant;

  beforeEach(function() {
    assistant = new StageAssistant();
    assistant.controller = new StageControllerStub();
  });

  it("should open the database and push the first scene", function() {
    var database = jasmine.createSpyObj("database", ["open"]);
    spyOn(Database, "getInstance").andReturn(database);
    spyOn(assistant.controller, "pushScene");

    assistant.setup();

    expect(database.open).wasCalledWith(jasmine.any(Function));
    database.open.mostRecentCall.args[0]();
    expect(assistant.controller.pushScene).wasCalledWith("movies");
  });
});
