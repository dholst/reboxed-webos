MoviesAssistant = Class.create({
  initialize: function() {
  },

  setup: function() {
    this.listAttributes = {
      renderLimit: 20,
			lookahead: 15,
			listTemplate: "movies/movies",
      itemTemplate: "movies/movie",
      itemsCallback: this.itemsCallback.bind(this),
      onItemRendered: this.itemRendered.bind(this)
    };

    this.controller.setupWidget("movies", this.listAttributes);
    this.listWidget = $("movies");
    Movie.paginate(0, 50, this.moviesFound.bind(this, 0), Prototype.emptyFunction);
  },

  itemRendered: function(listWidget, itemModel, itemNode) {
    Mojo.Log.info("rendering", itemModel.name);
  },

  itemsCallback: function(listWidget, offset, count) {
    Mojo.Log.info("need", count, "more items at", offset);
    Movie.paginate(offset, count, this.moviesFound.bind(this, offset), Prototype.emptyFunction);
  },

  moviesFound: function(offset, movies) {
    Mojo.Log.info("found", movies.length, "movies");
    this.listWidget.mojo.noticeUpdatedItems(offset, movies);
    Movie.count(function(count){this.listWidget.mojo.setLength(count)}.bind(this));
  }
});