ReserveMovieAssistant = Class.create(BaseAssistant, {
  initialize: function(kiosk, movie) {
    this.kiosk = kiosk;
    this.movie = movie;
  },

  setup: function() {
    this.controller.get("movie-name").update(this.movie.name);
    this.addSpinner("reserve-spinner");
    this.spinnerOn();
    this.realSetup();
  },

  realSetup: function() {
    Cart.create(this.kiosk, this.movie, this.cartCreated.bind(this), this.cartFailed.bind(this));
  },

  cartCreated: function(cart) {
    this.cart = cart;
    Card.getAll(this.cardsRetrieved.bind(this), this.cardsFailed.bind(this));
  },

  cardsRetrieved: function(cards) {
    this.cards = cards;
    this.setupWidgets();
    this.spinnerOff();

    this.controller.update("reserve-form", Mojo.View.render({object: this, template: "reserve-movie/details"}));

    if(this.movie.rating === "R") {
      this.controller.get("rated-r").show();
    }

    this.controller.listen("cardSelector", Mojo.Event.propertyChange, this.cardChanged.bind(this));
    this.controller.listen("confirm", Mojo.Event.tap, this.confirm.bind(this));
  },

  setupWidgets: function() {
    var choices = this.cards.map(function(card, index) {
      return {label: card.alias, value: index}
    });

    this.selectedCard = {value: 0};
    this.cvc = {disabled: false};
    this.eighteen = {value: false};

    this.controller.setupWidget("cardSelector", {choices: choices}, this.selectedCard);
    this.controller.setupWidget("cvc", {hintText: "Enter verification code...", maxLength: 3}, this.cvc);
    this.controller.setupWidget("eighteen", {}, this.eighteen);
  },

  cardChanged: function(event) {
    this.selectedCard.value = event.value;
    this.controller.modelChanged(this.selectedCard);
  },

  cartFailed: function() {
    Mojo.Log.info("cart creation failed");
  },

  cardsFailed: function() {
    Mojo.Log.info("cards retrieval failed");
  },

  confirm: function() {
    console.log(this.cards[this.selectedCard.value].alias);
    console.log(this.cvc.value);
    console.log(this.eighteen.value);
  },

  mockSetup: function() {
    this.movie = this.mockMovie();
    this.kiosk = this.mockKiosk();
    this.cart = this.mockCart();
    this.cardsRetrieved(this.mockCards());
  },

  mockMovie: function() {
    var movie = new Movie();
    movie.name = "Mock Movie Name";
    movie.rating = "R";
    return movie;
  },

  mockKiosk: function() {
    var kiosk = new Kiosk();
    kiosk.vendor = "McDonalds";
    kiosk.address = "123 Redbox Way";
    kiosk.city = "Sunnyvale";
    kiosk.state = "CA";
    kiosk.zip = "90210";
    return kiosk;
  },

  mockCart: function() {
    var cart = new Cart();
    cart.price = "$1.00";
    cart.tax = "$0.08";
    cart.total = "$1.08";
    cart.pickupBy = "March 25, 2010 9:00 PM";
    return cart;
  },

  mockCards: function() {
    var card1 = new Card();
    card1.alias = "Discover";

    var card2 = new Card();
    card2.alias = "Visa";

    return [card1, card2];
  }
});
