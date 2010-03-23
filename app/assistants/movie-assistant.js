MovieAssistant = Class.create({
  initialize: function(movie) {
    this.movie = movie;
  },

  setup: function() {
    this.controller.setupWidget(Mojo.Menu.commandMenu, {}, {
      items: [
        {},
        {label:"Locate", command:"locate"}
      ]
    });

    $("name").update(this.movie.name)
    $("image").src = "file://" + this.movie.cacheDirectory + "/" + this.movie.image;
    $("rating").update(this.movie.rating);
    $("released").update(this.movie.releasedDisplay);
    $("running-time").update(this.movie.runningTime);
    $("actors").update(this.movie.actors);
    $("genre").update(this.movie.genre);
    $("description").update(this.movie.description);
    $("yahoo").update(this.movie.yahooRating);
  },
  
  handleCommand: function(event) {
    if("locate" === event.command) {
      this.controller.stageController.pushScene("locate-movie", this.movie);
    }
  }
});