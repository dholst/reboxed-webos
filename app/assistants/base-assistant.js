BaseAssistant = Class.create({
  initialize: function() {
    this.panelOpen = false;
  },

  setup: function() {
    this.controller.setupWidget("spinner", {spinnerSize: Mojo.Widget.spinnerLarge}, {});
  },

  cleanup: function() {
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

  setupMenuPanel: function() {
  	this.scrim = this.controller.sceneElement.querySelector("div[x-mojo-menupanel-scrim]");
  	this.scrim.hide();

    this.menuPanel = this.controller.sceneElement.querySelector("div[x-mojo-menupanel]");
  	this.menuPanelVisibleTop = this.menuPanel.offsetTop;
  	this.menuPanel.style.top = (0 - this.menuPanel.offsetHeight - this.menuPanel.offsetTop) + "px";
  	this.menuPanelHiddenTop = this.menuPanel.offsetTop;
    this.menuPanel.hide();
  },

	animateMenuPanel : function(panel, reverse, callback){
		Mojo.Animation.animateStyle(panel, "top", "bezier", {
			from: this.menuPanelHiddenTop,
			to: this.menuPanelVisibleTop,
			duration: 0.12,
			curve: "over-easy",
			reverse: reverse,
			onComplete: callback
		});
	},

	menuPanelOn : function(){
	  if(this.panelOpen) {
	    return;
	  }

		this.panelOpen = true;
		this.scrim.show();
		this.disableSceneScroller();

		Mojo.Animation.Scrim.animate(this.scrim, 0, 1, function() {
		  this.menuPanel.show();
			this.animateMenuPanel(this.menuPanel, false, function() {});
		}.bind(this));
	},

	menuPanelOff :function(){
	  if(!this.panelOpen) {
	    return;
	  }

		this.panelOpen = false;
		this.enableSceneScroller();
		this.animateMenuPanel(this.menuPanel, true, function() {
			this.menuPanel.hide();
			Mojo.Animation.Scrim.animate(this.scrim, 1, 0, this.scrim.hide.bind(this.scrim));
		}.bind(this));
	},

	toggleMenuPanel: function(e){
	  this[this.panelOpen ? "menuPanelOff" : "menuPanelOn"]()
	},

  disableSceneScroller : function() {
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
  }
});