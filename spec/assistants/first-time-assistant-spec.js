describe("First Time Assistant", function() {
  var assistant;

  beforeEach(function() {
    assistant = new FirstTimeAssistant();
    assistant.controller = new SceneControllerStub();
  });

  it("should sync the movies and push scene when complete", function() {
    spyOn(assistant.controller, "listen")
    spyOn(MovieSync, "sync");
    spyOn(assistant.controller.stageController, "pushScene");

    assistant.setup();

    expect(assistant.controller.listen).wasCalledWith(document, Redbox.Event.movieSyncComplete, jasmine.any(Function));
    expect(MovieSync.sync).wasCalled();
    assistant.controller.listen.mostRecentCall.args[2]();
    expect(assistant.controller.stageController.pushScene).wasCalledWith("movies");
  });
});