CategoriesAssistant = Class.create(BaseAssistant, {
  initialize: function() {
    this.categoryList = {items: []}
  },

  setup: function($super) {
    $super()

    var listAttributes = {
      listTemplate: "categories/categories",
      itemTemplate: "categories/category"
    }

    this.controller.setupWidget("categories", listAttributes, this.categoryList)
    this.controller.setupWidget(Mojo.Menu.viewMenu, {}, {items: [
      {},
      {items: [
        {label: "Categories", width: 320, command: "menu"},
      ]},
      {}
    ]})

    this.controller.listen("categories", Mojo.Event.listTap, this.categoryTapped = this.categoryTapped.bind(this))

  },

  cleanup: function($super) {
    $super()
    this.controller.stopListening("categories", Mojo.Event.listTap, this.categoryTapped)
  },

  ready: function() {
    this.addDownArrowToMenuText()

    Category.findAll(function(categories) {
      this.categoryList.items.push.apply(this.categoryList.items, categories)
      this.controller.modelChanged(this.categoryList)
    }.bind(this))
  },

  handleCommand: function($super, event) {
    $super(event)

    if("menu" === event.command) {
      this.swapTo(event.originalEvent.target, ["kiosks", "movies"])
    }
  },

  categoryTapped: function(event) {
    this.controller.stageController.pushScene("category-movies", event.item)
  }
})