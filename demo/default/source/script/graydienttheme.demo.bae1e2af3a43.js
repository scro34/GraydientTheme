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
     * Christian Hagendorn (chris_schmidt)

************************************************************************ */

/**
 * The Flash widget embeds the HMTL Flash element
 */
qx.Class.define("qx.ui.embed.Flash",
{
  extend : qx.ui.core.Widget,


  /**
   * Constructs a flash widget.
   *
   * @param source {String} The URL of the Flash movie to display.
   * @param id {String?null} The unique id for the Flash movie.
   */
  construct : function(source, id)
  {
    this.base(arguments);

    if (qx.core.Environment.get("qx.debug"))
    {
      qx.core.Assert.assertString(source, "Invalid parameter 'source'.");

      if (id) {
        qx.core.Assert.assertString(id, "Invalid parameter 'id'.");
      }
    }

    this.setSource(source);

    if (id) {
      this.setId(id);
    } else {
      this.setId("flash" + this.toHashCode());
    }

    //init properties
    this.initQuality();
    this.initWmode();
    this.initAllowScriptAccess();
    this.initLiveConnect();

    // Creates the Flash DOM element (movie) on appear,
    // because otherwise IE 7 and higher blocks the
    // ExternelInterface from Flash.
    this.addListenerOnce("appear", function()
    {
      this._checkLoading();
      this.getContentElement().createFlash();
    }, this);
  },


  events :
  {
    /**
     * Fired when the flash object still is loading.
     *
     * The loading action can be prevented by calling
     * {@link qx.event.type.Event#preventDefault} on the event object
     */
    "loading" : "qx.event.type.Event",

    /**
     * Fired after the flash object has been loaded.
     *
     * The loaded action can be prevented by calling
     * {@link qx.event.type.Event#preventDefault} on the event object
     */
    "loaded" : "qx.event.type.Event",

    /**
     * Fired after the flash object has got a timeout.
     *
     * The timeout action can be prevented by calling
     * {@link qx.event.type.Event#preventDefault} on the event object
     */
    "timeout" : "qx.event.type.Event"
  },


  properties :
  {
    /**
     * The URL of the Flash movie.
     */
    source :
    {
      check : "String",
      apply : "_applySource"
    },

    /**
     * The unique Flash movie id.
     */
    id :
    {
      check : "String",
      apply : "_applyId"
    },

    /**
     * Set the quality attribute for the Flash movie.
     */
    quality :
    {
      check : ["low", "autolow", "autohigh", "medium", "high", "best"],
      init : "best",
      nullable : true,
      apply : "_applyQuality"
    },

    /**
     * Set the scale attribute for the Flash movie.
     */
    scale :
    {
      check : ["showall", "noborder", "exactfit", "noscale"],
      nullable : true,
      apply : "_applyScale"
    },

    /**
     * Set the wmode attribute for the Flash movie.
     */
    wmode :
    {
      check : ["window", "opaque", "transparent"],
      init : "opaque",
      nullable : true,
      apply : "_applyWmode"
    },

    /**
     * Set the play attribute for the Flash movie.
     */
    play :
    {
      check : "Boolean",
      nullable : true,
      apply : "_applyPlay"
    },

    /**
     * Set the loop attribute for the Flash movie.
     */
    loop :
    {
      check : "Boolean",
      nullable : true,
      apply : "_applyLoop"
    },

    /**
     * Set the mayscript attribute for the Flash movie.
     */
    mayScript :
    {
      check : "Boolean",
      nullable : false,
      apply : "_applyMayScript"
    },

    /**
     * Set the menu attribute for the Flash movie.
     */
    menu :
    {
      check : "Boolean",
      nullable : true,
      apply : "_applyMenu"
    },

    /**
     * Set allow script access
     **/
    allowScriptAccess :
    {
      check : ["sameDomain", "always", "never"],
      init : "sameDomain",
      nullable : true,
      apply : "_applyAllowScriptAccess"
    },

    /**
     * Enable/disable live connection
     **/
    liveConnect :
    {
      check : "Boolean",
      init : true,
      nullable : true,
      apply : "_applyLiveConnect"
    },

    /**
     * Set the 'FlashVars' to pass variables to the Flash movie.
     */
    variables :
    {
      init : {},
      check : "Map",
      apply : "_applyVariables"
    },

    /**
     * A timeout when trying to load the flash source.
     */
    loadTimeout :
    {
      check : "Integer",
      init : 10000
    }
  },


  members :
  {
    /** @type {Integer} The time stamp when the loading begins. */
    __time : null,


    /*
    ---------------------------------------------------------------------------
      PUBLIC WIDGET API
    ---------------------------------------------------------------------------
    */

    /**
     * Returns the DOM element of the Flash movie.
     *
     * Note: If you call the method before the widget is rendered, it will
     * always return <code>null</code>. Therefore call the method after
     * the {@link #appear} event is fired.
     *
     * @return {Element|null} The DOM element of the Flash movie.
     */
    getFlashElement : function()
    {
      var element = this.getContentElement();

      if (element) {
        return element.getFlashElement();
      } else {
        return null;
      }
    },


    /**
     * Checks if the movie is loaded.
     *
     * @return {Boolean} <code>true</code> When the movie is completely loaded,
     *   otherwise <code>false</code>.
     */
    isLoaded : function() {
      return this.getPercentLoaded() === 100;
    },


    /**
     * Returns the current loaded state from the Flash movie.
     *
     * @return {Integer} The loaded percent value.
     */
    getPercentLoaded : function()
    {
      var flashFE = this.getFlashElement();

      // First make sure the movie is defined and has received a non-zero object id.
      if(typeof(flashFE) != "undefined" && flashFE != null)
      {
        try {
          return flashFE.PercentLoaded();
        }
        catch(err)
        {
          // Not an accessible function yet.
          return 0;
        }
      }
      else {
        return 0;
      }
    },


    // overridden
    _createContentElement : function() {
      var el = new qx.html.Flash();
      el.setAttribute("$$widget", this.toHashCode());
      return el;
    },

    /**
     * Checks the current loaded state and fires one of the defined events:
     * {@link #loading}, {@link #loaded} or {@link #timeout}.
     *
     * Note the {@link #timeout} event is fired when the check reached the
     * defined {@link #loadTimeout}.
     */
    _checkLoading : function()
    {
      var source = this.getSource();
      if(source != "" && source != null && source != "undefined")
      {
        if(!this.isLoaded())
        {
          if(!this.__time) {
            this.__time = new Date().getTime();
          }

          var timeDiff = new Date().getTime() - this.__time;

          if(this.getLoadTimeout() > timeDiff)
          {
            var timer = qx.util.TimerManager.getInstance();
            timer.start(this._checkLoading, 0, this, null, 10);

            this.fireEvent("loading");
          }
          else
          {
            if (qx.core.Environment.get("qx.debug")) {
              this.debug("Timeout after: " + timeDiff);
            }
            this.fireEvent("timeout");
            this.__time = null;
          }
        }
        else
        {
          this.fireEvent("loaded");
          this.__time = null;
        }
      }
    },


    /*
    ---------------------------------------------------------------------------
     APPLY METHODS
    ---------------------------------------------------------------------------
    */


    // property apply
    _applySource : function(value, old)
    {
      var source = qx.util.ResourceManager.getInstance().toUri(value);
      this.getContentElement().setSource(source);
      qx.ui.core.queue.Layout.add(this);
    },

    // property apply
    _applyId : function(value, old)
    {
      this.getContentElement().setId(value);
      qx.ui.core.queue.Layout.add(this);
    },

    // property apply
    _applyVariables : function(value, old)
    {
      this.getContentElement().setVariables(value);
      qx.ui.core.queue.Layout.add(this);
    },

    // property apply
    _applyMayScript : function (value, old)
    {
      this.getContentElement().setAttribute("mayscript", value ? "" : false);
      qx.ui.core.queue.Layout.add(this);
    },

    // property apply
    _applyQuality : function(value, old) {
      this.__flashParamHelper("quality", value);
    },

    // property apply
    _applyScale : function(value, old) {
      this.__flashParamHelper("scale", value);
    },

    // property apply
    _applyWmode : function(value, old) {
      this.__flashParamHelper("wmode", value);
    },

    // property apply
    _applyPlay : function(value, old) {
      this.__flashParamHelper("play", value);
    },

    // property apply
    _applyLoop : function(value, old) {
      this.__flashParamHelper("loop", value);
    },

    // property apply
    _applyMenu : function(value, old) {
      this.__flashParamHelper("menu", value);
    },

    // property apply
    _applyAllowScriptAccess : function(value, old) {
      this.__flashParamHelper("allowScriptAccess", value);
    },

    // property apply
    _applyLiveConnect : function(value, old) {
      this.__flashParamHelper("swLiveConnect", value);
    },

    /*
    ---------------------------------------------------------------------------
     HELPER METHODS
    ---------------------------------------------------------------------------
    */

    /**
     * Set the attribute for the Flash DOM element.
     *
     * @param key {String} Flash Player attribute name.
     * @param value {String?null} The value for the attribute, <code>null</code>
     *    if the attribut should be removed from the DOM element.
     */
    __flashParamHelper : function(key, value)
    {
      this.getContentElement().setParam(key, value);
      qx.ui.core.queue.Layout.add(this);
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
     * Christian Hagendorn (chris_schmidt)

************************************************************************ */

/**
 * Managed wrapper for the HTML Flash tag.
 */
qx.Class.define("qx.html.Flash",
{
  extend : qx.html.Element,


  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */


  /**
   * @param styles {Map?null} optional map of CSS styles, where the key is the name
   *    of the style and the value is the value to use.
   * @param attributes {Map?null} optional map of element attributes, where the
   *    key is the name of the attribute and the value is the value to use.
   */
  construct : function(styles, attributes)
  {
    this.base(arguments, "div", styles, attributes);

    this.__params = {};
    this.__variables = {};
    this.__attributes = {};
  },


  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {

    /** @type {Map} The attributes for the Flash movie. */
    __params : null,

    /** @type {Map} the attributes for the object tag */
    __attributes : null,

    /** @type {Map} The <code>FlashVars</code> to pass variables to the Flash movie. */
    __variables : null,

    /** @type {qx.bom.Flash} The DOM Flash element. */
    __flash : null,

    // overridden
    _createDomElement : function() {
      return qx.dom.Element.create("div");
    },

    /**
     * Creates the DOM Flash movie with all needed attributes and
     * <code>FlashVars</code>.
     */
    createFlash : function()
    {
      this.__flash = qx.bom.Flash.create(this.getDomElement(), this.getAttributes(),
                                         this.__variables, this.__params);
    },

    /**
     * Set the URL from the Flash movie to display.
     *
     * @param value {String} URL from the Flash movie.
     */
    setSource : function(value)
    {
      if (qx.core.Environment.get("qx.debug")) {
        qx.core.Assert.assertString(value, "Invalid attribute 'value'.");
      }

      if (this.__flash) {
        throw new Error("The source cannot be modified after initial creation");
      }

      this.setAttribute("movie", value);
    },

    /**
     * Set the URL from the Flash movie to display.
     *
     * @param value {String} URL from the Flash movie.
     */
    setId : function(value)
    {
      if (qx.core.Environment.get("qx.debug")) {
        qx.core.Assert.assertString(value, "Invalid attribute 'value'.");
      }

      if (this.__flash) {
        throw new Error("The id cannot be modified after initial creation");
      }

      this.setAttribute("id", value);
    },

    /**
     * Returns the <code>FlashVars</code> for the Flash movie.
     *
     * @return {Map} Map with key/value pairs for passing
     *    <code>FlashVars</code>}
     */
    getVariables : function() {
      return this.__variables;
    },

    /**
     * Set the <code>FlashVars</code> to pass variables to the Flash movie.
     *
     * @param value {Map} Map with key/value pairs for passing
     *    <code>FlashVars</code>
     */
    setVariables : function(value)
    {
      if (qx.core.Environment.get("qx.debug")) {
        qx.core.Assert.assertMap(value, "Invalid attribute 'value'.");
      }

      if (this.__flash) {
        throw new Error("The variables cannot be modified after initial creation");
      }

      this.__variables = value;
    },

    /**
     * Returns the attributes for the Flash DOM element.
     *
     * @return {Map} Attributes for the DOM element.
     */
    getAttributes : function () {
      return this.__attributes;
    },

    /**
     * Set an attribute for the Flash DOM element.
     *
     * @param key {String} Key name.
     * @param value {String|Boolean|null} Value or <code>null</code> to remove attribute.
     */
    setAttribute : function (key, value)
    {
      if (qx.core.Environment.get("qx.debug")) {
        qx.core.Assert.assertString(key, "Invalid attribute 'key'.");

        if (arguments.length > 1 && value !== null) {
          if (!qx.lang.Type.isBoolean(value) && !qx.lang.Type.isString(value)) {
            throw new Error("Invalid attribute 'value' expected String, Boolean or null.");
          }
        }
      }

      if (key == "$$widget" || key.indexOf("$$") === 0) {
        this.base(arguments, key, value);
      }
      else if (this.__flash) {
        throw new Error("The attributes cannot be modified after initial creation");
      }

      if (value === null || value === undefined) {
        delete this.__attributes[key];
      } else {
        this.__attributes[key] = value;
      }
    },

    /**
     * Returns the params for the Flash DOM element.
     *
     * @return {Map} Map with key/value pairs for the Flash DOM element.
     */
    getParams : function() {
      return this.__params;
    },

    /**
     * Set the param for the Flash DOM element, also called attribute.
     *
     * @param key {String} Key name.
     * @param value {String|Boolean|null} Value or <code>null</code> to remove param
     */
    setParam : function(key, value)
    {
      if (qx.core.Environment.get("qx.debug")) {
        qx.core.Assert.assertString(key, "Invalid attribute 'key'.");

        if (arguments.length > 1 && value !== null) {
          if (!qx.lang.Type.isBoolean(value) && !qx.lang.Type.isString(value)) {
            throw new Error("Invalid attribute 'value' expected String, Boolean or null.");
          }
        }
      }

      if (this.__flash) {
        throw new Error("The params cannot be modified after initial creation");
      }

      if (value === null || value === undefined) {
        delete this.__params[key];
      } else {
        this.__params[key] = value;
      }
    },

    /**
     * Return the created DOM Flash movie.
     *
     * @return {Element|null} The DOM Flash element, otherwise <code>null</code>.
     */
    getFlashElement : function() {
      return this.__flash;
    }

  },


  /*
   *****************************************************************************
      DESTRUCT
   *****************************************************************************
   */

  destruct : function()
  {
    if (this.__flash) {
      qx.bom.Flash.destroy(this.__flash);
    }

    this.__params = this.__variables = this.__attributes = null;
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
     * Sebastian Werner (wpbasti)
     * Christian Hagendorn (chris_schmidt)

   ======================================================================

   This class contains code based on the following work:

   * SWFFix
     http://code.google.com/p/swffix/
     Version 0.3 (r17)

     Copyright:
       (c) 2007 SWFFix developers

     License:
       MIT: http://www.opensource.org/licenses/mit-license.php

     Authors:
       * Geoff Stearns
       * Michael Williams
       * Bobby van der Sluis

************************************************************************ */

/**
 * Flash(TM) embed via script
 *
 * Include:
 *
 * * Simple movie embedding (returning a cross-browser working DOM node)
 * * Support for custom parameters and attributes
 * * Support for Flash(TM) variables
 *
 * Does not include the following features from SWFFix:
 *
 * * Active content workarounds for already inserted movies (via markup)
 * * Express install support
 * * Transformation of standard conformance markup to cross browser support
 * * Support for alternative content (alt text)
 */
qx.Class.define("qx.bom.Flash",
{
  /*
  *****************************************************************************
     STATICS
  *****************************************************************************
  */

  statics :
  {
    /**
     * Saves the references to the flash objects to delete the flash objects
     * before the browser is closed. Note: it is only used in IE.
     */
    _flashObjects: {},

    /*
    ---------------------------------------------------------------------------
      CREATION
    ---------------------------------------------------------------------------
    */

    /**
     * Creates an DOM element
     *
     * The dimension of the movie should define through CSS styles {@link qx.bom.element.Style}
     *
     * It is possible to add these parameters as supported by Flash movies:
     * http://helpx.adobe.com/flash/kb/flash-object-embed-tag-attributes.html
     *
     * @param element {Element} Parent DOM element node to add flash movie
     * @param attributes {Map} attributes for the object tag like id or mayscript
     * @param variables {Map?null} Flash variable data (these are available in the movie later)
     * @param params {Map?null} Flash parameter data (these are used to configure the movie itself)
     * @param win {Window?null} Window to create the element for
     * @return {Element} The created Flash element
     */
    create : function(element, attributes, variables, params, win)
    {
      if (!win) {
        win = window;
      }

      //Check parameters and check if element for flash is in DOM, before call creates swf.
      if (qx.core.Environment.get("qx.debug"))
      {
        qx.core.Assert.assertElement(element, "Invalid parameter 'element'.");
        qx.core.Assert.assertMap(attributes, "Invalid parameter 'attributes'.");
        qx.core.Assert.assertString(attributes.movie, "Invalid attribute 'movie'.");
        qx.core.Assert.assertString(attributes.id, "Invalid attribute 'id'.");

        if (!qx.dom.Element.isInDom(element, win)) {
          qx.log.Logger.warn(this, "The parent DOM element isn't in DOM! The External Interface doesn't work in IE!");
        }
      }

      if (!attributes.width) {
        attributes.width  = "100%";
      }

      if (!attributes.height) {
        attributes.height = "100%";
      }

      // Work on param copy
      params = params ? qx.lang.Object.clone(params) : {};

      if (!params["movie"]) {
        params["movie"] = attributes.movie;
      }

      attributes["data"] = attributes.movie;
      delete attributes.movie;

      // Copy over variables (into params)
      if (variables)
      {
        for (var name in variables)
        {
          if (typeof params.flashvars != "undefined") {
            params.flashvars += "&" + name + "=" + variables[name];
          } else {
            params.flashvars = name + "=" + variables[name];
          }
        }
      }

      // Finally create the SWF
      var flash = this.__createSwf(element, attributes, params, win);
      this._flashObjects[attributes.id] = flash;

      return flash;
    },


    /**
     * Destroys the flash object from DOM, but not the parent DOM element.
     *
     * Note: Removing the flash object like this:
     * <pre>
     *  var div = qx.dom.Element.create("div");
     *  document.body.appendChild(div);
     *
     *  var flashObject = qx.bom.Flash.create(div, { movie : "Flash.swf", id : "id" });
     *  div.removeChild(div.firstChild);
     * </pre>
     * involve memory leaks in Internet Explorer.
     *
     * @param element {Element} Either the DOM element that contains
     *              the flash object or the flash object itself.
     * @param win {Window?} Window that the element, which is to be destroyed,
                    belongs to.
     * @signature function(element, win)
     */
    destroy : function(element, win) {
      if (qx.core.Environment.get("engine.name") == "mshtml" &&
        qx.core.Environment.get("browser.documentmode") < 11)
      {
        element = this.__getFlashObject(element);

        if (element.readyState == 4) {
          this.__destroyObjectInIE(element);
        }
        else
        {
          if (!win) {
            win = window;
          }

          qx.bom.Event.addNativeListener(win, "load", function() {
            qx.bom.Flash.__destroyObjectInIE(element);
          });
        }
      } else {
        element = this.__getFlashObject(element);

        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }

        delete this._flashObjects[element.id];
      }
    },


    /**
     * Return the flash object element from DOM node.
     *
     * @param element {Element} The element to look.
     * @return {Element} Flash object element
     */
    __getFlashObject : function(element)
    {
      if (!element) {
        throw new Error("DOM element is null or undefined!");
      }

      if (element.tagName.toLowerCase() !== "object") {
        element = element.firstChild;
      }

      if (!element || element.tagName.toLowerCase() !== "object") {
        throw new Error("DOM element has or is not a flash object!");
      }

      return element;
    },

    /**
     * Destroy the flash object and remove from DOM, to fix memory leaks.
     *
     * @signature function(element)
     * @param element {Element} Flash object element to destroy.
     */
    __destroyObjectInIE : qx.core.Environment.select("engine.name",
    {
      "mshtml" : qx.event.GlobalError.observeMethod(function(element)
      {
        for (var i in element)
        {
          if (typeof element[i] == "function") {
            element[i] = null;
          }
        }

        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
        delete this._flashObjects[element.id];
      }),

      "default" : null
    }),

    /**
     * Internal helper to prevent leaks in IE
     *
     * @signature function()
     */
    __fixOutOfMemoryError : qx.event.GlobalError.observeMethod(function()
    {
      // IE Memory Leak Fix
      for (var key in qx.bom.Flash._flashObjects) {
        qx.bom.Flash.destroy(qx.bom.Flash._flashObjects[key]);
      }

      window.__flash_unloadHandler = function() {};
      window.__flash_savedUnloadHandler = function() {};

      // Remove listener again
      qx.bom.Event.removeNativeListener(window, "beforeunload", qx.bom.Flash.__fixOutOfMemoryError);
    }),


    /**
     * Creates a DOM element with a flash movie.
     *
     * @param element {Element} DOM element node where the Flash element node will be added.
     * @param attributes {Map} Flash attribute data.
     * @param params {Map} Flash parameter data.
     * @param win {Window} Window to create the element for.
     * @signature function(element, attributes, params, win)
     */
    __createSwf : function(element, attributes, params, win) {
      if (qx.core.Environment.get("engine.name") == "mshtml" &&
        qx.core.Environment.get("browser.documentmode") < 11)
      {
        // Move data from params to attributes
        params.movie = attributes.data;
        delete attributes.data;

        // Cleanup classid
        delete attributes.classid;

        // Prepare parameters
        var paramsStr = "";
        for (var name in params) {
          paramsStr += '<param name="' + name + '" value="' + params[name] + '" />';
        }

        // Create element, but set attribute "id" first and not later.
        if (attributes.id)
        {
          element.innerHTML = '<object id="' + attributes.id +
            '" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" $$widget="' + attributes.$$widget + '">' +
            paramsStr + '</object>';
          delete attributes.id;
        } else {
          element.innerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" $$widget="' +
            attributes.$$widget + '">' + paramsStr + '</object>';
        }

        // Apply attributes
        for (var name in attributes) {
          // IE doesn't like dollar signs in attribute names.
          // Setting the attribute using innerHTML above works fine, though...
          if (name != "$$widget") {
            element.firstChild.setAttribute(name, attributes[name]);
          }
        }

        return element.firstChild;
      }

      // Cleanup
      delete attributes.classid;
      delete params.movie;

      var swf = qx.dom.Element.create("object", attributes, win);
      swf.setAttribute("type", "application/x-shockwave-flash");

      // Add parameters
      var param;
      for (var name in params)
      {
        param = qx.dom.Element.create("param", {}, win);
        param.setAttribute("name", name);
        param.setAttribute("value", params[name]);
        swf.appendChild(param);
      }

      element.appendChild(swf);

      return swf;
    }
  },

  /*
  *****************************************************************************
     DEFER
  *****************************************************************************
  */

  defer : function(statics)
  {
    if (qx.core.Environment.get("engine.name") == "mshtml") {
      qx.bom.Event.addNativeListener(window, "beforeunload", statics.__fixOutOfMemoryError);
    }
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2008 Derrell Lipman

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Derrell Lipman (derrell)

************************************************************************ */

/**
 * Timer manipulation for handling multiple timed callbacks with the use of
 * only a single native timer object.
 *
 * Use of these timers is via the methods start() and stop().  Examples:
 * <pre class='javascript'>
 * var timer = qx.util.TimerManager.getInstance();
 *
 * // Start a 5-second recurrent timer.
 * // Note that the first expiration is after 3 seconds
 * // (last parameter is 3000) but each subsequent expiration is
 * // at 5 second intervals.
 * timer.start(function(userData, timerId)
 *             {
 *               this.debug("Recurrent 5-second timer: " + timerId);
 *             },
 *             5000,
 *             this,
 *             null,
 *             3000);
 *
 * // Start a 1-second one-shot timer
 * timer.start(function(userData, timerId)
 *             {
 *               this.debug("One-shot 1-second timer: " + timerId);
 *             },
 *             0,
 *             this,
 *             null,
 *             1000);
 *
 * // Start a 2-second recurrent timer that stops itself after
 * // three iterations
 * timer.start(function(userData, timerId)
 *             {
 *               this.debug("Recurrent 2-second timer with limit 3:" +
 *                          timerId);
 *               if (++userData.count == 3)
 *               {
 *                 this.debug("Stopping recurrent 2-second timer");
 *                 timer.stop(timerId);
 *               }
 *             },
 *             2000,
 *             this,
 *             { count : 0 });
 *
 * // Start an immediate one-shot timer
 * timer.start(function(userData, timerId)
 *             {
 *               this.debug("Immediate one-shot timer: " + timerId);
 *             });
 * </pre>
 */
qx.Class.define("qx.util.TimerManager",
{
  extend : qx.core.Object,
  type   : "singleton",

  statics :
  {
    /** Time-ordered queue of timers */
    __timerQueue : [],

    /** Saved data for each timer */
    __timerData  : {},

    /** Next timer id value is determined by incrementing this */
    __timerId    : 0
  },

  members :
  {
    /** Whether we're currently listening on the interval timer event */
    __timerListenerActive : false,

    /**
     * Start a new timer
     *
     * @param callback {Function}
     *   Function to be called upon expiration of the timer.  The function is
     *   passed these parameters:
     *   <dl>
     *     <dt>userData</dt>
     *       <dd>The user data provided to the start() method</dd>
     *     <dt>timerId</dt>
     *       <dd>The timer id, as was returned by the start() method</dd>
     *   </dl>
     *
     * @param recurTime {Integer|null}
     *   If null, the timer will not recur.  Once the callback function
     *   returns the first time, the timer will be removed from the timer
     *   queue.  If non-null, upon return from the callback function, the
     *   timer will be reset to this number of milliseconds.
     *
     * @param context {qx.core.Object|null}
     *   Context (this) the callback function is called with.  If not
     *   provided, this Timer singleton object is used.
     *
     * @param userData {var}
     *   Data which is passed to the callback function upon timer expiry
     *
     * @param initialTime {Integer|null}
     *   Milliseconds before the callback function is called the very first
     *   time.  If not specified and recurTime is specified, then recurTime
     *   will be used as initialTime; otherwise initialTime will default
     *   to zero.
     *
     * @return {Integer}
     *   The timer id of this unique timer.  It may be provided to the stop()
     *   method to cancel a timer before expiration.
     */
    start : function(callback, recurTime, context, userData, initialTime)
    {
      // Get the expiration time for this timer
      if (! initialTime)
      {
        initialTime = recurTime || 0;
      }

      var expireAt = (new Date()).getTime() + initialTime;

      // Save the callback, user data, and requested recurrency time as well
      // as the current expiry time
      this.self(arguments).__timerData[++this.self(arguments).__timerId] =
        {
          callback  : callback,
          userData  : userData || null,
          expireAt  : expireAt,
          recurTime : recurTime,
          context   : context || this
        };

      // Insert this new timer on the time-ordered timer queue
      this.__insertNewTimer(expireAt, this.self(arguments).__timerId);

      // Give 'em the timer id
      return this.self(arguments).__timerId;
    },

    /**
     * Stop a running timer
     *
     * @param timerId {Integer}
     *   A timer id previously returned by start()
     */
    stop : function(timerId)
    {
      // Find this timer id in the time-ordered list
      var timerQueue = this.self(arguments).__timerQueue;
      var length = timerQueue.length;
      for (var i = 0; i < length; i++)
      {
        // Is this the one we're looking for?
        if (timerQueue[i] == timerId)
        {
          // Yup.  Remove it.
          timerQueue.splice(i, 1);

          // We found it so no need to continue looping through the queue
          break;
        }
      }

      // Ensure it's gone from the timer data map as well
      delete this.self(arguments).__timerData[timerId];

      // If there are no more timers pending...
      if (timerQueue.length == 0 && this.__timerListenerActive)
      {
        // ... then stop listening for the periodic timer
        qx.event.Idle.getInstance().removeListener("interval",
                                                   this.__processQueue,
                                                   this);
        this.__timerListenerActive = false;
      }
    },

    /**
     * Insert a timer on the time-ordered list of active timers.
     *
     * @param expireAt {Integer}
     *   Milliseconds from now when this timer should expire
     *
     * @param timerId {Integer}
     *   Id of the timer to be time-ordered
     *
     */
    __insertNewTimer : function(expireAt, timerId)
    {
      // The timer queue is time-ordered so that processing timers need not
      // search the queue; rather, it can simply look at the first element
      // and if not yet ready to fire, be done.  Search the queue for the
      // appropriate place to insert this timer.
      var timerQueue = this.self(arguments).__timerQueue;
      var timerData = this.self(arguments).__timerData;
      var length = timerQueue.length;
      for (var i = 0; i < length; i++)
      {
        // Have we reached a later time?
        if (timerData[timerQueue[i]].expireAt > expireAt)
        {
          // Yup.  Insert our new timer id before this element.
          timerQueue.splice(i, 0, timerId);

          // No need to loop through the queue further
          break;
        }
      }

      // Did we find someplace in the middle of the queue for it?
      if (timerQueue.length == length)
      {
        // Nope.  Insert it at the end.
        timerQueue.push(timerId);
      }

      // If this is the first element on the queue...
      if (! this.__timerListenerActive)
      {
        // ... then start listening for the periodic timer.
        qx.event.Idle.getInstance().addListener("interval",
                                                this.__processQueue,
                                                this);
        this.__timerListenerActive = true;
      }

    },

    /**
     * Process the queue of timers.  Call the registered callback function for
     * any timer which has expired.  If the timer is marked as recurrent, the
     * timer is restarted with the recurrent timeout following completion of
     * the callback function.
     *
     */
    __processQueue : function()
    {
      // Get the current time
      var timeNow = (new Date()).getTime();

      // While there are timer elements that need processing...
      var timerQueue = this.self(arguments).__timerQueue;
      var timerData = this.self(arguments).__timerData;

      // Is it time to process the first timer element yet?
      while (timerQueue.length > 0 &&
             timerData[timerQueue[0]].expireAt <= timeNow)
      {
        // Yup.  Do it.  First, remove element from the queue.
        var expiredTimerId = timerQueue.shift();

        // Call the handler function for this timer
        var expiredTimerData = timerData[expiredTimerId];
        expiredTimerData.callback.call(expiredTimerData.context,
                                       expiredTimerData.userData,
                                       expiredTimerId);

        // If this is a recurrent timer which wasn't stopped by the callback...
        if (expiredTimerData.recurTime && timerData[expiredTimerId])
        {
          // ... then restart it.
          var now = (new Date()).getTime();
          expiredTimerData.expireAt = now + expiredTimerData.recurTime;

          // Insert this timer back on the time-ordered timer queue
          this.__insertNewTimer(expiredTimerData.expireAt, expiredTimerId);
        }
        else
        {
          // If it's not a recurrent timer, we can purge its data too.
          delete timerData[expiredTimerId];
        }
      }

      // If there are no more timers pending...
      if (timerQueue.length == 0 && this.__timerListenerActive)
      {
        // ... then stop listening for the periodic timer
        qx.event.Idle.getInstance().removeListener("interval",
                                                   this.__processQueue,
                                                   this);
        this.__timerListenerActive = false;
      }
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

************************************************************************ */

/**
 * The Canvas widget embeds the HMTL canvas element
 * [<a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#the-canvas">W3C-HTML5</a>]
 *
 * Note: This widget does not work in Internet Explorer < 9!
 * Check for browser support with qx.core.Environment.get("html.canvas").
 *
 * To paint something on the canvas and keep the content updated on resizes you
 * either have to override the {@link #_draw} method or redraw the content on
 * the {@link #redraw} event. The drawing context can be obtained by {@link #getContext2d}.
 *
 * Note that this widget operates on two different coordinate systems. The canvas
 * has its own coordinate system for drawing operations. This canvas coordinate
 * system is scaled to fit actual size of the DOM element. Each time the size of
 * the canvas dimensions is changed a redraw is required. In this case the
 * protected method {@link #_draw} is called and the event {@link #redraw}
 * is fired. You can synchronize the internal canvas dimension with the
 * CSS dimension of the canvas element by setting {@link #syncDimension} to
 * <code>true</code>.
 *
 * *Example*
 *
 * Here is a little example of how to use the canvas widget.
 *
 * <pre class='javascript'>
 * var canvas = new qx.ui.embed.Canvas().set({
 *   canvasWidth: 200,
 *   canvasHeight: 200,
 *   syncDimension: true
 * });
 * canvas.addListener("redraw", function(e)
 * {
 *   var data = e.getData();
 *   var width = data.width;
 *   var height = data.height;
 *   var ctx = data.context;
 *
 *   ctx.fillStyle = "rgb(200,0,0)";
 *   ctx.fillRect (20, 20, width-5, height-5);
 *
 *   ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
 *   ctx.fillRect (70, 70, 105, 100);
 * }, this);
 * </pre>
 *
 * *External Documentation*
 *
 * <a href='http://manual.qooxdoo.org/${qxversion}/pages/widget/canvas.html' target='_blank'>
 * Documentation of this widget in the qooxdoo manual.</a>
 */
qx.Class.define("qx.ui.embed.Canvas",
{
  extend : qx.ui.core.Widget,



  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  /**
   * @param canvasWidth {Integer} The internal with of the canvas coordinates.
   * @param canvasHeight {Integer} The internal height of the canvas coordinates.
   */
  construct : function(canvasWidth, canvasHeight)
  {
    this.base(arguments);

    this.__deferredDraw = new qx.util.DeferredCall(this.__redraw, this);
    this.addListener("resize", this._onResize, this);

    if (canvasWidth !== undefined) {
      this.setCanvasWidth(canvasWidth);
    }

    if (canvasHeight !== undefined) {
      this.setCanvasHeight(canvasHeight);
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
     * The redraw event is fired each time the canvas dimension change and the
     * canvas needs to be updated. The data field contains a map containing the
     * <code>width</code> and <code>height</code> of the canvas and the
     * rendering <code>context</code>.
     */
    "redraw" : "qx.event.type.Data"
  },



  /*
   *****************************************************************************
      MEMBERS
   *****************************************************************************
   */

  properties :
  {
    /** Whether canvas and widget coordinates should be synchronized */
    syncDimension :
    {
      check : "Boolean",
      init : false
    },

    /** The internal with of the canvas coordinates */
    canvasWidth :
    {
      check : "Integer",
      init : 300,
      apply : "_applyCanvasWidth"
    },

    /** The internal height of the canvas coordinates */
    canvasHeight :
    {
      check : "Integer",
      init : 150,
      apply : "_applyCanvasHeight"
    }
  },



  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    /** @type {qx.util.DeferredCall} */
    __deferredDraw : null,

    /*
    ---------------------------------------------------------------------------
      WIDGET API
    ---------------------------------------------------------------------------
    */

    // overridden
    _createContentElement : function() {
      return new qx.html.Canvas();
    },


    /**
     * This methods triggers the redraw of the canvas' content
     */
    __redraw : function()
    {
      var canvas = this.getContentElement();
      var height = canvas.getHeight();
      var width = canvas.getWidth();
      var context = canvas.getContext2d();

      this._draw(width, height, context);
      this.fireNonBubblingEvent(
        "redraw",
        qx.event.type.Data,
        [{
          width: width,
          height: height,
          context: context
        }]
      );
    },


    // property apply
    _applyCanvasWidth : function(value, old)
    {
      this.getContentElement().setWidth(value);
      this.__deferredDraw.schedule();
    },


    // property apply
    _applyCanvasHeight : function(value, old)
    {
      this.getContentElement().setHeight(value);
      this.__deferredDraw.schedule();
    },


    /**
     * Redraw the canvas
     */
    update : function() {
      this.__deferredDraw.schedule();
    },


    /**
     * Widget resize event handler. Updates the canvas dimension if needed.
     *
     * @param e {qx.event.type.Data} The resize event object
     */
    _onResize : function(e)
    {
      var data = e.getData();

      if (this.getSyncDimension())
      {
        this.setCanvasHeight(data.height);
        this.setCanvasWidth(data.width);
      }
    },


    /**
     * Get the native canvas 2D rendering context
     * [<a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#canvasrenderingcontext2d">W3C-HTML5</a>].
     * All drawing operations are performed on this context.
     *
     * @return {CanvasRenderingContext2D} The 2D rendering context.
     */
    getContext2d : function() {
      return this.getContentElement().getContext2d();
    },


    /**
     * Template method, which can be used by derived classes to redraw the
     * content. It is called each time the canvas dimension change and the
     * canvas needs to be updated.
     *
     * @param width {Integer} New canvas width
     * @param height {Integer} New canvas height
     * @param context {CanvasRenderingContext2D} The rendering context to draw to
     */
    _draw : function(width, height, context) {}
  },



  /*
   *****************************************************************************
      DESTRUCT
   *****************************************************************************
   */
  destruct : function() {
    this._disposeObjects("__deferredDraw");
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
 * Managed wrapper for the HTML canvas tag.
 */
qx.Class.define("qx.html.Canvas",
{
  extend : qx.html.Element,



  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  /**
   * @param styles {Map?null} optional map of CSS styles, where the key is the name
   *    of the style and the value is the value to use.
   * @param attributes {Map?null} optional map of element attributes, where the
   *    key is the name of the attribute and the value is the value to use.
   */
  construct : function(styles, attributes)
  {
    this.base(arguments, "canvas", styles, attributes);
    this.__canvas = document.createElement("canvas");
  },





  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {

    __canvas : null,

    // overridden
    _createDomElement : function() {
      return this.__canvas;
    },


    /**
     * Get the canvas element [<a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#canvas">W3C-HMTL5</a>]
     *
     * @return {Element} The canvas DOM element.
     */
    getCanvas : function() {
      return this.__canvas;
    },


    /**
     * Set the width attribute of the canvas element. This property controls the
     * size of the canvas coordinate space.
     *
     * @param width {Integer} canvas width
     */
    setWidth : function(width) {
      this.__canvas.width = width;
    },


    /**
     * Get the width attribute of the canvas element
     *
     * @return {Integer} canvas width
     */
    getWidth : function() {
      return this.__canvas.width;
    },


    /**
     * Set the height attribute of the canvas element. This property controls the
     * size of the canvas coordinate space.
     *
     * @param height {Integer} canvas height
     */
    setHeight : function(height) {
      this.__canvas.height = height;
    },


    /**
     * Get the height attribute of the canvas element
     *
     * @return {Integer} canvas height
     */
    getHeight : function() {
      return this.__canvas.height;
    },


    /**
     * Get the canvas' 2D rendering context
     * [<a href="http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#canvasrenderingcontext2d">W3C-HTML5</a>].
     * All drawing operations are performed on this context.
     *
     * @return {CanvasRenderingContext2D} The 2D rendering context.
     */
    getContext2d : function() {
      return this.__canvas.getContext("2d");
    }
  },



  /*
   *****************************************************************************
      DESTRUCT
   *****************************************************************************
   */

  destruct : function() {
    this.__canvas = null;
  }
});
