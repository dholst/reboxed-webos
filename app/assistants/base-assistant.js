BaseAssistant = Class.create({
  initialize: function() {
    this.panelOpen = false
  },

  setup: function() {
    var appMenuItems = []
    appMenuItems.push(Mojo.Menu.editItem)

    if(this.showPreferences) {
      appMenuItems.push({label: "Preferences", command: Mojo.Menu.prefsCmd})
    }

    appMenuItems.push({label: "Help", command: Mojo.Menu.helpCmd})

    this.controller.setupWidget(Mojo.Menu.appMenu, {omitDefaultItems: true}, {visible: true, items: appMenuItems})
    this.controller.setupWidget("spinner", {spinnerSize: Mojo.Widget.spinnerLarge}, {})

    this.toggleMenuPanel = this.toggleMenuPanel.bind(this)
    var scrim = this.getMenuScrim()

    if(scrim) {
      this.controller.listen(scrim, Mojo.Event.tap, this.toggleMenuPanel)
    }
    
    this.controller.listen(document, Reboxed.Event.refresh, this.refresh = this.refresh.bind(this))
  },

  activate: function() {
  },
  
  cleanup: function() {
    var scrim = this.getMenuScrim()

    if(scrim) {
      this.controller.stopListening(scrim, Mojo.Event.tap, this.toggleMenuPanel)
    }
    
    this.controller.stopListening(document, Reboxed.Event.refresh, this.refresh)
  },
  
  refresh: function() {
  },

  spinnerOn: function(message) {
    var spinner = $$(".spinner").first()
    spinner.mojo.start()
    $("spinner-scrim").show()

    var spinnerMessage = $("spinner-message")

    if(!spinnerMessage) {
      spinner.insert({after: '<div id="spinner-message" class="spinner-message palm-info-text"></div>'})
      spinnerMessage = $("spinner-message")
    }

    spinnerMessage.update(message || "")
  },

  spinnerOff: function() {
    if($("spinner-message")) {
      $("spinner-message").remove()
      $$(".spinner").first().mojo.stop()
      $("spinner-scrim").hide()
    }
  },

  update: function(element, content) {
    this.controller.get(element).update(content)
  },

  menuPanelOn: function() {
    this.panelOpen = true
    this.getMenuScrim().show()
    this.getMenuPanel().show()
    this.disableSceneScroller()
  },

  menuPanelOff: function() {
    this.panelOpen = false
    this.getMenuPanel().hide()
    this.getMenuScrim().hide()
    this.enableSceneScroller()
  },

  getMenuScrim: function() {
    return this.controller.sceneElement.querySelector("div[x-mojo-menupanel-scrim]")
  },

  getMenuPanel: function() {
    return this.controller.sceneElement.querySelector("div[x-mojo-menupanel]")
  },

  toggleMenuPanel: function() {
    if(this.panelOpen) {
      this.menuPanelOff()
    }
    else {
      this.menuPanelOn()
    }
  },

  disableSceneScroller: function() {
    this.controller.listen(this.controller.sceneElement, Mojo.Event.dragStart, this.dragHandler)
  },

  dragHandler: function(event) {
    event.stop() //prevents the scene from scrolling.
  },

  enableSceneScroller : function() {
    this.controller.stopListening(this.controller.sceneElement, Mojo.Event.dragStart, this.dragHandler)
  },

  handleCommand: function(event) {
    if(Mojo.Event.back === event.type && this.panelOpen) {
      this.toggleMenuPanel()
      event.stop()
    }
    else if(Mojo.Event.command === event.type) {
      if(Mojo.Menu.helpCmd == event.command) {
        this.controller.stageController.pushScene("help")
        event.stop()
      }
      else if(Mojo.Menu.prefsCmd == event.command) {
        this.controller.stageController.pushScene("preferences")
        event.stop()
      }
    }
  },

  swapTo: function(scenes) {
    items = []

    scenes.each(function(scene) {
      items.push({label: scene.capitalize(), command: scene})
    })

    this.controller.popupSubmenu({
      placeNear: $("switch"),
      items: items,

      onChoose: function(command) {
        if(command) {
          this.controller.stageController.swapScene(command)
        }
      }.bind(this)
    })
  },

  currentScene: function() {
    return this.controller.stageController.topScene().sceneName
  },

  noAppMenu: function() {
    this.controller.setupWidget(Mojo.Menu.appMenu, {omitDefaultItems: true}, {visible: false})
  }
})