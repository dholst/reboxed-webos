StageAssistant = Class.create({
  setup: function() {
    Reboxed.Metrix.postDeviceData()
    this.controller.pushScene('first')
  }
})
