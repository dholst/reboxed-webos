Cart = Class.create({
});

Cart.create = function(kiosk, movie, success, failure) {
  new Ajax.Request(Redbox.Cart.addItemUrl(movie.id), {
    method: "post",
    contentType: "application/json",
    postBody: Redbox.Cart.buildAddItemRequest(kiosk.id),
    onSuccess: Cart.addSuccess.bind(this, kiosk, movie, success, failure),
    onFailure: Cart.failure.bind(this, failure)
  });
}

Cart.addSuccess = function(kiosk, movie, successCallback, failureCallback, response) {
  new Ajax.Request(Redbox.Cart.refreshUrl(), {
    method: "post",
    contentType: "application/json",
    postBody: Redbox.Cart.buildRefreshRequest(),
    onSuccess: Cart.refreshSuccess.bind(this, kiosk, movie, successCallback, failureCallback),
    onFailure: Cart.failure.bind(this, failureCallback)
  });
}

Cart.refreshSuccess = function(kiosk, movie, successCallback, failureCallback, response) {
  var cart = Redbox.Cart.parseRefreshResponse(response.responseJSON);

  //TODO: MAKE SURE THEY'RE THE SAME AS IN THE CART
  cart.movie = movie;
  cart.kiosk = kiosk;

  successCallback(cart);
}

Cart.failure = function(failureCallback, response) {
  Mojo.Log.info("cart failure, status:", response.getStatus());
  failureCallback();
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