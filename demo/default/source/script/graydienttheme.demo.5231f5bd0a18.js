/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Fabian Jakobs (fjakobs)

************************************************************************ */

/**
 * Responsible for the selection management of the {@link qx.ui.tree.Tree}.
 *
 * @internal
 */
qx.Class.define("qx.ui.tree.selection.SelectionManager",
{
  extend : qx.ui.core.selection.ScrollArea,

  members :
  {
    // overridden
    _getSelectableLocationY : function(item)
    {
      var computed = item.getBounds();
      if (computed)
      {
        var top = this._getWidget().getItemTop(item);
        return {
          top: top,
          bottom: top+computed.height
        }
      }
    },


    // overridden
    _isSelectable : function(item) {
      return this._isItemSelectable(item)
      && item instanceof qx.ui.tree.core.AbstractTreeItem;
    },


    // overridden
    _getSelectableFromPointerEvent : function(event)
    {
      return this._getWidget().getTreeItem(event.getTarget());
    },


    // overridden
    getSelectables : function(all)
    {
      // if only the user selectables should be returned
      var oldUserInteraction = false;
      if (!all) {
        oldUserInteraction = this._userInteraction;
        this._userInteraction = true;
      }

      var widget = this._getWidget();
      var result = [];

      if (widget.getRoot() != null)
      {
        var items = widget.getRoot().getItems(true, !!all, widget.getHideRoot());

        for (var i = 0; i < items.length; i++)
        {
          if (this._isSelectable(items[i])) {
            result.push(items[i]);
          }
        }
      }

      // reset to the former user interaction state
      this._userInteraction = oldUserInteraction;

      return result;
    },


    // overridden
    _getSelectableRange : function(item1, item2)
    {
      // Fast path for identical items
      if (item1 === item2) {
        return [item1];
      }

      var selectables = this.getSelectables();

      var item1Index = selectables.indexOf(item1);
      var item2Index = selectables.indexOf(item2);

      if (item1Index < 0 || item2Index < 0) {
        return [];
      }

      if (item1Index < item2Index) {
        return selectables.slice(item1Index, item2Index+1);
      } else {
        return selectables.slice(item2Index, item1Index+1);
      }
    },


    // overridden
    _getFirstSelectable : function() {
      return this.getSelectables()[0] || null;
    },


    // overridden
    _getLastSelectable : function()
    {
      var selectables = this.getSelectables();
      if (selectables.length > 0) {
        return selectables[selectables.length-1];
      } else {
        return null;
      }
    },

    // overridden
    _getRelatedSelectable : function(item, relation)
    {
      var widget = this._getWidget();
      var related = null;

      switch (relation)
      {
        case "above":
          related = widget.getPreviousNodeOf(item, false);
          break;

        case "under":
          related = widget.getNextNodeOf(item, false);
          break;

        case "left":
        case "right":
          break;
      }

      if (!related) {
        return null;
      }

      if (this._isSelectable(related)) {
        return related;
      } else {
        return this._getRelatedSelectable(related, relation);
      }
    }
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Fabian Jakobs (fjakobs)
     * Sebastian Werner (wpbasti)
     * Andreas Ecker (ecker)
     * Derrell Lipman (derrell)
     * Christian Hagendorn (chris_schmidt)

************************************************************************ */

/**
 * The AbstractItem serves as a common superclass for the {@link
 * qx.ui.tree.core.AbstractTreeItem} and {@link qx.ui.tree.VirtualTreeItem} classes.
 *
 * @childControl label {qx.ui.basic.Label} label of the tree item
 * @childControl icon {qx.ui.basic.Image} icon of the tree item
 * @childControl open {qx.ui.tree.core.FolderOpenButton} button to open/close a subtree
 */
qx.Class.define("qx.ui.tree.core.AbstractItem",
{
  extend : qx.ui.core.Widget,
  type : "abstract",
  include : [qx.ui.form.MModelProperty],
  implement : [qx.ui.form.IModel],


  /**
   * @param label {String?null} The tree item's caption text
   */
  construct : function(label)
  {
    this.base(arguments);

    if (label != null) {
      this.setLabel(label);
    }

    this._setLayout(new qx.ui.layout.HBox());
    this._addWidgets();

    this.initOpen();
  },


  properties :
  {
    /**
     * Whether the tree item is opened.
     */
    open :
    {
      check : "Boolean",
      init : false,
      event : "changeOpen",
      apply : "_applyOpen"
    },


    /**
     * Controls, when to show the open symbol. If the mode is "auto" , the open
     * symbol is shown only if the item has child items.
     */
    openSymbolMode :
    {
      check : ["always", "never", "auto"],
      init : "auto",
      event : "changeOpenSymbolMode",
      apply : "_applyOpenSymbolMode"
    },


    /**
     * The number of pixel to indent the tree item for each level.
     */
    indent :
    {
      check : "Integer",
      init : 19,
      apply : "_applyIndent",
      event : "changeIndent",
      themeable : true
    },


    /**
     * URI of "closed" icon. Can be any URI String supported by qx.ui.basic.Image.
     **/
    icon :
    {
      check : "String",
      apply : "_applyIcon",
      event : "changeIcon",
      nullable : true,
      themeable : true
    },


    /**
     * URI of "opened" icon. Can be any URI String supported by qx.ui.basic.Image.
     **/
    iconOpened :
    {
      check : "String",
      apply : "_applyIconOpened",
      event : "changeIconOpened",
      nullable : true,
      themeable : true
    },


    /**
     * The label/caption/text
     */
    label :
    {
      check : "String",
      apply : "_applyLabel",
      event : "changeLabel",
      init : ""
    }
  },


  members :
  {
    __labelAdded : null,
    __iconAdded : null,
    __spacer : null,


    /**
     * This method configures the tree item by adding its sub widgets like
     * label, icon, open symbol, ...
     *
     * This method must be overridden by sub classes.
     */
    _addWidgets : function() {
      throw new Error("Abstract method call.");
    },


    // overridden
    _createChildControlImpl : function(id, hash)
    {
      var control;

      switch(id)
      {
        case "label":
          control = new qx.ui.basic.Label().set({
            alignY: "middle",
            anonymous: true,
            value: this.getLabel()
          });
          break;

        case "icon":
          control = new qx.ui.basic.Image().set({
            alignY: "middle",
            anonymous: true,
            source: this.getIcon()
          });
          break;

        case "open":
          control = new qx.ui.tree.core.FolderOpenButton().set({
            alignY: "middle"
          });
          control.addListener("changeOpen", this._onChangeOpen, this);
          control.addListener("resize", this._updateIndent, this);
          break;
      }

      return control || this.base(arguments, id);
    },


    /*
    ---------------------------------------------------------------------------
      TREE ITEM CONFIGURATION
    ---------------------------------------------------------------------------
    */

    /**
     * Adds a sub widget to the tree item's horizontal box layout.
     *
     * @param widget {qx.ui.core.Widget} The widget to add
     * @param options {Map?null} The (optional) layout options to use for the widget
     */
    addWidget : function(widget, options) {
      this._add(widget, options);
    },


    /**
     * Adds the spacer used to render the indentation to the item's horizontal
     * box layout. If the spacer has been added before, it is removed from its
     * old position and added to the end of the layout.
     */
    addSpacer : function()
    {
      if (!this.__spacer) {
        this.__spacer = new qx.ui.core.Spacer();
      } else {
        this._remove(this.__spacer);
      }

      this._add(this.__spacer);
    },


    /**
     * Adds the open button to the item's horizontal box layout. If the open
     * button has been added before, it is removed from its old position and
     * added to the end of the layout.
     */
    addOpenButton : function() {
      this._add(this.getChildControl("open"));
    },


    /**
     * Event handler, which listens to open state changes of the open button
     *
     * @param e {qx.event.type.Data} The event object
     */
    _onChangeOpen : function(e)
    {
      if (this.isOpenable()) {
        this.setOpen(e.getData());
      }
    },


    /**
     * Adds the icon widget to the item's horizontal box layout. If the icon
     * widget has been added before, it is removed from its old position and
     * added to the end of the layout.
     */
    addIcon : function()
    {
      var icon = this.getChildControl("icon");

      if (this.__iconAdded) {
        this._remove(icon);
      }

      this._add(icon);
      this.__iconAdded = true;
    },


    /**
     * Adds the label to the item's horizontal box layout. If the label
     * has been added before, it is removed from its old position and
     * added to the end of the layout.
     *
     * @param text {String?0} The label's contents
     */
    addLabel : function(text)
    {
      var label = this.getChildControl("label");

      if (this.__labelAdded) {
        this._remove(label);
      }

      if (text) {
        this.setLabel(text);
      } else {
        label.setValue(this.getLabel());
      }

      this._add(label);
      this.__labelAdded = true;
    },


    /*
    ---------------------------------------------------------------------------
      PROPERTY APPLY
    ---------------------------------------------------------------------------
    */

    // property apply
    _applyIcon : function(value, old)
    {
      // Set "closed" icon - even when "opened" - if no "opened" icon was
      // user-defined
      if (!this.__getUserValueIconOpened()) {
        this.__setIconSource(value);
      }

      else if (!this.isOpen()) {
        this.__setIconSource(value);
      }

    },


    // property apply
    _applyIconOpened : function(value, old)
    {

      if (this.isOpen()) {

        // ... both "closed" and "opened" icon were user-defined
        if (this.__getUserValueIcon() && this.__getUserValueIconOpened()) {
          this.__setIconSource(value);
        }

        // .. only "opened" icon was user-defined
        else if (!this.__getUserValueIcon() && this.__getUserValueIconOpened()) {
          this.__setIconSource(value);
        }
      }

    },


    // property apply
    _applyLabel : function(value, old)
    {
      var label = this.getChildControl("label", true);
      if (label) {
        label.setValue(value);
      }
    },

    // property apply
    _applyOpen : function(value, old)
    {
      var open = this.getChildControl("open", true);
      if (open) {
        open.setOpen(value);
      }

      //
      // Determine source of icon for "opened" or "closed" state
      //
      var source;

      // Opened
      if (value) {
        // Never overwrite user-defined icon with themed "opened" icon
        source = this.__getUserValueIconOpened() ? this.getIconOpened() : null;
      }

      // Closed
      else {
        source = this.getIcon();
      }

      if (source) {
        this.__setIconSource(source);
      }

      value ? this.addState("opened") : this.removeState("opened");

    },

    /**
    * Get user-defined value of "icon" property
    *
    * @return {var} The user value of the property "icon"
    */
    __getUserValueIcon : function() {
      return qx.util.PropertyUtil.getUserValue(this, "icon");
    },

    /**
    * Get user-defined value of "iconOpened" property
    *
    * @return {var} The user value of the property "iconOpened"
    */
    __getUserValueIconOpened : function() {
      return qx.util.PropertyUtil.getUserValue(this, "iconOpened");
    },

    /**
    * Set source of icon child control
    *
    * @param url {String} The URL of the icon
    */
    __setIconSource : function(url) {
      var icon = this.getChildControl("icon", true);
      if (icon) {
        icon.setSource(url);
      }
    },


    /*
    ---------------------------------------------------------------------------
      INDENT HANDLING
    ---------------------------------------------------------------------------
    */

    /**
     * Whether the tree item can be opened.
     *
     * @return {Boolean} Whether the tree item can be opened.
     */
    isOpenable : function()
    {
      var openMode = this.getOpenSymbolMode();
      return (
        openMode === "always" ||
        openMode === "auto" && this.hasChildren()
      );
    },


    /**
     * Whether the open symbol should be shown
     *
     * @return {Boolean} Whether the open symbol should be shown.
     */
    _shouldShowOpenSymbol : function() {
      throw new Error("Abstract method call.");
    },


    // property apply
    _applyOpenSymbolMode : function(value, old) {
      this._updateIndent();
    },


    /**
     * Update the indentation of the tree item.
     */
    _updateIndent : function()
    {
      var openWidth = 0;
      var open = this.getChildControl("open", true);

      if (open)
      {
        if (this._shouldShowOpenSymbol())
        {
          open.show();

          var openBounds = open.getBounds();
          if (openBounds) {
            openWidth = openBounds.width;
          } else {
            return;
          }
        }
        else
        {
          open.exclude();
        }
      }

      if (this.__spacer) {
        this.__spacer.setWidth((this.getLevel() + 1) * this.getIndent() - openWidth);
      }
    },


    // property apply
    _applyIndent : function(value, old) {
      this._updateIndent();
    },


    /**
     * Computes the item's nesting level. If the item is not part of a tree
     * this function will return <code>null</code>.
     *
     * @return {Integer|null} The item's nesting level or <code>null</code>.
     */
    getLevel : function() {
      throw new Error("Abstract method call.");
    },


    // overridden
    syncWidget : function(jobs) {
      this._updateIndent();
    },


    /**
     * Whether the item has any children
     *
     * @return {Boolean} Whether the item has any children.
     */
    hasChildren : function() {
      throw new Error("Abstract method call.");
    }
  },


  destruct : function() {
    this._disposeObjects("__spacer");
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Fabian Jakobs (fjakobs)

************************************************************************ */

/**
 * The small folder open/close button
 */
qx.Class.define("qx.ui.tree.core.FolderOpenButton",
{
  extend : qx.ui.basic.Image,
  include : qx.ui.core.MExecutable,




  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  construct : function()
  {
    this.base(arguments);

    this.initOpen();

    this.addListener("tap", this._onTap);
    this.addListener("pointerdown", this._stopPropagation, this);
    this.addListener("pointerup", this._stopPropagation, this);
  },





  /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */

  properties :
  {
    /**
     * Whether the button state is "open"
     */
    open :
    {
      check : "Boolean",
      init : false,
      event : "changeOpen",
      apply : "_applyOpen"
    }
  },




  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    // property apply
    _applyOpen : function(value, old)
    {
      value ? this.addState("opened") : this.removeState("opened");
      this.execute();
    },


    /**
     * Stop tap event propagation
     *
     * @param e {qx.event.type.Event} The event object
     */
    _stopPropagation : function(e) {
      e.stopPropagation();
    },


    /**
     * Pointer tap event listener
     *
     * @param e {qx.event.type.Pointer} Pointer event
     */
    _onTap : function(e)
    {
      this.toggleOpen();
      e.stopPropagation();
    }
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Fabian Jakobs (fjakobs)
     * Sebastian Werner (wpbasti)
     * Andreas Ecker (ecker)
     * Derrell Lipman (derrell)

************************************************************************ */

/**
 * The AbstractTreeItem serves as a common superclass for the {@link
 * qx.ui.tree.TreeFile} and {@link qx.ui.tree.TreeFolder} classes.
 *
 * @childControl label {qx.ui.basic.Label} label of the tree item
 * @childControl icon {qx.ui.basic.Image} icon of the tree item
 * @childControl open {qx.ui.tree.core.FolderOpenButton} button to open/close a subtree
 */
qx.Class.define("qx.ui.tree.core.AbstractTreeItem",
{
  extend : qx.ui.tree.core.AbstractItem,
  type : "abstract",


  construct : function(label)
  {
    this.base(arguments, label);

    this.__children = [];
  },


  properties :
  {
    /**
     * The parent tree folder.
     */
    parent :
    {
      check : "qx.ui.tree.core.AbstractTreeItem",
      nullable : true
    }
  },


  members :
  {
    __children : null,
    __childrenContainer : null,


    /**
     * Returns the tree the tree item is connected to. If the item is not part of
     * a tree <code>null</code> will be returned.
     *
     * @return {qx.ui.tree.Tree|null} The item's tree or <code>null</code>.
     */
    getTree : function()
    {
      var treeItem = this;
      while (treeItem.getParent()) {
        treeItem = treeItem.getParent();
      }

      var tree = treeItem.getLayoutParent() ? treeItem.getLayoutParent().getLayoutParent() : 0;
      if (tree && tree instanceof qx.ui.core.scroll.ScrollPane) {
        return tree.getLayoutParent();
      }
      return null;
    },


    // property apply
    _applyOpen : function(value, old)
    {
      if (this.hasChildren()) {
        this.getChildrenContainer().setVisibility(value ? "visible" : "excluded");
      }

      this.base(arguments, value, old);
    },

    /*
    ---------------------------------------------------------------------------
      INDENT HANDLING
    ---------------------------------------------------------------------------
    */

    // overridden
    _shouldShowOpenSymbol : function()
    {
      var open = this.getChildControl("open", true);
      if (!open) {
        return false;
      }

      var tree = this.getTree();
      if (!tree.getRootOpenClose())
      {
        if (tree.getHideRoot())
        {
          if (tree.getRoot() == this.getParent()) {
            return false;
          }
        }
        else
        {
          if (tree.getRoot() == this) {
            return false;
          }
        }
      }

      return this.isOpenable();
    },


    // overridden
    _updateIndent : function()
    {
      if (!this.getTree()) {
        return;
      }

      this.base(arguments);
    },


    // overridden
    getLevel : function()
    {
      var tree = this.getTree();
      if (!tree) {
        return;
      }

      var treeItem = this;
      var level = -1;

      while (treeItem)
      {
        treeItem = treeItem.getParent();
        level += 1;
      }

      // don't count the hidden root node in the tree widget
      if (tree.getHideRoot()) {
        level -= 1;
      }

      if (!tree.getRootOpenClose()) {
        level -= 1;
      }

      return level;
    },


    /*
    ---------------------------------------------------------------------------
      STATE HANDLING
    ---------------------------------------------------------------------------
    */

    // overridden
    addState : function(state)
    {
      this.base(arguments, state);

      var children = this._getChildren();
      for (var i=0,l=children.length; i<l; i++)
      {
        var child = children[i];
        if (child.addState) {
          children[i].addState(state);
        }
      }
    },


    // overridden
    removeState : function(state)
    {
      this.base(arguments, state);

      var children = this._getChildren();
      for (var i=0,l=children.length; i<l; i++)
      {
        var child = children[i];
        if (child.removeState) {
          children[i].removeState(state);
        }
      }
    },


    /*
    ---------------------------------------------------------------------------
      CHILDREN CONTAINER
    ---------------------------------------------------------------------------
    */

    /**
     * Returns the widget, which acts as container for the child items.
     * This widget must have a vertical box layout.
     *
     * @return {qx.ui.core.Widget} The children container
     */
    getChildrenContainer : function()
    {
      if (!this.__childrenContainer)
      {
        this.__childrenContainer = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
          visibility : this.isOpen() ? "visible" : "excluded"
        });
      }

      return this.__childrenContainer;
    },


    /**
     * Whether the tree item has a children container
     *
     * @return {Boolean} Whether it has a children container
     */
    hasChildrenContainer : function() {
      return this.__childrenContainer;
    },


    /**
     * Get the children container of the item's parent. This function will return
     * <code>null</code>, if the item does not have a parent or is not the root
     * item.
     *
     * @return {qx.ui.core.Widget} The parent's children container.
     */
    getParentChildrenContainer : function()
    {
      if (this.getParent()) {
        return this.getParent().getChildrenContainer();
      } else if (this.getLayoutParent()) {
        return this.getLayoutParent();
      } else {
        return null;
      }
    },


    /*
    ---------------------------------------------------------------------------
      CHILDREN HANDLING
    ---------------------------------------------------------------------------
    */

    /**
     * Get all child items.
     *
     * Note: Don not modify the returned array, since this function does not
     * return a copy!
     *
     * @return {AbstractTreeItem[]} An array of all child items.
     */
    getChildren : function() {
      return this.__children;
    },


    // overridden
    hasChildren : function() {
      return this.__children ? this.__children.length > 0 : false;
    },


    /**
     * Returns all children of the folder.
     *
     * @param recursive {Boolean ? true} whether children of subfolder should be
     *     included
     * @param invisible {Boolean ? true} whether invisible children should be
     *     included
     * @param ignoreFirst {Boolean ? true} Whether the current treeItem should
     *     be excluded from the list.
     * @return {AbstractTreeItem[]} list of children
     */
    getItems : function(recursive, invisible, ignoreFirst)
    {
      if (ignoreFirst !== false) {
        var items = [];
      } else {
        var items = [this];
      }

      var addChildren =
        this.hasChildren() &&
        (invisible !== false || this.isOpen())

      if (addChildren)
      {
        var children = this.getChildren();
        if (recursive === false)
        {
          items = items.concat(children);
        }
        else
        {
          for (var i=0, chl=children.length; i<chl; i++) {
            items = items.concat(children[i].getItems(recursive, invisible, false));
          }
        }
      }
      return items;
    },


    /**
     * Adds this item and recursively all sub items to the widget queue to
     * update the indentation.
     *
     * @internal
     */
    recursiveAddToWidgetQueue : function()
    {
      var children = this.getItems(true, true, false);
      for (var i=0, l=children.length; i<l; i++) {
        qx.ui.core.queue.Widget.add(children[i]);
      }
    },


    /**
     * Adds the item's children container to the parent's children container.
     */
    __addChildrenToParent : function()
    {
      if (this.getParentChildrenContainer()) {
        this.getParentChildrenContainer()._addAfter(this.getChildrenContainer(), this);
      }
    },


    /**
     * Adds the passed tree items to the end of this item's children list.
     *
     * @param varargs {AbstractTreeItem} variable number of tree items to add
     */
    add : function(varargs)
    {
      var container = this.getChildrenContainer();
      var tree = this.getTree();


      for (var i=0, l=arguments.length; i<l; i++)
      {
        var treeItem = arguments[i];

        var oldParent = treeItem.getParent();
        if (oldParent) {
          oldParent.remove(treeItem);
        }

        treeItem.setParent(this);
        var hasChildren = this.hasChildren();

        container.add(treeItem);

        if (treeItem.hasChildren()) {
          container.add(treeItem.getChildrenContainer());
        }
        this.__children.push(treeItem);

        if (!hasChildren) {
          this.__addChildrenToParent();
        }

        if (tree)
        {
          treeItem.recursiveAddToWidgetQueue();
          tree.fireNonBubblingEvent("addItem", qx.event.type.Data, [treeItem]);
        }
      }
      if (tree) {
        qx.ui.core.queue.Widget.add(this);
      }
    },


    /**
     * Adds the tree item to the current item, at the given index.
     *
     * @param treeItem {AbstractTreeItem} new tree item to insert
     * @param index {Integer} position to insert into
     */
    addAt : function(treeItem, index)
    {
      if (qx.core.Environment.get("qx.debug")) {
        this.assert(
          index <= this.__children.length && index >= 0,
          "Invalid child index: " + index
        );
      }

      if (index == this.__children.length)
      {
        this.add(treeItem);
        return;
      }

      var oldParent = treeItem.getParent();
      if (oldParent) {
        oldParent.remove(treeItem);
      }

      var container = this.getChildrenContainer();

      treeItem.setParent(this);
      var hasChildren = this.hasChildren();

      var nextItem = this.__children[index];
      container.addBefore(treeItem, nextItem);

      if (treeItem.hasChildren()) {
        container.addAfter(treeItem.getChildrenContainer(), treeItem);
      }
      qx.lang.Array.insertAt(this.__children, treeItem, index);

      if (!hasChildren) {
        this.__addChildrenToParent();
      }

      if (this.getTree())
      {
        treeItem.recursiveAddToWidgetQueue();
        qx.ui.core.queue.Widget.add(this);
      }
    },


    /**
     * Add a tree item to this item before the existing child <code>before</code>.
     *
     * @param treeItem {AbstractTreeItem} tree item to add
     * @param before {AbstractTreeItem} existing child to add the item before
     */
    addBefore : function(treeItem, before)
    {
      if (qx.core.Environment.get("qx.debug")) {
        this.assert(this.__children.indexOf(before) >= 0)
      }

      // It's important to remove the item before the addAt is called
      // otherwise the index calculation could be wrong
      var oldParent = treeItem.getParent();
      if (oldParent) {
        oldParent.remove(treeItem);
      }

      this.addAt(treeItem, this.__children.indexOf(before));
    },


    /**
     * Add a tree item to this item after the existing child <code>before</code>.
     *
     * @param treeItem {AbstractTreeItem} tree item to add
     * @param after {AbstractTreeItem} existing child to add the item after
     */
    addAfter : function(treeItem, after)
    {
      if (qx.core.Environment.get("qx.debug")) {
        this.assert(this.__children.indexOf(after) >= 0)
      }

      // It's important to remove the item before the addAt is called
      // otherwise the index calculation could be wrong
      var oldParent = treeItem.getParent();
      if (oldParent) {
        oldParent.remove(treeItem);
      }

      this.addAt(treeItem, this.__children.indexOf(after)+1);
    },


    /**
     * Add a tree item as the first child of this item.
     *
     * @param treeItem {AbstractTreeItem} tree item to add
     */
    addAtBegin : function(treeItem) {
      this.addAt(treeItem, 0);
    },


    /**
     * Removes the passed tree items from this item.
     *
     * @param varargs {AbstractTreeItem} variable number of tree items to remove
     */
    remove : function(varargs)
    {
      for (var i=0, l=arguments.length; i<l; i++)
      {
        var treeItem = arguments[i];
        if (this.__children.indexOf(treeItem) == -1) {
          this.warn("Cannot remove treeitem '"+treeItem+"'. It is not a child of this tree item.");
          return;
        }

        var container = this.getChildrenContainer();

        if (treeItem.hasChildrenContainer()) {
          var treeItemChildContainer = treeItem.getChildrenContainer();
          if (container.getChildren().indexOf(treeItemChildContainer) >= 0) {
            // Sometimes not, see bug #3038
            container.remove(treeItemChildContainer);
          }
        }
        qx.lang.Array.remove(this.__children, treeItem);

        treeItem.setParent(null);
        container.remove(treeItem);
      }

      var tree = this.getTree();
      if (tree) {
        tree.fireNonBubblingEvent("removeItem", qx.event.type.Data, [treeItem]);
      }

      qx.ui.core.queue.Widget.add(this);
    },


    /**
     * Remove the child with the given child index.
     *
     * @param index {Integer} Index of the child to remove
     */
    removeAt : function(index)
    {
      var item = this.__children[index];
      if (item) {
        this.remove(item);
      }
    },


    /**
     * Remove all child items from this item.
     */
    removeAll : function()
    {
      // create a copy for returning
      var children = this.__children.concat();
      for (var i=this.__children.length-1; i>=0; i--) {
        this.remove(this.__children[i]);
      }
      return children;
    }
  },


  destruct : function()
  {
    this._disposeArray("__children");
    this._disposeObjects("__childrenContainer");
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Fabian Jakobs (fjakobs)
     * Sebastian Werner (wpbasti)
     * Andreas Ecker (ecker)
     * Derrell Lipman (derrell)
     * Christian Hagendorn (chris_schmidt)
     * Daniel Wagner (d_wagner)

************************************************************************ */

/**
 * The Tree class implements a tree widget, with collapsible and expandable
 * container nodes and terminal leaf nodes. You instantiate a Tree object and
 * then assign the tree a root folder using the {@link #root} property.
 *
 * If you don't want to show the root item, you can hide it with the
 * {@link #hideRoot} property.
 *
 * The handling of <b>selections</b> within a tree is somewhat distributed
 * between the root tree object and the attached {@link qx.ui.tree.selection.SelectionManager}.
 * To get the currently selected element of a tree use the tree {@link #getSelection}
 * method and tree {@link #setSelection} to set it. The TreeSelectionManager
 * handles more coarse-grained issues like providing {@link #selectAll} and
 * {@link #resetSelection} methods.
 */
qx.Class.define("qx.ui.tree.Tree",
{
  extend : qx.ui.core.scroll.AbstractScrollArea,
  implement : [
    qx.ui.core.IMultiSelection,
    qx.ui.form.IModelSelection,
    qx.ui.form.IForm
  ],
  include : [
    qx.ui.core.MMultiSelectionHandling,
    qx.ui.core.MContentPadding,
    qx.ui.form.MModelSelection,
    qx.ui.form.MForm
  ],


  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */


  construct : function()
  {
    this.base(arguments);

    this.__content = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
      allowShrinkY: false,
      allowGrowX: true
    });

    this.getChildControl("pane").add(this.__content);

    this.initOpenMode();
    this.initRootOpenClose();

    this.addListener("changeSelection", this._onChangeSelection, this);
    this.addListener("keypress", this._onKeyPress, this);
  },


  /*
  *****************************************************************************
     EVENTS
  *****************************************************************************
  */


  events :
  {
    /**
     * This event is fired after a tree item was added to the tree. The
     * {@link qx.event.type.Data#getData} method of the event returns the
     * added item.
     */
    addItem : "qx.event.type.Data",

    /**
     * This event is fired after a tree item has been removed from the tree.
     * The {@link qx.event.type.Data#getData} method of the event returns the
     * removed item.
     */
    removeItem : "qx.event.type.Data"
  },


  /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */

  properties :
  {
    /**
     * Control whether tap or double tap should open or close the tapped
     * folder.
     */
    openMode :
    {
      check : ["tap", "dbltap", "none"],
      init : "dbltap",
      apply : "_applyOpenMode",
      event : "changeOpenMode",
      themeable : true
    },

    /**
     * The root tree item of the tree to display
     */
    root :
    {
      check : "qx.ui.tree.core.AbstractTreeItem",
      init : null,
      nullable : true,
      event : "changeRoot",
      apply : "_applyRoot"
    },

    /**
     * Hide the root (Tree) node.  This differs from the visibility property in
     * that this property hides *only* the root node, not the node's children.
     */
    hideRoot :
    {
      check : "Boolean",
      init : false,
      apply :"_applyHideRoot"
    },

    /**
     * Whether the Root should have an open/close button.  This may also be
     * used in conjunction with the hideNode property to provide for virtual root
     * nodes.  In the latter case, be very sure that the virtual root nodes are
     * expanded programatically, since there will be no open/close button for the
     * user to open them.
     */
    rootOpenClose :
    {
      check : "Boolean",
      init : false,
      apply : "_applyRootOpenClose"
    },

    // overridden
    appearance :
    {
      refine: true,
      init: "tree"
    },

    // overridden
    focusable :
    {
      refine : true,
      init : true
    }
  },


  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    __content : null,

    /** @type {Class} Pointer to the selection manager to use */
    SELECTION_MANAGER : qx.ui.tree.selection.SelectionManager,


    /*
    ---------------------------------------------------------------------------
      WIDGET API
    ---------------------------------------------------------------------------
    */


    /**
     * Get the widget, which contains the root tree item. This widget must
     * have a vertical box layout.
     *
     * @return {qx.ui.core.Widget} the children container
     */
    getChildrenContainer : function() {
      return this.__content;
    },


    // property apply
    _applyRoot : function(value, old)
    {
      var container = this.getChildrenContainer();

      if (old && !old.isDisposed())
      {
        container.remove(old);
        if (old.hasChildren()) {
          container.remove(old.getChildrenContainer());
        }
      }

      if (value)
      {
        container.add(value);
        if (value.hasChildren()) {
          container.add(value.getChildrenContainer());
        }

        value.setVisibility(this.getHideRoot() ? "excluded" : "visible");
        value.recursiveAddToWidgetQueue();
      }
    },


    // property apply
    _applyHideRoot : function(value, old)
    {
      var root = this.getRoot();
      if (!root) {
        return;
      }

      root.setVisibility(value ? "excluded" : "visible");
      root.recursiveAddToWidgetQueue();
    },


    // property apply
    _applyRootOpenClose : function(value, old)
    {
      var root = this.getRoot();
      if (!root) {
        return;
      }
      root.recursiveAddToWidgetQueue();
    },


    /**
     * Returns the element, to which the content padding should be applied.
     *
     * @return {qx.ui.core.Widget} The content padding target.
     */
    _getContentPaddingTarget : function() {
      return this.__content;
    },


    /*
    ---------------------------------------------------------------------------
      SELECTION MANAGER API
    ---------------------------------------------------------------------------
    */


    /**
     * Get the tree item following the given item in the tree hierarchy.
     *
     * @param treeItem {qx.ui.tree.core.AbstractTreeItem} The tree item to get the item after
     * @param invisible {Boolean?true} Whether invisible/closed tree items
     *     should be returned as well.
     *
     * @return {qx.ui.tree.core.AbstractTreeItem?null} The item after the given item. May be
     *     <code>null</code> if the item is the last item.
     */
    getNextNodeOf : function(treeItem, invisible)
    {
      if ((invisible !== false || treeItem.isOpen()) && treeItem.hasChildren()) {
        return treeItem.getChildren()[0];
      }

      while (treeItem)
      {
        var parent = treeItem.getParent();
        if (!parent) {
          return null;
        }


        var parentChildren = parent.getChildren();
        var index = parentChildren.indexOf(treeItem);
        if (index > -1 && index < parentChildren.length-1) {
          return parentChildren[index+1];
        }

        treeItem = parent;
      }
      return null;
    },


    /**
     * Get the tree item preceding the given item in the tree hierarchy.
     *
     * @param treeItem {qx.ui.tree.core.AbstractTreeItem} The tree item to get the item before
     * @param invisible {Boolean?true} Whether invisible/closed tree items
     *     should be returned as well.
     *
     * @return {qx.ui.tree.core.AbstractTreeItem?null} The item before the given item. May be
     *     <code>null</code> if the given item is the tree's root.
     */
    getPreviousNodeOf : function(treeItem, invisible)
    {
      var parent = treeItem.getParent();
      if (!parent) {
        return null;
      }

      if (this.getHideRoot())
      {
        if (parent == this.getRoot())
        {
          if (parent.getChildren()[0] == treeItem) {
            return null;
          }
        }
      }
      else
      {
        if (treeItem == this.getRoot()) {
          return null;
        }
      }

      var parentChildren = parent.getChildren();
      var index = parentChildren.indexOf(treeItem);
      if (index > 0)
      {
        var folder = parentChildren[index-1];
        while ((invisible !== false || folder.isOpen()) && folder.hasChildren())
        {
          var children = folder.getChildren();
          folder = children[children.length-1];
        }
        return folder;
      }
      else
      {
        return parent;
      }
    },


    /**
     * Get the tree item's next sibling.
     *
     * @param treeItem {qx.ui.tree.core.AbstractTreeItem} The tree item to get the following
     * sibling of.
     *
     * @return {qx.ui.tree.core.AbstractTreeItem?null} The item following the given item. May be
     *     <code>null</code> if the given item is the last in it's nesting
     *     level.
     */
    getNextSiblingOf : function(treeItem)
    {
      if (treeItem == this.getRoot()) {
        return null;
      }

      var parent = treeItem.getParent();
      var siblings = parent.getChildren();
      var index = siblings.indexOf(treeItem);

      if (index < siblings.length-1) {
        return siblings[index+1];
      }

      return null;
    },


    /**
     * Get the tree item's previous sibling.
     *
     * @param treeItem {qx.ui.tree.core.AbstractTreeItem} The tree item to get the previous
     * sibling of.
     *
     * @return {qx.ui.tree.core.AbstractTreeItem?null} The item preceding the given item. May be
     *     <code>null</code> if the given item is the first in it's nesting
     *     level.
     */
    getPreviousSiblingOf : function(treeItem)
    {
      if (treeItem == this.getRoot()) {
        return null;
      }

      var parent = treeItem.getParent();
      var siblings = parent.getChildren();
      var index = siblings.indexOf(treeItem);

      if (index > 0) {
        return siblings[index-1];
      }

      return null;
    },


    /**
     * Returns all children of the tree.
     *
     * @param recursive {Boolean ? false} whether children of subfolder should be
     *     included
     * @param invisible {Boolean ? true} whether invisible children should be
     *     included
     * @return {qx.ui.tree.core.AbstractTreeItem[]} list of children
     */
    getItems : function(recursive, invisible) {
      if (this.getRoot() != null) {
        return this.getRoot().getItems(recursive, invisible, this.getHideRoot());
      }
      else {
        return [];
      }
    },


    /**
     * Returns the tree's only "external" child, namely the root node.
     *
     * @return {qx.ui.tree.core.AbstractTreeItem[]} Array containing the root node
     */
    getChildren : function() {
      if (this.getRoot() != null) {
        return [this.getRoot()];
      }
      else {
        return [];
      }
    },


    /*
    ---------------------------------------------------------------------------
      POINTER EVENT HANDLER
    ---------------------------------------------------------------------------
    */


    /**
     * Returns the tree item, which contains the given widget.
     *
     * @param widget {qx.ui.core.Widget} The widget to get the containing tree
     *   item for.
     * @return {qx.ui.tree.core.AbstractTreeItem|null} The tree item containing the widget. If the
     *     widget is not inside of any tree item <code>null</code> is returned.
     */
    getTreeItem : function(widget)
    {
      while (widget)
      {
        if (widget == this) {
          return null;
        }

        if (widget instanceof qx.ui.tree.core.AbstractTreeItem) {
          return widget;
        }

        widget = widget.getLayoutParent();
      }

      return null;
    },


    // property apply
    _applyOpenMode : function(value, old)
    {
      if (old == "tap") {
        this.removeListener("tap", this._onOpen, this);
      } else if (old == "dbltap") {
        this.removeListener("dbltap", this._onOpen, this);
      }

      if (value == "tap") {
        this.addListener("tap", this._onOpen, this);
      } else if (value == "dbltap") {
        this.addListener("dbltap", this._onOpen, this);
      }
    },


    /**
     * Event handler for tap events, which could change a tree item's open
     * state.
     *
     * @param e {qx.event.type.Pointer} The tap event object
     */
    _onOpen : function(e)
    {
      var treeItem = this.getTreeItem(e.getTarget());
      if (!treeItem ||!treeItem.isOpenable()) {
        return;
      }

      treeItem.setOpen(!treeItem.isOpen());
      e.stopPropagation();
    },


    /**
     * Event handler for changeSelection events, which opens all parent folders
     * of the selected folders.
     *
     * @param e {qx.event.type.Data} The selection data event.
     */
    _onChangeSelection : function(e) {
      var selection = e.getData();
      // for every selected folder
      for (var i = 0; i < selection.length; i++) {
        var folder = selection[i];
        // go up all parents and open them
        while (folder.getParent() != null) {
          folder = folder.getParent();
          folder.setOpen(true);
        }
      }
    },


    /**
     * Event handler for key press events. Open and close the current selected
     * item on key left and right press. Jump to parent on key left if already
     * closed.
     *
     * @param e {qx.event.type.KeySequence} key event.
     */
    _onKeyPress : function(e)
    {
      var item = this._getLeadItem();

      if (item !== null)
      {
        switch(e.getKeyIdentifier())
        {
          case "Left":
            if (item.isOpenable() && item.isOpen()) {
              item.setOpen(false);
            } else if (item.getParent()) {
              this.setSelection([item.getParent()]);
            }
            break;

          case "Right":
            if (item.isOpenable() && !item.isOpen()) {
              item.setOpen(true);
            }
            break;

          case "Enter":
          case "Space":
            if (item.isOpenable()) {
              item.toggleOpen();
            }
            break;
        }
      }
    }
  },


  /*
  *****************************************************************************
     DESTRUCTOR
  *****************************************************************************
  */


  destruct : function() {
    this._disposeObjects("__content");
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Fabian Jakobs (fjakobs)
     * Sebastian Werner (wpbasti)
     * Andreas Ecker (ecker)
     * Derrell Lipman (derrell)
     * Christian Hagendorn (chris_schmidt)

************************************************************************ */

/**
 * The tree folder is a tree element, which can have nested tree elements.
 */
qx.Class.define("qx.ui.tree.TreeFolder",
{
  extend : qx.ui.tree.core.AbstractTreeItem,


  properties :
  {
    appearance :
    {
      refine : true,
      init : "tree-folder"
    }
  },


  members :
  {
    // overridden
    _addWidgets : function()
    {
      this.addSpacer();
      this.addOpenButton();
      this.addIcon();
      this.addLabel();
    }
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2011 1&1 Internet AG, Germany, http://www.1und1.de
     2006 Derrell Lipman

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Sebastian Werner (wpbasti)
     * Andreas Ecker (ecker)
     * Derrell Lipman (derrell)
     * Christian Hagendorn (chris_schmidt)

************************************************************************ */

/**
 * The tree file is a leaf tree item. It cannot contain any nested tree items.
 */
qx.Class.define("qx.ui.tree.TreeFile",
{
  extend : qx.ui.tree.core.AbstractTreeItem,


  properties :
  {
    appearance :
    {
      refine : true,
      init : "tree-file"
    }
  },


  members :
  {
    // overridden
    _addWidgets : function()
    {
      this.addSpacer();
      this.addIcon();
      this.addLabel();
    }
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Christian Hagendorn (chris_schmidt)

************************************************************************ */

/**
 * Interface describes the methods which the {@link qx.ui.tree.provider.WidgetProvider}
 * uses for communication.
 */
qx.Interface.define("qx.ui.tree.core.IVirtualTree",
{
  members :
  {
    /**
     * Return whether top level items should have an open/close button. The top
     * level item item is normally the root item, but when the root is hidden,
     * the root children are the top level items.
     *
     * @return {Boolean} Returns <code>true</code> when top level items should
     *   show open/close buttons, <code>false</code> otherwise.
     */
    isShowTopLevelOpenCloseIcons : function() {},


    /**
     * Returns the internal data structure. The Array index is the row and the
     * value is the model item.
     *
     * @internal
     * @return {qx.data.Array} The internal data structure.
     */
    getLookupTable : function() {},


    /**
     * Returns if the passed item is a note or a leaf.
     *
     * @internal
     * @param item {qx.core.Object} Item to check.
     * @return {Boolean} <code>True</code> when item is a node,
     *   </code>false</code> when item is a leaf.
     */
    isNode : function(item)
    {
      this.assertArgumentsCount(arguments, 1, 1);
      this.assertInterface(item, qx.core.Object);
    },


    /**
     * Return whether the node is opened or closed.
     *
     * @param node {qx.core.Object} Node to check.
     * @return {Boolean} Returns <code>true</code> when the node is opened,
     *   <code>false</code> otherwise.
     */
    isNodeOpen : function(node)
    {
      this.assertArgumentsCount(arguments, 1, 1);
      this.assertInterface(node, qx.core.Object);
    },


    /**
     * Returns the row's nesting level.
     *
     * @param row {Integer} The row to get the nesting level.
     * @return {Integer} The row's nesting level or <code>null</code>.
     */
    getLevel : function(row)
    {
      this.assertArgumentsCount(arguments, 1, 1);
      this.assertInteger(row);
    },


    /**
     * Return whether the node has visible children or not.
     *
     * @internal
     * @param node {qx.core.Object} Node to check.
     * @return {Boolean} <code>True</code> when the node has visible children,
     *   <code>false</code> otherwise.
     */
    hasChildren : function(node)
    {
      this.assertArgumentsCount(arguments, 1, 1);
      this.assertInterface(node, qx.core.Object);
    },


    /**
     * Opens the passed node.
     *
     * @param node {qx.core.Object} Node to open.
     */
    openNode : function(node)
    {
      this.assertArgumentsCount(arguments, 1, 1);
      this.assertInterface(node, qx.core.Object);
    },


    /**
     * Opens the passed node without scrolling selected item into view.
     *
     * @param node {qx.core.Object} Node to open.
     */
    openNodeWithoutScrolling : function(node)
    {
      this.assertArgumentsCount(arguments, 1, 1);
      this.assertInterface(node, qx.core.Object);
    },


    /**
     * Closes the passed node.
     *
     * @param node {qx.core.Object} Node to close.
     */
    closeNode : function(node)
    {
      this.assertArgumentsCount(arguments, 1, 1);
      this.assertInterface(node, qx.core.Object);
    },


    /**
     * Closes the passed node without scrolling selected item into view.
     *
     * @param node {qx.core.Object} Node to close.
     */
    closeNodeWithoutScrolling : function(node)
    {
      this.assertArgumentsCount(arguments, 1, 1);
      this.assertInterface(node, qx.core.Object);
    },


    /**
     * Returns the current selection.
     *
     * @return {qx.data.Array} The current selected elements.
     */
    getSelection : function() {}
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Christian Hagendorn (chris_schmidt)

************************************************************************ */

/**
 * Virtual tree implementation.
 *
 * The virtual tree can be used to render node and leafs. Nodes and leafs are
 * both items for a tree. The difference between a node and a leaf is that a
 * node has child items, but a leaf not.
 *
 * With the {@link qx.ui.tree.core.IVirtualTreeDelegate} interface it is possible
 * to configure the tree's behavior (item renderer configuration, etc.).
 *
 * Here's an example of how to use the widget:
 * <pre class="javascript">
 * //create the model data
 * var nodes = [];
 * for (var i = 0; i < 2500; i++)
 * {
 *   nodes[i] = {name : "Item " + i};
 *
 *   // if its not the root node
 *   if (i !== 0)
 *   {
 *     // add the children in some random order
 *     var node = nodes[parseInt(Math.random() * i)];
 *
 *     if(node.children == null) {
 *       node.children = [];
 *     }
 *     node.children.push(nodes[i]);
 *   }
 * }
 *
 * // converts the raw nodes to qooxdoo objects
 * nodes = qx.data.marshal.Json.createModel(nodes, true);
 *
 * // creates the tree
 * var tree = new qx.ui.tree.VirtualTree(nodes.getItem(0), "name", "children").set({
 *   width : 200,
 *   height : 400
 * });
 *
 * //log selection changes
 * tree.getSelection().addListener("change", function(e) {
 *   this.debug("Selection: " + tree.getSelection().getItem(0).getName());
 * }, this);
 * </pre>
 */
qx.Class.define("qx.ui.tree.VirtualTree",
{
  extend : qx.ui.virtual.core.Scroller,
  implement : [qx.ui.tree.core.IVirtualTree, qx.data.controller.ISelection],
  include : [
    qx.ui.virtual.selection.MModel,
    qx.ui.core.MContentPadding
  ],

  /**
   * @param model {qx.core.Object?null} The model structure for the tree, for
   *   more details have a look at the 'model' property.
   * @param labelPath {String?null} The name of the label property, for more
   *   details have a look at the 'labelPath' property.
   * @param childProperty {String?null} The name of the child property, for
   *   more details have a look at the 'childProperty' property.
   */
  construct : function(model, labelPath, childProperty)
  {
    this.base(arguments, 0, 1, 20, 100);

    this._init();

    if (labelPath != null) {
      this.setLabelPath(labelPath);
    }

    if (childProperty != null) {
      this.setChildProperty(childProperty);
    }

    if(model != null) {
      this.initModel(model);
    }

    this.initItemHeight();
    this.initOpenMode();

    this.addListener("keypress", this._onKeyPress, this);
  },

  events :
  {
    /**
     * Fired when a node is opened.
     */
    open : "qx.event.type.Data",


    /**
     * Fired when a node is closed.
     */
    close : "qx.event.type.Data"
  },


  properties :
  {
    // overridden
    appearance :
    {
      refine: true,
      init: "virtual-tree"
    },


    // overridden
    focusable :
    {
      refine: true,
      init: true
    },


    // overridden
    width :
    {
      refine : true,
      init : 100
    },


    // overridden
    height :
    {
      refine : true,
      init : 200
    },


    /** Default item height. */
    itemHeight :
    {
      check : "Integer",
      init : 25,
      apply : "_applyRowHeight",
      themeable : true
    },


    /**
     * Control whether tap or double tap should open or close the tapped
     * item.
     */
    openMode :
    {
      check: ["tap", "dbltap", "none"],
      init: "dbltap",
      apply: "_applyOpenMode",
      event: "changeOpenMode",
      themeable: true
    },


    /**
     * Hides *only* the root node, not the node's children when the property is
     * set to <code>true</code>.
     */
    hideRoot :
    {
      check: "Boolean",
      init: false,
      apply:"_applyHideRoot"
    },


    /**
     * Whether top level items should have an open/close button. The top level
     * item item is normally the root item, but when the root is hidden, the
     * root children are the top level items.
     */
    showTopLevelOpenCloseIcons :
    {
      check : "Boolean",
      init : false,
      apply : "_applyShowTopLevelOpenCloseIcons"
    },


    /**
     * Configures the tree to show also the leafs. When the property is set to
     * <code>false</code> *only* the nodes are shown.
     */
    showLeafs :
    {
      check: "Boolean",
      init: true,
      apply: "_applyShowLeafs"
    },


    /**
     * The name of the property, where the children are stored in the model.
     * Instead of the {@link #labelPath} must the child property a direct
     * property form the model instance.
     */
    childProperty :
    {
      check: "String",
      apply: "_applyChildProperty",
      nullable: true
    },


    /**
     * The name of the property, where the value for the tree folders label
     * is stored in the model classes.
     */
    labelPath :
    {
      check: "String",
      apply: "_applyLabelPath",
      nullable: true
    },


    /**
     * The path to the property which holds the information that should be
     * shown as an icon.
     */
    iconPath :
    {
      check: "String",
      apply: "_applyIconPath",
      nullable: true
    },


    /**
     * A map containing the options for the label binding. The possible keys
     * can be found in the {@link qx.data.SingleValueBinding} documentation.
     */
    labelOptions :
    {
      apply: "_applyLabelOptions",
      nullable: true
    },


    /**
     * A map containing the options for the icon binding. The possible keys
     * can be found in the {@link qx.data.SingleValueBinding} documentation.
     */
    iconOptions :
    {
      apply: "_applyIconOptions",
      nullable: true
    },


    /**
     * The model containing the data (nodes and/or leafs) which should be shown
     * in the tree.
     */
    model :
    {
      check : "qx.core.Object",
      apply : "_applyModel",
      event: "changeModel",
      nullable : true,
      deferredInit : true
    },


    /**
     * Delegation object, which can have one or more functions defined by the
     * {@link qx.ui.tree.core.IVirtualTreeDelegate} interface.
     */
    delegate :
    {
      event: "changeDelegate",
      apply: "_applyDelegate",
      init: null,
      nullable: true
    }
  },


  members :
  {
    /** @type {qx.ui.tree.provider.WidgetProvider} Provider for widget rendering. */
    _provider : null,


    /** @type {qx.ui.virtual.layer.Abstract} Layer which contains the items. */
    _layer : null,


    /**
     * @type {qx.data.Array} The internal lookup table data structure to get the model item
     * from a row.
     */
    __lookupTable : null,


    /** @type {Array} HashMap which contains all open nodes. */
    __openNodes : null,


    /**
     * @type {Array} The internal data structure to get the nesting level from a
     * row.
     */
    __nestingLevel : null,


    /**
     * @type {qx.util.DeferredCall} Adds this instance to the widget queue on a
     * deferred call.
     */
    __deferredCall : null,


    /** @type {Integer} Holds the max item width from a rendered widget. */
    _itemWidth : 0,


    /** @type {Array} internal parent chain form the last selected node */
    __parentChain : null,


    /*
    ---------------------------------------------------------------------------
      PUBLIC API
    ---------------------------------------------------------------------------
    */


    // overridden
    syncWidget : function(jobs)
    {
      var firstRow = this._layer.getFirstRow();
      var rowSize = this._layer.getRowSizes().length;

      for (var row = firstRow; row < firstRow + rowSize; row++)
      {
        var widget = this._layer.getRenderedCellWidget(row, 0);
        if (widget != null) {
          this._itemWidth = Math.max(this._itemWidth, widget.getSizeHint().width);
        }
      }
      var paneWidth = this.getPane().getInnerSize().width;
      this.getPane().getColumnConfig().setItemSize(0, Math.max(this._itemWidth, paneWidth));
    },


    // Interface implementation
    openNode : function(node)
    {
      this.__openNode(node);
      this.buildLookupTable();
    },


    // Interface implementation
    openNodeWithoutScrolling : function(node)
    {
      var autoscroll = this.getAutoScrollIntoView();
      // suspend automatically scrolling selection into view
      this.setAutoScrollIntoView(false);

      this.openNode(node);

      // re set to original value
      this.setAutoScrollIntoView(autoscroll);
    },


    /**
     * Trigger a rebuild from the internal data structure.
     */
    refresh : function() {
      this.buildLookupTable();
    },


    /**
     * Opens the passed node and all his parents. *Note!* The algorithm
     * implements a depth-first search with a complexity: <code>O(n)</code> and
     * <code>n</code> are all model items.
     *
     * @param node {qx.core.Object} Node to open.
     */
    openNodeAndParents : function(node)
    {
      this.__openNodeAndAllParents(this.getModel(), node);
      this.buildLookupTable();
    },


    // Interface implementation
    closeNode : function(node)
    {
      if (qx.lang.Array.contains(this.__openNodes, node))
      {
        qx.lang.Array.remove(this.__openNodes, node);
        this.fireDataEvent("close", node);
        this.buildLookupTable();
      }
    },


    // Interface implementation
    closeNodeWithoutScrolling : function(node)
    {
      var autoscroll = this.getAutoScrollIntoView();
      // suspend automatically scrolling selection into view
      this.setAutoScrollIntoView(false);

      this.closeNode(node);

      // re set to original value
      this.setAutoScrollIntoView(autoscroll);
    },


    // Interface implementation
    isNodeOpen : function(node) {
      return qx.lang.Array.contains(this.__openNodes, node);
    },


    /*
    ---------------------------------------------------------------------------
      INTERNAL API
    ---------------------------------------------------------------------------
    */


    /**
     * Initializes the virtual tree.
     */
    _init : function()
    {
      this.__lookupTable = new qx.data.Array();
      this.__openNodes = [];
      this.__nestingLevel = [];
      this._initLayer();
    },


    /**
     * Initializes the virtual tree layer.
     */
    _initLayer : function()
    {
      this._provider = new qx.ui.tree.provider.WidgetProvider(this);
      this._layer = this._provider.createLayer();
      this._layer.addListener("updated", this._onUpdated, this);
      this.getPane().addLayer(this._layer);
      this.getPane().addListenerOnce("resize", function(e) {
        // apply width to pane on first rendering pass
        // to avoid visible flickering
        this.getPane().getColumnConfig().setItemSize(0, e.getData().width);
      }, this);
    },


    // Interface implementation
    getLookupTable : function() {
      return this.__lookupTable;
    },


    /**
     * Performs a lookup from model index to row.
     *
     * @param index {Number} The index to look at.
     * @return {Number} The row or <code>-1</code>
     *  if the index is not a model index.
     */
    _reverseLookup : function(index) {
      return index;
    },


    /**
     * Returns the model data for the given row.
     *
     * @param row {Integer} row to get data for.
     * @return {var|null} the row's model data.
     */
    _getDataFromRow : function(row) {
      return this.__lookupTable.getItem(row);
    },

    /**
     * Returns the selectable model items.
     *
     * @return {qx.data.Array} The selectable items.
     */
    _getSelectables : function() {
      return this.__lookupTable;
    },


    /**
     * Returns all open nodes.
     *
     * @internal
     * @return {Array} All open nodes.
     */
    getOpenNodes : function() {
      return this.__openNodes;
    },


    // Interface implementation
    isNode : function(item) {
      return qx.ui.tree.core.Util.isNode(item, this.getChildProperty());
    },


    // Interface implementation
    getLevel : function(row) {
      return this.__nestingLevel[row];
    },


    // Interface implementation
    hasChildren : function(node) {
      return qx.ui.tree.core.Util.hasChildren(node, this.getChildProperty(), !this.isShowLeafs());
    },


    /**
     * Returns the element, to which the content padding should be applied.
     *
     * @return {qx.ui.core.Widget} The content padding target.
     */
    _getContentPaddingTarget : function() {
      return this.getPane();
    },


    /*
    ---------------------------------------------------------------------------
      PROPERTY APPLY METHODS
    ---------------------------------------------------------------------------
    */


    // property apply
    _applyRowHeight : function(value, old) {
      this.getPane().getRowConfig().setDefaultItemSize(value);
    },


    // property apply
    _applyOpenMode : function(value, old)
    {
      var pane = this.getPane();

      //"tap", "dbltap", "none"
      if (value === "dbltap") {
        pane.addListener("cellDbltap", this._onOpen, this);
      } else if (value === "tap") {
        pane.addListener("cellTap", this._onOpen, this);
      }

      if (old === "dbltap") {
        pane.removeListener("cellDbltap", this._onOpen, this);
      } else if (old === "tap") {
        pane.removeListener("cellTap", this._onOpen, this);
      }
    },


    // property apply
    _applyHideRoot : function(value, old) {
      this.buildLookupTable();
    },


    // property apply
    _applyShowTopLevelOpenCloseIcons : function(value, old) {
      this.buildLookupTable();
    },


    // property apply
    _applyShowLeafs : function(value, old) {
      this.buildLookupTable();
    },


    // property apply
    _applyChildProperty : function(value, old) {
      this._provider.setChildProperty(value);
    },


    // property apply
    _applyLabelPath : function(value, old) {
      this._provider.setLabelPath(value);
    },


    // property apply
    _applyIconPath : function(value, old) {
      this._provider.setIconPath(value);
    },


    // property apply
    _applyLabelOptions : function(value, old) {
      this._provider.setLabelOptions(value);
    },


    // property apply
    _applyIconOptions : function(value, old) {
      this._provider.setIconOptions(value);
    },


    // property apply
    _applyModel : function(value, old)
    {
      this.__openNodes = [];

      if (value != null)
      {
        if (qx.core.Environment.get("qx.debug"))
        {
          if (!qx.Class.hasMixin(value.constructor,
                qx.data.marshal.MEventBubbling))
          {
            this.warn("The model item doesn't support the Mixin 'qx.data." +
              "marshal.MEventBubbling'. Therefore the tree can not update " +
              "the view automatically on model changes.");
          }
        }
        value.addListener("changeBubble", this._onChangeBubble, this);
        this.__openNode(value);
      }

      if (old != null) {
        old.removeListener("changeBubble", this._onChangeBubble, this);
      }

      this.__applyModelChanges();
    },


    // property apply
    _applyDelegate : function(value, old)
    {
      this._provider.setDelegate(value);
      this.buildLookupTable();
    },


    /*
    ---------------------------------------------------------------------------
      EVENT HANDLERS
    ---------------------------------------------------------------------------
    */


    /**
     * Event handler for the changeBubble event. The handler rebuild the lookup
     * table when the child structure changed.
     *
     * @param event {qx.event.type.Data} The data event.
     */
    _onChangeBubble : function(event)
    {
      var data = event.getData();
      var propertyName = data.name;
      var index = propertyName.lastIndexOf(".");

      if (index != -1) {
        propertyName = propertyName.substr(index + 1, propertyName.length);
      }

      // only continue when the effected property is the child property
      if (qx.lang.String.startsWith(propertyName, this.getChildProperty()))
      {
        var item = data.item;

        if (qx.Class.isSubClassOf(item.constructor, qx.data.Array))
        {
          if (index === -1)
          {
            item = this.getModel();
          }
          else
          {
            var propertyChain = data.name.substr(0, index);
            item = qx.data.SingleValueBinding.resolvePropertyChain(this.getModel(), propertyChain);
          }
        }

        if (this.__lookupTable.indexOf(item) != -1) {
          this.__applyModelChanges();
        }
      }
    },


    /**
     * Event handler for the update event.
     *
     * @param event {qx.event.type.Event} The event.
     */
    _onUpdated : function(event)
    {
      if (this.__deferredCall == null) {
        this.__deferredCall = new qx.util.DeferredCall(function() {
          qx.ui.core.queue.Widget.add(this);
        }, this);
      }
      this.__deferredCall.schedule();
    },


    /**
     * Event handler to open/close tapped nodes.
     *
     * @param event {qx.ui.virtual.core.CellEvent} The cell tap event.
     */
    _onOpen : function(event)
    {
      var row = event.getRow();
      var item = this.__lookupTable.getItem(row);

      if (this.isNode(item))
      {
        if (this.isNodeOpen(item)) {
          this.closeNode(item);
        } else {
          this.openNode(item);
        }
      }
    },


    /**
     * Event handler for key press events. Open and close the current selected
     * item on key left and right press. Jump to parent on key left if already
     * closed.
     *
     * @param e {qx.event.type.KeySequence} key event.
     */
    _onKeyPress : function(e)
    {
      var selection = this.getSelection();

      if (selection.getLength() > 0)
      {
        var item = selection.getItem(0);
        var isNode = this.isNode(item);

        switch(e.getKeyIdentifier())
        {
          case "Left":
            if (isNode && this.isNodeOpen(item)) {
              this.closeNode(item);
            } else {
              var parent = this.getParent(item);
              if (parent != null) {
                selection.splice(0, 1, parent);
              }
            }
            break;

          case "Right":
            if (isNode && !this.isNodeOpen(item)) {
              this.openNode(item);
            }
            else
            {
              if (isNode)
              {
                var children = item.get(this.getChildProperty());
                if (children != null && children.getLength() > 0) {
                  selection.splice(0, 1, children.getItem(0));
                }
              }
            }
            break;

          case "Enter":
          case "Space":
            if (!isNode) {
              return;
            }
            if (this.isNodeOpen(item)) {
              this.closeNode(item);
            } else {
              this.openNode(item);
            }
            break;
        }
      }
    },

    /*
    ---------------------------------------------------------------------------
      SELECTION HOOK METHODS
    ---------------------------------------------------------------------------
    */

    /**
     * Hook method which is called from the {@link qx.ui.virtual.selection.MModel}.
     * The hook method sets the first visible parent not as new selection when
     * the current selection is empty and the selection mode is one selection.
     *
     * @param newSelection {Array} The newSelection which will be set to the selection manager.
     */
    _beforeApplySelection : function(newSelection)
    {
      if (newSelection.length === 0 &&
          this.getSelectionMode() === "one")
      {
        var visibleParent = this.__getVisibleParent();
        var row = this.getLookupTable().indexOf(visibleParent);

        if (row >= 0) {
          newSelection.push(row);
        }
      }
    },


    /**
     * Hook method which is called from the {@link qx.ui.virtual.selection.MModel}.
     * The hook method builds the parent chain form the current selected item.
     */
    _afterApplySelection : function()
    {
      var selection = this.getSelection();

      if (selection.getLength() > 0 &&
          this.getSelectionMode() === "one") {
        this.__buildParentChain(selection.getItem(0));
      } else {
        this.__parentChain = [];
      }
    },


    /*
    ---------------------------------------------------------------------------
      HELPER METHODS
    ---------------------------------------------------------------------------
    */


    /**
     * Helper method to apply model changes. Normally build the lookup table and
     * apply the default selection.
     */
    __applyModelChanges : function()
    {
      this.buildLookupTable();
      this._applyDefaultSelection();
    },


    /**
     * Helper method to build the internal data structure.
     *
     * @internal
     */
    buildLookupTable : function()
    {
      if (
        this.getModel() != null &&
        (this.getChildProperty() == null || this.getLabelPath() == null)
      )
      {
        throw new Error("Could not build tree, because 'childProperty' and/" +
          "or 'labelPath' is 'null'!");
      }

      this._itemWidth = 0;
      var lookupTable = [];
      this.__nestingLevel = [];
      var nestedLevel = -1;

      var root = this.getModel();
      if (root != null)
      {
        if (!this.isHideRoot())
        {
          nestedLevel++;
          lookupTable.push(root);
          this.__nestingLevel.push(nestedLevel);
        }

        if (this.isNodeOpen(root))
        {
          var visibleChildren = this.__getVisibleChildrenFrom(root, nestedLevel);
          lookupTable = lookupTable.concat(visibleChildren);
        }
      }

      if (!qx.lang.Array.equals(this.__lookupTable.toArray(), lookupTable))
      {
        this._provider.removeBindings();
        this.__lookupTable.removeAll();
        this.__lookupTable.append(lookupTable);
        this.__updateRowCount();
        this._updateSelection();
      }
    },


    /**
     * Helper method to get all visible children form the passed parent node.
     * The algorithm implements a depth-first search with a complexity:
     * <code>O(n)</code> and <code>n</code> are all visible items.
     *
     * @param node {qx.core.Object} The start node to start search.
     * @param nestedLevel {Integer} The nested level from the start node.
     * @return {Array} All visible children form the parent.
     */
    __getVisibleChildrenFrom : function(node, nestedLevel)
    {
      var visible = [];
      nestedLevel++;

      if (!this.isNode(node)) {
        return visible;
      }

      var children = node.get(this.getChildProperty());
      if (children == null) {
        return visible;
      }

      // clone children to keep original model unmodified
      children = children.copy();

      var delegate = this.getDelegate();
      var filter = qx.util.Delegate.getMethod(delegate, "filter");
      var sorter = qx.util.Delegate.getMethod(delegate, "sorter");

      if (sorter != null) {
        children.sort(sorter);
      }

      for (var i = 0; i < children.getLength(); i++)
      {
        var child = children.getItem(i);

        if (filter && !filter(child)) {
          continue;
        }

        if (this.isNode(child))
        {
          this.__nestingLevel.push(nestedLevel);
          visible.push(child);

          if (this.isNodeOpen(child))
          {
            var visibleChildren = this.__getVisibleChildrenFrom(child, nestedLevel);
            visible = visible.concat(visibleChildren);
          }
        }
        else
        {
          if (this.isShowLeafs())
          {
            this.__nestingLevel.push(nestedLevel);
            visible.push(child);
          }
        }
      }

      // dispose children clone
      children.dispose();

      return visible;
    },


    /**
     * Helper method to set the node to the open nodes data structure when it
     * is not included.
     *
     * @param node {qx.core.Object} Node to set to open nodes.
     */
    __openNode : function(node)
    {
      if (!qx.lang.Array.contains(this.__openNodes, node)) {
        this.__openNodes.push(node);
        this.fireDataEvent("open", node);
      }
    },


    /**
     * Helper method to set the target node and all his parents to the open
     * nodes data structure. The algorithm implements a depth-first search with
     * a complexity: <code>O(n)</code> and <code>n</code> are all model items.
     *
     * @param startNode {qx.core.Object} Start (root) node to search.
     * @param targetNode {qx.core.Object} Target node to open (and his parents).
     * @return {Boolean} <code>True</code> when the targetNode and his
     *  parents could opened, <code>false</code> otherwise.
     */
    __openNodeAndAllParents : function(startNode, targetNode)
    {
      if (startNode === targetNode)
      {
        this.__openNode(targetNode);
        return true;
      }

      if (!this.isNode(startNode)) {
        return false;
      }

      var children = startNode.get(this.getChildProperty());
      if (children == null) {
        return false;
      }

      for (var i = 0; i < children.getLength(); i++)
      {
        var child = children.getItem(i);
        var result = this.__openNodeAndAllParents(child, targetNode);

        if (result === true)
        {
          this.__openNode(child);
          return true;
        }
      }

      return false;
    },


    /**
     * Helper method to update the row count.
     */
    __updateRowCount : function()
    {
      this.getPane().getRowConfig().setItemCount(this.__lookupTable.getLength());
      this.getPane().fullUpdate();
    },


    /**
     * Helper method to get the parent node. Node! This only works with leaf and
     * nodes which are in the internal lookup table.
     *
     * @param item {qx.core.Object} Node or leaf to get parent.
     * @return {qx.core.Object|null} The parent note or <code>null</code> when
     *   no parent found.
     *
     * @internal
     */
    getParent : function(item)
    {
      var index = this.__lookupTable.indexOf(item);
      if (index < 0) {
        return null;
      }

      var level = this.__nestingLevel[index];
      while(index > 0)
      {
        index--;
        var levelBevore = this.__nestingLevel[index];
        if (levelBevore < level) {
          return this.__lookupTable.getItem(index);
        }
      }

      return null;
    },


    /**
     * Builds the parent chain form the passed item.
     *
     * @param item {var} Item to build parent chain.
     */
    __buildParentChain : function(item)
    {
      this.__parentChain = [];
      var parent = this.getParent(item);
      while(parent != null)
      {
        this.__parentChain.unshift(parent);
        parent = this.getParent(parent);
      }
    },


    /**
     * Return the first visible parent node from the last selected node.
     *
     * @return {var} The first visible node.
     */
    __getVisibleParent : function()
    {
      if (this.__parentChain == null) {
        return this.getModel();
      }

      var lookupTable = this.getLookupTable();
      var parent = this.__parentChain.pop();

      while(parent != null)
      {
        if (lookupTable.contains(parent)) {
          return parent;
        }
        parent = this.__parentChain.pop();
      }
      return this.getModel();
    }
  },


  destruct : function()
  {
    var pane = this.getPane()
    if (pane != null)
    {
      if (pane.hasListener("cellDbltap")) {
        pane.removeListener("cellDbltap", this._onOpen, this);
      }
      if (pane.hasListener("cellTap")) {
        pane.removeListener("cellTap", this._onOpen, this);
      }
    }

    if (!qx.core.ObjectRegistry.inShutDown && this.__deferredCall != null)
    {
      this.__deferredCall.cancel();
      this.__deferredCall.dispose();
    }

    var model = this.getModel();
    if (model != null) {
      model.removeListener("changeBubble", this._onChangeBubble, this);
    }

    this._layer.removeListener("updated", this._onUpdated, this);
    this._layer.destroy();
    this._provider.dispose();
    this.__lookupTable.dispose();

    this._layer = this._provider = this.__lookupTable = this.__openNodes =
      this.__deferredCall = null;
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Christian Hagendorn (chris_schmidt)

************************************************************************ */

/**
 * This interface needs to implemented from all {@link qx.ui.tree.VirtualTree}
 * providers.
 *
 * @internal
 */
qx.Interface.define("qx.ui.tree.provider.IVirtualTreeProvider",
{
  members :
  {
    /**
     * Creates a layer for node and leaf rendering.
     *
     * @return {qx.ui.virtual.layer.Abstract} new layer.
     */
    createLayer : function() {},


    /**
     * Creates a renderer for rendering.
     *
     * @return {var} new node renderer.
     */
    createRenderer : function() {},


    /**
     * Sets the name of the property, where the children are stored in the model.
     *
     * @param value {String} The child property name.
     */
    setChildProperty : function(value)
    {
      this.assertArgumentsCount(arguments, 1, 1);
      this.assertString(value);
    },


    /**
     * Sets the name of the property, where the value for the tree folders label
     * is stored in the model classes.
     *
     * @param value {String} The label path.
     */
    setLabelPath : function(value)
    {
      this.assertArgumentsCount(arguments, 1, 1);
      this.assertString(value);
    },


    /**
     * Styles a selected item.
     *
     * @param row {Integer} row to style.
     */
    styleSelectabled : function(row)
    {
      this.assertArgumentsCount(arguments, 1, 1);
      this.assertInteger(row);
    },


    /**
     * Styles a not selected item.
     *
     * @param row {Integer} row to style.
     */
    styleUnselectabled : function(row)
    {
      this.assertArgumentsCount(arguments, 1, 1);
      this.assertInteger(row);
    },


    /**
     * Returns if the passed row can be selected or not.
     *
     * @param row {Integer} row to select.
     * @return {Boolean} <code>true</code> when the row can be selected,
     *    <code>false</code> otherwise.
     */
    isSelectable : function(row)
    {
      this.assertArgumentsCount(arguments, 1, 1);
      this.assertInteger(row);
    }
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Christian Hagendorn (chris_schmidt)
     * Martin Wittemann (martinwittemann)

************************************************************************ */

/**
 * The mixin controls the binding between model and item.
 *
 * @internal
 */
qx.Mixin.define("qx.ui.tree.core.MWidgetController",
{
  construct : function() {
    this.__boundItems = [];
  },


  properties :
  {
    /**
     * The name of the property, where the value for the tree node/leaf label
     * is stored in the model classes.
     */
    labelPath :
    {
      check: "String",
      nullable: true
    },


    /**
     * The path to the property which holds the information that should be
     * shown as an icon.
     */
    iconPath :
    {
      check: "String",
      nullable: true
    },


    /**
     * A map containing the options for the label binding. The possible keys
     * can be found in the {@link qx.data.SingleValueBinding} documentation.
     */
    labelOptions :
    {
      nullable: true
    },


    /**
     * A map containing the options for the icon binding. The possible keys
     * can be found in the {@link qx.data.SingleValueBinding} documentation.
     */
    iconOptions :
    {
      nullable: true
    },


    /**
     * The name of the property, where the children are stored in the model.
     * Instead of the {@link #labelPath} must the child property a direct
     * property form the model instance.
     */
    childProperty :
    {
      check: "String",
      nullable: true
    },


    /**
     * Delegation object, which can have one or more functions defined by the
     * {@link qx.ui.tree.core.IVirtualTreeDelegate} interface.
     */
    delegate :
    {
      event: "changeDelegate",
      init: null,
      nullable: true
    }
  },


  members :
  {
    /** @type {Array} which contains the bounded items */
    __boundItems : null,


    /**
     * Helper-Method for binding the default properties from the model to the
     * target widget. The used default properties  depends on the passed item.
     *
     * This method should only be called in the {@link IVirtualTreeDelegate#bindItem}
     * function implemented by the {@link #delegate} property.
     *
     * @param item {qx.ui.core.Widget} The internally created and used node or
     *   leaf.
     * @param index {Integer} The index of the item (node or leaf).
     */
    bindDefaultProperties : function(item, index)
    {
      // bind model first
      this.bindProperty("", "model", null, item, index);

      this.bindProperty(
        this.getLabelPath(), "label", this.getLabelOptions(), item, index
      );

      try
      {
        this.bindProperty(
          this.getChildProperty() + ".length", "appearance",
          {
            converter : function() {
              return "virtual-tree-folder";
            }
          }, item, index
        );
      } catch(ex) {
        item.setAppearance("virtual-tree-file");
      }

      if (this.getIconPath() != null)
      {
        this.bindProperty(
          this.getIconPath(), "icon", this.getIconOptions(), item, index
        );
      }
    },


    /**
     * Helper-Method for binding a given property from the model to the target
     * widget.
     *
     * This method should only be called in the {@link IVirtualTreeDelegate#bindItem}
     * function implemented by the {@link #delegate} property.
     *
     * @param sourcePath {String | null} The path to the property in the model.
     *   If you use an empty string, the whole model item will be bound.
     * @param targetProperty {String} The name of the property in the target widget.
     * @param options {Map | null} The options to use for the binding.
     * @param targetWidget {qx.ui.core.Widget} The target widget.
     * @param index {Integer} The index of the current binding.
     */
    bindProperty : function(sourcePath, targetProperty, options, targetWidget, index)
    {
      var bindPath = this.__getBindPath(index, sourcePath);
      var bindTarget = this._tree.getLookupTable();

      var id = bindTarget.bind(bindPath, targetWidget, targetProperty, options);
      this.__addBinding(targetWidget, id);
    },


    /**
     * Helper-Method for binding a given property from the target widget to
     * the model.
     * This method should only be called in the
     * {@link qx.ui.tree.core.IVirtualTreeDelegate#bindItem} function implemented by the
     * {@link #delegate} property.
     *
     * @param targetPath {String | null} The path to the property in the model.
     * @param sourceProperty {String} The name of the property in the target.
     * @param options {Map | null} The options to use for the binding.
     * @param sourceWidget {qx.ui.core.Widget} The source widget.
     * @param index {Integer} The index of the current binding.
     */
    bindPropertyReverse : function(targetPath, sourceProperty, options, sourceWidget, index)
    {
      var bindPath = this.__getBindPath(index, targetPath);
      var bindTarget = this._tree.getLookupTable();

      var id = sourceWidget.bind(sourceProperty, bindTarget, bindPath, options);
      this.__addBinding(sourceWidget, id);
    },


    /**
     * Remove all bindings from all bounded items.
     */
    removeBindings : function()
    {
      while(this.__boundItems.length > 0) {
        var item = this.__boundItems.pop();
        this._removeBindingsFrom(item);
      }
    },


    /**
     * Sets up the binding for the given item and index.
     *
     * @param item {qx.ui.core.Widget} The internally created and used item.
     * @param index {Integer} The index of the item.
     */
    _bindItem : function(item, index)
    {
      var bindItem = qx.util.Delegate.getMethod(this.getDelegate(), "bindItem");

      if (bindItem != null) {
        bindItem(this, item, index);
      } else {
        this.bindDefaultProperties(item, index);
      }
    },


    /**
     * Removes the binding of the given item.
     *
     * @param item {qx.ui.core.Widget} The item which the binding should be
     *   removed.
     */
    _removeBindingsFrom : function(item)
    {
      var bindings = this.__getBindings(item);

      while (bindings.length > 0)
      {
        var id = bindings.pop();

        try {
          this._tree.getLookupTable().removeBinding(id);
        } catch(e) {
          item.removeBinding(id);
        }
      }

      if (qx.lang.Array.contains(this.__boundItems, item)) {
        qx.lang.Array.remove(this.__boundItems, item);
      }
    },


    /**
     * Helper method to create the path for binding.
     *
     * @param index {Integer} The index of the item.
     * @param path {String|null} The path to the property.
     * @return {String} The binding path
     */
    __getBindPath : function(index, path)
    {
      var bindPath = "[" + index + "]";
      if (path != null && path != "") {
        bindPath += "." + path;
      }
      return bindPath;
    },


    /**
     * Helper method to save the binding for the widget.
     *
     * @param widget {qx.ui.core.Widget} widget to save binding.
     * @param id {var} the id from the binding.
     */
    __addBinding : function(widget, id)
    {
      var bindings = this.__getBindings(widget);

      if (!qx.lang.Array.contains(bindings, id)) {
        bindings.push(id);
      }

      if (!qx.lang.Array.contains(this.__boundItems, widget)) {
        this.__boundItems.push(widget);
      }
    },


    /**
     * Helper method which returns all bound id from the widget.
     *
     * @param widget {qx.ui.core.Widget} widget to get all binding.
     * @return {Array} all bound id's.
     */
    __getBindings : function(widget)
    {
      var bindings = widget.getUserData("BindingIds");

      if (bindings == null) {
        bindings = [];
        widget.setUserData("BindingIds", bindings);
      }

      return bindings;
    }
  },


  destruct : function() {
    this.__boundItems = null;
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Christian Hagendorn (chris_schmidt)

************************************************************************ */

/**
 * The provider implements the {@link qx.ui.virtual.core.IWidgetCellProvider}
 * API, which can be used as delegate for the widget cell rendering and it
 * provides a API to bind the model with the rendered item.
 *
 * @internal
 */
qx.Class.define("qx.ui.tree.provider.WidgetProvider",
{
  extend : qx.core.Object,

  implement : [
   qx.ui.virtual.core.IWidgetCellProvider,
   qx.ui.tree.provider.IVirtualTreeProvider
  ],

  include : [qx.ui.tree.core.MWidgetController],


  /**
   * @param tree {qx.ui.tree.VirtualTree} tree to provide.
   */
  construct : function(tree)
  {
    this.base(arguments);

    this._tree = tree;

    this.addListener("changeDelegate", this._onChangeDelegate, this);
    this._onChangeDelegate();
  },


  members :
  {
    /** @type {qx.ui.tree.VirtualTree} tree to provide. */
    _tree : null,


    /** @type {qx.ui.virtual.cell.WidgetCell} the used item renderer. */
    _renderer : null,


    /*
    ---------------------------------------------------------------------------
      PUBLIC API
    ---------------------------------------------------------------------------
    */


    // interface implementation
    getCellWidget : function(row, column)
    {
      var item = this._tree.getLookupTable().getItem(row);

      var hasChildren = false;
      if (this._tree.isNode(item)) {
        hasChildren = this._tree.hasChildren(item);
      }

      var widget = this._renderer.getCellWidget();
      widget.setOpen(hasChildren && this._tree.isNodeOpen(item));
      widget.addListener("changeOpen", this.__onOpenChanged, this);
      widget.setUserData("cell.childProperty", this.getChildProperty());
      widget.setUserData("cell.showLeafs", this._tree.isShowLeafs());

      if(this._tree.getSelection().contains(item)) {
        this._styleSelectabled(widget);
      } else {
        this._styleUnselectabled(widget);
      }

      var level = this._tree.getLevel(row);
      if (!this._tree.isShowTopLevelOpenCloseIcons()) {
        level -= 1;
      }
      widget.setUserData("cell.level", level);

      if (!this._tree.isShowTopLevelOpenCloseIcons() && level == -1) {
        widget.setOpenSymbolMode("never");
      } else {
        widget.setOpenSymbolMode("auto");
      }

      this._bindItem(widget, row);
      qx.ui.core.queue.Widget.add(widget);

      return widget;
    },


    // interface implementation
    poolCellWidget : function(widget)
    {
      widget.removeListener("changeOpen", this.__onOpenChanged, this);
      this._removeBindingsFrom(widget);
      this._renderer.pool(widget);
      this._onPool(widget);
    },


    // Interface implementation
    createLayer : function() {
      return new qx.ui.virtual.layer.WidgetCell(this);
    },


    // Interface implementation
    createRenderer : function()
    {
      var createItem = qx.util.Delegate.getMethod(this.getDelegate(), "createItem");

      if (createItem == null) {
        createItem = function() {
          return new qx.ui.tree.VirtualTreeItem();
        }
      }

      var renderer = new qx.ui.virtual.cell.WidgetCell();
      renderer.setDelegate({
        createWidget : createItem
      });

      return renderer;
    },


    // interface implementation
    styleSelectabled : function(row)
    {
      var widget = this._tree._layer.getRenderedCellWidget(row, 0);
      this._styleSelectabled(widget);
    },


    // interface implementation
    styleUnselectabled : function(row)
    {
      var widget = this._tree._layer.getRenderedCellWidget(row, 0);
      this._styleUnselectabled(widget);
    },


    // interface implementation
    isSelectable : function(row)
    {
      var widget = this._tree._layer.getRenderedCellWidget(row, 0);
      if (widget != null) {
        return widget.isEnabled();
      } else {
        return true;
      }
    },


    /*
    ---------------------------------------------------------------------------
      INTERNAL API
    ---------------------------------------------------------------------------
    */


    /**
     * Styles a selected item.
     *
     * @param widget {qx.ui.core.Widget} widget to style.
     */
    _styleSelectabled : function(widget) {
      if(widget == null) {
        return;
      }

      this._renderer.updateStates(widget, {selected: 1});
    },


    /**
     * Styles a not selected item.
     *
     * @param widget {qx.ui.core.Widget} widget to style.
     */
    _styleUnselectabled : function(widget) {
      if(widget == null) {
        return;
      }

      this._renderer.updateStates(widget, {});
    },


    /**
     * Calls the delegate <code>onPool</code> method when it is used in the
     * {@link #delegate} property.
     *
     * @param item {qx.ui.core.Widget} Item to modify.
     */
    _onPool : function(item)
    {
      var onPool = qx.util.Delegate.getMethod(this.getDelegate(), "onPool");

      if (onPool != null) {
        onPool(item);
      }
    },


    /*
    ---------------------------------------------------------------------------
      EVENT HANDLERS
    ---------------------------------------------------------------------------
    */


    /**
     * Event handler for the created item's.
     *
     * @param event {qx.event.type.Data} fired event.
     */
    _onItemCreated : function(event)
    {
      var configureItem = qx.util.Delegate.getMethod(this.getDelegate(), "configureItem");

      if (configureItem != null) {
        var leaf = event.getData();
        configureItem(leaf);
      }
    },


    /**
     * Event handler for the change delegate event.
     *
     * @param event {qx.event.type.Data} fired event.
     */
    _onChangeDelegate : function(event)
    {
      if (this._renderer != null) {
        this._renderer.dispose();
        this.removeBindings();
      }

      this._renderer = this.createRenderer();
      this._renderer.addListener("created", this._onItemCreated, this);
    },


    /**
     * Handler when a node changes opened or closed state.
     *
     * @param event {qx.event.type.Data} The data event.
     */
    __onOpenChanged : function(event)
    {
      var widget = event.getTarget();

      var row = widget.getUserData("cell.row");
      var item = this._tree.getLookupTable().getItem(row);

      if (event.getData()) {
        this._tree.openNodeWithoutScrolling(item);
      } else {
        this._tree.closeNodeWithoutScrolling(item);
      }
    }
  },


  destruct : function()
  {
    this.removeBindings();
    this._renderer.dispose();
    this._tree = this._renderer = null;
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Christian Hagendorn (chris_schmidt)

************************************************************************ */

/**
 * The tree item is a tree element for the {@link VirtualTree}, which can have
 * nested tree elements.
 */
qx.Class.define("qx.ui.tree.VirtualTreeItem",
{
  extend : qx.ui.tree.core.AbstractItem,


  properties :
  {
    // overridden
    appearance :
    {
      refine : true,
      init : "virtual-tree-folder"
    }
  },


  members :
  {
    // overridden
    /**
     * @lint ignoreReferenceField(_forwardStates)
     */
    _forwardStates : {
      selected : true
    },


    // overridden
    _addWidgets : function()
    {
      this.addSpacer();
      this.addOpenButton();
      this.addIcon();
      this.addLabel();
    },


    // overridden
    _shouldShowOpenSymbol : function()
    {
      var open = this.getChildControl("open", true);
      if (open == null) {
        return false;
      }

      return this.isOpenable();
    },


    // overridden
    getLevel : function() {
      return this.getUserData("cell.level");
    },


    // overridden
    hasChildren : function()
    {
      var model = this.getModel();
      var childProperty = this.getUserData("cell.childProperty");
      var showLeafs = this.getUserData("cell.showLeafs");

      return qx.ui.tree.core.Util.hasChildren(model, childProperty, !showLeafs);
    },


    // apply method
    _applyModel : function(value, old)
    {
      var childProperty = this.getUserData("cell.childProperty");
      var showLeafs = this.getUserData("cell.showLeafs");

      if (value != null && qx.ui.tree.core.Util.isNode(value, childProperty))
      {
        var eventType = "change" + qx.lang.String.firstUp(childProperty);
        // listen to children property changes
        if (qx.Class.hasProperty(value.constructor, childProperty)) {
          value.addListener(eventType, this._onChangeChildProperty, this);
        }


        // children property has been set already, immediately add
        // listener for indent updating
        if (qx.ui.tree.core.Util.hasChildren(value, childProperty, !showLeafs)) {
          value.get(childProperty).addListener("changeLength",
            this._onChangeLength, this);
          this._updateIndent();
        }
      }


      if (old != null && qx.ui.tree.core.Util.isNode(old, childProperty))
      {
        var eventType = "change" + qx.lang.String.firstUp(childProperty);
        old.removeListener(eventType, this._onChangeChildProperty, this);

        var oldChildren = old.get(childProperty);
        if (oldChildren) {
          oldChildren.removeListener("changeLength", this._onChangeLength, this);
        }
      }
    },


    /**
     * Handler to update open/close icon when model length changed.
     */
    _onChangeLength : function() {
      this._updateIndent();
    },


    /**
     * Handler to add listener to array of children property.
     *
     * @param e {qx.event.type.Data} Data event; provides children array
     */
    _onChangeChildProperty : function(e)
    {
      var children = e.getData();
      var old = e.getOldData();

      if (children) {
        this._updateIndent();
        children.addListener("changeLength", this._onChangeLength, this);
      }

      if (old) {
        old.removeListener("changeLength", this._onChangeLength, this);
      }
    }
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2013 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Christian Hagendorn (chris_schmidt)

************************************************************************ */

/**
 * This utility class implements some methods for the <code>VirtualTree</code>.
 */
qx.Class.define("qx.ui.tree.core.Util",
{
  statics :
  {
    /**
     * Returns if the passed item is a node or a leaf.
     *
     * @param node {qx.core.Object} Node to check.
     * @param childProperty {String} The property name to find the children.
     * @return {Boolean} <code>True</code> when the passed item is a node,
     *   </code>false</code> when it is a leaf.
     */
    isNode : function(node, childProperty)
    {
      if (node == null || childProperty == null) {
        return false;
      }
      return qx.Class.hasProperty(node.constructor, childProperty);
    },


    /**
     * Returns whether the node has visible children or not.
     *
     * @param node {qx.core.Object} Node to check.
     * @param childProperty {String} The property name to find the children.
     * @param ignoreLeafs {Boolean?} Indicates whether leafs are ignored. This means when it is set to
     *    <code>true</code> a node which contains only leafs has no children. The default value is <code>false</code>.
     * @return {Boolean} <code>True</code> when the node has visible children,
     *   <code>false</code> otherwise.
     */
    hasChildren : function(node, childProperty, ignoreLeafs)
    {
      if (node == null || childProperty == null || !this.isNode(node, childProperty)) {
        return false;
      }

      var children = node.get(childProperty);
      if (children == null) {
        return false;
      }

      if (!ignoreLeafs) {
        return children.length > 0;
      }
      else
      {
        for (var i = 0; i < children.getLength(); i++)
        {
          var child = children.getItem(i);
          if (this.isNode(child, childProperty)) {
            return true;
          }
        }
      }
      return false;
    }
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2007 Derrell Lipman

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Derrell Lipman (derrell)

************************************************************************ */

/**
 * A "virtual" tree
 * <p>
 *   A number of convenience methods are available in the following mixins:
 *   <ul>
 *     <li>{@link qx.ui.treevirtual.MNode}</li>
 *     <li>{@link qx.ui.treevirtual.MFamily}</li>
 *   </ul>
 * </p>
 */
qx.Class.define("qx.ui.treevirtual.TreeVirtual",
{
  extend : qx.ui.table.Table,




  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  /**
   * @param headings {Array | String}
   *   An array containing a list of strings, one for each column, representing
   *   the headings for each column.  As a special case, if only one column is
   *   to exist, the string representing its heading need not be enclosed in an
   *   array.
   *
   * @param custom {Map ? null}
   *   A map provided (typically) by subclasses, to override the various
   *   supplemental classes allocated within this constructor.  For normal
   *   usage, this parameter may be omitted.  Each property must be an object
   *   instance or a function which returns an object instance, as indicated by
   *   the defaults listed here:
   *
   *   <dl>
   *     <dt>initiallyHiddenColumns</dt>
   *       <dd>
   *         {Array?}
   *         A list of column numbers that should be initially invisible. Any
   *         column not mentioned will be initially visible, and if no array
   *         is provided, all columns will be initially visible.
   *       </dd>
   *     <dt>dataModel</dt>
   *       <dd>new qx.ui.treevirtual.SimpleTreeDataModel()</dd>
   *     <dt>treeDataCellRenderer</dt>
   *       <dd>
   *         Instance of {@link qx.ui.treevirtual.SimpleTreeDataCellRenderer}.
   *         Custom data cell renderer for the tree column.
   *       </dd>
   *     <dt>treeColumn</dt>
   *       <dd>
   *         The column number in which the tree is to reside, i.e., which
   *         column uses the SimpleTreeDataCellRenderer or a subclass of it.
   *       </dd>
   *     <dt>defaultDataCellRenderer</dt>
   *       <dd>
   *         Instance of {@link qx.ui.treevirtual.DefaultDataCellRenderer}.
   *         Custom data cell renderer for all columns other than the tree
   *         column.
   *       </dd>
   *     <dt>dataRowRenderer</dt>
   *       <dd>new qx.ui.treevirtual.SimpleTreeDataRowRenderer()</dd>
   *     <dt>selectionManager</dt>
   *       <dd><pre class='javascript'>
   *         function(obj)
   *         {
   *           return new qx.ui.treevirtual.SelectionManager(obj);
   *         }
   *       </pre></dd>
   *     <dt>tableColumnModel</dt>
   *       <dd><pre class='javascript'>
   *         function(obj)
   *         {
   *           return new qx.ui.table.columnmodel.Resize(obj);
   *         }
   *       </pre></dd>
   *   </dl>
   */
  construct : function(headings, custom)
  {
    //
    // Allocate default objects if custom objects are not specified
    //
    if (! custom)
    {
      custom = { };
    }

    if (! custom.dataModel)
    {
      custom.dataModel =
        new qx.ui.treevirtual.SimpleTreeDataModel();
    }

    if (custom.treeColumn === undefined)
    {
      custom.treeColumn = 0;
      custom.dataModel.setTreeColumn(custom.treeColumn);
    }

    if (! custom.treeDataCellRenderer)
    {
      custom.treeDataCellRenderer =
        new qx.ui.treevirtual.SimpleTreeDataCellRenderer();
    }

    if (! custom.defaultDataCellRenderer)
    {
      custom.defaultDataCellRenderer =
        new qx.ui.treevirtual.DefaultDataCellRenderer();
    }

    if (! custom.dataRowRenderer)
    {
      custom.dataRowRenderer =
        new qx.ui.treevirtual.SimpleTreeDataRowRenderer();
    }

    if (! custom.selectionManager)
    {
      custom.selectionManager =
        function(obj)
        {
          return new qx.ui.treevirtual.SelectionManager(obj);
        };
    }

    if (! custom.tableColumnModel)
    {
      custom.tableColumnModel =
        function(obj)
        {
          return new qx.ui.table.columnmodel.Resize(obj);
        };
    }

    // Specify the column headings.  We accept a single string (one single
    // column) or an array of strings (one or more columns).
    if (qx.lang.Type.isString(headings)) {
      headings = [ headings ];
    }

    custom.dataModel.setColumns(headings);
    custom.dataModel.setTreeColumn(custom.treeColumn);

    // Save a reference to the tree with the data model
    custom.dataModel.setTree(this);

    // Call our superclass constructor
    this.base(arguments, custom.dataModel, custom);

    // Arrange to redisplay edited data following editing
    this.addListener("dataEdited",
                     function(e)
                     {
                       this.getDataModel().setData();
                     },
                     this);

    // By default, present the column visibility button only if there are
    // multiple columns.
    this.setColumnVisibilityButtonVisible(headings.length > 1);

    // Set sizes
    this.setRowHeight(16);
    this.setMetaColumnCounts(headings.length > 1 ? [ 1, -1 ] : [ 1 ]);

    // Overflow on trees is always hidden.  The internal elements scroll.
    this.setOverflow("hidden");

    // Set the data cell render.  We use the SimpleTreeDataCellRenderer for the
    // tree column, and our DefaultDataCellRenderer for all other columns.
    var stdcr = custom.treeDataCellRenderer;
    var ddcr = custom.defaultDataCellRenderer;
    var tcm = this.getTableColumnModel();
    var treeCol = this.getDataModel().getTreeColumn();

    for (var i=0; i<headings.length; i++)
    {
      tcm.setDataCellRenderer(i, i == treeCol ? stdcr : ddcr);
    }

    // Set the data row renderer.
    this.setDataRowRenderer(custom.dataRowRenderer);

    // Move the focus with the mouse.  This controls the ROW focus indicator.
    this.setFocusCellOnPointerMove(true);

    // In a tree we don't typically want a visible cell focus indicator
    this.setShowCellFocusIndicator(false);

    // Get the list of pane scrollers
    var scrollers = this._getPaneScrollerArr();

    // For each scroller...
    for (var i=0; i<scrollers.length; i++)
    {
      // Set the pane scrollers to handle the selection before
      // displaying the focus, so we can manipulate the selected icon.
      scrollers[i].setSelectBeforeFocus(true);
    }
  },




  /*
  *****************************************************************************
     EVENTS
  *****************************************************************************
  */

  events :
  {
    /**
     * Fired when a tree branch which already has content is opened.
     *
     * Event data: the node object from the data model (of the node
     * being opened) as described in
     * {@link qx.ui.treevirtual.SimpleTreeDataModel}
     */
    "treeOpenWithContent" : "qx.event.type.Data",

    /**
     * Fired when an empty tree branch is opened.
     *
     * Event data: the node object from the data model (of the node
     * being opened) as described in
     * {@link qx.ui.treevirtual.SimpleTreeDataModel}
     */
    "treeOpenWhileEmpty"  : "qx.event.type.Data",

    /**
     * Fired when a tree branch is closed.
     *
     * Event data: the node object from the data model (of the node
     * being closed) as described in
     * {@link qx.ui.treevirtual.SimpleTreeDataModel}
     */
    "treeClose"           : "qx.event.type.Data",

    /**
     * Fired when the selected rows change.
     *
     * Event data: An array of node objects (the selected rows' nodes)
     * from the data model.  Each node object is described in
     * {@link qx.ui.treevirtual.SimpleTreeDataModel}
     */
    "changeSelection"     : "qx.event.type.Data"
  },




  /*
  *****************************************************************************
     STATICS
  *****************************************************************************
  */

  statics :
  {
    /**
     * Selection Modes {int}
     *
     *   NONE
     *     Nothing can ever be selected.
     *
     *   SINGLE
     *     Allow only one selected item.
     *
     *   SINGLE_INTERVAL
     *     Allow one contiguous interval of selected items.
     *
     *   MULTIPLE_INTERVAL
     *     Allow any set of selected items, whether contiguous or not.
     *
     *   MULTIPLE_INTERVAL_TOGGLE
     *     Like MULTIPLE_INTERVAL, but clicking on an item toggles its selection state.
     */
    SelectionMode :
    {
      NONE :
        qx.ui.table.selection.Model.NO_SELECTION,
      SINGLE :
        qx.ui.table.selection.Model.SINGLE_SELECTION,
      SINGLE_INTERVAL :
        qx.ui.table.selection.Model.SINGLE_INTERVAL_SELECTION,
      MULTIPLE_INTERVAL :
        qx.ui.table.selection.Model.MULTIPLE_INTERVAL_SELECTION,
      MULTIPLE_INTERVAL_TOGGLE :
        qx.ui.table.selection.Model.MULTIPLE_INTERVAL_SELECTION_TOGGLE
    }
  },




  /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */

  properties :
  {
    /**
     * Whether a click on the open/close button should also cause selection of
     * the row.
     */
    openCloseClickSelectsRow :
    {
      check : "Boolean",
      init : false
    },

    appearance :
    {
      refine : true,
      init : "treevirtual"
    }
  },




  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    /**
     * Return the data model for this tree.
     *
     * @return {qx.ui.table.ITableModel} The data model.
     */
    getDataModel : function()
    {
      return this.getTableModel();
    },


    /**
     * Set whether lines linking tree children shall be drawn on the tree.
     * Note that not all themes support tree lines.  As of the time of this
     * writing, the Classic theme supports tree lines (and uses +/- icons
     * which lend themselves to tree lines), while the Modern theme, which
     * uses right-facing and downward-facing arrows instead of +/-, does not.
     *
     * @param b {Boolean}
     *   <i>true</i> if tree lines should be shown; <i>false</i> otherwise.
     *
     */
    setUseTreeLines : function(b)
    {
      var dataModel = this.getDataModel();
      var treeCol = dataModel.getTreeColumn();
      var dcr = this.getTableColumnModel().getDataCellRenderer(treeCol);
      dcr.setUseTreeLines(b);

      // Inform the listeners
      if (dataModel.hasListener("dataChanged"))
      {
        var data =
        {
          firstRow    : 0,
          lastRow     : dataModel.getRowCount() - 1,
          firstColumn : 0,
          lastColumn  : dataModel.getColumnCount() - 1
        };

        dataModel.fireDataEvent("dataChanged", data);
      }
    },


    /**
     * Get whether lines linking tree children shall be drawn on the tree.
     *
     * @return {Boolean}
     *   <i>true</i> if tree lines are in use;
     *   <i>false</i> otherwise.
     */
    getUseTreeLines : function()
    {
      var treeCol = this.getDataModel().getTreeColumn();
      var dcr = this.getTableColumnModel().getDataCellRenderer(treeCol);
      return dcr.getUseTreeLines();
    },


    /**
     * Set whether the open/close button should be displayed on a branch,
     * even if the branch has no children.
     *
     * @param b {Boolean}
     *   <i>true</i> if the open/close button should be shown;
     *   <i>false</i> otherwise.
     *
     */
    setAlwaysShowOpenCloseSymbol : function(b)
    {
      var dataModel = this.getDataModel();
      var treeCol = dataModel.getTreeColumn();
      var dcr = this.getTableColumnModel().getDataCellRenderer(treeCol);
      dcr.setAlwaysShowOpenCloseSymbol(b);

      // Inform the listeners
      if (dataModel.hasListener("dataChanged"))
      {
        var data =
        {
          firstRow    : 0,
          lastRow     : dataModel.getRowCount() - 1,
          firstColumn : 0,
          lastColumn  : dataModel.getColumnCount() - 1
        };

        dataModel.fireDataEvent("dataChanged", data);
      }
    },


    /**
     * Set whether drawing of first-level tree-node lines are disabled even
     * if drawing of tree lines is enabled.
     *
     * @param b {Boolean}
     *   <i>true</i> if first-level tree lines should be disabled;
     *   <i>false</i> for normal operation.
     *
     */
    setExcludeFirstLevelTreeLines : function(b)
    {
      var dataModel = this.getDataModel();
      var treeCol = dataModel.getTreeColumn();
      var dcr = this.getTableColumnModel().getDataCellRenderer(treeCol);
      dcr.setExcludeFirstLevelTreeLines(b);

      // Inform the listeners
      if (dataModel.hasListener("dataChanged"))
      {
        var data =
        {
          firstRow    : 0,
          lastRow     : dataModel.getRowCount() - 1,
          firstColumn : 0,
          lastColumn  : dataModel.getColumnCount() - 1
        };

        dataModel.fireDataEvent("dataChanged", data);
      }
    },


    /**
     * Get whether drawing of first-level tree lines should be disabled even
     * if drawing of tree lines is enabled.
     * (See also {@link #getUseTreeLines})
     *
     * @return {Boolean}
     *   <i>true</i> if tree lines are in use;
     *   <i>false</i> otherwise.
     */
    getExcludeFirstLevelTreeLines : function()
    {
      var treeCol = this.getDataModel().getTreeColumn();
      var dcr = this.getTableColumnModel().getDataCellRenderer(treeCol);
      return dcr.getExcludeFirstLevelTreeLines();
    },


    /**
     * Set whether the open/close button should be displayed on a branch,
     * even if the branch has no children.
     *
     * @return {Boolean}
     *   <i>true</i> if tree lines are in use;
     *   <i>false</i> otherwise.
     */
    getAlwaysShowOpenCloseSymbol : function()
    {
      var treeCol = this.getDataModel().getTreeColumn();
      var dcr = this.getTableColumnModel().getDataCellRenderer(treeCol);
      return dcr.getAlwaysShowOpenCloseSymbol();
    },


    /**
     * Set the selection mode.
     *
     * @param mode {Integer}
     *   The selection mode to be used.  It may be any of:
     *     <pre>
     *       qx.ui.treevirtual.TreeVirtual.SelectionMode.NONE:
     *          Nothing can ever be selected.
     *
     *       qx.ui.treevirtual.TreeVirtual.SelectionMode.SINGLE
     *          Allow only one selected item.
     *
     *       qx.ui.treevirtual.TreeVirtual.SelectionMode.SINGLE_INTERVAL
     *          Allow one contiguous interval of selected items.
     *
     *       qx.ui.treevirtual.TreeVirtual.SelectionMode.MULTIPLE_INTERVAL
     *          Allow any selected items, whether contiguous or not.
     *     </pre>
     *
     */
    setSelectionMode : function(mode)
    {
      this.getSelectionModel().setSelectionMode(mode);
    },


    /**
     * Get the selection mode currently in use.
     *
     * @return {Integer}
     *   One of the values documented in {@link #setSelectionMode}
     */
    getSelectionMode : function()
    {
      return this.getSelectionModel().getSelectionMode();
    },


    /**
     * Obtain the entire hierarchy of labels from the root down to the
     * specified node.
     *
     * @param nodeReference {Object | Integer}
     *   The node for which the hierarchy is desired.  The node can be
     *   represented either by the node object, or the node id (as would have
     *   been returned by addBranch(), addLeaf(), etc.)
     *
     * @return {Array}
     *   The returned array contains one string for each label in the
     *   hierarchy of the node specified by the parameter.  Element 0 of the
     *   array contains the label of the root node, element 1 contains the
     *   label of the node immediately below root in the specified node's
     *   hierarchy, etc., down to the last element in the array contain the
     *   label of the node referenced by the parameter.
     */
    getHierarchy : function(nodeReference)
    {
      var _this = this;
      var components = [];
      var node;
      var nodeId;

      if (typeof(nodeReference) == "object")
      {
        node = nodeReference;
        nodeId = node.nodeId;
      }
      else if (typeof(nodeReference) == "number")
      {
        nodeId = nodeReference;
      }
      else
      {
        throw new Error("Expected node object or node id");
      }

      function addHierarchy(nodeId)
      {
        // If we're at the root...
        if (! nodeId)
        {
          // ... then we're done
          return ;
        }

        // Get the requested node
        var node = _this.getDataModel().getData()[nodeId];

        // Add its label to the hierarchy components
        components.unshift(node.label);

        // Call recursively to our parent node.
        addHierarchy(node.parentNodeId);
      }

      addHierarchy(nodeId);
      return components;
    },


    /**
     * Return the nodes that are currently selected.
     *
     * @return {Array}
     *   An array containing the nodes that are currently selected.
     */
    getSelectedNodes : function()
    {
      return this.getDataModel().getSelectedNodes();
    },


    /**
     * Event handler. Called when a key was pressed.
     *
     * We handle the Enter key to toggle opened/closed tree state.  All
     * other keydown events are passed to our superclass.
     *
     * @param evt {Map}
     *   The event.
     *
     */
    _onKeyPress : function(evt)
    {
      if (!this.getEnabled())
      {
        return;
      }

      var identifier = evt.getKeyIdentifier();

      var consumed = false;
      var modifiers = evt.getModifiers();

      if (modifiers == 0)
      {
        switch(identifier)
        {
          case "Enter":
            // Get the data model
            var dm = this.getDataModel();

            var focusedCol = this.getFocusedColumn();
            var treeCol = dm.getTreeColumn();

            if (focusedCol == treeCol)
            {
              // Get the focused node
              var focusedRow = this.getFocusedRow();
              var node = dm.getNode(focusedRow);

              if (! node.bHideOpenClose &&
                  node.type != qx.ui.treevirtual.SimpleTreeDataModel.Type.LEAF)
              {
                dm.setState(node, { bOpened : ! node.bOpened });
              }

              consumed = true;
            }
            break;

          case "Left":
            this.moveFocusedCell(-1, 0);
            break;

          case "Right":
            this.moveFocusedCell(1, 0);
            break;
        }
      }
      else if (modifiers == qx.event.type.Dom.CTRL_MASK)
      {
        switch(identifier)
        {
          case "Left":
            // Get the data model
            var dm = this.getDataModel();

            // Get the focused node
            var focusedRow = this.getFocusedRow();
            var treeCol = dm.getTreeColumn();
            var node = dm.getNode(focusedRow);

            // If it's an open branch and open/close is allowed...
            if ((node.type ==
                 qx.ui.treevirtual.SimpleTreeDataModel.Type.BRANCH) &&
                ! node.bHideOpenClose &&
                node.bOpened)
            {
              // ... then close it
              dm.setState(node, { bOpened : ! node.bOpened });
            }

            // Reset the focus to the current node
            this.setFocusedCell(treeCol, focusedRow, true);

            consumed = true;
            break;

          case "Right":
            // Get the data model
            var dm = this.getDataModel();

            // Get the focused node
            focusedRow = this.getFocusedRow();
            treeCol = dm.getTreeColumn();
            node = dm.getNode(focusedRow);

            // If it's a closed branch and open/close is allowed...
            if ((node.type ==
                 qx.ui.treevirtual.SimpleTreeDataModel.Type.BRANCH) &&
                ! node.bHideOpenClose &&
                ! node.bOpened)
            {
              // ... then open it
              dm.setState(node, { bOpened : ! node.bOpened });
            }

            // Reset the focus to the current node
            this.setFocusedCell(treeCol, focusedRow, true);

            consumed = true;
            break;
        }
      }
      else if (modifiers == qx.event.type.Dom.SHIFT_MASK)
      {
        switch(identifier)
        {
          case "Left":
            // Get the data model
            var dm = this.getDataModel();

            // Get the focused node
            var focusedRow = this.getFocusedRow();
            var treeCol = dm.getTreeColumn();
            var node = dm.getNode(focusedRow);

            // If we're not at the top-level already...
            if (node.parentNodeId)
            {
              // Find out what rendered row our parent node is at
              var rowIndex = dm.getRowFromNodeId(node.parentNodeId);

              // Set the focus to our parent
              this.setFocusedCell(this._focusedCol, rowIndex, true);
            }

            consumed = true;
            break;

          case "Right":
            // Get the data model
            var dm = this.getDataModel();

            // Get the focused node
            focusedRow = this.getFocusedRow();
            treeCol = dm.getTreeColumn();
            node = dm.getNode(focusedRow);

            // If we're on a branch and open/close is allowed...
            if ((node.type ==
                 qx.ui.treevirtual.SimpleTreeDataModel.Type.BRANCH) &&
                ! node.bHideOpenClose)
            {
              // ... then first ensure the branch is open
              if (! node.bOpened)
              {
                dm.setState(node, { bOpened : ! node.bOpened });
              }

              // If this node has children...
              if (node.children.length > 0)
              {
                // ... then move the focus to the first child
                this.moveFocusedCell(0, 1);
              }
            }

            consumed = true;
            break;
        }
      }

      // Was this one of our events that we handled?
      if (consumed)
      {
        // Yup.  Don't propagate it.
        evt.preventDefault();
        evt.stopPropagation();
      }
      else
      {
        // It's not one of ours.  Let our superclass handle this event
        this.base(arguments, evt);
      }
    },


    /**
     * Event handler. Called when the selection has changed.
     *
     * @param evt {Map}
     *   The event.
     *
     */
    _onSelectionChanged : function(evt)
    {
      // Clear the old list of selected nodes
      this.getDataModel()._clearSelections();

      // If selections are allowed, pass an event to our listeners
      if (this.getSelectionMode() !=
          qx.ui.treevirtual.TreeVirtual.SelectionMode.NONE)
      {
        var selectedNodes = this._calculateSelectedNodes();

        // Get the now-focused
        this.fireDataEvent("changeSelection", selectedNodes);
      }

      // Call the superclass method
      this.base(arguments, evt);
    },


    /**
     * Calculate and return the set of nodes which are currently selected by
     * the user, on the screen.  In the process of calculating which nodes
     * are selected, the nodes corresponding to the selected rows on the
     * screen are marked as selected by setting their <i>bSelected</i>
     * property to true, and all previously-selected nodes have their
     * <i>bSelected</i> property reset to false.
     *
     * @return {Array}
     *   An array of nodes matching the set of rows which are selected on the
     *   screen.
     */
    _calculateSelectedNodes : function()
    {
      // Create an array of nodes that are now selected
      var stdcm = this.getDataModel();
      var selectedRanges = this.getSelectionModel().getSelectedRanges();
      var selectedNodes = [];
      var node;

      for (var i=0;
           i<selectedRanges.length;
           i++)
      {
        for (var j=selectedRanges[i].minIndex;
             j<=selectedRanges[i].maxIndex;
             j++)
        {
          node = stdcm.getNode(j);
          stdcm.setState(node, { bSelected : true });
          selectedNodes.push(node);
        }
      }

      return selectedNodes;
    },


    /**
     * Set the overflow mode.
     *
     * @param s {String}
     *   Overflow mode.  The only allowable mode is "hidden".
     *
     *
     * @throws {Error}
     *   Error if tree overflow mode is other than "hidden"
     */
    setOverflow : function(s)
    {
      if (s != "hidden")
      {
        throw new Error("Tree overflow must be hidden.  " +
                        "The internal elements of it will scroll.");
      }
    }
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2010 Derrell Lipman

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Derrell Lipman (derrell)

************************************************************************ */

/**
 * Primitives for building trees and tree nodes.
 *
 * The methods in this mixin are included directly in the SimpleTreeDataModel
 * but are also useful for other types of trees (not TreeVirtual) that need
 * similar tree and node creation.
 */
qx.Mixin.define("qx.ui.treevirtual.MTreePrimitive",
{
  statics :
  {
    /** Primitive types of tree nodes */
    Type :
    {
      LEAF   : 1,
      BRANCH : 2
    },

    /**
     * Add a node to the tree.
     *
     * NOTE: This method is for <b>internal use</b> and should not be called by
     *       users of this class. There is no guarantee that the interface to this
     *       method will remain unchanged over time.
     *
     * @param nodeArr {Array|Map}
     *   The array to which new nodes are to be added. See, however, the
     *   nodeId parameter. If nodeId values will be provided, then nodeArr can
     *   be a map. The traditional TreeVirtual does not provide node ids, and
     *   passes an array for this parameter.
     *
     * @param parentNodeId {Integer}
     *   The node id of the parent of the node being added
     *
     * @param label {String}
     *   The string to display as the label for this node
     *
     * @param bOpened {Boolean}
     *   <i>true</i> if the tree should be rendered in its opened state;
     *   <i>false</i> otherwise.
     *
     * @param bHideOpenCloseButton {Boolean}
     *   <i>true</i> if the open/close button should be hidden (not displayed);
     *   </i>false</i> to display the open/close button for this node.
     *
     * @param type {Integer}
     *   The type of node being added.  The type determines whether children
     *   may be added, and determines the default icons to use.  This
     *   parameter must be one of the following values:
     *   <dl>
     *     <dt>qx.ui.treevirtual.MTreePrimitive.Type.BRANCH</dt>
     *     <dd>
     *       This node is a branch.  A branch node may have children.
     *     </dd>
     *     <dt>qx.ui.treevirtual.MTreePrimitive.Type.LEAF</dt>
     *     <dd>
     *       This node is a leaf, and may not have children
     *     </dd>
     *   </dl>
     *
     * @param icon {String}
     *   The relative (subject to alias expansion) or full path of the icon to
     *   display for this node when it is not a selected node.
     *
     * @param iconSelected {String}
     *   The relative (subject to alias expansion) or full path of the icon to
     *   display for this node when it is a selected node.
     *   <p>
     *   NOTE: As of 13 Mar 2009, this feature is disabled by default, by
     *         virtue of the fact that the tree's "alwaysUpdateCells" property
     *         has a setting of 'false' now instead of 'true'. Setting this
     *         property to true allows the icon to change upon selection, but
     *         causes problems such as single clicks not always selecting a
     *         row, and, in IE, double click operations failing
     *         completely. (For more information, see bugs 605 and 2021.) To
     *         re-enable the option to have an unique icon that is displayed
     *         when the node is selected, issue
     *         <code>tree.setAlwaysUpdateCells(true);</code>
     *
     * @param nodeId {Integer?}
     *   The requested node id for this new node. If not provided, nodeArr
     *   will be assumed to be an array, not a map, and the next available
     *   index of the array will be used. If it is provided, then nodeArr may
     *   be either an array or a map.
     *
     * @return {Integer} The node id of the newly-added node.
     *
     * @throws {Error} If one tries to add a child to a non-existent parent.
     * @throws {Error} If one tries to add a node to a leaf.
     */
    _addNode : function(nodeArr,
                        parentNodeId,
                        label,
                        bOpened,
                        bHideOpenCloseButton,
                        type,
                        icon,
                        iconSelected,
                        nodeId)
    {
      var parentNode;

      // Ensure that if parent was specified, it exists
      if (parentNodeId)
      {
        parentNode = nodeArr[parentNodeId];

        if (!parentNode)
        {
          throw new Error("Request to add a child to a non-existent parent");
        }

        // Ensure parent isn't a leaf
        if (parentNode.type == qx.ui.treevirtual.MTreePrimitive.Type.LEAF)
        {
          throw new Error("Sorry, a LEAF may not have children.");
        }
      }
      else
      {
        // This is a child of the root
        parentNode = nodeArr[0];
        parentNodeId = 0;
      }

      // If this is a leaf, we don't present open/close icon
      if (type == qx.ui.treevirtual.MTreePrimitive.Type.LEAF)
      {
        // mask off the opened bit but retain the hide open/close button bit
        bOpened = false;
        bHideOpenCloseButton = false;
      }

      // Determine the node id of this new node
      if (nodeId === undefined)
      {
        nodeId = nodeArr.length;
      }

      // Set the data for this node.
      var node =
      {
        type           : type,
        nodeId         : nodeId,
        parentNodeId   : parentNodeId,
        label          : label,
        bSelected      : false,
        bOpened        : bOpened,
        bHideOpenClose : bHideOpenCloseButton,
        icon           : icon,
        iconSelected   : iconSelected,
        children       : [ ],
        columnData     : [ ]
      };

      // Add this node to the array
      nodeArr[nodeId] = node;

      // Add this node to its parent's child array.
      parentNode.children.push(nodeId);

      // Return the node id we just added
      return nodeId;
    },

    /**
     * An empty tree contains only this one node
     *
     * @return {Map}
     *   Returns a root node with all relevant fields filled.
     */
    _getEmptyTree : function()
    {
      return {
               label    : "<virtual root>",
               nodeId   : 0,
               bOpened  : true,
               children : []
             };
    }
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2007-2010 Derrell Lipman

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Derrell Lipman (derrell)

************************************************************************ */

/**
 * A simple tree data model used as the table model
 *
 * The object structure of a single node of the tree is:
 *
 * <pre class='javascript'>
 * {
 *   // USER-PROVIDED ATTRIBUTES
 *   // ------------------------
 *   type           : qx.ui.treevirtual.MTreePrimitive.Type.LEAF,
 *   parentNodeId   : 23,    // index of the parent node in _nodeArr
 *
 *   label          : "My Documents",
 *   bSelected      : true,  // true if node is selected; false otherwise.
 *   bOpened        : true,  // true (-), false (+)
 *   bHideOpenClose : false, // whether to hide the open/close button
 *   icon           : "images/folder.gif",
 *   iconSelected   : "images/folder_selected.gif",
 *
 *   cellStyle      : "background-color:cyan"
 *   labelStyle     : "background-color:red;color:white"
 *
 *   // USER-PROVIDED COLUMN DATA
 *   columnData     : [
 *                      null, // null at index of tree column (typically 0)
 *                      "text of column 1",
 *                      "text of column 2"
 *                    ],
 *
 *   // APPLICATION-, MIXIN-, and SUBCLASS-PROVIDED CUSTOM DATA
 *   data           : {
 *                      application :
 *                      {
 *                          // application-specific user data goes in here
 *                          foo: "bar",
 *                          ...
 *                      },
 *                      MDragAndDropSupport :
 *                      {
 *                          // Data required for the Drag & Drop mixin.
 *                          // When a mixin is included, its constructor
 *                          // should create this object, named according
 *                          // to the mixin or subclass name (empty or
 *                          // otherwise)
 *                      },
 *                      ... // Additional mixins or subclasses.
 *                    },
 *
 *   // INTERNALLY-CALCULATED ATTRIBUTES
 *   // --------------------------------
 *   // The following properties need not (and should not) be set by the
 *   // caller, but are automatically calculated.  Some are used internally,
 *   // while others may be of use to event listeners.
 *
 *   nodeId         : 42,   // The index in _nodeArr, useful to event listeners.
 *   children       : [ ],  // each value is an index into _nodeArr
 *
 *   level          : 2,    // The indentation level of this tree node
 *
 *   bFirstChild    : true,
 *   lastChild      : [ false ],  // Array where the index is the column of
 *                                // indentation, and the value is a boolean.
 *                                // These are used to locate the
 *                                // appropriate "tree line" icon.
 * }
 * </pre>
 */
qx.Class.define("qx.ui.treevirtual.SimpleTreeDataModel",
{
  extend : qx.ui.table.model.Abstract,

  include : qx.ui.treevirtual.MTreePrimitive,


  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  construct : function()
  {
    this.base(arguments);

    this._rowArr = []; // rows, resorted into tree order as necessary
    this._nodeArr = []; // tree nodes, organized with hierarchy

    this._nodeRowMap = []; // map nodeArr index to rowArr index.  The
                           // index of this array is the index of
                           // _nodeArr, and the values in this array are
                           // the indexes into _rowArr.

    this._treeColumn = 0; // default column for tree nodes

    this._selections = {}; // list of indexes of selected nodes

    // the root node, needed to store its children
    this._nodeArr.push(qx.ui.treevirtual.MTreePrimitive._getEmptyTree());

    // Track which columns are editable
    this.__editableColArr = null;
  },


  properties :
  {
    /**
     * Gives the user the opportunity to filter the model. The filter
     * function is called for every node in the model. It gets as an argument the
     * <code>node</code> object and has to return
     * <code>true</code> if the given data should be shown and
     * <code>false</code> if the given data should be ignored.
     */
    filter :
    {
      check : "Function",
      nullable : true,
      apply : "_applyFilter"
    }
  },



  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    __tree           : null,
    __editableColArr : null,
    __tempTreeData : null,
    __recalculateLastChildFlags : null,

    /** Rows, resorted into tree order as necessary */
    _rowArr : null,

    /** Tree nodes, organized with hierarchy */
    _nodeArr : null,

    /**
     * Map nodeArr index to rowArr index.  The index of this array is the
     * index of _nodeArr, and the values in this array are the indexes into
     * _rowArr.
     */
    _nodeRowMap : null,

    /** Column for tree nodes */
    _treeColumn : null,

    /** list of indexes of selected nodes */
    _selections : null,

    /**
     * Set the tree object for which this data model is used.
     *
     * @param tree {qx.ui.treevirtual.TreeVirtual}
     *    The tree used to render the data in this model.
     *
     */
    setTree : function(tree)
    {
      this.__tree = tree;
    },

    /**
     * Get the tree object for which this data model is used.
     *
     * @return {qx.ui.treevirtual.TreeVirtual}
     */
    getTree : function()
    {
      return this.__tree;
    },

    /**
     * Sets all columns editable or not editable.
     *
     * @param editable {Boolean}
     *   Whether all columns are editable.
     *
     */
    setEditable : function(editable)
    {
      this.__editableColArr = [];

      for (var col=0; col<this.getColumnCount(); col++)
      {
        this.__editableColArr[col] = editable;
      }

      this.fireEvent("metaDataChanged");
    },


    /**
     * Sets whether a column is editable.
     *
     * @param columnIndex {Integer}
     *   The column of which to set the editable state.
     *
     * @param editable {Boolean}
     *   Whether the column should be editable.
     *
     */
    setColumnEditable : function(columnIndex, editable)
    {
      if (editable != this.isColumnEditable(columnIndex))
      {
        if (this.__editableColArr == null)
        {
          this.__editableColArr = [];
        }

        this.__editableColArr[columnIndex] = editable;

        this.fireEvent("metaDataChanged");
      }
    },

    // overridden
    isColumnEditable : function(columnIndex)
    {
      // The tree column is not editable
      if (columnIndex == this._treeColumn)
      {
        return false;
      }

      return(this.__editableColArr
             ? this.__editableColArr[columnIndex] == true
             : false);
    },


    // overridden
    isColumnSortable : function(columnIndex)
    {
      return false;
    },


    /**
     * Sorts the model by a column.
     *
     * @param columnIndex {Integer} the column to sort by.
     * @param ascending {Boolean} whether to sort ascending.
     * @throws {Error} If one tries to sort the tree by column
     */
    sortByColumn : function(columnIndex, ascending)
    {
      throw new Error("Trees can not be sorted by column");
    },


    /**
     * Returns the column index the model is sorted by. This model is never
     * sorted, so -1 is returned.
     *
     * @return {Integer}
     *   -1, to indicate that the model is not sorted.
     */
    getSortColumnIndex : function()
    {
      return -1;
    },


    /**
     * Specifies which column the tree is to be displayed in.  The tree is
     * displayed using the SimpleTreeDataCellRenderer.  Other columns may be
     * provided which use different cell renderers.
     *
     * Setting the tree column involves more than simply setting this column
     * index; it also requires setting an appropriate cell renderer for this
     * column, that knows how to render a tree. The expected and typical
     * method of setting the tree column is to provide it in the 'custom'
     * parameter to the TreeVirtual constructor, which also initializes the
     * proper cell renderers. This method does not set any cell renderers. If
     * you wish to call this method on your own, you should also manually set
     * the cell renderer for the specified column, and likely also set the
     * cell renderer for column 0 (the former tree column) to something
     * appropriate to your data.
     *
     *
     * @param columnIndex {Integer}
     *   The index of the column in which the tree should be displayed.
     *
     */
    setTreeColumn : function(columnIndex)
    {
      this._treeColumn = columnIndex;
    },


    /**
     * Get the column in which the tree is to be displayed.
     *
     * @return {Integer}
     *   The column in which the tree is to be displayed
     */
    getTreeColumn : function()
    {
      return this._treeColumn;
    },

    // overridden
    getRowCount : function()
    {
      return this._rowArr.length;
    },

    // overridden
    getRowData : function(rowIndex)
    {
      return this._rowArr[rowIndex];
    },


    /**
     * Returns a cell value by column index.
     *
     * @throws {Error} if the row index is out of bounds.
     * @param columnIndex {Integer} the index of the column.
     * @param rowIndex {Integer} the index of the row.
     * @return {var} The value of the cell.
     * @see #getValueById
     */
    getValue : function(columnIndex, rowIndex)
    {
      if (rowIndex < 0 || rowIndex >= this._rowArr.length)
      {
        throw new Error("this._rowArr row " +
                        "(" + rowIndex + ") out of bounds: " +
                        this._rowArr +
                        " (0.." + (this._rowArr.length - 1) + ")");
      }

      if (columnIndex < 0 || columnIndex >= this._rowArr[rowIndex].length)
      {
        throw new Error("this._rowArr column " +
                        "(" + columnIndex + ") out of bounds: " +
                        this._rowArr[rowIndex] +
                        " (0.." + (this._rowArr[rowIndex].length - 1) + ")");
      }

      return this._rowArr[rowIndex][columnIndex];
    },


    // overridden
    setValue : function(columnIndex, rowIndex, value)
    {
      if (columnIndex == this._treeColumn)
      {
        // Ignore requests to set the tree column data using this method
        return;
      }

      // convert from rowArr to nodeArr, and get the requested node
      var node = this.getNodeFromRow(rowIndex);

      if (node.columnData[columnIndex] != value)
      {
        node.columnData[columnIndex] = value;
        this.setData();

        // Inform the listeners
        if (this.hasListener("dataChanged"))
        {
          var data =
          {
            firstRow    : rowIndex,
            lastRow     : rowIndex,
            firstColumn : columnIndex,
            lastColumn  : columnIndex
          };

          this.fireDataEvent("dataChanged", data);
        }
      }
    },


    /**
     * Returns the node object specific to a currently visible row. In this
     * simple tree data model, that's the same as retrieving the value of the
     * tree column of the specified row.
     *
     * @throws {Error}
     *   Thrown if the row index is out of bounds.
     *
     * @param rowIndex {Integer}
     *   The index of the row.
     *
     * @return {Object}
     *   The node object associated with the specified row.
     */
    getNode : function(rowIndex)
    {
      if (rowIndex < 0 || rowIndex >= this._rowArr.length)
      {
        throw new Error("this._rowArr row " +
                        "(" + rowIndex + ") out of bounds: " +
                        this._rowArr +
                        " (0.." + (this._rowArr.length - 1) + ")");
      }

      return this._rowArr[rowIndex][this._treeColumn];
    },


    /**
     * Add a branch to the tree.
     *
     * @param parentNodeId {Integer}
     *   The node id of the parent of the node being added
     *
     * @param label {String}
     *   The string to display as the label for this node
     *
     * @param bOpened {Boolean}
     *   <i>True</i> if the branch should be rendered in its opened state;
     *   <i>false</i> otherwise.
     *
     * @param bHideOpenCloseButton {Boolean}
     *   <i>True</i> if the open/close button should not be displayed;
     *   <i>false</i> if the open/close button should be displayed
     *
     * @param icon {String}
     *   The relative (subject to alias expansion) or full path of the icon to
     *   display for this node when it is not a selected node.
     *
     * @param iconSelected {String}
     *   The relative (subject to alias expansion) or full path of the icon to
     *   display for this node when it is a selected node.
     *
     * @return {Integer}
     *   The node id of the newly-added branch.
     */
    addBranch : function(parentNodeId,
                         label,
                         bOpened,
                         bHideOpenCloseButton,
                         icon,
                         iconSelected)
    {
      return qx.ui.treevirtual.MTreePrimitive._addNode(
        this._nodeArr,
        parentNodeId,
        label,
        bOpened,
        bHideOpenCloseButton,
        qx.ui.treevirtual.MTreePrimitive.Type.BRANCH,
        icon,
        iconSelected);
    },


    /**
     * Add a leaf to the tree.
     *
     * @param parentNodeId {Integer}
     *   The node id of the parent of the node being added
     *
     * @param label {String}
     *   The string to display as the label for this node
     *
     * @param icon {String}
     *   The relative (subject to alias expansion) or full path of the icon to
     *   display for this node when it is not a selected node.
     *
     * @param iconSelected {String}
     *   The relative (subject to alias expansion) or full path of the icon to
     *   display for this node when it is a selected node.
     *
     * @return {Integer} The node id of the newly-added leaf.
     */
    addLeaf : function(parentNodeId,
                       label,
                       icon,
                       iconSelected)
    {
      return qx.ui.treevirtual.MTreePrimitive._addNode(
        this._nodeArr,
        parentNodeId,
        label,
        false,
        false,
        qx.ui.treevirtual.MTreePrimitive.Type.LEAF,
        icon,
        iconSelected);
    },


    /**
     * Prune the tree by removing, recursively, all of a node's children.  If
     * requested, also remove the node itself.
     *
     * @param nodeReference {Object | Integer}
     *   The node to be pruned from the tree.  The node can be represented
     *   either by the node object, or the node id (as would have been
     *   returned by addBranch(), addLeaf(), etc.)
     *
     * @param bSelfAlso {Boolean}
     *   If <i>true</i> then remove the node identified by <i>nodeId</i> as
     *   well as all of the children.
     *
     * @throws {Error} If the node object or id is not valid.
     *
     */
    prune : function(nodeReference, bSelfAlso)
    {
      var node;
      var nodeId;

      if (typeof(nodeReference) == "object")
      {
        node = nodeReference;
        nodeId = node.nodeId;
      }
      else if (typeof(nodeReference) == "number")
      {
        nodeId = nodeReference;
      }
      else
      {
        throw new Error("Expected node object or node id");
      }

      // First, recursively remove all children
      for (var i=this._nodeArr[nodeId].children.length-1; i>=0; i--)
      {
        this.prune(this._nodeArr[nodeId].children[i], true);
      }

      // Now remove ourself, if requested. (Don't try to remove the root node)
      if (bSelfAlso && nodeId != 0)
      {
        // Delete ourself from our parent's children list
        node = this._nodeArr[nodeId];
        qx.lang.Array.remove(this._nodeArr[node.parentNodeId].children,
                             nodeId);

        // Delete ourself from the selections list, if we're in it.
        if (this._selections[nodeId])
        {
          delete this._selections[nodeId];
        }

        // We can't splice the node itself out, because that would muck up the
        // nodeId == index correspondence.  Instead, just replace the node
        // with null so its index just becomes unused.
        this._nodeArr[nodeId] = null;
      }
    },


    /**
     * Move a node in the tree.
     *
     * @param moveNodeReference {Object | Integer}
     *   The node to be moved.  The node can be represented
     *   either by the node object, or the node id (as would have been
     *   returned by addBranch(), addLeaf(), etc.)
     *
     * @param parentNodeReference {Object | Integer}
     *   The new parent node, which must not be a LEAF.  The node can be
     *   represented either by the node object, or the node id (as would have
     *   been returned by addBranch(), addLeaf(), etc.)
     *
     * @throws {Error} If the node object or id is not valid.
     * @throws {Error} If one tries to add a child to a non-existent parent.
     * @throws {Error} If one tries to add a node to a leaf.
     */
    move : function(moveNodeReference,
                    parentNodeReference)
    {
      var moveNode;
      var moveNodeId;
      var parentNode;
      var parentNodeId;

      // Replace null parent with node id 0
      parentNodeReference = parentNodeReference || 0;

      if (typeof(moveNodeReference) == "object")
      {
        moveNode = moveNodeReference;
        moveNodeId = moveNode.nodeId;
      }
      else if (typeof(moveNodeReference) == "number")
      {
        moveNodeId = moveNodeReference;
        moveNode = this._nodeArr[moveNodeId];
      }
      else
      {
        throw new Error("Expected move node object or node id");
      }

      if (typeof(parentNodeReference) == "object")
      {
        parentNode = parentNodeReference;
        parentNodeId = parentNode.nodeId;
      }
      else if (typeof(parentNodeReference) == "number")
      {
        parentNodeId = parentNodeReference;
        parentNode = this._nodeArr[parentNodeId];
      }
      else
      {
        throw new Error("Expected parent node object or node id");
      }

      // Ensure parent isn't a leaf
      if (parentNode.type == qx.ui.treevirtual.MTreePrimitive.Type.LEAF)
      {
        throw new Error("Sorry, a LEAF may not have children.");
      }

      // Remove the node from its current parent's children list
      var oldParent = this._nodeArr[moveNode.parentNodeId];
      qx.lang.Array.remove(oldParent.children, moveNodeId);

      // Add the node to its new parent's children list
      parentNode.children.push(moveNodeId);

      // Replace this node's parent reference
      this._nodeArr[moveNodeId].parentNodeId = parentNodeId;
    },


    /**
     * Orders the node and creates all data needed to render the tree.
     *
     * @param nodeId {Integer}
     *   A node identifier, as previously returned by {@link #addBranch} or
     *   {@link #addLeaf}.
     * @param level {Integer} the level in the hierarchy
     */
    __inorder : function(nodeId, level)
    {
      var filter = this.getFilter();
      var child = null;
      var childNodeId;

      // For each child of the specified node...
      var numChildren = this._nodeArr[nodeId].children.length;
      var index = 0;
      var children = this.__tempTreeData[nodeId] = [];
      for (var i=0; i<numChildren; i++)
      {
        // Determine the node id of this child
        childNodeId = this._nodeArr[nodeId].children[i];

        // Get the child node
        child = this._nodeArr[childNodeId];

        // Skip deleted nodes or apply the filter
        if (child == null || (filter && !filter.call(this, child))) {
          this.__recalculateLastChildFlags = true;
          continue;
        }

        // Remember the children so that we can add the lastChild flags later
        children.push(child);

        // (Re-)assign this node's level
        child.level = level;

        // Determine if we're the first child of our parent
        child.bFirstChild = (index == 0);

        // Set the last child flag of the node only when no node was skipped.
        // Otherwise we will have to recalculate the last child flags, as
        // the parent or sibling node might become the first child.
        if (!this.__recalculateLastChildFlags) {
          this.__setLastChildFlag(child, i == numChildren - 1);
        }

        // Ensure there's an entry in the columnData array for each column
        if (!child.columnData)
        {
          child.columnData = [ ];
        }

        if (child.columnData.length < this.getColumnCount())
        {
          child.columnData[this.getColumnCount() - 1] = null;
        }

        // Add this node to the row array.  Initialize a row data array.
        var rowData = [ ];

        // If additional column data is provided...
        if (child.columnData)
        {
          // ... then add each column data.
          for (var j=0; j<child.columnData.length; j++)
          {
            // Is this the tree column?
            if (j == this._treeColumn)
            {
              // Yup.  Add the tree node data
              rowData.push(child);
            }
            else
            {
              // Otherwise, add the column data verbatim.
              rowData.push(child.columnData[j]);
            }
          }
        }
        else
        {
          // No column data.  Just add the tree node.
          rowData.push(child);
        }

        // Track the _rowArr index for each node so we can handle
        // selections.
        this._nodeRowMap[child.nodeId] = this._rowArr.length;

        // Add the row data to the row array
        this._rowArr.push(rowData);

        // If this node is selected, ...
        if (child.bSelected)
        {
          // ... indicate so for the row.
          rowData.selected = true;
          this._selections[child.nodeId] = true;
        }

        // If this child is opened, ...
        if (child.bOpened)
        {
          // ... then add its children too.
          this.__inorder(childNodeId, level + 1);
        }
        index++;
      }
    },


    /**
     * Calcultes the lastChild flags to the nodes, so that the tree can render the
     * tree lines right.
     *
     * @param nodeId {Integer}
     *   A node identifier, as previously returned by {@link #addBranch} or
     *   {@link #addLeaf}.
     */
    __calculateLastChildFlags : function(nodeId)
    {
      var tempTreeData = this.__tempTreeData;
      var children =  tempTreeData[nodeId];
      var numChildren = children.length;
      for (var i = 0; i < numChildren; i++)
      {
        var child = children[i];

        this.__setLastChildFlag(child, i == numChildren - 1);

        var hasChildren = tempTreeData[child.nodeId] && tempTreeData[child.nodeId].length > 0;
        if (hasChildren) {
          this.__calculateLastChildFlags(child.nodeId);
        }
      }
    },


    /**
     * Sets the last child flag for a node and all it's parents.
     *
     * @param node {Object} the node object
     * @param isLastChild {Boolean} whether the node is the last child
     */
    __setLastChildFlag : function(node, isLastChild)
    {
      // Determine if we're the last child of our parent
      node.lastChild = [ isLastChild ];

      // Get our parent.
      var parent =  this._nodeArr[node.parentNodeId];

      // For each parent node, determine if it is a last child
      while (parent.nodeId)
      {
        var bLast = parent.lastChild[parent.lastChild.length - 1];
        node.lastChild.unshift(bLast);
        parent = this._nodeArr[parent.parentNodeId];
      }
    },


    /**
     * Renders the tree data.
     */
    __render : function()
    {
      // Reset the __tempTreeData
      this.__tempTreeData = [];
      this.__recalculateLastChildFlags = false;

      // Reset the row array
      this._rowArr = [];

      // Reset the _nodeArr -> _rowArr map
      this._nodeRowMap = [];

      // Reset the set of selections
      this._selections = {};

      // Begin in-order traversal of the tree from the root to regenerate
      // _rowArr.
      this.__inorder(0, 1);

      // Reset the lastChild flags when needed, so that the tree can render the
      // tree lines right.
      if (this.__recalculateLastChildFlags) {
        this.__calculateLastChildFlags(0);
      }

      // Give the memory free
      this.__tempTreeData = null;

      // Inform the listeners
      if (this.hasListener("dataChanged"))
      {
        var data =
        {
          firstRow    : 0,
          lastRow     : this._rowArr.length - 1,
          firstColumn : 0,
          lastColumn  : this.getColumnCount() - 1
        };

        this.fireDataEvent("dataChanged", data);
      }
    },


    /**
     * Sets the whole data en bulk, or notifies the data model that node
     * modifications are complete.
     *
     * @param nodeArr {Array | null}
     *   Pass either an Array of node objects, or null.
     *
     *   If non-null, nodeArr is an array of node objects containing the
     *   entire tree to be displayed.  If loading the whole data en bulk in
     *   this way, it is assumed that the data is correct!  No error checking
     *   or validation is done.  You'd better know what you're doing!  Caveat
     *   emptor.
     *
     *
     *   If nodeArr is null, then this call is a notification that the user
     *   has completed building or modifying a tree by issuing a series of
     *   calls to {@link #addBranch} and/or {@link #addLeaf}.
     *
     *
     * @throws {Error} If the parameter has the wrong type.
     */
    setData : function(nodeArr)
    {
      if (nodeArr instanceof Array)
      {
        // Save the user-supplied data.
        this._nodeArr = nodeArr;
      }
      else if (nodeArr !== null && nodeArr !== undefined)
      {
        throw new Error("Expected array of node objects or null/undefined; " +
                        "got " + typeof (nodeArr));
      }

      // Re-render the row array
      this.__render();

      // Set selections in the selection model now
      var selectionModel = this.getTree().getSelectionModel();
      var selections = this._selections;
      for (var nodeId in selections)
      {
        var nRowIndex = this.getRowFromNodeId(nodeId);
        selectionModel.setSelectionInterval(nRowIndex, nRowIndex);
      }
    },


    /**
     * Return the array of node data.
     *
     * @return {Array}
     *  Array of node objects.
     *  See {@link qx.ui.treevirtual.SimpleTreeDataModel} for a description
     *  nodes in this array.
     */
    getData : function()
    {
      return this._nodeArr;
    },


    /**
     * Clears the tree of all nodes
     *
     */
    clearData : function ()
    {
      this._clearSelections();
      this.setData([ qx.ui.treevirtual.MTreePrimitive._getEmptyTree() ]);
    },


    /**
     * Add data to an additional column (a column other than the tree column)
     * of the tree.
     *
     * @param nodeId {Integer}
     *   A node identifier, as previously returned by {@link #addBranch} or
     *   {@link #addLeaf}.
     *
     * @param columnIndex {Integer}
     *   The column number to which the provided data applies
     *
     * @param data {var}
     *   The cell data for the specified column
     *
     */
    setColumnData : function(nodeId, columnIndex, data)
    {
      this._nodeArr[nodeId].columnData[columnIndex] = data;
    },


    /**
     * Retrieve the data from an additional column (a column other than the
     * tree column) of the tree.
     *
     * @param nodeId {Integer}
     *   A node identifier, as previously returned by {@link #addBranch} or
     *   {@link #addLeaf}.
     *
     * @param columnIndex {Integer}
     *   The column number to which the provided data applies
     *
     * @return {var} The cell data for the specified column
     */
    getColumnData : function(nodeId, columnIndex)
    {
      return this._nodeArr[nodeId].columnData[columnIndex];
    },


    /**
     * Set state attributes of a node.
     *
     * @param nodeReference {Object | Integer}
     *   The node to have its attributes set.  The node can be represented
     *   either by the node object, or the node id (as would have been
     *   returned by addBranch(), addLeaf(), etc.)
     *
     * @param attributes {Map}
     *   Each property name in the map may correspond to the property names of
     *   a node which are specified as <i>USER-PROVIDED ATTRIBUTES</i> in
     *   {@link SimpleTreeDataModel}.  Each property value will be assigned
     *   to the corresponding property of the node specified by nodeId.
     *
     * @throws {Error} If the node object or id is not valid.
     */
    setState : function(nodeReference, attributes)
    {
      var node;
      var nodeId;

      if (typeof(nodeReference) == "object")
      {
        node = nodeReference;
        nodeId = node.nodeId;
      }
      else if (typeof(nodeReference) == "number")
      {
        nodeId = nodeReference;
        node = this._nodeArr[nodeId];
      }
      else
      {
        throw new Error("Expected node object or node id");
      }

      for (var attribute in attributes)
      {
        // Do any attribute-specific processing
        switch(attribute)
        {
        case "bSelected":
          var nRowIndex = this.getRowFromNodeId(nodeId);
          var selectionModel = this.getTree().getSelectionModel();
          var TV = qx.ui.treevirtual.TreeVirtual;
          var bChangeSelection =
            (typeof(nRowIndex) === "number" &&
             this.getTree().getSelectionMode() != TV.SelectionMode.NONE);

          // The selected state is changing. Keep track of what is selected
          if (attributes[attribute])
          {
            this._selections[nodeId] = true;

            // Add selection range for node
            if (bChangeSelection &&
                ! selectionModel.isSelectedIndex(nRowIndex))
            {
              selectionModel.setSelectionInterval(nRowIndex, nRowIndex);
            }
          }
          else
          {
            delete this._selections[nodeId];

            // Delete selection range for node
            if (bChangeSelection &&
                selectionModel.isSelectedIndex(nRowIndex))
            {
              selectionModel.removeSelectionInterval(nRowIndex, nRowIndex);
            }
          }
          break;

        case "bOpened":
          // Don't do anything if the requested state is the same as the
          // current state.
          if (attributes[attribute] == node.bOpened)
          {
            break;
          }

          // Get the tree to which this data model is attached
          var tree = this.__tree;

          // Are we opening or closing?
          if (node.bOpened)
          {
            // We're closing.  If there are listeners, generate a treeClose
            // event.
            tree.fireDataEvent("treeClose", node);
          }
          else
          {
            // We're opening.  Are there any children?
            if (node.children.length > 0)
            {
              // Yup.  If there any listeners, generate a "treeOpenWithContent"
              // event.
              tree.fireDataEvent("treeOpenWithContent", node);
            }
            else
            {
              // No children.  If there are listeners, generate a
              // "treeOpenWhileEmpty" event.
              tree.fireDataEvent("treeOpenWhileEmpty", node);
            }
          }

          // Event handler may have modified the opened state.  Check before
          // toggling.
          if (!node.bHideOpenClose)
          {
            // It's still boolean.  Toggle the state
            node.bOpened = !node.bOpened;

            // Clear the old selections in the tree
            tree.getSelectionModel()._resetSelection();
          }

          // Re-render the row data since formerly visible rows may now be
          // invisible, or vice versa.
          this.setData();
          break;

        default:
          // no attribute-specific processing required
          break;
        }

        // Set the new attribute value
        node[attribute] = attributes[attribute];
      }
    },


    /**
     * Return the mapping of nodes to rendered rows.  This function is intended
     * for use by the cell renderer, not by users of this class.
     * It is also useful to select a node.
     *
     * @return {Array}
     *   The array containing mappings of nodes to rendered rows.
     */
    getNodeRowMap : function()
    {
      return this._nodeRowMap;
    },

    /**
     * This operation maps nodes to rowIndexes.  It does the opposite job to {@link #getNodeFromRow}.
     *
     * @param nodeId {Integer}
     *   The id of the node (as would have been returned by addBranch(),
     *   addLeaf(), etc.) to get the row index for.
     * @return {Integer} row index for the given node ID
     */
    getRowFromNodeId : function(nodeId)
    {
      return this._nodeRowMap[nodeId];
    },

    /**
     * This operation maps rowIndexes to nodes.  It does the opposite job to {@link #getRowFromNodeId}.
     * This function is useful to map selection (row based) to nodes.
     *
     * @param rowIndex {Integer} zero-based row index.
     * @return {Object} node associated to <tt>rowIndex</tt>.
     */
    getNodeFromRow : function(rowIndex)
    {
      return this._nodeArr[this._rowArr[rowIndex][this._treeColumn].nodeId];
    },


    /**
     * Clear all selections in the data model.  This method does not clear
     * selections displayed in the widget, and is intended for internal use,
     * not by users of this class.
     *
     */
    _clearSelections : function()
    {
      // Clear selected state for any selected nodes.
      for (var selection in this._selections)
      {
        this._nodeArr[selection].bSelected = false;
      }

      // Reinitialize selections array.
      this._selections = { };
    },


    /**
     * Return the nodes that are currently selected.
     *
     * @return {Array}
     *   An array containing the nodes that are currently selected.
     */
    getSelectedNodes : function()
    {
      var nodes = [ ];

      for (var nodeId in this._selections)
      {
        nodes.push(this._nodeArr[nodeId]);
      }

      return nodes;
    },


    // property apply
    _applyFilter : function(value, old)
    {
      this.setData();
    }
  },

  destruct : function()
  {
    this._rowArr = this._nodeArr = this._nodeRowMap = this._selections =
      this.__tree = this.__tempTreeData = null;
  },

  defer : function(statics)
  {
    // For backward compatibility, ensure the Type values are available from
    // this class as well as from the mixin.
    statics.Type = qx.ui.treevirtual.MTreePrimitive.Type;
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2007 Derrell Lipman

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Derrell Lipman (derrell)
     * David Perez Carmona (david-perez)

************************************************************************ */

/**
 * A data cell renderer for the tree column of a simple tree
 *
 * This cell renderer has provisions for subclasses to easily extend the
 * appearance of the tree. If the tree should contain images, labels,
 * etc. before the indentation, the subclass should override the method
 * _addExtraContentBeforeIndentation(). Similarly, content can be added before
 * the icon by overriding _addExtraContentBeforeIcon(), and before the label
 * by overriding _addExtraContentBeforeLabel().
 *
 * Each of these overridden methods that calls _addImage() can provide, as
 * part of the map passed to _addImage(), a member called "tooltip" which
 * contains the tool tip to present when the mouse is hovered over the image.
 *
 * If this class is subclassed to form a new cell renderer, an instance of it
 * must be provided, via the 'custom' parameter, to the TreeVirtual
 * constructor.
 */
qx.Class.define("qx.ui.treevirtual.SimpleTreeDataCellRenderer",
{
  extend : qx.ui.table.cellrenderer.Abstract,


  construct : function()
  {
    var STDCR = qx.ui.treevirtual.SimpleTreeDataCellRenderer;

    // Begin preloading of the tree images, if not already requested.
    if (STDCR.__bVirgin)
    {
      STDCR.__preloadImages();
      STDCR.__bVirgin = false;
    }

    this.base(arguments);

    this.__am = qx.util.AliasManager.getInstance();
    this.__rm = qx.util.ResourceManager.getInstance();
    this.__tm = qx.theme.manager.Appearance.getInstance();

    // Base URL used for indentation
    this.BLANK = this.__rm.toUri(this.__am.resolve("static/blank.gif"));
  },


  statics :
  {
    /** File names of each of the tree icons */
    __icon : { },

    /** Whether we have not yet requested pre-loading of images */
    __bVirgin : true,

    /**
     * Request preloading of images so they appear immediately upon rendering
     */
    __preloadImages : function()
    {
      var STDCR = qx.ui.treevirtual.SimpleTreeDataCellRenderer;

      var ImageLoader = qx.io.ImageLoader;

      var am = qx.util.AliasManager.getInstance();
      var rm = qx.util.ResourceManager.getInstance();
      var tm = qx.theme.manager.Appearance.getInstance();

      var loadImage = function(f)
      {
        ImageLoader.load(rm.toUri(am.resolve(f)));
      };

      STDCR.__icon.line = tm.styleFrom("treevirtual-line");
      loadImage(STDCR.__icon.line.icon);

      STDCR.__icon.contract = tm.styleFrom("treevirtual-contract");
      loadImage(STDCR.__icon.contract.icon);

      STDCR.__icon.expand = tm.styleFrom("treevirtual-expand");
      loadImage(STDCR.__icon.expand.icon);

      STDCR.__icon.onlyContract = tm.styleFrom("treevirtual-only-contract");
      loadImage(STDCR.__icon.onlyContract.icon);

      STDCR.__icon.onlyExpand = tm.styleFrom("treevirtual-only-expand");
      loadImage(STDCR.__icon.onlyExpand.icon);

      STDCR.__icon.startContract = tm.styleFrom("treevirtual-start-contract");
      loadImage(STDCR.__icon.startContract.icon);

      STDCR.__icon.startExpand = tm.styleFrom("treevirtual-start-expand");
      loadImage(STDCR.__icon.startExpand.icon);

      STDCR.__icon.endContract = tm.styleFrom("treevirtual-end-contract");
      loadImage(STDCR.__icon.endContract.icon);

      STDCR.__icon.endExpand = tm.styleFrom("treevirtual-end-expand");
      loadImage(STDCR.__icon.endExpand.icon);

      STDCR.__icon.crossContract = tm.styleFrom("treevirtual-cross-contract");
      loadImage(STDCR.__icon.crossContract.icon);

      STDCR.__icon.crossExpand = tm.styleFrom("treevirtual-cross-expand");
      loadImage(STDCR.__icon.crossExpand.icon);

      STDCR.__icon.end = tm.styleFrom("treevirtual-end");
      loadImage(STDCR.__icon.end.icon);

      STDCR.__icon.cross = tm.styleFrom("treevirtual-cross");
      loadImage(STDCR.__icon.cross.icon);
    }
  },


  properties :
  {
    /**
     * Set whether lines linking tree children shall be drawn on the tree
     * if the theme supports tree lines.
     */
    useTreeLines :
    {
      check : "Boolean",
      init : true
    },

    /**
     * When true, exclude only the first-level tree lines, creating,
     * effectively, multiple unrelated root nodes.
     */
    excludeFirstLevelTreeLines :
    {
      check : "Boolean",
      init : false
    },

    /**
     * Set whether the open/close button should be displayed on a branch, even
     * if the branch has no children.
     */
    alwaysShowOpenCloseSymbol :
    {
      check : "Boolean",
      init : false
    }
  },




  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    __am : null,
    __tm : null,
    __rm : null,


    // overridden
    _onChangeTheme : function() {
      this.base(arguments);
      qx.ui.treevirtual.SimpleTreeDataCellRenderer.__preloadImages();
    },


    // overridden
    _getCellStyle : function(cellInfo)
    {
      var node = cellInfo.value;

      // Return the style for the div for the cell.  If there's cell-specific
      // style information provided, append it.
      var html =
        this.base(arguments, cellInfo) +
        (node.cellStyle ? node.cellStyle + ";" : "");
      return html;
    },

    // overridden
    _getContentHtml : function(cellInfo)
    {
      var html = "";

      // Horizontal position
      var pos = 0;

      // If needed, add extra content before indentation
      var extra = this._addExtraContentBeforeIndentation(cellInfo, pos);
      html += extra.html;
      pos = extra.pos;

      // Add the indentation (optionally with tree lines)
      var indentation = this._addIndentation(cellInfo, pos);
      html += indentation.html;
      pos = indentation.pos;

      // If needed, add extra content before icon
      extra = this._addExtraContentBeforeIcon(cellInfo, pos);
      html += extra.html;
      pos = extra.pos;

      // Add the node icon
      var icon = this._addIcon(cellInfo, pos);
      html += icon.html;
      pos = icon.pos;

      // If needed, add extra content before label
      extra = this._addExtraContentBeforeLabel(cellInfo, pos);
      html += extra.html;
      pos = extra.pos;

      // Add the node's label
      html += this._addLabel(cellInfo, pos);

      return html;
    },

    /**
     * Add an image to the tree.  This might be a visible icon or it may be
     * part of the indentation.
     *
     * @param imageInfo {Map}
     *   How to display the image.  It optionally includes any of the
     *   following:
     *   <dl>
     *     <dt>position {Map}</dt>
     *     <dd>
     *       If provided, a div is created to hold the image.  The div's top,
     *       right, bottom, left, width, and/or height may be specified with
     *       members of this map.  Each is expected to be an integer value.
     *     </dd>
     *     <dt>imageWidth, imageHeight</dt>
     *     <dd>
     *       The image's width and height.  These are used only if both are
     *       specified.
     *     </dd>
     *   </dl>
     *
     * @return {String}
     *   The html for this image, possibly with a surrounding div (see
     *   'position', above).
     */
    _addImage : function(imageInfo)
    {
      var html = [];

      // Resolve the URI
      var source = this.__rm.toUri(this.__am.resolve(imageInfo.url));

      // If we've been given positioning attributes, enclose image in a div
      if (imageInfo.position)
      {
        var pos = imageInfo.position;

        html.push('<div style="position:absolute;');

        if (qx.core.Environment.get("css.boxsizing"))
        {
          html.push(qx.bom.element.BoxSizing.compile("content-box"));
        }

        if (pos.top !== undefined)
        {
          html.push('top:' + pos.top + 'px;');
        }

        if (pos.right !== undefined)
        {
          html.push('right:' + pos.right + 'px;');
        }

        if (pos.bottom !== undefined)
        {
          html.push('bottom:' + pos.bottom + 'px;');
        }

        if (pos.left !== undefined)
        {
          html.push('left:' + pos.left + 'px;');
        }

        if (pos.width !== undefined)
        {
          html.push('width:' + pos.width + 'px;');
        }

        if (pos.height !== undefined)
        {
          html.push('height:' + pos.height + 'px;');
        }

        html.push('">');
      }

      // Don't use an image tag.  They render differently in Firefox and IE7
      // even if both are enclosed in a div specified as content box.  Instead,
      // add the image as the background image of a div.
      html.push('<div style="');
      html.push('background-image:url(' + source + ');');
      html.push('background-repeat:no-repeat;');

      if (imageInfo.imageWidth && imageInfo.imageHeight)
      {
        html.push(
          ';width:' +
          imageInfo.imageWidth +
          'px' +
          ';height:' +
          imageInfo.imageHeight +
          'px');
      }

      var tooltip = imageInfo.tooltip;

      if (tooltip != null)
      {
        html.push('" title="' + tooltip);
      }

      html.push('">&nbsp;</div>');

      if (imageInfo.position)
      {
        html.push('</div>');
      }

      return html.join("");
    },


    /**
     * Add the indentation for this node of the tree.
     *
     * The indentation optionally includes tree lines.  Whether tree lines are
     * used depends on (a) the properties 'useTreeLines' and
     * 'excludeFirstLevelTreelines' within this class; and (b) the widget
     * theme in use (some themes don't support tree lines).
     *
     * @param cellInfo {Map} The information about the cell.
     *   See {@link qx.ui.table.cellrenderer.Abstract#createDataCellHtml}.
     *
     * @param pos {Integer}
     *   The position from the left edge of the column at which to render this
     *   item.
     *
     * @return {Map}
     *   The returned map contains an 'html' member which contains the html for
     *   the indentation, and a 'pos' member which is the starting position
     *   plus the width of the indentation.
     */
    _addIndentation : function(cellInfo, pos)
    {
      var node = cellInfo.value;
      var imageData;
      var html = "";

      // Generate the indentation.  Obtain icon determination values once
      // rather than each time through the loop.
      var bUseTreeLines = this.getUseTreeLines();
      var bExcludeFirstLevelTreeLines = this.getExcludeFirstLevelTreeLines();
      var bAlwaysShowOpenCloseSymbol = this.getAlwaysShowOpenCloseSymbol();

      for (var i=0; i<node.level; i++)
      {
        imageData = this._getIndentSymbol(i, node, bUseTreeLines,
                                          bAlwaysShowOpenCloseSymbol,
                                          bExcludeFirstLevelTreeLines);

        var rowHeight = cellInfo.table.getRowHeight();

        html += this._addImage(
        {
          url         : imageData.icon,
          position    :
          {
            top         : 0 + (imageData.paddingTop || 0),
            left        : pos + (imageData.paddingLeft || 0),
            width       : rowHeight + 3,
            height      : rowHeight
          },
          imageWidth  : rowHeight,
          imageHeight : rowHeight
        });
        pos += rowHeight + 3;
      }

      return (
        {
          html : html,
          pos  : pos
        });
    },

    /**
     * Add the icon for this node of the tree.
     *
     * @param cellInfo {Map} The information about the cell.
     *   See {@link qx.ui.table.cellrenderer.Abstract#createDataCellHtml}.
     *
     * @param pos {Integer}
     *   The position from the left edge of the column at which to render this
     *   item.
     *
     * @return {Map}
     *   The returned map contains an 'html' member which contains the html for
     *   the icon, and a 'pos' member which is the starting position plus the
     *   width of the icon.
     */
    _addIcon : function(cellInfo, pos)
    {
      var node = cellInfo.value;

      // Add the node's icon
      var imageUrl = (node.bSelected ? node.iconSelected : node.icon);

      if (!imageUrl)
      {
        if (node.type == qx.ui.treevirtual.SimpleTreeDataModel.Type.LEAF)
        {
          var o = this.__tm.styleFrom("treevirtual-file");
        }
        else
        {
          var states = { opened : node.bOpened };
          var o = this.__tm.styleFrom("treevirtual-folder", states);
        }

        imageUrl = o.icon;
      }

      var rowHeight = cellInfo.table.getRowHeight();

      var html = this._addImage(
      {
        url         : imageUrl,
        position    :
        {
          top         : 0,
          left        : pos,
          width       : rowHeight + 3,
          height      : rowHeight
        },
        imageWidth  : rowHeight,
        imageHeight : rowHeight
      });

      return (
        {
          html : html,
          pos  : pos + rowHeight + 3
        });
    },

    /**
     * Add the label for this node of the tree.
     *
     * @param cellInfo {Map} The information about the cell.
     *   See {@link qx.ui.table.cellrenderer.Abstract#createDataCellHtml}.
     *   Additionally, if defined, the labelSpanStyle member is used to apply
     *   style to the span containing the label.  (This member is for use by
     *   subclasses; it's not otherwise used by this class.)
     *
     * @param pos {Integer}
     *   The position from the left edge of the column at which to render this
     *   item.
     *
     * @return {String}
     *   The html for the label.
     */
    _addLabel : function(cellInfo, pos)
    {
      var node = cellInfo.value;
      var label = node.label;

      if (qx.core.Environment.get("qx.dynlocale")) {
        if (label && label.translate) {
          label = label.translate();
        }
      }

      // Add the node's label.  We calculate the "left" property with: each
      // tree line (indentation) icon is 19 pixels wide; the folder icon is 16
      // pixels wide, there are two pixels of padding at the left, and we want
      // 2 pixels between the folder icon and the label
      var html =
        '<div style="position:absolute;' +
        'left:' + pos + 'px;' +
        'top:0;' +
        (node.labelStyle ? node.labelStyle + ";" : "") +
        '">' +
        '<span' + (cellInfo.labelSpanStyle
                   ? 'style="' + cellInfo.labelSpanStyle + ';"'
                   : "") + '>' +
        label +
        '</span>' +
        '</div>';

      return html;
    },

    /**
     * Adds extra content just before the indentation.
     *
     * @param cellInfo {Map} The information about the cell.
     *      See {@link qx.ui.table.cellrenderer.Abstract#createDataCellHtml}.
     *
     * @param pos {Integer}
     *   The position from the left edge of the column at which to render this
     *   item.
     *
     * @return {Map}
     *   The returned map contains an 'html' member which contains the html for
     *   the indentation, and a 'pos' member which is the starting position
     *   plus the width of the indentation.
     */
    _addExtraContentBeforeIndentation : function(cellInfo, pos)
    {
      return { html: '', pos: pos };
    },

    /**
     * Adds extra content just before the icon.
     *
     * @param cellInfo {Map} The information about the cell.
     *      See {@link qx.ui.table.cellrenderer.Abstract#createDataCellHtml}.
     *
     * @param pos {Integer}
     *   The position from the left edge of the column at which to render this
     *   item.
     *
     * @return {Map}
     *   The returned map contains an 'html' member which contains the html for
     *   the indentation, and a 'pos' member which is the starting position
     *   plus the width of the indentation.
     */
    _addExtraContentBeforeIcon : function(cellInfo, pos)
    {
      return { html: '', pos: pos };
    },

    /**
     * Adds extra content just before the label.
     *
     * @param cellInfo {Map} The information about the cell.
     *      See {@link qx.ui.table.cellrenderer.Abstract#createDataCellHtml}.
     *
     * @param pos {Integer}
     *   The position from the left edge of the column at which to render this
     *   item.
     *
     * @return {Map}
     *   The returned map contains an 'html' member which contains the html for
     *   the indentation, and a 'pos' member which is the starting position
     *   plus the width of the indentation.
     */
    _addExtraContentBeforeLabel : function(cellInfo, pos)
    {
      return { html: '', pos: pos };
    },


    /**
     * Determine the symbol to use for indentation of a tree row, at a
     * particular column.  The indentation to use may be just white space or
     * may be a tree line.  Tree lines come in numerous varieties, so the
     * appropriate one is selected.
     *
     * @param column {Integer}
     *   The column of indentation being requested, zero-relative
     *
     * @param node {Node}
     *   The node being displayed in the row.  The properties of a node are
     *   described in {@link qx.ui.treevirtual.SimpleTreeDataModel}
     *
     * @param bUseTreeLines {Boolean}
     *   Whether to find an appropriate tree line icon, or simply provide
     *   white space.
     *
     * @param bAlwaysShowOpenCloseSymbol {Boolean}
     *   Whether to display the open/close icon for a node even if it has no
     *   children.
     *
     * @param bExcludeFirstLevelTreeLines {Boolean}
     *   If bUseTreeLines is enabled, then further filtering of the left-most
     *   tree line may be specified here.  If <i>true</i> then the left-most
     *   tree line, between top-level siblings, will not be displayed.
     *   If <i>false</i>, then the left-most tree line wiill be displayed
     *   just like all of the other tree lines.
     *
     * @return {Map} map of image properties.
     */
    _getIndentSymbol : function(column,
                                node,
                                bUseTreeLines,
                                bAlwaysShowOpenCloseSymbol,
                                bExcludeFirstLevelTreeLines)
    {
      var STDCR = qx.ui.treevirtual.SimpleTreeDataCellRenderer;

      // If we're in column 0 and excludeFirstLevelTreeLines is enabled, then
      // we treat this as if no tree lines were requested.
      if (column == 0 && bExcludeFirstLevelTreeLines)
      {
        bUseTreeLines = false;
      }

      // If we're not on the final column...
      if (column < node.level - 1)
      {
        // then return either a line or a blank icon, depending on
        // bUseTreeLines
        return (bUseTreeLines && ! node.lastChild[column]
                ? STDCR.__icon.line
                : { icon : this.BLANK });
      }

      var bLastChild = node.lastChild[node.lastChild.length - 1];

      // Is this a branch node that does not have the open/close button hidden?
      if (node.type == qx.ui.treevirtual.SimpleTreeDataModel.Type.BRANCH &&
          ! node.bHideOpenClose)
      {
        // Does this node have any children, or do we always want the
        // open/close symbol to be shown?
        if (node.children.length > 0 || bAlwaysShowOpenCloseSymbol)
        {
          // If we're not showing tree lines...
          if (!bUseTreeLines)
          {
            // ... then just use an expand or contract
            return (node.bOpened
                    ? STDCR.__icon.contract
                    : STDCR.__icon.expand);
          }

          // Are we looking at a top-level, first child of its parent?
          if (column == 0 && node.bFirstChild)
          {
            // Yup.  If it's also a last child...
            if (bLastChild)
            {
              // ... then use no tree lines.
              return (node.bOpened
                      ? STDCR.__icon.onlyContract
                      : STDCR.__icon.onlyExpand);
            }
            else
            {
              // otherwise, use descender lines but no ascender.
              return (node.bOpened
                      ? STDCR.__icon.startContract
                      : STDCR.__icon.startExpand);
            }
          }

          // It's not a top-level, first child.  Is this the last child of its
          // parent?
          if (bLastChild)
          {
            // Yup.  Return an ending expand or contract.
            return (node.bOpened
                    ? STDCR.__icon.endContract
                    : STDCR.__icon.endExpand);
          }

          // Otherwise, return a crossing expand or contract.
          return (node.bOpened
                  ? STDCR.__icon.crossContract
                  : STDCR.__icon.crossExpand);
        }
      }

      // This node does not have any children.  Return an end or cross, if
      // we're using tree lines.
      if (bUseTreeLines)
      {
        // If this is a child of the root node...
        if (node.parentNodeId == 0)
        {
          // If this is the only child...
          if (bLastChild && node.bFirstChild)
          {
            // ... then return a blank.
            return { icon : this.BLANK };
          }

          // Otherwise, if this is the last child...
          if (bLastChild)
          {
            // ... then return an end line.
            return STDCR.__icon.end;
          }

          // Otherwise if this is the first child and is a branch...
          if (node.bFirstChild &&
              node.type == qx.ui.treevirtual.SimpleTreeDataModel.Type.BRANCH)
          {
            // ... then return a start line.
            return (node.bOpened
                    ? STDCR.__icon.startContract
                    : STDCR.__icon.startExpand);
          }
        }

        // If this is a last child, return and ending line; otherwise cross.
        return (bLastChild
                ? STDCR.__icon.end
                : STDCR.__icon.cross);
      }

      return { icon : this.BLANK };
    }
  },

  destruct : function() {
    this.__am = this.__rm = this.__tm = null;
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2007 Derrell Lipman

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Derrell Lipman (derrell)

************************************************************************ */

/**
 * The default data cell renderer for a virtual tree (columns other than the
 * tree column)
 */
qx.Class.define("qx.ui.treevirtual.DefaultDataCellRenderer",
{
  extend : qx.ui.table.cellrenderer.Default
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2007 Derrell Lipman

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Derrell Lipman (derrell)

************************************************************************ */

/**
 * A data row renderer for a simple tree row
 */
qx.Class.define("qx.ui.treevirtual.SimpleTreeDataRowRenderer",
{
  extend : qx.ui.table.rowrenderer.Default,




  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  construct : function() {
    this.base(arguments);
  },




  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    // overridden
    updateDataRowElement : function(rowInfo, rowElem)
    {
      // If the node is selected, select the row
      var tree = rowInfo.table;
      var rowData = rowInfo.rowData;
      var tableModel = tree.getTableModel();
      var treeCol = tableModel.getTreeColumn();
      var node = rowData[treeCol];

      // Set the row's selected state based on the data model
      rowInfo.selected = node.bSelected;

      if (node.bSelected)
      {
        // Ensure that the selection model knows it's selected
        var row = rowInfo.row;
        tree.getSelectionModel()._addSelectionInterval(row, row);
      }

      // Now call our superclass
      this.base(arguments, rowInfo, rowElem);
    }
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2007 Derrell Lipman

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Derrell Lipman (derrell)

************************************************************************ */

/**
 * A selection manager. This is a helper class that handles all selection
 * related events and updates a SelectionModel.
 * <p>
 * This Selection Manager differs from its superclass in that we do not want
 * rows to be selected when moving around with the keyboard.
 */
qx.Class.define("qx.ui.treevirtual.SelectionManager",
{
  extend : qx.ui.table.selection.Manager,




  /**
   * @param table {qx.ui.table.Table}
   *    The table whose selections are being managed
   */
  construct : function(table)
  {
    this.base(arguments);

    this.__table = table;
  },



  members :
  {
    __table : null,


    /**
     * Getter for the table being managed
     *
     * @return {qx.ui.table.Table}
     *   Table being managed
     */
    getTable : function()
    {
      return this.__table;
    },


    /**
     * Handles a select event.  First we determine if the click was on the
     * open/close button and toggle the opened/closed state as necessary.
     * Then, if the click was not on the open/close button or if the table's
     * "openCloseClickSelectsRow" property so indicates, call our superclass to
     * handle the actual row selection.
     *
     * @param index {Integer} the index the event is pointing at.
     * @param evt {Map} the mouse event.
     */
    _handleSelectEvent : function(index, evt)
    {
      var _this = this;

      function handleButtonClick(tree, index, evt)
      {
        // Get the data model
        var dataModel = tree.getDataModel();

        // Determine the column containing the tree
        var treeCol = dataModel.getTreeColumn();

        // Get the focused column
        var focusedCol = tree.getFocusedColumn();

        // If the click is not in the tree column, ...
        if (focusedCol != treeCol)
        {
          // ... then let the Table selection manager deal with it
          return false;
        }

        // If the cell hasn't been focused automatically...
        if (evt instanceof qx.event.type.Mouse)
        {
          if (! tree.getFocusCellOnPointerMove())
          {
            // ... then focus it now so we can determine the node to open/close
            var scrollers = tree._getPaneScrollerArr();

            for (var i=0; i<scrollers.length; i++)
            {
              scrollers[i]._focusCellAtPagePos(evt.getViewportLeft(),
                                               evt.getViewportTop());
            }
          }
        }

        // Get the node to which this event applies
        var node = dataModel.getNode(tree.getFocusedRow());

        if (!node) {
          return false;
        }

        // Was this a mouse event?
        if (evt instanceof qx.event.type.Mouse)
        {
          // Yup.  Get the order of the columns
          var tcm = tree.getTableColumnModel();
          var columnPositions = tcm._getColToXPosMap();

          // Calculate the position of the beginning of the tree column
          var left = qx.bom.element.Location.getLeft(
            tree.getContentElement().getDomElement());

          for (var i=0; i<columnPositions[treeCol].visX; i++) {
            left += tcm.getColumnWidth(columnPositions[i].visX);
          }

          // Was the click on the open/close button?  That button begins at
          // (node.level - 1) * (rowHeight + 3) + 2 (the latter for padding),
          // and has width (rowHeight + 3). We add a bit of latitude to that.
          var x = evt.getViewportLeft();
          var latitude = 2;
          var rowHeight = _this.__table.getRowHeight();
          var buttonPos = left + (node.level - 1) * (rowHeight + 3) + 2;

          if (x >= buttonPos - latitude && x <= buttonPos + rowHeight + 3 + latitude)
          {
            // Yup.  Toggle the opened state for this node.
            dataModel.setState(node, { bOpened : ! node.bOpened });
            return tree.getOpenCloseClickSelectsRow() ? false : true;
          }
          else
          {
            return _this._handleExtendedClick(tree, evt, node, left);
          }
        }
        else
        {
          // See which key generated the event
          var identifier = evt.getKeyIdentifier();

          switch(identifier)
          {
            case "Space":
              // This should only select the row, not toggle the opened state
              return false;

            case "Enter":
              // Toggle the open state if open/close is allowed
              if (!node.bHideOpenClose &&
                  node.type != qx.ui.treevirtual.SimpleTreeDataModel.Type.LEAF)
              {
                dataModel.setState(node, { bOpened : ! node.bOpened });
              }

              return tree.getOpenCloseClickSelectsRow() ? false : true;

            default:
              // Unrecognized key.  Ignore it.
              return true;
          }
        }
      }

      // Call our local method to toggle the open/close state, if necessary
      var bNoSelect = handleButtonClick(this.__table, index, evt);

      // If we haven't been told not to do the selection...
      if (!bNoSelect)
      {
        // then call the superclass to handle it.
        this.base(arguments, index, evt);
      }
    },

    /**
     * Handle a mouse click event that is not normally handled by the simple
     * tree.  This is intended for more sophisticated trees where clicks in
     * different places, e.g. on various icons or on the label itself, should
     * be handled specially.
     *
     * @param tree {qx.ui.treevirtual.TreeVirtual}
     *   The tree on which the event has occurred.
     *
     * @param evt {Map}
     *   The mouse event.  Of particular interest is evt.getViewportLeft()
     *   which is the horizontal offset from the left border of the click.
     *
     * @param node {Map}
     *   The node which the tree row is displaying
     *
     * @param left {Integer}
     *   The offset from the left, of the beginning of the tree column.
     *
     * @return {Boolean}
     *   <i>true</i> if the row should be prevented from being selected;
     *   <i>false</i> otherwise.
     */
    _handleExtendedClick : function(tree, evt, node, left)
    {
      return false;
    }
  },

  destruct : function() {
    this.__table = null;
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2007 Derrell Lipman

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Derrell Lipman (derrell)

************************************************************************ */

/**
 * A table column model that automatically resizes columns based on a
 * selected behavior.
 *
 * @see qx.ui.table.columnmodel.Basic
 */
qx.Class.define("qx.ui.table.columnmodel.Resize",
{
  extend : qx.ui.table.columnmodel.Basic,
  include : qx.locale.MTranslation,



  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  construct : function()
  {
    this.base(arguments);

    // We don't want to recursively call ourself based on our resetting of
    // column sizes.  Track when we're resizing.
    this.__bInProgress = false;

    // Track when the table has appeared.  We want to ignore resize events
    // until then since we won't be able to determine the available width
    // anyway.
    this.__bAppeared = false;
  },




  /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */

  properties :
  {
    /**
     * The behavior to use.
     *
     * The provided behavior must extend {@link qx.ui.table.columnmodel.resizebehavior.Abstract} and
     * implement the <i>onAppear</i>, <i>onTableWidthChanged</i>,
     * <i>onColumnWidthChanged</i> and <i>onVisibilityChanged</i>methods.
     */
    behavior :
    {
      check : "qx.ui.table.columnmodel.resizebehavior.Abstract",
      init : null,
      nullable : true,
      apply : "_applyBehavior",
      event : "changeBehavior"
    }
  },




  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    __bAppeared : null,
    __bInProgress : null,
    __table : null,


    // Behavior modifier
    _applyBehavior : function(value, old)
    {
      if (old != null)
      {
        old.dispose();
        old = null;
      }

      // Tell the new behavior how many columns there are
      value._setNumColumns(this.getOverallColumnCount());
      value.setTableColumnModel(this);
    },


    /**
     * Initializes the column model.
     *
     * @param numColumns {Integer} the number of columns the model should have.
     * @param table {qx.ui.table.Table}
     *   The table which this model is used for. This allows us access to
     *   other aspects of the table, as the <i>behavior</i> sees fit.
     */
    init : function(numColumns, table)
    {
      // Call our superclass
      this.base(arguments, numColumns, table);

      if (this.__table == null)
      {
        this.__table = table;
        // We'll do our column resizing when the table appears, ...
        table.addListener("appear", this._onappear, this);

        // ... when the inner width of the table changes, ...
        table.addListener("tableWidthChanged", this._onTableWidthChanged, this);

        // ... when a vertical scroll bar appears or disappears
        table.addListener(
          "verticalScrollBarChanged",
          this._onverticalscrollbarchanged,
          this
        );

        // We want to manipulate the button visibility menu
        table.addListener(
          "columnVisibilityMenuCreateEnd",
          this._addResetColumnWidthButton,
          this
        );

        // ... when columns are resized, ...
        this.addListener("widthChanged", this._oncolumnwidthchanged, this );

        // ... and when a column visibility changes.
        this.addListener("visibilityChanged", this._onvisibilitychanged, this);
      }

      // Set the initial resize behavior
      if (this.getBehavior() == null) {
        this.setBehavior(new qx.ui.table.columnmodel.resizebehavior.Default());
      }

      // Tell the behavior how many columns there are
      this.getBehavior()._setNumColumns(numColumns);
    },


    /**
     * Get the table widget
     *
     * @return {qx.ui.table.Table} the table widget
     */
    getTable : function() {
      return this.__table;
    },


    /**
     * Reset the column widths to their "onappear" defaults.
     *
     * @param event {qx.event.type.Data}
     *   The "columnVisibilityMenuCreateEnd" event indicating that the menu is
     *   being generated.  The data is a map containing properties <i>table</i>
     *   and <i>menu</i>.
     *
     */
    _addResetColumnWidthButton : function(event)
    {
      var data = event.getData();
      var columnButton = data.columnButton;
      var menu = data.menu;
      var o;

      // Add a separator between the column names and our reset button
      o = columnButton.factory("separator");
      menu.add(o);

      // Add a button to reset the column widths
      o = columnButton.factory("user-button",
                               {
                                 text : this.tr("Reset column widths")
                               });
      menu.add(o);
      o.addListener("execute", this._onappear, this);
    },


    /**
     * Event handler for the "appear" event.
     *
     * @param event {qx.event.type.Event}
     *   The "onappear" event object.
     *
     */
    _onappear : function(event)
    {
      // Is this a recursive call?
      if (this.__bInProgress)
      {
        // Yup.  Ignore it.
        return ;
      }

      this.__bInProgress = true;

      if (qx.core.Environment.get("qx.debug"))
      {
        if (qx.core.Environment.get("qx.tableResizeDebug"))
        {
          this.debug("onappear");
        }
      }

      // this handler is also called by the "execute" event of the menu button
      this.getBehavior().onAppear(event, event.getType() !== "appear");

      this.__table._updateScrollerWidths();
      this.__table._updateScrollBarVisibility();

      this.__bInProgress = false;

      this.__bAppeared = true;
    },


    /**
     * Event handler for the "tableWidthChanged" event.
     *
     * @param event {qx.event.type.Event}
     *   The "onwindowresize" event object.
     *
     */
    _onTableWidthChanged : function(event)
    {
      // Is this a recursive call or has the table not yet been rendered?
      if (this.__bInProgress || !this.__bAppeared)
      {
        // Yup.  Ignore it.
        return;
      }

      this.__bInProgress = true;

      if (qx.core.Environment.get("qx.debug"))
      {
        if (qx.core.Environment.get("qx.tableResizeDebug"))
        {
          this.debug("ontablewidthchanged");
        }
      }

      this.getBehavior().onTableWidthChanged(event);
      this.__bInProgress = false;
    },


    /**
     * Event handler for the "verticalScrollBarChanged" event.
     *
     * @param event {qx.event.type.Data}
     *   The "verticalScrollBarChanged" event object.  The data is a boolean
     *   indicating whether a vertical scroll bar is now present.
     *
     */
    _onverticalscrollbarchanged : function(event)
    {
      // Is this a recursive call or has the table not yet been rendered?
      if (this.__bInProgress || !this.__bAppeared)
      {
        // Yup.  Ignore it.
        return;
      }

      this.__bInProgress = true;

      if (qx.core.Environment.get("qx.debug"))
      {
        if (qx.core.Environment.get("qx.tableResizeDebug"))
        {
          this.debug("onverticalscrollbarchanged");
        }
      }

      this.getBehavior().onVerticalScrollBarChanged(event);

      qx.event.Timer.once(function()
      {
        if (this.__table && !this.__table.isDisposed())
        {
          this.__table._updateScrollerWidths();
          this.__table._updateScrollBarVisibility();
        }
      }, this, 0);

      this.__bInProgress = false;
    },


    /**
     * Event handler for the "widthChanged" event.
     *
     * @param event {qx.event.type.Data}
     *   The "widthChanged" event object.
     *
     */
    _oncolumnwidthchanged : function(event)
    {
      // Is this a recursive call or has the table not yet been rendered?
      if (this.__bInProgress || !this.__bAppeared)
      {
        // Yup.  Ignore it.
        return;
      }

      this.__bInProgress = true;

      if (qx.core.Environment.get("qx.debug"))
      {
        if (qx.core.Environment.get("qx.tableResizeDebug"))
        {
          this.debug("oncolumnwidthchanged");
        }
      }

      this.getBehavior().onColumnWidthChanged(event);
      this.__bInProgress = false;
    },


    /**
     * Event handler for the "visibilityChanged" event.
     *
     * @param event {qx.event.type.Data}
     *   The "visibilityChanged" event object.
     *
     */
    _onvisibilitychanged : function(event)
    {
      // Is this a recursive call or has the table not yet been rendered?
      if (this.__bInProgress || !this.__bAppeared)
      {
        // Yup.  Ignore it.
        return;
      }

      this.__bInProgress = true;

      if (qx.core.Environment.get("qx.debug"))
      {
        if (qx.core.Environment.get("qx.tableResizeDebug"))
        {
          this.debug("onvisibilitychanged");
        }
      }

      this.getBehavior().onVisibilityChanged(event);
      this.__bInProgress = false;
    }
  },


 /*
  *****************************************************************************
     DESTRUCTOR
  *****************************************************************************
  */

  destruct : function() {
    this.__table = null;
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2007-2008 Derrell Lipman

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Derrell Lipman (derrell)
     * Fabian Jakobs (fjakobs)

************************************************************************ */

/**
 * All of the resizing information about a column.
 *
 *  This is used internally by qx.ui.table and qx.ui.progressive's table and
 *  may be used for other widgets as well.
 */
qx.Class.define("qx.ui.core.ColumnData",
{
  extend : qx.ui.core.LayoutItem,


  construct : function()
  {
    this.base(arguments);
    this.setColumnWidth("auto");
  },


  members :
  {
    __computedWidth : null,


    // overridden
    renderLayout : function(left, top, width, height) {
      this.__computedWidth = width;
    },


    /**
     * Get the computed width of the column.
     * @return {Integer} Computed column width
     */
    getComputedWidth : function() {
      return this.__computedWidth;
    },


    /**
     * Get the column's flex value
     *
     * @return {Integer} The column's flex value
     */
    getFlex : function()
    {
      return this.getLayoutProperties().flex || 0;
    },


    /**
     * Set the column width. The column width can be one of the following
     * values:
     *
     * * Pixels: e.g. <code>23</code>
     * * Autosized: <code>"auto"</code>
     * * Flex: e.g. <code>"1*"</code>
     * * Percent: e.g. <code>"33%"</code>
     *
     * @param width {Integer|String} The column width
     * @param flex {Integer?0} Optional flex value of the column
     */
    setColumnWidth : function(width, flex)
    {
      var flex = flex || 0;
      var percent = null;

      if (typeof width == "number")
      {
        this.setWidth(width);
      }
      else if (typeof width == "string")
      {
        if (width == "auto") {
          flex = 1;
        }
        else
        {
          var match = width.match(/^[0-9]+(?:\.[0-9]+)?([%\*])$/);
          if (match)
          {
            if (match[1] == "*") {
              flex = parseFloat(width);
            } else {
              percent = width;
            }
          }
        }
      }
      this.setLayoutProperties({
        flex: flex,
        width: percent
      });
    }
  },

  environment :
  {
    "qx.tableResizeDebug" : false
  }
})
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2007 Derrell Lipman

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Derrell Lipman (derrell)

************************************************************************ */

/**
 * An abstract resize behavior.  All resize behaviors should extend this
 * class.
 */
qx.Class.define("qx.ui.table.columnmodel.resizebehavior.Abstract",
{
  type : "abstract",
  extend : qx.core.Object,



  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    /**
     * Called when the ResizeTableColumnModel is initialized, and upon loading of
     * a new TableModel, to allow the Resize Behaviors to know how many columns
     * are in use.
     *
     * @abstract
     * @param numColumns {Integer} The numbrer of columns in use.
     * @throws {Error} the abstract function warning.
     */
    _setNumColumns : function(numColumns) {
      throw new Error("_setNumColumns is abstract");
    },


    /**
     * Called when the table has first been rendered.
     *
     * @abstract
     * @param event {var} The <i>onappear</i> event object.
     * @param forceRefresh {Boolean?false} Whether a refresh should be forced
     * @throws {Error} the abstract function warning.
     */
    onAppear : function(event, forceRefresh) {
      throw new Error("onAppear is abstract");
    },


    /**
     * Called when the table width changes due to either a window size change
     * or a parent object changing size causing the table to change size.
     *
     * @abstract
     * @param event {var} The <i>tableWidthChanged</i> event object.
     * @throws {Error} the abstract function warning.
     */
    onTableWidthChanged : function(event) {
      throw new Error("onTableWidthChanged is abstract");
    },


    /**
     * Called when the use of vertical scroll bar in the table changes, either
     * from present to not present, or vice versa.
     *
     * @abstract
     * @param event {var} The <i>verticalScrollBarChanged</i> event object.  This event has data,
     *     obtained via event.getValue(), which is a boolean indicating whether a
     *     vertical scroll bar is now present.
     * @throws {Error} the abstract function warning.
     */
    onVerticalScrollBarChanged : function(event) {
      throw new Error("onVerticalScrollBarChanged is abstract");
    },


    /**
     * Called when a column width is changed.
     *
     * @abstract
     * @param event {var} The <i>widthChanged</i> event object.  This event has data, obtained via
     *     event.getValue(), which is an object with three properties: the column
     *     which changed width (data.col), the old width (data.oldWidth) and the new
     *     width (data.newWidth).
     * @throws {Error} the abstract function warning.
     */
    onColumnWidthChanged : function(event) {
      throw new Error("onColumnWidthChanged is abstract");
    },


    /**
     * Called when a column visibility is changed.
     *
     * @abstract
     * @param event {var} The <i>visibilityChanged</i> event object.  This event has data, obtained
     *     via event.getValue(), which is an object with two properties: the column
     *     which changed width (data.col) and the new visibility of the column
     *     (data.visible).
     * @throws {Error} the abstract function warning.
     */
    onVisibilityChanged : function(event) {
      throw new Error("onVisibilityChanged is abstract");
    },

    /**
     * Determine the inner width available to columns in the table.
     *
     * @return {Integer} The available width
     */
    _getAvailableWidth : function()
    {
      var tableColumnModel = this.getTableColumnModel();

      // Get the inner width off the table
      var table = tableColumnModel.getTable();

      var scrollerArr = table._getPaneScrollerArr();
      if (!scrollerArr[0] || !scrollerArr[0].getLayoutParent().getBounds()) {
        return null;
      };
      var scrollerParentWidth = scrollerArr[0].getLayoutParent().getBounds().width;

      var lastScroller = scrollerArr[scrollerArr.length-1];
      scrollerParentWidth -= lastScroller.getPaneInsetRight();

      return scrollerParentWidth;
    }
  }});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2007 Derrell Lipman

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Derrell Lipman (derrell)

************************************************************************ */

/**
 * The default resize behavior.  Until a resize model is loaded, the default
 * behavior is to:
 * <ol>
 *   <li>
 *     Upon the table initially appearing, and upon any window resize, divide
 *     the table space equally between the visible columns.
 *   </li>
 *   <li>
 *     When a column is increased in width, all columns to its right are
 *     pushed to the right with no change to their widths.  This may push some
 *     columns off the right edge of the table, causing a horizontal scroll
 *     bar to appear.
 *   </li>
 *   <li>
 *     When a column is decreased in width, if the total width of all columns
 *     is <i>greater than</i> the table width, no additional column width
 *     change is made.
 *   </li>
 *   <li>
 *     When a column is decreased in width, if the total width of all columns
 *     is <i>less than</i> the table width, the visible column
 *     immediately to the right of the column which decreased in width has its
 *     width increased to fill the remaining space.
 *   </li>
 * </ol>
 *
 * A resize model may be loaded to provide more guidance on how to adjust
 * column width upon each of the events: initial appear, window resize, and
 * column resize. *** TO BE FILLED IN ***
 *
 * @require(qx.ui.core.ColumnData)
 */
qx.Class.define("qx.ui.table.columnmodel.resizebehavior.Default",
{
  extend : qx.ui.table.columnmodel.resizebehavior.Abstract,


  construct : function()
  {
    this.base(arguments);

    this.__resizeColumnData = [];

    // This layout is not connected to a widget but to this class. This class
    // must implement the method "getLayoutChildren", which must return all
    // columns (LayoutItems) which should be recalcutated. The call
    // "layout.renderLayout" will call the method "renderLayout" on each column
    // data object
    // The advantage of the use of the normal layout manager is that the
    // samantics of flex and percent are exectly the same as in the widget code.
    this.__layout = new qx.ui.layout.HBox();
    this.__layout.connectToWidget(this);

    this.__deferredComputeColumnsFlexWidth = new qx.util.DeferredCall(
      this._computeColumnsFlexWidth, this
    );
  },


  /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */

  properties :
  {
    /**
     * A function to instantiate a resize behavior column data object.
     */
    newResizeBehaviorColumnData :
    {
      check : "Function",
      init : function(obj)
      {
        return new qx.ui.core.ColumnData();
      }
    },

    /**
     * Whether to reinitialize default widths on each appear event.
     * Typically, one would want to initialize the default widths only upon
     * the first appearance of the table, but the original behavior was to
     * reinitialize it even if the table is hidden and then reshown
     * (e.g. it's in a pageview and the page is switched and then switched
     * back).
     */
    initializeWidthsOnEveryAppear :
    {
      check : "Boolean",
      init  : false
    },

    /**
     * The table column model in use.  Of particular interest is the method
     * <i>getTable</i> which is a reference to the table widget.  This allows
     * access to any other features of the table, for use in calculating widths
     * of columns.
     */
    tableColumnModel :
    {
      check : "qx.ui.table.columnmodel.Resize"
    }
  },




  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    __layout : null,
    __layoutChildren : null,
    __resizeColumnData : null,
    __deferredComputeColumnsFlexWidth : null,

    /**
     * Whether we have initialized widths on the first appear yet
     */
    __widthsInitialized : false,

    /**
     * Set the width of a column.
     *
     * @param col {Integer} The column whose width is to be set
     *
     * @param width {Integer|String}
     *   The width of the specified column.  The width may be specified as
     *   integer number of pixels (e.g. 100), a string representing percentage
     *   of the inner width of the Table (e.g. "25%"), or a string
     *   representing a flex width (e.g. "1*").
     *
     * @param flex {Integer?0} Optional flex value of the column
     *
     * @throws {Error}
     *   Error is thrown if the provided column number is out of the range.
     */
    setWidth : function(col, width, flex)
    {
      // Ensure the column is within range
      if (col >= this.__resizeColumnData.length) {
        throw new Error("Column number out of range");
      }

      // Set the new width
      this.__resizeColumnData[col].setColumnWidth(width, flex);
      this.__deferredComputeColumnsFlexWidth.schedule();
    },


    /**
     * Set the minimum width of a column.
     *
     * @param col {Integer}
     *   The column whose minimum width is to be set
     *
     * @param width {Integer}
     *   The minimum width of the specified column.
     *
     *
     * @throws {Error}
     *   Error is thrown if the provided column number is out of the range.
     */
    setMinWidth : function(col, width)
    {
      // Ensure the column is within range
      if (col >= this.__resizeColumnData.length)
      {
        throw new Error("Column number out of range");
      }

      // Set the new width
      this.__resizeColumnData[col].setMinWidth(width);
      this.__deferredComputeColumnsFlexWidth.schedule();
    },


    /**
     * Set the maximum width of a column.
     *
     * @param col {Integer}
     *   The column whose maximum width is to be set
     *
     * @param width {Integer}
     *   The maximum width of the specified column.
     *
     *
     * @throws {Error}
     *   Error is thrown if the provided column number is out of the range.
     */
    setMaxWidth : function(col, width)
    {
      // Ensure the column is within range
      if (col >= this.__resizeColumnData.length) {
        throw new Error("Column number out of range");
      }

      // Set the new width
      this.__resizeColumnData[col].setMaxWidth(width);
      this.__deferredComputeColumnsFlexWidth.schedule();
    },


    /**
     * Set any or all of the width, minimum width, and maximum width of a
     * column in a single call.
     *
     * @param col {Integer}
     *   The column whose attributes are to be changed
     *
     * @param map {Map}
     *   A map containing any or all of the property names "width", "minWidth",
     *   and "maxWidth".  The property values are as described for
     *   {@link #setWidth}, {@link #setMinWidth} and {@link #setMaxWidth}
     *   respectively.
     *
     *
     * @throws {Error}
     *   Error is thrown if the provided column number is out of the range.
     */
    set : function(col, map)
    {
      for (var prop in map)
      {
        switch(prop)
        {
          case "width":
            this.setWidth(col, map[prop]);
            break;

          case "minWidth":
            this.setMinWidth(col, map[prop]);
            break;

          case "maxWidth":
            this.setMaxWidth(col, map[prop]);
            break;

          default:
            throw new Error("Unknown property: " + prop);
        }
      }
    },

    // overloaded
    onAppear : function(event, forceRefresh)
    {
      // If we haven't initialized widths at least once, or
      // they want us to reinitialize widths on every appear event...
      if (forceRefresh === true || !this.__widthsInitialized || this.getInitializeWidthsOnEveryAppear())
      {
        // Calculate column widths
        this._computeColumnsFlexWidth();

        // Track that we've initialized widths at least once
        this.__widthsInitialized = true;
      }
    },

    // overloaded
    onTableWidthChanged : function(event) {
      this._computeColumnsFlexWidth();
    },

    // overloaded
    onVerticalScrollBarChanged : function(event) {
      this._computeColumnsFlexWidth();
    },

    // overloaded
    onColumnWidthChanged : function(event)
    {
      // Extend the next column to fill blank space
      this._extendNextColumn(event);
    },

    // overloaded
    onVisibilityChanged : function(event)
    {
      // Event data properties: col, visible
      var data = event.getData();

      // If a column just became visible, resize all columns.
      if (data.visible)
      {
        this._computeColumnsFlexWidth();
        return;
      }

      // Extend the last column to fill blank space
      this._extendLastColumn(event);
    },

    // overloaded
    _setNumColumns : function(numColumns)
    {
      var colData = this.__resizeColumnData;
      // Are there now fewer (or the same number of) columns than there were
      // previously?
      if (numColumns <= colData.length)
      {
        // Yup.  Delete the extras.
        colData.splice(numColumns, colData.length);
        return;
      }

      // There are more columns than there were previously.  Allocate more.
      for (var i=colData.length; i<numColumns; i++)
      {
        colData[i] = this.getNewResizeBehaviorColumnData()();
        colData[i].columnNumber = i;
      }
    },


    /**
     * This method is required by the box layout. If returns an array of items
     * to relayout.
     *
     * @return {qx.ui.core.ColumnData[]} The list of column data object to layout.
     */
    getLayoutChildren : function() {
      return this.__layoutChildren;
    },


    /**
     * Computes the width of all flexible children.
     *
     */
    _computeColumnsFlexWidth : function()
    {
      this.__deferredComputeColumnsFlexWidth.cancel();
      var width = this._getAvailableWidth();

      if (width === null) {
        return;
      }

      var tableColumnModel = this.getTableColumnModel();
      var visibleColumns = tableColumnModel.getVisibleColumns();
      var visibleColumnsLength = visibleColumns.length;
      var colData = this.__resizeColumnData;
      var i, l;

      if (visibleColumnsLength === 0) {
        return;
      }

      // Create an array of the visible columns
      var columns = [ ];
      for (i=0; i<visibleColumnsLength; i++)
      {
        columns.push(colData[visibleColumns[i]]);
      }
      this.__layoutChildren = columns;
      this.__clearLayoutCaches();

      // Use a horizontal box layout to determine the available width.
      this.__layout.renderLayout(width, 100, {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      });

      // Now that we've calculated the width, set it.
      for (i=0,l=columns.length; i<l; i++)
      {
        var colWidth = columns[i].getComputedWidth();
        tableColumnModel.setColumnWidth(visibleColumns[i], colWidth);
      }
    },


    /**
     * Clear all layout caches of the column datas.
     */
    __clearLayoutCaches : function()
    {
      this.__layout.invalidateChildrenCache();
      var children = this.__layoutChildren;
      for (var i=0,l=children.length; i<l; i++) {
        children[i].invalidateLayoutCache();
      }
    },


    /**
     * Extend the visible column to right of the column which just changed
     * width, to fill any available space within the inner width of the table.
     * This means that if the sum of the widths of all columns exceeds the
     * inner width of the table, no change is made.  If, on the other hand,
     * the sum of the widths of all columns is less than the inner width of
     * the table, the visible column to the right of the column which just
     * changed width is extended to take up the width available within the
     * inner width of the table.
     *
     *
     * @param event {qx.event.type.Data}
     *   The event object.
     *
     */
    _extendNextColumn : function(event)
    {
      var tableColumnModel = this.getTableColumnModel();

      // Event data properties: col, oldWidth, newWidth
      var data = event.getData();

      var visibleColumns = tableColumnModel.getVisibleColumns();

      // Determine the available width
      var width = this._getAvailableWidth();

      // Determine the number of visible columns
      var numColumns = visibleColumns.length;

      // Did this column become longer than it was?
      if (data.newWidth > data.oldWidth)
      {
        // Yup.  Don't resize anything else.  The other columns will just get
        // pushed off and require scrollbars be added (if not already there).
        return ;
      }

      // This column became shorter.  See if we no longer take up the full
      // space that's available to us.
      var i;
      var nextCol;
      var widthUsed = 0;

      for (i=0; i<numColumns; i++) {
        widthUsed += tableColumnModel.getColumnWidth(visibleColumns[i]);
      }

      // If the used width is less than the available width...
      if (widthUsed < width)
      {
        // ... then determine the next visible column
        for (i=0; i<visibleColumns.length; i++)
        {
          if (visibleColumns[i] == data.col)
          {
            nextCol = visibleColumns[i + 1];
            break;
          }
        }

        if (nextCol)
        {
          // Make the next column take up the available space.
          var newWidth =
            (width - (widthUsed - tableColumnModel.getColumnWidth(nextCol)));
          tableColumnModel.setColumnWidth(nextCol, newWidth);
        }
      }
    },


    /**
     * If a column was just made invisible, extend the last column to fill any
     * available space within the inner width of the table.  This means that
     * if the sum of the widths of all columns exceeds the inner width of the
     * table, no change is made.  If, on the other hand, the sum of the widths
     * of all columns is less than the inner width of the table, the last
     * column is extended to take up the width available within the inner
     * width of the table.
     *
     *
     * @param event {qx.event.type.Data}
     *   The event object.
     *
     */
    _extendLastColumn : function(event)
    {
      var tableColumnModel = this.getTableColumnModel();

      // Event data properties: col, visible
      var data = event.getData();

      // If the column just became visible, don't make any width changes
      if (data.visible)
      {
        return;
      }

      // Get the array of visible columns
      var visibleColumns = tableColumnModel.getVisibleColumns();

      // If no columns are visible...
      if (visibleColumns.length == 0)
      {
        return;
      }

      // Determine the available width
      var width = this._getAvailableWidth(tableColumnModel);

      // Determine the number of visible columns
      var numColumns = visibleColumns.length;

      // See if we no longer take up the full space that's available to us.
      var i;
      var lastCol;
      var widthUsed = 0;

      for (i=0; i<numColumns; i++) {
        widthUsed += tableColumnModel.getColumnWidth(visibleColumns[i]);
      }

      // If the used width is less than the available width...
      if (widthUsed < width)
      {
        // ... then get the last visible column
        lastCol = visibleColumns[visibleColumns.length - 1];

        // Make the last column take up the available space.
        var newWidth =
          (width - (widthUsed - tableColumnModel.getColumnWidth(lastCol)));
        tableColumnModel.setColumnWidth(lastCol, newWidth);
      }
    },


    /**
     * Returns an array of the resizing information of a column.
     *
     * @return {qx.ui.core.ColumnData[]} array of the resizing information of a column.
     */
    _getResizeColumnData : function()
    {
      return this.__resizeColumnData;
    }
  },




  /*
  *****************************************************************************
     DESTRUCTOR
  *****************************************************************************
  */

  destruct : function()
  {
    this.__resizeColumnData = this.__layoutChildren = null;
    this._disposeObjects("__layout", "__deferredComputeColumnsFlexWidth");
  }
});
