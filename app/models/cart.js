Cart = Class.create({
  initialize: function(kiosk, movie, success, failure) {
    this.kiosk = kiosk;
    this.movie = movie;
    this.success = success;
    this.failure = failure;

    var request = {
      buy: false,
      kiosk: this.kiosk.id
    };

    new Ajax.Request("https://www.redbox.com/ajax.svc/Cart/AddItem/" + this.movie.id, {
      method: "post",
      contentType: "application/json",
      postBody: Object.toJSON(request),
      onSuccess: this.addItemSuccess.bind(this),
      onFailure: this.addItemFailure.bind(this)
    });
  },

  addItemSuccess: function(response) {
    new Ajax.Request("https://www.redbox.com/ajax.svc/Cart/Refresh/", {
      method: "post",
      contentType: "application/json",
      postBody: "{}",
      onSuccess: this.cartRefreshSuccess.bind(this),
      onFailure: this.cartRefreshFailure.bind(this)
    });
  },

  cartRefreshSuccess: function(response) {
    var cart = response.responseJSON.d.cart;
    this.price = cart.Total;
    this.tax = cart.Tax;
    this.total = cart.GrandTotal;
    this.canCheckout = cart.CanCheckout;
    this.pickupBy = cart.PickupBy;
    this.success(this);
  },

  addItemFailure: function(response) {
    Mojo.Log.info("add to cart failed, status:", response.getStatus());
    this.failure();
  },

  cartRefreshFailure: function(response) {
    Mojo.Log.info("cart refresh failed, status:", response.getStatus());
    this.failure();
  }
});

Cart.create = function(kiosk, movie, success, failure) {
  new Cart(kiosk, movie, success, failure);
}

/*
 {
    "d": {
        "cart": {
            "KioskID": 20727,
            "Kiosk": {
                "ID": 20727,
                "Address": "1905 E 7th St",
                "City": "Atlantic",
                "State": "IA",
                "Zip": "50022-1916",
                "Label": null,
                "AddressLine2": null,
                "AddressDisplayName": "",
                "Indoor": true,
                "Vendor": "Walmart",
                "Attributes": {}
            },
            "KioskOnline": true,
            "Tax": "$0.07",
            "SubTotal": "$1.00",
            "Total": "$1.00",
            "GrandTotal": "$1.07",
            "Items": [{
                "ItemID": 0,
                "ProductID": 3172,
                "ProductTypeID": 1,
                "Name": "Brothers",
                "Img": "Brothers_3172.jpg",
                "Price": "$1.00",
                "FormatID": 1,
                "FormatName": "DVD",
                "Buy": false,
                "Status": 0,
                "EffectiveDate": {
                    "d": 634049172600000000,
                    "k": 1
                },
                "ExpireDate": null,
                "Rating": "R",
                "PromoCode": null,
                "CanCheckout": true,
                "Desc": "Captain Sam Cahill is embarking on his fourth tour of duty, leaving behind his beloved wife and two daughters. When Sam’s Blackhawk helicopter is shot down in the mountains of Afghanistan, the worst is presumed, leaving an enormous void in the family. Despite a dark history, Sam’s charismatic younger brother Tommy steps in to fill the family void.\r\n\r\nRated R by the Motion Picture Association of America for language and some disturbing violent content. \r\n\r\nWidescreen.\r\nClosed captioned.\r\nSpanish subtitles available.\r\n",
                "InitialNight": "$1.00",
                "ExtraNight": "$1.00",
                "Duration": 0
            }],
            "CanCheckout": true,
            "PickupBy": "March 25, 2010 9:00 PM",
            "ReceiptEmail": null,
            "Mobile": false,
            "InvoiceID": 0
        },
        "msgs": [],
        "msgKeys": [],
        "critical": false
    }
}
*/