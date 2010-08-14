var AppAssistant = Class.create({
  handleLaunch: function(params) {
    if("refresh" == params) {
      Mojo.Event.send(document, Reboxed.Event.refresh, {})      
    }
  }
})