Ajax.Responders.register({
  onCreate: function(request) {
    Mojo.Log.info("ajax request started,", request.method, request.url)
  },

  onComplete: function(response) {
    Mojo.Log.info("ajax request completed with", response.getStatus());
  }
});

Ajax.Request.prototype.success = function() {
  var status = this.getStatus();
  return (status >= 200 && status < 300);
}