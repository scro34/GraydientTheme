/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2009 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Fabian Jakobs (fjakobs)

************************************************************************ */

/**
 * The part loader knows about all generated packages and parts.
 *
 * It contains functionality to load parts and to retrieve part instances.
 */
qx.Class.define("qx.io.PartLoader",
{
  type : "singleton",
  extend : qx.core.Object,


  construct : function()
  {
    this.base(arguments);


    var loader = this._loader = qx.Part.getInstance();

    var self = this;
    loader.onpart = function(part) {
      if (part.getReadyState() == "complete") {
        self.fireDataEvent("partLoaded", part);
      } else {
        self.fireDataEvent("partLoadingError", part.getName());
      }
    }
  },


  events :
  {
    /**
     * Fired if a parts was loaded. The data of the event instance point to the
     * loaded part instance.
     */
    "partLoaded" : "qx.event.type.Data",

    /**
     * Fired if a part could not be loaded. The event's
     * {@link qx.event.type.Data#getData} method returns the name of the failed
     * part.
     */
    "partLoadingError" : "qx.event.type.Data"
  },


  statics :
  {
    /**
     * Loads one or more parts asynchronously. The callback is called after all
     * parts and their dependencies are fully loaded. If the parts are already
     * loaded the callback is called immediately.
     *
     * @param partNames {String[]} List of parts names to load as defined in the
     *    config file at compile time.
     * @param callback {Function} Function to execute on completion.
     *   The function has one parameter which is an array of ready states of
     *   the parts specified in the partNames argument.
     * @param self {Object?window} Context to execute the given function in
     */
    require : function(partNames, callback, self) {
      this.getInstance().require(partNames, callback, self);
    }
  },


  members :
  {
    /**
     * Loads one or more parts asynchronously. The callback is called after all
     * parts and their dependencies are fully loaded. If the parts are already
     * loaded the callback is called immediately.
     *
     * @param partNames {String|String[]} List of parts names to load as defined
     *    in the config file at compile time. The method also accepts a single
     *    string as parameter to only load one part.
     * @param callback {Function} Function to execute on completion
     * @param self {Object?window} Context to execute the given function in
     */
    require : function(partNames, callback, self) {
      this._loader.require(partNames, callback, self);
    },


    /**
     * Get the part instance of the part with the given name.
     *
     * @param name {String} Name of the part as defined in the config file at
     *    compile time.
     * @return {qx.io.part.Part} The corresponding part instance
     */
    getPart : function(name) {
      return this.getParts()[name];
    },


    /**
     * Checks if a part with the given name is available.
     * @param name {String} Name of the part as defined in the config file at
     *    compile time.
     * @return {Boolean} <code>true</code>, if the part is available
     */
    hasPart : function(name) {
      return this.getPart(name) !== undefined;
    },


    /**
     * Returns a map of all known parts.
     * @return {Map} Map containing all parts.
     */
    getParts : function() {
      return this._loader.getParts();
    }
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2010 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Fabian Jakobs (fjakobs)
     * Martin Wittemann (martinwittemann)

************************************************************************ */

/**
 * The part loader knows about all generated packages and parts.
 *
 * It contains functionality to load parts.
 */
qx.Bootstrap.define("qx.Part",
{
  // !! Careful when editing this file. Do not extend the dependencies !!

  /**
   * @param loader {Object} The data structure from the boot script about all
   *   known parts and packages. Usually <code>qx.$$loader</code>.
   */
  construct : function(loader)
  {
    // assert: boot part has a single package
    var bootPackageKey = loader.parts[loader.boot][0];

    this.__loader = loader;

    // initialize the pseudo event listener maps
    this.__partListners = {};
    this.__packageListeners = {};
    this.__packageClosureListeners = {};

    // create the packages
    this.__packages = {};
    for (var key in loader.packages)
    {
      var pkg = new qx.io.part.Package(
        this.__decodeUris(loader.packages[key].uris), key, key==bootPackageKey
      );
      this.__packages[key] = pkg;
    };

    // create the parts
    this.__parts = {};
    var parts = loader.parts;
    var closureParts = loader.closureParts || {};

    for (var name in parts)
    {
      var pkgKeys = parts[name];
      var packages = [];
      for (var i = 0; i < pkgKeys.length; i++) {
        packages.push(this.__packages[pkgKeys[i]]);
      }

      // check for closure loading
      if (closureParts[name]) {
        var part = new qx.io.part.ClosurePart(name, packages, this);
      } else {
        var part = new qx.io.part.Part(name, packages, this);
      }

      this.__parts[name] = part;
    }
  },


  statics :
  {
    /**
     * Default timeout in ms for the error handling of the closure loading.
     */
    TIMEOUT : 7500,


    /**
     * Get the default part loader instance
     *
     * @return {qx.Part} the default part loader
     */
    getInstance : function()
    {
      if (!this.$$instance) {
        this.$$instance = new this(qx.$$loader);
      }
      return this.$$instance;
    },


    /**
     * Loads one or more parts asynchronously. The callback is called after all
     * parts and their dependencies are fully loaded. If the parts are already
     * loaded the callback is called immediately.
     *
     * @param partNames {String[]} List of parts names to load as defined in the
     *    config file at compile time.
     * @param callback {Function} Function to execute on completion
     * @param self {Object?window} Context to execute the given function in
     */
    require : function(partNames, callback, self) {
      this.getInstance().require(partNames, callback, self);
    },


    /**
     * Preloads one or more closure parts but does not execute them. This means
     * the closure (the whole code of the part) is already loaded but not
     * executed so you can't use the classes in the the part after a preload.
     * If you want to execute them, just use the regular {@link #require}
     * function.
     *
     * @param partNames {String[]} List of parts names to preload as defined
     *   in the config file at compile time.
     */
    preload : function(partNames) {
      this.getInstance().preload(partNames);
    },


    /**
     * Loaded closure packages have to call this method to indicate
     * successful loading and to get their closure stored.
     *
     * @param id {String} The id of the package.
     * @param closure {Function} The wrapped code of the package.
     */
    $$notifyLoad : function(id, closure) {
      this.getInstance().saveClosure(id, closure);
    }
  },


  members :
  {
    __loader : null,
    __packages : null,
    __parts : null,
    __packageClosureListeners : null,


    /**
     * This method is only for testing purposes! Don't use it!
     *
     * @internal
     * @param pkg {qx.io.part.Package} The package to add to the internal
     *   registry of packages.
     */
    addToPackage : function(pkg) {
      this.__packages[pkg.getId()] = pkg;
    },


    /**
     * Internal helper method to save the closure and notify that the load.
     *
     * @internal
     * @param id {String} The hash of the package.
     * @param closure {Function} The code of the package wrappen into a closure.
     */
    saveClosure : function(id, closure)
    {
      // search for the package
      var pkg = this.__packages[id];

      // error if no package could be found
      if (!pkg) {
        throw new Error("Package not available: " + id);
      }

      // save the colsure in the package itself
      pkg.saveClosure(closure);

      // call the listeners
      var listeners = this.__packageClosureListeners[id];
      if (!listeners) {
        return;
      }
      for (var i = 0; i < listeners.length; i++) {
        listeners[i]("complete", id);
      }
      // get rid of all colsure package listeners for that package
      this.__packageClosureListeners[id] = [];
    },


    /**
     * Internal method for testing purposes which returns the internal parts
     * store.
     *
     * @internal
     * @return {Array} An array of parts.
     */
    getParts : function() {
      return this.__parts;
    },


    /**
     * Loads one or more parts asynchronously. The callback is called after all
     * parts and their dependencies are fully loaded. If the parts are already
     * loaded the callback is called immediately.
     *
     * @param partNames {String|String[]} List of parts names to load as defined
     *   in the config file at compile time. The method also accepts a single
     *   string as parameter to only load one part.
     * @param callback {Function} Function to execute on completion.
     *   The function has one parameter which is an array of ready states of
     *   the parts specified in the partNames argument.
     * @param self {Object?window} Context to execute the given function in
     */
    require : function(partNames, callback, self)
    {
      var callback = callback || function() {};
      var self = self || window;

      if (qx.Bootstrap.isString(partNames)) {
        partNames = [partNames];
      }

      var parts = [];
      for (var i=0; i<partNames.length; i++) {
        var part = this.__parts[partNames[i]];
        if (part === undefined) {
          var registeredPartNames = qx.Bootstrap.keys(this.getParts());
          throw new Error('Part "' + partNames[i] + '" not found in parts (' +
            registeredPartNames.join(', ') + ')');
        } else {
          parts.push(part);
        }
      }

      var partsLoaded = 0;
      var onLoad = function() {
        partsLoaded += 1;
        // done?
        if (partsLoaded >= parts.length) {
          // gather the ready states of the parts
          var states = [];
          for (var i = 0; i < parts.length; i++) {
            states.push(parts[i].getReadyState());
          }
          callback.call(self, states);
        }
      };

      for (var i=0; i<parts.length; i++) {
        parts[i].load(onLoad, this);
      }
    },


    /**
     * Preloader for the given part.
     *
     * @param partNames {String} The hash of the part to preload.
     * @param callback {Function} Function to execute on completion.
     *   The function has one parameter which is an array of ready states of
     *   the parts specified in the partNames argument.
     * @param self {Object?window} Context to execute the given function in
     */
    preload : function(partNames, callback, self)
    {
      if (qx.Bootstrap.isString(partNames)) {
        partNames = [partNames];
      }

      var partsPreloaded = 0;
      for (var i=0; i<partNames.length; i++) {

        this.__parts[partNames[i]].preload(function() {
          partsPreloaded++;

          if (partsPreloaded >= partNames.length) {
            // gather the ready states of the parts
            var states = [];
            for (var i = 0; i < partNames.length; i++) {
              states.push(this.__parts[partNames[i]].getReadyState());
            };
            if (callback) {
              callback.call(self, states);
            }
          };
        }, this);
      }
    },


    /**
     * Get the URI lists of all packages
     *
     * @return {String[][]} Array of URI lists for each package
     */
    __getUris : function()
    {
      var packages = this.__loader.packages;
      var uris = [];
      for (var key in packages) {
        uris.push(this.__decodeUris(packages[key].uris));
      }
      return uris;
    },


    /**
     * Decodes a list of source URIs. The function is defined in the loader
     * script.
     *
     * @signature function(compressedUris)
     * @param compressedUris {String[]} Array of compressed URIs
     * @return {String[]} decompressed URIs
     */
    __decodeUris : qx.$$loader.decodeUris,


    /*
    ---------------------------------------------------------------------------
      PART
    ---------------------------------------------------------------------------
    */

    __partListners : null,


    /**
     * Register callback, which is called after the given part has been loaded
     * or fails with an error. After the call the listener is removed.
     *
     * @internal
     *
     * @param part {Object} Part to load
     * @param callback {Object} the listener
     */
    addPartListener : function(part, callback)
    {
      var key = part.getName();
      if (!this.__partListners[key]) {
        this.__partListners[key] = [];
      }
      this.__partListners[key].push(callback);
    },


    /**
     * If defined this method is called after each part load.
     */
    onpart : null,


    /**
     * This method is called after a part has been loaded or failed to load.
     * It calls all listeners for this part.
     *
     * @internal
     * @param part {Object} The loaded part
     */
    notifyPartResult : function(part)
    {
      var key = part.getName();

      var listeners = this.__partListners[key];
      if (listeners)
      {
        for (var i = 0; i < listeners.length; i++) {
          listeners[i](part.getReadyState());
        }
        this.__partListners[key] = [];
      }

      if (typeof this.onpart == "function") {
        this.onpart(part);
      }
    },


    /*
    ---------------------------------------------------------------------------
      PACKAGE
    ---------------------------------------------------------------------------
    */

    __packageListeners : null,


    /**
     * Register callback, which is called after the given package has been loaded
     * or fails with an error. After the call the listener is removed.
     *
     * @internal
     *
     * @param pkg {Object} Package to load
     * @param callback {Object} the listener
     */
    addPackageListener : function(pkg, callback)
    {
      var key = pkg.getId();
      if (!this.__packageListeners[key]) {
        this.__packageListeners[key] = [];
      }
      this.__packageListeners[key].push(callback);
    },


    /**
     * This method is called after a packages has been loaded or failed to load.
     * It calls all listeners for this package.
     *
     * @internal
     * @param pkg {Object} The loaded package
     */
    notifyPackageResult : function(pkg)
    {
      var key = pkg.getId();

      var listeners = this.__packageListeners[key];
      if (!listeners) {
        return;
      }
      for (var i=0; i<listeners.length; i++) {
        listeners[i](pkg.getReadyState());
      }
      this.__packageListeners[key] = [];
    }
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2009 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Fabian Jakobs (fjakobs)
     * Martin Wittemann (martinwittemann)

************************************************************************ */

/**
 * The Package wraps a list of related script URLs, which are required by one
 * or more parts.
 *
 * @internal
 * @ignore(qx.util.ResourceManager)
 */
qx.Bootstrap.define("qx.io.part.Package",
{
  /**
   * @param urls {String[]} A list of script URLs
   * @param id {var} Unique package hash key
   * @param loaded {Boolean?false} Whether the package is already loaded
   */
  construct : function(urls, id, loaded)
  {
    this.__readyState = loaded ? "complete" : "initialized";
    this.__urls = urls;
    this.__id = id;
  },


  members :
  {
    __readyState : null,
    __urls : null,
    __id : null,
    __closure : null,
    __loadWithClosure : null,
    __timeoutId : null,
    __notifyPackageResult : null,


    /**
     * Get the package ID.
     *
     * @return {String} The package id
     */
    getId : function() {
      return this.__id;
    },


    /**
     * Get the ready state of the package. The value is one of
     * <ul>
     * <li>
     *   <b>initialized</b>: The package is initialized. The {@link #load}
     *   method has not yet been called
     * </li>
     * <li><b>loading</b>: The package is still loading.</li>
     * <li><b>complete</b>: The package has been loaded successfully</li>
     * <li><b>cached</b>: The package is loaded but is not executed
     *   (for closure parts)</li>
     * </li>
     *
     * @return {String} The ready state.
     */
    getReadyState : function() {
      return this.__readyState;
    },


    /**
     * Returns the urlsstored stored in the package.
     *
     * @internal
     * @return {String[]} An array of urls of this package.
     */
    getUrls : function() {
      return this.__urls;
    },


    /**
     * Method for storing the closure for this package. This is only relevant
     * if a {@link qx.io.part.ClosurePart} is used.
     *
     * @param closure {Function} The code of this package wrapped in a closure.
     */
    saveClosure : function(closure)
    {
      if (this.__readyState == "error") {
        return;
      }

      this.__closure = closure;

      if (!this.__loadWithClosure) {
        this.execute();
      } else {
        clearTimeout(this.__timeoutId);
        this.__readyState = "cached";
        this.__notifyPackageResult(this);
      }
    },


    /**
     * Executes the stored closure. This is only relevant if a
     * {@link qx.io.part.ClosurePart} is used.
     */
    execute : function()
    {
      if (this.__closure)
      {
        this.__closure();
        delete this.__closure;
      }

      if (qx.$$packageData[this.__id])
      {
        this.__importPackageData(qx.$$packageData[this.__id]);
        delete qx.$$packageData[this.__id];
      }
      this.__readyState = "complete";
    },


    /**
     * Load method if the package loads a closure. This is only relevant if a
     * {@link qx.io.part.ClosurePart} is used.
     *
     * @param notifyPackageResult {Function} The callback if all scripts are
     *   done loading in this package.
     * @param self {Object?} The context of the callback.
     */
    loadClosure : function(notifyPackageResult, self)
    {
      if (this.__readyState !== "initialized") {
        return;
      }

      this.__loadWithClosure = true;

      this.__readyState = "loading";

      this.__notifyPackageResult = qx.Bootstrap.bind(notifyPackageResult, self);

      this.__loadScriptList(
        this.__urls,
        function() {},
        function() {
          this.__readyState = "error";
          notifyPackageResult.call(self, this);
        },
        this
      );

      var pkg = this;
      this.__timeoutId = setTimeout(function() {
        pkg.__readyState = "error";
        notifyPackageResult.call(self, pkg);
      }, qx.Part.TIMEOUT);
    },


    /**
     * Load the part's script URLs in the correct order.
     *
     * @param notifyPackageResult {Function} The callback if all scripts are
     *   done loading in this package.
     * @param self {Object?} The context of the callback.
     */
    load : function(notifyPackageResult, self)
    {
      if (this.__readyState !== "initialized") {
        return;
      }

      this.__loadWithClosure = false;

      this.__readyState = "loading";

      this.__loadScriptList(
        this.__urls,
        function() {
          this.__readyState = "complete";
          this.execute();
          notifyPackageResult.call(self, this);
        },
        function() {
          this.__readyState = "error";
          notifyPackageResult.call(self, this);
        },
        this
      );
    },


    /**
     * Loads a list of scripts in the correct order.
     *
     * @param urlList {String[]} List of script urls
     * @param callback {Function} Function to execute on completion
     * @param errBack {Function} Function to execute on error
     * @param self {Object?window} Context to execute the given function in
     */
    __loadScriptList : function(urlList, callback, errBack, self)
    {
      if (urlList.length == 0)
      {
        callback.call(self);
        return;
      }

      var urlsLoaded = 0;
      var self = this;
      var loadScripts = function(urls)
      {
        if (urlsLoaded >= urlList.length)
        {
          callback.call(self);
          return;
        }

        var loader = new qx.bom.request.Script();
        loader.open("GET", urls.shift());

        loader.onload = function()
        {
          urlsLoaded += 1;
          loader.dispose();

          // Important to use engine detection directly to keep the minimal
          // package size small [BUG #5068]
          if ((qx.bom.client.Engine.getName() == "webkit"))
          {
            // force asynchronous load
            // Safari fails with an "maximum recursion depth exceeded" error if it is
            // called sync.
            setTimeout(function()
            {
              loadScripts.call(self, urls, callback, self);
            }, 0);
          }
          else
          {
            loadScripts.call(self, urls, callback, self);
          }
        };

        loader.onerror = function() {
          if (self.__readyState == "loading") {
            clearTimeout(self.__timeoutId);
            loader.dispose();
            return errBack.call(self);
          }
        };

        // Force loading script asynchronously (IE may load synchronously)
        window.setTimeout(function() {
          loader.send();
        });
      };

      loadScripts(urlList.concat());
    },


    /**
     * Import the data of a package. The function is defined in the loader
     * script.
     *
     * @signature function(packageData)
     * @param packageData {Map} Map of package data categories ("resources",...)
     */
    __importPackageData : qx.$$loader.importPackageData
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
     * Tristan Koch (tristankoch)

************************************************************************ */

/**
 * Script loader with interface similar to
 * <a href="http://www.w3.org/TR/XMLHttpRequest/">XmlHttpRequest</a>.
 *
 * The script loader can be used to load scripts from arbitrary sources.
 * <span class="desktop">
 * For JSONP requests, consider the {@link qx.bom.request.Jsonp} transport
 * that derives from the script loader.
 * </span>
 *
 * <div class="desktop">
 * Example:
 *
 * <pre class="javascript">
 *  var req = new qx.bom.request.Script();
 *  req.onload = function() {
 *    // Script is loaded and parsed and
 *    // globals set are available
 *  }
 *
 *  req.open("GET", url);
 *  req.send();
 * </pre>
 * </div>
 *
 * @ignore(qx.core, qx.core.Environment.*)
 * @require(qx.bom.request.Script#_success)
 * @require(qx.bom.request.Script#abort)
 * @require(qx.bom.request.Script#dispose)
 * @require(qx.bom.request.Script#isDisposed)
 * @require(qx.bom.request.Script#getAllResponseHeaders)
 * @require(qx.bom.request.Script#getResponseHeader)
 * @require(qx.bom.request.Script#setDetermineSuccess)
 * @require(qx.bom.request.Script#setRequestHeader)
 *
 * @group (IO)
 */

qx.Bootstrap.define("qx.bom.request.Script",
{

  construct : function()
  {
    this.__initXhrProperties();

    this.__onNativeLoadBound = qx.Bootstrap.bind(this._onNativeLoad, this);
    this.__onNativeErrorBound = qx.Bootstrap.bind(this._onNativeError, this);
    this.__onTimeoutBound = qx.Bootstrap.bind(this._onTimeout, this);

    this.__headElement = document.head || document.getElementsByTagName( "head" )[0] ||
                         document.documentElement;

    this._emitter = new qx.event.Emitter();

    // BUGFIX: Browsers not supporting error handler
    // Set default timeout to capture network errors
    //
    // Note: The script is parsed and executed, before a "load" is fired.
    this.timeout = this.__supportsErrorHandler() ? 0 : 15000;
  },


  events : {
    /** Fired at ready state changes. */
    "readystatechange" : "qx.bom.request.Script",

    /** Fired on error. */
    "error" : "qx.bom.request.Script",

    /** Fired at loadend. */
    "loadend" : "qx.bom.request.Script",

    /** Fired on timeouts. */
    "timeout" : "qx.bom.request.Script",

    /** Fired when the request is aborted. */
    "abort" : "qx.bom.request.Script",

    /** Fired on successful retrieval. */
    "load" : "qx.bom.request.Script"
  },


  members :
  {

    /**
     * @type {Number} Ready state.
     *
     * States can be:
     * UNSENT:           0,
     * OPENED:           1,
     * LOADING:          2,
     * LOADING:          3,
     * DONE:             4
     *
     * Contrary to {@link qx.bom.request.Xhr#readyState}, the script transport
     * does not receive response headers. For compatibility, another LOADING
     * state is implemented that replaces the HEADERS_RECEIVED state.
     */
    readyState: null,

    /**
     * @type {Number} The status code.
     *
     * Note: The script transport cannot determine the HTTP status code.
     */
    status: null,

    /**
     * @type {String} The status text.
     *
     * The script transport does not receive response headers. For compatibility,
     * the statusText property is set to the status casted to string.
     */
    statusText: null,

    /**
     * @type {Number} Timeout limit in milliseconds.
     *
     * 0 (default) means no timeout.
     */
    timeout: null,

    /**
     * @type {Function} Function that is executed once the script was loaded.
     */
    __determineSuccess: null,


    /**
     * Add an event listener for the given event name.
     *
     * @param name {String} The name of the event to listen to.
     * @param listener {Function} The function to execute when the event is fired
     * @param ctx {var?} The context of the listener.
     * @return {qx.bom.request.Script} Self for chaining.
     */
    on: function(name, listener, ctx) {
      this._emitter.on(name, listener, ctx);
      return this;
    },


    /**
     * Initializes (prepares) request.
     *
     * @param method {String}
     *   The HTTP method to use.
     *   This parameter exists for compatibility reasons. The script transport
     *   does not support methods other than GET.
     * @param url {String}
     *   The URL to which to send the request.
     */
    open: function(method, url) {
      if (this.__disposed) {
        return;
      }

      // Reset XHR properties that may have been set by previous request
      this.__initXhrProperties();

      this.__abort = null;
      this.__url = url;

      if (this.__environmentGet("qx.debug.io")) {
        qx.Bootstrap.debug(qx.bom.request.Script, "Open native request with " +
          "url: " + url);
      }

      this._readyStateChange(1);
    },

    /**
     * Appends a query parameter to URL.
     *
     * This method exists for compatibility reasons. The script transport
     * does not support request headers. However, many services parse query
     * parameters like request headers.
     *
     * Note: The request must be initialized before using this method.
     *
     * @param key {String}
     *  The name of the header whose value is to be set.
     * @param value {String}
     *  The value to set as the body of the header.
     * @return {qx.bom.request.Script} Self for chaining.
     */
    setRequestHeader: function(key, value) {
      if (this.__disposed) {
        return null;
      }

      var param = {};

      if (this.readyState !== 1) {
        throw new Error("Invalid state");
      }

      param[key] = value;
      this.__url = qx.util.Uri.appendParamsToUrl(this.__url, param);
      return this;
    },

    /**
     * Sends request.
     * @return {qx.bom.request.Script} Self for chaining.
     */
    send: function() {
      if (this.__disposed) {
        return null;
      }

      var script = this.__createScriptElement(),
          head = this.__headElement,
          that = this;

      if (this.timeout > 0) {
        this.__timeoutId = window.setTimeout(this.__onTimeoutBound, this.timeout);
      }

      if (this.__environmentGet("qx.debug.io")) {
        qx.Bootstrap.debug(qx.bom.request.Script, "Send native request");
      }

      // Attach script to DOM
      head.insertBefore(script, head.firstChild);

      // The resource is loaded once the script is in DOM.
      // Assume HEADERS_RECEIVED and LOADING and dispatch async.
      window.setTimeout(function() {
        that._readyStateChange(2);
        that._readyStateChange(3);
      });
      return this;
    },

    /**
     * Aborts request.
     * @return {qx.bom.request.Script} Self for chaining.
     */
    abort: function() {
      if (this.__disposed) {
        return null;
      }

      this.__abort = true;
      this.__disposeScriptElement();
      this._emit("abort");
      return this;
    },


    /**
     * Helper to emit events and call the callback methods.
     * @param event {String} The name of the event.
     */
    _emit: function(event) {
      this["on" + event]();
      this._emitter.emit(event, this);
    },


    /**
     * Event handler for an event that fires at every state change.
     *
     * Replace with custom method to get informed about the communication progress.
     */
    onreadystatechange: function() {},

    /**
     * Event handler for XHR event "load" that is fired on successful retrieval.
     *
     * Note: This handler is called even when an invalid script is returned.
     *
     * Warning: Internet Explorer < 9 receives a false "load" for invalid URLs.
     * This "load" is fired about 2 seconds after sending the request. To
     * distinguish from a real "load", consider defining a custom check
     * function using {@link #setDetermineSuccess} and query the status
     * property. However, the script loaded needs to have a known impact on
     * the global namespace. If this does not work for you, you may be able
     * to set a timeout lower than 2 seconds, depending on script size,
     * complexity and execution time.
     *
     * Replace with custom method to listen to the "load" event.
     */
    onload: function() {},

    /**
     * Event handler for XHR event "loadend" that is fired on retrieval.
     *
     * Note: This handler is called even when a network error (or similar)
     * occurred.
     *
     * Replace with custom method to listen to the "loadend" event.
     */
    onloadend: function() {},

    /**
     * Event handler for XHR event "error" that is fired on a network error.
     *
     * Note: Some browsers do not support the "error" event.
     *
     * Replace with custom method to listen to the "error" event.
     */
    onerror: function() {},

    /**
    * Event handler for XHR event "abort" that is fired when request
    * is aborted.
    *
    * Replace with custom method to listen to the "abort" event.
    */
    onabort: function() {},

    /**
    * Event handler for XHR event "timeout" that is fired when timeout
    * interval has passed.
    *
    * Replace with custom method to listen to the "timeout" event.
    */
    ontimeout: function() {},

    /**
     * Get a single response header from response.
     *
     * Note: This method exists for compatibility reasons. The script
     * transport does not receive response headers.
     *
     * @param key {String}
     *  Key of the header to get the value from.
     * @return {String|null} Warning message or <code>null</code> if the request
     * is disposed
     */
    getResponseHeader: function(key) {
      if (this.__disposed) {
        return null;
      }

      if (this.__environmentGet("qx.debug")) {
        qx.Bootstrap.debug("Response header cannot be determined for " +
          "requests made with script transport.");
      }
      return "unknown";
    },

    /**
     * Get all response headers from response.
     *
     * Note: This method exists for compatibility reasons. The script
     * transport does not receive response headers.
     * @return {String|null} Warning message or <code>null</code> if the request
     * is disposed
     */
    getAllResponseHeaders: function() {
      if (this.__disposed) {
        return null;
      }

      if (this.__environmentGet("qx.debug")) {
        qx.Bootstrap.debug("Response headers cannot be determined for" +
          "requests made with script transport.");
      }

      return "Unknown response headers";
    },

    /**
     * Determine if loaded script has expected impact on global namespace.
     *
     * The function is called once the script was loaded and must return a
     * boolean indicating if the response is to be considered successful.
     *
     * @param check {Function} Function executed once the script was loaded.
     *
     */
    setDetermineSuccess: function(check) {
      this.__determineSuccess = check;
    },

    /**
     * Dispose object.
     */
    dispose: function() {
      var script = this.__scriptElement;

      if (!this.__disposed) {

        // Prevent memory leaks
        if (script) {
          script.onload = script.onreadystatechange = null;
          this.__disposeScriptElement();
        }

        if (this.__timeoutId) {
          window.clearTimeout(this.__timeoutId);
        }

        this.__disposed = true;
      }
    },


    /**
     * Check if the request has already beed disposed.
     * @return {Boolean} <code>true</code>, if the request has been disposed.
     */
    isDisposed : function() {
      return !!this.__disposed;
    },


    /*
    ---------------------------------------------------------------------------
      PROTECTED
    ---------------------------------------------------------------------------
    */

    /**
     * Get URL of request.
     *
     * @return {String} URL of request.
     */
    _getUrl: function() {
      return this.__url;
    },

    /**
     * Get script element used for request.
     *
     * @return {Element} Script element.
     */
    _getScriptElement: function() {
      return this.__scriptElement;
    },

    /**
     * Handle timeout.
     */
    _onTimeout: function() {
      this.__failure();

      if (!this.__supportsErrorHandler()) {
        this._emit("error");
      }

      this._emit("timeout");

      if (!this.__supportsErrorHandler()) {
        this._emit("loadend");
      }
    },

    /**
     * Handle native load.
     */
    _onNativeLoad: function() {
      var script = this.__scriptElement,
          determineSuccess = this.__determineSuccess,
          that = this;

      // Aborted request must not fire load
      if (this.__abort) {
        return;
      }

      // BUGFIX: IE < 9
      // When handling "readystatechange" event, skip if readyState
      // does not signal loaded script
      if (this.__environmentGet("engine.name") === "mshtml" &&
          this.__environmentGet("browser.documentmode") < 9) {
        if (!(/loaded|complete/).test(script.readyState)) {
          return;
        } else {
          if (this.__environmentGet("qx.debug.io")) {
            qx.Bootstrap.debug(qx.bom.request.Script, "Received native readyState: loaded");
          }
        }
      }

      if (this.__environmentGet("qx.debug.io")) {
        qx.Bootstrap.debug(qx.bom.request.Script, "Received native load");
      }

      // Determine status by calling user-provided check function
      if (determineSuccess) {

        // Status set before has higher precedence
        if (!this.status) {
          this.status = determineSuccess() ? 200 : 500;
        }

      }

      if (this.status === 500) {
        if (this.__environmentGet("qx.debug.io")) {
          qx.Bootstrap.debug(qx.bom.request.Script, "Detected error");
        }
      }

      if (this.__timeoutId) {
        window.clearTimeout(this.__timeoutId);
      }

      window.setTimeout(function() {
        that._success();
        that._readyStateChange(4);
        that._emit("load");
        that._emit("loadend");
      });
    },

    /**
     * Handle native error.
     */
    _onNativeError: function() {
      this.__failure();
      this._emit("error");
      this._emit("loadend");
    },

    /*
    ---------------------------------------------------------------------------
      PRIVATE
    ---------------------------------------------------------------------------
    */

    /**
     * @type {Element} Script element
     */
    __scriptElement: null,

    /**
     * @type {Element} Head element
     */
    __headElement: null,

    /**
     * @type {String} URL
     */
    __url: "",

    /**
     * @type {Function} Bound _onNativeLoad handler.
     */
    __onNativeLoadBound: null,

    /**
     * @type {Function} Bound _onNativeError handler.
     */
    __onNativeErrorBound: null,

    /**
     * @type {Function} Bound _onTimeout handler.
     */
    __onTimeoutBound: null,

    /**
     * @type {Number} Timeout timer iD.
     */
    __timeoutId: null,

    /**
     * @type {Boolean} Whether request was aborted.
     */
    __abort: null,

    /**
     * @type {Boolean} Whether request was disposed.
     */
    __disposed: null,

    /*
    ---------------------------------------------------------------------------
      HELPER
    ---------------------------------------------------------------------------
    */

    /**
     * Initialize properties.
     */
    __initXhrProperties: function() {
      this.readyState = 0;
      this.status = 0;
      this.statusText = "";
    },

    /**
     * Change readyState.
     *
     * @param readyState {Number} The desired readyState
     */
    _readyStateChange: function(readyState) {
      this.readyState = readyState;
      this._emit("readystatechange");
    },

    /**
     * Handle success.
     */
    _success: function() {
      this.__disposeScriptElement();
      this.readyState = 4;

      // By default, load is considered successful
      if (!this.status) {
        this.status = 200;
      }

      this.statusText = "" + this.status;
    },

    /**
     * Handle failure.
     */
    __failure: function() {
      this.__disposeScriptElement();
      this.readyState = 4;
      this.status = 0;
      this.statusText = null;
    },

    /**
     * Looks up whether browser supports error handler.
     *
     * @return {Boolean} Whether browser supports error handler.
     */
    __supportsErrorHandler: function() {
      var isLegacyIe = this.__environmentGet("engine.name") === "mshtml" &&
        this.__environmentGet("browser.documentmode") < 9;

      var isOpera = this.__environmentGet("engine.name") === "opera";

      return !(isLegacyIe || isOpera);
    },

    /**
     * Create and configure script element.
     *
     * @return {Element} Configured script element.
     */
    __createScriptElement: function() {
      var script = this.__scriptElement = document.createElement("script");

      script.src = this.__url;
      script.onerror = this.__onNativeErrorBound;
      script.onload = this.__onNativeLoadBound;

      // BUGFIX: IE < 9
      // Legacy IEs do not fire the "load" event for script elements.
      // Instead, they support the "readystatechange" event
      if (this.__environmentGet("engine.name") === "mshtml" &&
          this.__environmentGet("browser.documentmode") < 9) {
        script.onreadystatechange = this.__onNativeLoadBound;
      }

      return script;
    },

    /**
     * Remove script element from DOM.
     */
    __disposeScriptElement: function() {
      var script = this.__scriptElement;

      if (script && script.parentNode) {
        this.__headElement.removeChild(script);
      }
    },

    /**
     * Proxy Environment.get to guard against env not being present yet.
     *
     * @param key {String} Environment key.
     * @return {var} Value of the queried environment key
     * @lint environmentNonLiteralKey(key)
     */
    __environmentGet: function(key) {
      if (qx && qx.core && qx.core.Environment) {
        return qx.core.Environment.get(key);
      } else {
        if (key === "engine.name") {
          return qx.bom.client.Engine.getName();
        }

        if (key === "browser.documentmode") {
          return qx.bom.client.Browser.getDocumentMode();
        }

        if (key == "qx.debug.io") {
          return false;
        }

        throw new Error("Unknown environment key at this phase");
      }
    }
  },

  defer: function() {
    if (qx && qx.core && qx.core.Environment) {
      qx.core.Environment.add("qx.debug.io", false);
    }
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2009 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Fabian Jakobs (fjakobs)
     * Martin Wittemann (martinwittemann)

************************************************************************ */

/**
 * Wrapper for a part as defined in the config file. This class knows about all
 * packages the part depends on and provides functionality to load the part.
 *
 * @internal
 */
qx.Bootstrap.define("qx.io.part.Part",
{
  /**
   * @param name {String} Name of the part as defined in the config file at
   *    compile time.
   * @param packages {Package[]} List of dependent packages
   * @param loader {qx.Part} The loader of this part.
   */
  construct : function(name, packages, loader)
  {
    this.__name = name;
    this._readyState = "complete";
    this._packages = packages;
    this._loader = loader;

    for (var i=0; i<packages.length; i++)
    {
      if (packages[i].getReadyState() !== "complete")
      {
        this._readyState = "initialized";
        break;
      }
    }
  },


  members :
  {
    _readyState : null,
    _loader : null,
    _packages : null,
    __name : null,


    /**
     * Get the ready state of the part. The value is one of
     * <ul>
     * <li>
     *   <b>initialized</b>: The part is initialized. The {@link #load}
     *   method has not yet been called
     * </li>
     * <li><b>loading</b>: The part is still loading.</li>
     * <li><b>complete</b>: The part has been loaded successfully</li>
     * </li>
     *
     * @return {String} The ready state.
     */
    getReadyState : function() {
      return this._readyState;
    },


    /**
     * The part name as defined in the config file
     *
     * @return {String} The part name
     */
    getName : function() {
      return this.__name;
    },


    /**
     * Internal helper for testing purposes.
     * @internal
     * @return {qx.io.part.Package[]} All contained packages in an array.
     */
    getPackages : function()
    {
      return this._packages;
    },


    /**
     * Method for preloading this part.
     * Empty implementation! Regular parts can not be preloaded.
     *
     * @param callback {Function} Callback for the preload.
     * @param self {Object?} The context of the callback.
     */
    preload : function(callback, self) {
      // Just do nothing because you can not preload regular parts.
      // Also, loading the part here is not a good idea because it could break
      // the load order of the packages if someone uses preload right after
      // loading another part. So we just invoke the callback async.
      if (callback) {
        window.setTimeout(function() {
          callback.call(self, this);
        }, 0);
      }
    },


    /**
     * Loads the part asynchronously. The callback is called after the part and
     * its dependencies are fully loaded. If the part is already loaded the
     * callback is called immediately.
     *
     * @internal
     *
     * @param callback {Function} Function to execute on completion
     * @param self {Object?window} Context to execute the given function in
     */
    load : function(callback, self)
    {
       if (this._checkCompleteLoading(callback, self)) {
         return;
       };

      this._readyState = "loading";

      if (callback) {
        this._appendPartListener(callback, self, this);
      }

      var part = this;
      var onLoad = function() {
        part.load();
      }

      for (var i=0; i<this._packages.length; i++)
      {
        var pkg = this._packages[i];
        switch (pkg.getReadyState())
        {
          case "initialized":
            this._loader.addPackageListener(pkg, onLoad);
            pkg.load(this._loader.notifyPackageResult, this._loader);
            return;

          case "loading":
            this._loader.addPackageListener(pkg, onLoad);
            return;

          case "complete":
            break;

          case "error":
            this._markAsCompleted("error");
            return;

          default:
            throw new Error("Invalid case! " + pkg.getReadyState());
        }
      }

      this._markAsCompleted("complete");
    },


    /**
     * Helper for appending a listener for this part.
     *
     * @param callback {Function} The function to call when the part is loaded.
     * @param self {Object?} The context of the callback.
     * @param part {qx.io.part.Part|qx.io.part.ClosurePart} The part to listen
     *   to.
     */
    _appendPartListener : function(callback, self, part)
    {
      var that = this;
      this._loader.addPartListener(this, function() {
        that._signalStartup();
        callback.call(self, part._readyState);
      });
    },


    /**
     * Helper for marking the part as complete.
     *
     * @param readyState {String} The new ready state.
     */
    _markAsCompleted : function(readyState)
    {
      this._readyState = readyState;
      this._loader.notifyPartResult(this);
    },



    /**
     * Method used to start up the application in case not all parts
     * necessary to initialize the application are in the boot part. [BUG #3793]
     */
    _signalStartup : function() {
      // signal the application startup if not already done
      if (!qx.$$loader.applicationHandlerReady) {
        qx.$$loader.signalStartup();
      }
    },


    /**
     * Helper for checking if the part is loaded completely.
     *
     * @param callback {Function} The function to be called if the part has
     *   been loaded completely.
     * @param self {Object} The context of the callback function.
     * @return {Boolean} true, if the part is loading, complete or has an error.
     */
    _checkCompleteLoading : function(callback, self)
    {
      // check if its already loaded
      var readyState = this._readyState;
      if (readyState == "complete" || readyState == "error") {
        if (callback) {
          var that = this;
          setTimeout(function() {
            that._signalStartup();
            callback.call(self, readyState);
          }, 0);
        }
        return true;
      }
      // add a listener if it is currently loading
      else if (readyState == "loading" && callback)
      {
        this._appendPartListener(callback, self, this);
        return true;
      }
    }
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2009 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Fabian Jakobs (fjakobs)
     * Martin Wittemann (martinwittemann)

************************************************************************ */

/**
 * Wrapper for a part as defined in the config file. This class knows about all
 * packages the part depends on and provides functionality to load the part.
 *
 * @internal
 */
qx.Bootstrap.define("qx.io.part.ClosurePart",
{
  extend : qx.io.part.Part,

  /**
   * @param name {String} Name of the part as defined in the config file at
   *    compile time.
   * @param packages {Package[]} List of dependent packages
   * @param loader {qx.Part} The loader of this part.
   */
  construct : function(name, packages, loader)
  {
    qx.io.part.Part.call(this, name, packages, loader);
  },


  members :
  {
    __packagesToLoad : 0,


    // overridden
    preload : function(callback, self)
    {
      // store how many packages are already preloaded
      var packagesLoaded = 0;
      var that = this;

      for (var i = 0; i < this._packages.length; i++)
      {
        var pkg = this._packages[i];
        if (pkg.getReadyState() == "initialized") {

          pkg.loadClosure(function(pkg) {
            packagesLoaded++;
            that._loader.notifyPackageResult(pkg);
            // everything loaded?
            if (packagesLoaded >= that._packages.length && callback) {
              callback.call(self);
            }
          }, this._loader);
        }
      }
    },


    /**
     * Loads the closure part including all its packages. The loading will
     * be done parallel. After all packages are available, the closures are
     * executed in the correct order.
     *
     * @param callback {Function} The function to call after the loading.
     * @param self {Object?} The context of the callback.
     */
    load : function(callback, self)
    {
      if (this._checkCompleteLoading(callback, self)) {
        return;
      };

      this._readyState = "loading";

      if (callback) {
        this._appendPartListener(callback, self, this);
      }

      this.__packagesToLoad = this._packages.length;

      for (var i = 0; i < this._packages.length; i++)
      {
        var pkg = this._packages[i];
        var pkgReadyState = pkg.getReadyState();

        // trigger loading
        if (pkgReadyState == "initialized") {
          pkg.loadClosure(this._loader.notifyPackageResult, this._loader);
        }

        // Listener for package changes
        if (pkgReadyState == "initialized" || pkgReadyState == "loading")
        {
          this._loader.addPackageListener(
            pkg,
            qx.Bootstrap.bind(this._onPackageLoad, this, pkg)
          );
        }
        else if (pkgReadyState == "error")
        {
          this._markAsCompleted("error");
          return;
        }
        else {
          // "complete" and "cached"
          this.__packagesToLoad--;
        }
      }

      // execute closures in case everything is already loaded/cached
      if (this.__packagesToLoad <= 0) {
        this.__executePackages();
      }
    },


    /**
     * Executes the packages in their correct order and marks the part as
     * complete after execution.
     */
    __executePackages : function()
    {
      for (var i = 0; i < this._packages.length; i++) {
        this._packages[i].execute();
      }
      this._markAsCompleted("complete");
    },


    /**
     * Handler for every package load. It checks for errors and decreases the
     * packages to load. If all packages has been loaded, it invokes the
     * execution.
     *
     * @param pkg {qx.io.part.Package} The loaded package.
     */
    _onPackageLoad : function(pkg)
    {
      // if the part already has an error, ignore the callback
      if (this._readyState == "error") {
        return;
      }

      // one error package results in an error part
      if (pkg.getReadyState() == "error") {
        this._markAsCompleted("error");
        return;
      }

      // every package could be loaded -> execute the closures
      this.__packagesToLoad--;
      if (this.__packagesToLoad <= 0) {
        this.__executePackages();
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
     See the LICENSE file in the project's left-level directory for details.

   Authors:
     * Sebastian Werner (wpbasti)
     * Fabian Jakobs (fjakobs)

************************************************************************ */

/**
 * Container, which allows vertical and horizontal scrolling if the contents is
 * larger than the container.
 *
 * Note that this class can only have one child widget. This container has a
 * fixed layout, which cannot be changed.
 *
 * *Example*
 *
 * Here is a little example of how to use the widget.
 *
 * <pre class='javascript'>
 *   // create scroll container
 *   var scroll = new qx.ui.container.Scroll().set({
 *     width: 300,
 *     height: 200
 *   });
 *
 *   // add a widget which is larger than the container
 *   scroll.add(new qx.ui.core.Widget().set({
 *     width: 600,
 *     minWidth: 600,
 *     height: 400,
 *     minHeight: 400
 *   }));
 *
 *   this.getRoot().add(scroll);
 * </pre>
 *
 * This example creates a scroll container and adds a widget, which is larger
 * than the container. This will cause the container to display vertical
 * and horizontal toolbars.
 *
 * *External Documentation*
 *
 * <a href='http://manual.qooxdoo.org/${qxversion}/pages/widget/scroll.html' target='_blank'>
 * Documentation of this widget in the qooxdoo manual.</a>
 */
qx.Class.define("qx.ui.container.Scroll",
{
  extend : qx.ui.core.scroll.AbstractScrollArea,
  include : [qx.ui.core.MContentPadding],



  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  /**
   * @param content {qx.ui.core.LayoutItem?null} The content widget of the scroll
   *    container.
   */
  construct : function(content)
  {
    this.base(arguments);

    if (content) {
      this.add(content);
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
     * Sets the content of the scroll container. Scroll containers
     * may only have one child, so it always replaces the current
     * child with the given one.
     *
     * @param widget {qx.ui.core.Widget} Widget to insert
     */
    add : function(widget) {
      this.getChildControl("pane").add(widget);
    },


    /**
     * Returns the content of the scroll area.
     *
     * @param widget {qx.ui.core.Widget} Widget to remove
     */
    remove : function(widget) {
      this.getChildControl("pane").remove(widget);
    },


    /**
     * Returns the content of the scroll container.
     *
     * Scroll containers may only have one child. This
     * method returns an array containing the child or an empty array.
     *
     * @return {Object[]} The child array
     */
    getChildren : function() {
      return this.getChildControl("pane").getChildren();
    },


    /**
     * Returns the element, to which the content padding should be applied.
     *
     * @return {qx.ui.core.Widget} The content padding target.
     */
    _getContentPaddingTarget : function() {
      return this.getChildControl("pane");
    }
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2009 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Sebastian Werner (wpbasti)
     * Andreas Ecker (ecker)

************************************************************************ */

/**
 * A wrapper for Cookie handling.
 */
qx.Bootstrap.define("qx.bom.Cookie",
{
  /*
  *****************************************************************************
     STATICS
  *****************************************************************************
  */

  statics :
  {
    /*
    ---------------------------------------------------------------------------
      USER APPLICATION METHODS
    ---------------------------------------------------------------------------
    */

    /**
     * Returns the string value of a cookie.
     *
     * @param key {String} The key for the saved string value.
     * @return {null | String} Returns the saved string value, if the cookie
     *    contains a value for the key, <code>null</code> otherwise.
     */
    get : function(key)
    {
      var start = document.cookie.indexOf(key + "=");
      var len = start + key.length + 1;

      if ((!start) && (key != document.cookie.substring(0, key.length))) {
        return null;
      }

      if (start == -1) {
        return null;
      }

      var end = document.cookie.indexOf(";", len);

      if (end == -1) {
        end = document.cookie.length;
      }

      return unescape(document.cookie.substring(len, end));
    },


    /**
     * Sets the string value of a cookie.
     *
     * @param key {String} The key for the string value.
     * @param value {String} The string value.
     * @param expires {Number?null} The expires in days starting from now,
     *    or <code>null</code> if the cookie should deleted after browser close.
     * @param path {String?null} Path value.
     * @param domain {String?null} Domain value.
     * @param secure {Boolean?null} Secure flag.
     */
    set : function(key, value, expires, path, domain, secure)
    {
      // Generate cookie
      var cookie = [ key, "=", escape(value) ];

      if (expires)
      {
        var today = new Date();
        today.setTime(today.getTime());

        cookie.push(";expires=", new Date(today.getTime() + (expires * 1000 * 60 * 60 * 24)).toGMTString());
      }

      if (path) {
        cookie.push(";path=", path);
      }

      if (domain) {
        cookie.push(";domain=", domain);
      }

      if (secure) {
        cookie.push(";secure");
      }

      // Store cookie
      document.cookie = cookie.join("");
    },


    /**
     * Deletes the string value of a cookie.
     *
     * @param key {String} The key for the string value.
     * @param path {String?null} Path value.
     * @param domain {String?null} Domain value.
     */
    del : function(key, path, domain)
    {
      if (!qx.bom.Cookie.get(key)) {
        return;
      }

      // Generate cookie
      var cookie = [ key, "=" ];

      if (path) {
        cookie.push(";path=", path);
      }

      if (domain) {
        cookie.push(";domain=", domain);
      }

      cookie.push(";expires=Thu, 01-Jan-1970 00:00:01 GMT");

      // Store cookie
      document.cookie = cookie.join("");
    }
  }
});
