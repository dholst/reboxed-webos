BaseAssistant = Class.create({
  initialize: function() {
    this.panelOpen = false;
  },

  setup: function() {
    this.controller.setupWidget("spinner", {spinnerSize: Mojo.Widget.spinnerLarge}, {});

    this.toggleMenuPanel = this.toggleMenuPanel.bind(this);
    var scrim = this.getMenuScrim();

    if(scrim) {
      this.controller.listen(scrim, Mojo.Event.tap, this.toggleMenuPanel);
    }
  },

  cleanup: function() {
    var scrim = this.getMenuScrim();

    if(scrim) {
      this.controller.stopListening(scrim, Mojo.Event.tap, this.toggleMenuPanel);
    }
  },
  
  spinnerOn: function(message) {
    var spinner = $$(".spinner").first()
    spinner.mojo.start();
    $("spinner-scrim").show();

    var spinnerMessage = $("spinner-message");

    if(!spinnerMessage) {
      spinner.insert({after: '<div id="spinner-message" class="spinner-message palm-info-text"></div>'});
      spinnerMessage = $("spinner-message");
    }

    spinnerMessage.update(message || "");
  },

  spinnerOff: function() {
    if($("spinner-message")) {
      $("spinner-message").remove();
      $$(".spinner").first().mojo.stop();
      $("spinner-scrim").hide();
    }
  },

  update: function(element, content) {
    this.controller.get(element).update(content);
  },

	menuPanelOn: function(focusOn) {
		this.panelOpen = true;
		this.getMenuScrim().show();
		this.getMenuPanel().show();
		this.disableSceneScroller();
		
		if(focusOn) {
		  this.controller.get(focusOn).focus();
		}
	},

	menuPanelOff: function(){
		this.panelOpen = false;
		this.getMenuPanel().hide();
		this.getMenuScrim().hide();
		this.enableSceneScroller();
	},

  getMenuScrim: function() {
    return this.controller.sceneElement.querySelector("div[x-mojo-menupanel-scrim]");
  },

	getMenuPanel: function() {
  	return this.controller.sceneElement.querySelector("div[x-mojo-menupanel]")
	},

	toggleMenuPanel: function() {
	  if(this.panelOpen) {
	    this.menuPanelOff();
	  }
	  else {
	    this.menuPanelOn();
	  }
	},

  disableSceneScroller: function() {
		this.controller.listen(this.controller.sceneElement, Mojo.Event.dragStart, this.dragHandler);
	},

	dragHandler: function(event) {
		event.stop(); //prevents the scene from scrolling.
	},

	enableSceneScroller : function() {
		this.controller.stopListening(this.controller.sceneElement, Mojo.Event.dragStart, this.dragHandler);
	},

	handleCommand: function(event) {
	  if(Mojo.Event.back === event.type && this.panelOpen) {
	    this.toggleMenuPanel();
	    event.stop();
	  }
  },

  swapTo: function(target, scene) {
    this.controller.popupSubmenu({
      placeNear: target,

      onChoose: function(command) {
        if(scene === command) {
          this.controller.stageController.swapScene(scene);
        }
      }.bind(this),

      items: [
        {label: scene.capitalize(), command: scene}
      ]
    });
  },
  
  addDownArrowToMenuText: function() {
    var menuText = this.controller.sceneElement.querySelector("div.palm-menu-text .truncating-text");
    menuText.insert({bottom: '<img src="images/down.png">'});
  }
});