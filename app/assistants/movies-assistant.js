MoviesAssistant = Class.create({
  setup: function() {
    this.listAttributes = {
			listTemplate: "movies/movies",
      itemTemplate: "movies/movie",
      itemsCallback: this.itemsCallback.bind(this)
    };

    this.controller.setupWidget("movies", this.listAttributes);
    this.paginate(0, 50);
  },

  itemsCallback: function(listWidget, offset, count) {
    this.paginate(offset, count);
  },

  paginate: function(offset, count) {
    Movie.paginate(offset, count, this.moviesFound.bind(this, offset), this.findError.bind(this));
  },

  moviesFound: function(offset, movies) {
    $("movies").mojo.noticeUpdatedItems(offset, movies);
    Movie.count(function(count){$("movies").mojo.setLength(count)}.bind(this));
  },

  findError: function() {
    Mojo.Log.error("paginate error");
  }
});