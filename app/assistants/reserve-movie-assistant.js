ReserveMovieAssistant = Class.create(BaseAssistant, {
  initialize: function(kiosk, movie) {
    this.kiosk = kiosk;
    this.movie = movie;
  },

  setup: function($super) {
    $super();
    this.update("movie-name", this.movie.name);

  },

  activate: function() {
    if(User.current) {
      this.addToCart();
    }
    else if(this.triedToLogin) {
      this.controller.stageController.popScene();
    }
    else {
      this.triedToLogin = true;
      this.controller.stageController.pushScene("login");
    }
  },

  addToCart: function() {
    this.spinnerOn("adding movie to cart");
    Cart.create(this.kiosk, this.movie, this.cartCreated.bind(this), this.cartFailed.bind(this));
  },

  cartCreated: function(cart) {
    this.cart = cart;
    this.update("movie-name", this.cart.movie.name);
    Card.getAll(this.cardsRetrieved.bind(this), this.cardsFailed.bind(this));
  },

  cardsRetrieved: function(cards) {
    if(!cards.length) {
      this.cardsFailed();
    }
    else {
      this.cards = cards;
      this.setupWidgets();
      this.spinnerOff();

      this.controller.update("reserve-form", Mojo.View.render({object: this, template: "reserve-movie/details"}));

      if(this.cart.movie.rating === "R") {
        this.controller.get("rated-r").show();
      }

      this.controller.listen("cardSelector", Mojo.Event.propertyChange, this.cardChanged.bind(this));
      this.controller.listen("confirm", Mojo.Event.tap, this.confirm.bind(this));
    }
  },

  setupWidgets: function() {
    var choices = this.cards.map(function(card, index) {
      return {label: card.alias, value: index}
    });

    this.selectedCard = {value: 0};
    this.cvc = {disabled: false, value: ""};
    this.eighteen = {value: false};
    this.button = {buttonLabel: "Confirm Reservation", buttonClass: 'affirmative'};

    this.controller.setupWidget("cardSelector", {choices: choices}, this.selectedCard);
    this.controller.setupWidget("cvc", {hintText: "Enter verification code...", maxLength: 3}, this.cvc);
    this.controller.setupWidget("eighteen", {}, this.eighteen);
    this.controller.setupWidget("confirm", {type: Mojo.Widget.activityButton}, this.button);
  },

  confirm: function() {
    if(!this.cvc.value.length) {
      this.reserveError("Enter your card verification code.");
    }
    else if(this.cart.movie.rating === "R" && !this.eighteen.value) {
      this.reserveError("Verify your age.");
    }
    else {
      this.button.disabled = true;
      this.controller.modelChanged(this.button);
      this.cart.checkoutWith(this.cards[this.selectedCard.value], this.cvc.value, this.checkoutComplete.bind(this), this.checkoutFailed.bind(this));
    }
  },

  cardChanged: function(event) {
    this.selectedCard.value = event.value;
    this.controller.modelChanged(this.selectedCard);
  },

  cartFailed: function() {
    this.failAndPop("Unable to reserve movie.");
  },

  cardsFailed: function() {
    this.failAndPop("Unable to reserve movie, check that a credit card is available on your account.")
  },

  failAndPop: function(message) {
    this.spinnerOff();

    this.controller.showDialog({
      message: message,
      preventCancel: true,
      template: 'dialog/error',
      assistant: new ErrorDialogAssistant(function() {
        this.controller.stageController.popScene();
      }.bind(this))
    });
  },

  reserveError: function(message) {
    this.button.disabled = false;
    this.controller.modelChanged(this.button);
    this.controller.get("confirm").mojo.deactivate();
    this.controller.update("reserve-failure-message", message)
    this.controller.get("reserve-failure").show();
  },

  checkoutComplete: function() {
    this.controller.stageController.popScene(true);
  },

  checkoutFailed: function() {
    this.reserveError("Unable to complete reservation. Check your card and card verification code and try again.");
  }
});
