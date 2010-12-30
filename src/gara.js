/*

		gara - Javascript Toolkit
	===========================================================================

		Copyright (c) 2007 Thomas Gossmann

		Homepage:
			http://garathekit.org

		This library is free software;  you  can  redistribute  it  and/or
		modify  it  under  the  terms  of  the   GNU Lesser General Public
		License  as  published  by  the  Free Software Foundation;  either
		version 2.1 of the License, or (at your option) any later version.

		This library is distributed in  the hope  that it  will be useful,
		but WITHOUT ANY WARRANTY; without  even  the  implied  warranty of
		MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See  the  GNU
		Lesser General Public License for more details.

	===========================================================================
*/

"use strict";

/**
 * gara namespace
 * 
 * @namespace
 */
var gara = (function (gara) {
	// Var defs and inits
	// #########################################################################

	// gara
	var elements, i, loadLib, config = {
			global : window,
			baseUrl : ".",
			garaBaseUrl : "./",
			disableIncludes : false
		},

	// resource members
		head = document.getElementsByTagName("head")[0],
		resources = {},
		loadQueue = [],
		cbc = 1, // callback queues counter (increments on each gara.ready)
		getQualifiedName, append, loadHandler, getResourcePath,
		callbackqs = {},
		resourcesBase = [], resourcesBasePaths = [],

	// inheritance members
		initializing = false, fnTest = /xyz/.test(function () {xyz;}) ? /\$super/ : /.*/,
		supers = [],
		classesReady = [],
		classqs = {}, ccbc = 1,
		provideClass = "", superClass = "", childs = {},
		usesqs = {}, usesReady = [], useqs = {}, ucbc = 1, circularEnd = {}, isCircular, circularLoop,
		fireUseReady, requireUse, useReady,
		fireChain, fireReady, fireSuper, chainSuper, fixContexts, fixDescriptor,
		Class = function () {}, PropModifier,
	
	// Event Management members
		listeners = {}, unregisterAllEvents,
	
	// L10n
		l10n = {
			"gara.ok": "Ok",
			"gara.cancel": "Cancel",
			"gara.yes" : "Yes",
			"gara.no" : "No",
			"gara.retry" : "Retry",
			"gara.abort" : "Abort",
			"gara.ignore" : "Ignore"
		};

	// Language fixes and additions
	// #########################################################################

	if (typeof Array.isArray !== 'function') {
		Array.isArray = function (value) {
			return Object.prototype.toString.apply(value) === '[object Array]';
		};
	}
	
	if (typeof Array.prototype.add === "undefined") {
		Array.prototype.add = function (value) {
			this[this.length] = value;
		};
	}
	
	if (typeof Array.prototype.contains === "undefined") {
		Array.prototype.contains = function (item) {
			return this.indexOf(item) !== -1;
		};
	}
	
	if (typeof Array.prototype.remove === "undefined") {
		Array.prototype.remove = function (item) {
			var index = this.indexOf(item);
		    if (index !== -1) {
		    	this.splice(index, 1);
		    }
		};
	}
	
	if (typeof Array.prototype.removeAt === "undefined") {
		Array.prototype.removeAt = function (index) {
			this.splice(index, 1);
		};
	}
	
	if (typeof Array.prototype.insertAt === "undefined") {
		Array.prototype.insertAt = function (index, item) {
			this.splice(index, 0, item);
		};
	}
	
	// Default config
	// #########################################################################

	// Get script base path
	elements = document.getElementsByTagName("script");
	for (i = 0; i < elements.length; ++i) {
		if (elements[i].src && (elements[i].src.indexOf("gara.js") != -1)) {
			config.garaBaseUrl = elements[i].src.substring(0, elements[i].src.lastIndexOf("/"));
			break;
		}
	}

	config.libs = config.garaBaseUrl + "/../lib/";

	// load global config
	if (typeof (gara) == "object") {
		for (var e in gara) {
			config[e] = gara[e];
		}
	}

	gara = {};
	gara.toString = function () {return "[gara]";};
	gara.version = "1.0-beta";

	gara.XHR = (function () {
		var xmlhttp = null, XMLHTTP_PROGIDS = ["Msxml2.XMLHTTP", "Microsoft.XMLHTTP", "Msxml2.XMLHTTP.4.0"];

		return function () {
			if (xmlhttp === null) {
				if (typeof XMLHttpRequest !== "undefined") {
					xmlhttp = XMLHttpRequest;
				} else {
					for ( var i = 0; i < 3; ++i) {
						var progid = XMLHTTP_PROGIDS[i];
						try {
							xmlhttp = ActiveXObject(progid);
						} catch (e) {
						}
					}
				}
			}

			return new xmlhttp();
		};
	})();

	loadLib = function (uri) {
		var xhr = gara.XHR(), code;
		//console.log("load lib: " + config.libs + uri);
		xhr.open('GET', config.libs + uri, false);
		try {
			xhr.send(null);
			// var code = "(function (){" + xhr.responseText + "})();";
			code = xhr.responseText;
			if (window.execScript) {
				window.execScript(code);
				return null;
			}
			return config.global.eval ? config.global.eval(code)
					: eval(code);
		} catch (e) {
			console.error(e);
		}
	};

//	if (typeof (base2) == "undefined" || typeof (base2.DOM) == "undefined") {
//		loadLib("base2-dom-fp.js");
//	}
//	base2.JavaScript.bind(window);

	// Utils
	// #########################################################################

	gara.getStyle = function (element, styleProp) {
		var style;
		if (document.defaultView && document.defaultView.getComputedStyle){
			style = document.defaultView.getComputedStyle(element, "").getPropertyValue(styleProp);
		} else if (element.currentStyle) {
			styleProp = styleProp.replace(/\-(\w)/g, function (match, p1){
				return p1.toUpperCase();
			});
			style = element.currentStyle[styleProp];
		}
		return style;
	};

	gara.getNumStyle = function (element, styleProp) {
		var val = parseInt(gara.getStyle(element, styleProp));
		return isNaN(val) ? 0 : val;
	};

	gara.generateUID = function () {
		var d = new Date();
		return "garaUID" + d.getDay() + d.getHours() + d.getMinutes() + d.getSeconds() + d.getMilliseconds();
	};
	
	// Event Management
	// #########################################################################

	/**
	 * @function Adds a listener to a specified domNode and store the added event
	 *         in the event manager.
	 *
	 * @param {HTMLElement}
	 *            domNode the node where the event is added to
	 * @param {DOMString}
	 *            type the event type
	 * @param {Object|Function}
	 *            listener the desired action handler
	 * @param {boolean}
	 *            [useCapture] boolean flag indicating to use capture or bubble
	 *            (false is default here)
	 * @return {Event} generated event-object for this listener
	 */
	gara.addEventListener = function(domNode, type, listener, useCapture) {
//		base2.DOM.EventTarget(domNode);
		domNode.addEventListener(type, listener, useCapture || false);

//		console.log("EventManager.addListener " + type + " on " + domNode);

		var d = new Date();
		var hashAppendix = "" + d.getDay() + d.getHours() + d.getMinutes() 
							+ d.getSeconds() + d.getMilliseconds();

		if (!domNode._garaHash) {
			domNode._garaHash = domNode.toString() + hashAppendix;
		}

		if (!Object.prototype.hasOwnProperty.call(listener, "_garaHash")) {
			listener._garaHash = listener.toString() + hashAppendix;
		}

		var hash = "" + domNode._garaHash + type + listener._garaHash;
		var event = {
			domNode : domNode,
			type : type,
			listener : listener
		};
		listeners[hash] = event;

		return event;
	};


	/**
	 * @function Removes a specified event
	 *
	 * @param {Event}
	 *            event object which is returned by addListener()
	 * @see addListener
	 */
	gara.removeEventListener = function(domNode, type, listener) {
		if (domNode) {
			domNode.removeEventListener(type, listener, false);

			if (domNode._garaHash && listener.hasOwnProperty("_garaHash")) {
				var hash = domNode._garaHash + type + listener._garaHash;

				if (listeners[hash]) {
					delete listeners[hash];
				}
			}
		}
	};

	/**
	 * @function
	 *
	 * Removes all stored listeners on the page unload.
	 * @private
	 */
	unregisterAllEvents = function() {
		var hash, e;
		for (hash in listeners) {
			e = listeners[hash];
			gara.removeEventListener(e.domNode, e.type, e.listener);
		}
	};
	
//	base2.DOM.EventTarget(window);
	window.addEventListener("unload", unregisterAllEvents, false);

	// L10n
	// #########################################################################
	
	/**
	 * Returns the value for the key (if existent). If value is passed then the key is set.
	 * 
	 * @param {String} key the L10n key
	 * @param {String} value a new value for the key
	 * @returns {String} the value for the key or an empty string
	 */
	gara.l10n = function (key, value) {
		var v = "";
		if (Object.prototype.hasOwnProperty.call(l10n, key)) {
			v = l10n[key];
		}
		
		if (typeof value !== "undefined") {
			v = value;
		}
		
		return v;
	};
	
	// Resource Management
	// #########################################################################

	resourcesBase = ["gara.action", 
	                 "gara.dialogs", 
	                 "gara.events",
	                 "gara.layout",
	                 "gara.viewers", 
	                 "gara.widgets",
	                 "gara.window"],
	resourcesBasePaths = [config.garaBaseUrl + "/gara.action",
	                      config.garaBaseUrl + "/gara.dialogs",
	                      config.garaBaseUrl + "/gara.events", 
	                      config.garaBaseUrl + "/gara.layout", 
	                      config.garaBaseUrl + "/gara.viewers", 
	                      config.garaBaseUrl + "/gara.widgets", 
	                      config.garaBaseUrl + "/gara.window"],
	callbackqs[cbc] = {resources : []};

	gara.setResourcePath = gara.registerModulePath = function (resource, path) {
		resourcesBase.add(resource);
		resourcesBasePaths.add(path);
	};

	getResourcePath = function (resource) {
		var tail = "", pos, res;
		while (resource.indexOf("/") !== -1) {
			pos = resource.lastIndexOf("/");
			res = resource.substring(0, pos === -1 ? resource.length : pos);
			tail = resource.replace(/(.+)\/([^\/]+)$/g, "$2") + (tail === "" ? tail : "/" + tail);
			if (resourcesBase.contains(res)) {
				return resourcesBasePaths[resourcesBase.indexOf(res)] + "/" + tail + ".js";
			} else {
				resource = resource.replace(/(.+)\/([^\/]+)$/g, "$1");
			}
		}

		return config.baseUrl + "/" + resource + (tail === "" ? tail : "/" + tail) + ".js";
	};

	gara.loadScript = function (resource, callback) {
		resource = typeof(resource) === "string" ? [resource] : resource;
		resource.forEach(function (resource) {
			resource = getQualifiedName(resource);

			if (!Object.prototype.hasOwnProperty.call(resources, resource)) {
				resources[resource] = {
					name : resource,
					path : getResourcePath(resource),
					loaded : false,
					callbackqs : []
				};

				if (!loadQueue.contains(resource)) {
					loadQueue.push(resource);
					append(resources[resource]);
				}

				// map
				resources[resource].callbackqs.push(cbc);
			}

			callbackqs[cbc].resources.push(resources[resource]);
		});

		if (callback) {
			gara.loaded(callback);
		}
	};

	gara.ls = gara.loadScript;

	gara.loaded = function (callback) {
		if (loadQueue.length) {
			callbackqs[cbc++].callback = callback;
			callbackqs[cbc] = {resources : []};
		} else {
			callback.call();
		}
	};

	loadHandler = function (e) {
		var node = e.target || e.srcElement, resource = resources[node.name];
		if (e.type === "load" || /^(complete|loaded)$/.test(node.readyState)) {
			loadQueue.remove(resource.name);
			resource.loaded = true;

			if (node.removeEventListener) {
				node.removeEventListener("load", loadHandler, false);
			} else if (node.detachEvent) {
				node.detachEvent("onreadystatechange", loadHandler);
			}

			// check queues
			resource.callbackqs.forEach(function (cbc) {
				var allDone = true;
				callbackqs[cbc].resources.forEach(function (res) {
					allDone = allDone && res.loaded;
				});

				if (allDone) {
					if (callbackqs[cbc].callback) {
						callbackqs[cbc].callback.call();
					}

					resource.callbackqs.remove(cbc);
					delete callbackqs[cbc];
				}
			});
		}
	};

	append = function (resource) {
		var node = document.createElement("script");

		if (node.addEventListener) {
			node.addEventListener("load", loadHandler, false);
		} else if (node.attachEvent) {
			node.attachEvent("onreadystatechange", loadHandler);
		}

		node.name = resource.name;
		node.src = resource.path;
		head.appendChild(node);
	};

	getQualifiedName = function (resource) {
		var slashPos, found = false;
		while (resource.indexOf(".") !== -1 && !found) {
			slashPos = resource.indexOf("/");
			found = resourcesBase.contains(resource.substring(0, slashPos === -1 ? resource.length : slashPos));
			if (!found) {
				resource = resource.replace(/(.+)\.([^.]+)$/g, "$1/$2");
			}
		}
		return resource;
	};

	// Inheritance
	// #########################################################################

	/**
	 * Class (c) by John Resig
	 * Inspired by base2 and Prototype
	 * Modifications are made
	 *	* _super is renamed to $super
	 *	* init is renamed to $constructor
	 *
	 * @private
	 * @author John Resig
	 * @see http://ejohn.org/blog/simple-javascript-inheritance/
	 */

	classqs[ccbc] = {classes:[]};
	usesqs[ucbc] = {classes:[]};

	// Create a new Class that inherits from this class
	Class.extend = function (prop) {
		var $super = this.prototype, prototype, protectedProps = {}, key, statics = {};

		// Instantiate a base class (but only create the instance,
		// don't run the init constructor)
		initializing = true,
		prototype = new this();
		initializing = false;

		// Copy the properties over onto the new prototype
		for (key in prop) {
			if (prop[key] instanceof PropModifier) {
				switch (prop[key].getModifier()) {
				case "static":
					statics[key] = prop[key].getValue();
					break;
				}
			} else {
				// Check if we're overwriting an existing function
				prototype[key] = typeof prop[key] == "function"
						&& typeof $super[key] == "function"
						&& fnTest.test(prop[key]) ? (function (key, fn) {
							return function () {
								var tmp = this.$super, ret;

								// Add a new .$super() method that is the same method
								// but on the super-class
								this.$super = $super[key];

								// The method only need to be bound temporarily, so we
								// remove it when we're done executing
								ret = fn.apply(this, arguments);
								this.$super = tmp;

								return ret;
							};
						})(key, prop[key])
								: prop[key];
			}
		}

		// The dummy class constructor
		function Class() {
			// All construction is actually done in the $constructor method
			if (!initializing && this.$constructor) {
				this.$constructor.apply(this, arguments);
			}
		}

		for (key in statics) {
			Class[key] = statics[key];
		}

		// Populate our constructed prototype object
		Class.prototype = prototype;

		// Enforce the constructor to be what we expect
		Class.constructor = Class;

		// And make this class extendable
		Class.extend = arguments.callee;

		return Class;
	};

	PropModifier = function(modifier, value) {
		var m = modifier, v = value;

		this.getModifier = function () {
			return m;
		};

		this.getValue = function () {
			return v;
		};
	};

	gara.provide = function (name, superClass) {
		fixContexts(name);
		var resource = getQualifiedName(name);
		resources[resource] = {
			name : resource,
			loaded : true,
			callbackqs : []
		};
		provideClass = name;

		if (superClass) {
			gara.$super(superClass);
		}
	};

	gara.require = function () {
		var i, name;
		
		for (i = 0; i < arguments.length; i++) {
			name = arguments[i];
			if (typeof (name) === "string") {
				gara.ls(name);
				if (!classesReady.contains(name)) {
					classqs[ccbc].classes.push(name);
				}	
			} else if (typeof(name) === "function") {
				gara.ready(name);
			}
		}
		
//		gara.ls(names);
//		names = typeof(names) === "string" ? [names] : names;
//		names.forEach(function (name) {
//			if (!classesReady.contains(name)) {
//				classqs[ccbc].classes.push(name);
//			}
//		});
//		if (callback) {
//			gara.ready(callback);
//		}
	};

	requireUse = function (names, callback) {
		var allLoaded = true;
		gara.ls(names);
		names = typeof(names) === "string" ? [names] : names;
		names.forEach(function (name) {
			if (!usesReady.contains(name)) {
				usesqs[ucbc].classes.push(name);
			}
		});

		if (callback) {
			usesqs[ucbc].classes.forEach(function (name) {
				allLoaded = allLoaded && usesReady.contains(name);
			});

			if (allLoaded) {
				callback.call();
			} else {
				usesqs[ucbc++].callback = callback;
				usesqs[ucbc] = {classes : []};
			}
		}
	};

	isCircular = function (use, check) {
		var name, i, len, deep;
		circularLoop.add(use);
		if (useqs[use]) {
			for (i = 0, len = useqs[use].length; i < len; i++) {
				name = useqs[use][i];
				if (name === check) {
					circularEnd[check] = use;
					return true;
				}
				if (!circularLoop.contains(name) && isCircular(name, check)) {
					return true;
				}
			}
		}
		return false;
	};

	gara.use = function(names) {
		gara.ls(names);
		names = typeof(names) === "string" ? [names] : names;
		names.forEach(function (name) {
			// deadlock check
			// if a uses b and b uses a
			circularLoop = [];
			if (!isCircular(name, provideClass)) {
				if (!Object.prototype.hasOwnProperty.call(useqs, provideClass)) {
					useqs[provideClass] = [];
				}
				useqs[provideClass].push(name);
			}
		});
	};

	gara.$super = function (name) {
		gara.ls(name);

		superClass = name;
	};

	gara.$static = function (value) {
		return new PropModifier("static", value);
	};

	gara.ready = function (callback) {
		var allLoaded = true;
		classqs[ccbc].classes.forEach(function (name) {
			allLoaded = allLoaded && classesReady.contains(name);
		});

		if (allLoaded) {
			callback.call();
		} else {
			classqs[ccbc++].callback = callback;
			classqs[ccbc] = {classes : []};
		}
	};

	fireReady = function (name) {
		var c, allDone;
		classesReady.push(name);

		for (c in classqs) {
			allDone = true;
			if (classqs[c].classes.contains(name)) {
				classqs[c].classes.forEach(function (name) {
					allDone = allDone && classesReady.contains(name);
				});

				if (allDone) {
					classqs[c].callback.call();
					delete classqs[c];
				}
			}
		}
	};

	fireUseReady = function (name) {
		var c, allDone;
		usesReady.push(name);

		for (c in usesqs) {
			allDone = true;
			if (usesqs[c].classes.contains(name)) {
				usesqs[c].classes.forEach(function (name) {
					allDone = allDone && usesReady.contains(name);
				});

				if (allDone) {
					usesqs[c].callback.call();
					delete usesqs[c];
				}
			}
		}
	};

	fireSuper = function (name) {
		supers.push(name);
		if (Object.prototype.hasOwnProperty.call(childs, name)) {
			childs[name].forEach(function (callback) {
				callback.call();
			});
		}
	};

	chainSuper = function (name, descriptor, callback) {
		if (typeof(descriptor) === "function") {
			if (name === provideClass && superClass && supers.contains(superClass)) {
				return callback.call(this, name, descriptor());
			} else if (superClass && !supers.contains(superClass)) {
				gara.use(superClass);
				if (!Object.prototype.hasOwnProperty.call(childs, superClass)) {
					childs[superClass] = [];
				}
				childs[superClass].push(function () {
					callback.call(this, name, descriptor());
				});
			} else {
				return callback.call(this, name, descriptor());
			}
		} else {
			return callback.call(this, name, descriptor);
		}
	};

	fixDescriptor = function(name, descriptor) {
		// fixing some methods
		if (!Object.prototype.hasOwnProperty.call(descriptor, "toString")
				&& descriptor !== name) {
			descriptor.toString = function () {
				return "[" + name + "]";
			};
		}

		descriptor.getClass = function () {
			return name;
		};
	};

	fixContexts = function (name) {
		var compName = "", components, nextContext, context = config.global, i;
		components = name.split(".");
		
		// create context if not existent
		for (i = 0; i < components.length; ++i) {
			nextContext = context[components[i]];
			compName += "." + components[i];

			if (typeof nextContext === "undefined") {
				nextContext = (function (canonicalName) { 
					return {
						toString : function () {
							return "["+canonicalName+"]";
						}
					};
				})(compName.substring(1));
				context[components[i]] = nextContext;
			}
			context = nextContext;
		}
	};
	
	createClass = function (name, descriptor) {
		var compName = "", components, nextContext, context = config.global, i;
		components = name.split(".");
		// create context if not existent
		for (i = 0; i < components.length - 1; ++i) {
			nextContext = context[components[i]];
			compName += "." + components[i];

			if (typeof nextContext === "undefined") {
				nextContext = {};
				context[components[i]] = nextContext;
			}
			context = nextContext;
		}
		context[components[components.length - 1]] = descriptor;
	};

	gara.Class = function (name, descriptor) {
		chainSuper(name, descriptor || name, function (name, descriptor) {
			var lambda, base, merge;

			descriptor = descriptor || name;
			base = descriptor.$extends || Class;

			if (descriptor === name) {
				if (this instanceof gara.Class) {
					lambda = base.extend(descriptor);
					return new lambda();
				}
				return base.extend(descriptor);
			} else {
				fixDescriptor(name, descriptor);

				// create class
				createClass(name, base.extend(descriptor));

				// load uses
				//loadUse(name);
				fireSuper(name);
				if (Object.prototype.hasOwnProperty.call(useqs, name)) {
					requireUse(useqs[name], function() {
						fireUseReady(name);
						if (circularEnd[name]) {
							merge = useqs[name];
							merge.push(circularEnd[name]);
							gara.require(merge, function () {
								fireReady(name);
							});
						} else {
							fireReady(name);
						}
					});

				} else if (circularEnd[name]) {
					fireUseReady(name);
					gara.require(circularEnd[name], function () {
						fireReady(name);
					});
				} else {
					fireUseReady(name);
					fireReady(name);
				}
			}
		});
	};

	gara.Singleton = function (name, descriptor) {
		chainSuper(name, descriptor, function (name, descriptor) {
			var base = descriptor.$extends || Class;
			fixDescriptor(name, descriptor);
			createClass(name, new (base.extend(descriptor))());
			fireUseReady(name);
			fireReady(name);
		});
	};

	// Fixing Exception and make it extendable
	gara.Class("gara.Exception", {
		$constructor : function (message) {
			this.message = String(message);
		},

		getName : function () {
			return this.getClass();
		},

		getMessage : function () {
			return this.message;
		},

		toString : function () {
			return "[error " + this.getName() + "] " + this.getMessage();
		}
	});

	// Inheritance
	// #########################################################################
	
	/**
	 * @constant
	 * The <tt>MessageBox</tt> style constant for an ABORT button; the only valid combination is ABORT|RETRY|IGNORE (value is 1&lt;&lt;9).
	 */
	gara.ABORT = 512;

	/**
	 * Keyboard event constant representing the DOWN ARROW key.
	 */
	gara.ARROW_DOWN = 40;

	/**
	 * Keyboard event constant representing the LEFT ARROW key.
	 */
	gara.ARROW_LEFT = 37;

	/**
	 * 
	 * Keyboard event constant representing the RIGHT ARROW key.
	 */
	gara.ARROW_RIGHT = 39;

	/**
	 * 
	 * Keyboard event constant representing the UP ARROW key.
	 */
	gara.ARROW_UP = 38;

	/**
	 * 
	 * Style constant for application modal behavior (value is 1&lt;&lt;16).
	 */
	gara.APPLICATION_MODAL = 65536;

	/**
	 * 
	 * Style constant for menu bar behavior (value is 1&lt;&lt;1).
	 */
	gara.BAR = 2;

	/**
	 * 
	 * Style constant for bordered behavior (value is 1&lt;&lt;11).
	 * <p><b>Used By=</b><ul>
	 * <li><code>Decorations</code> and subclasses</li>
	 * </ul></p>
	 */
	gara.BORDER = 2048;

	/**
	 * 
	 * Style constant for align bottom behavior (value is 1&lt;&lt;10; since align DOWN and align BOTTOM are considered the same).
	 */
	gara.BOTTOM = 1024;

	/**
	 * 
	 * The <tt>MessageBox</tt> style constant for a CANCEL button; valid combinations are OK|CANCEL; YES|NO|CANCEL; RETRY|CANCEL (value is 1&lt;&lt;8).
	 */
	gara.CANCEL = 256;

	/**
	 * 
	 * Style constant for cascade behavior (value is 1&lt;&lt;6).
	 * <p><b>Used By=</b><ul>
	 * <li><code>MenuItem</code></li>
	 * </ul></p>
	 */
	gara.CASCADE = 64;

	/**
	 * 
	 * Style constant for check box behavior (value is 1&lt;&lt;5).
	 * <p><b>Used By=</b><ul>
	 * <li><code>MenuItem</code></li>
	 * <li><code>Table</code></li>
	 * <li><code>Tree</code></li>
	 * </ul></p>
	 */
	gara.CHECK = 32;

	/**
	 * Style constant for close box trim (value is 1&lt;&lt;6;
	 * since we do not distinguish between CLOSE style and MENU style).
	 * <p><b>Used By:</b><ul>
	 * <li><code>Decorations</code> and subclasses</li>
	 * <li><code>TabFolder</code></li>
	 * </ul></p>
	 */
	gara.CLOSE = 64;

	/**
	 * 
	 * Indicates that a default should be used (value is 0).
	 *
	 * NOTE= In SWT; this value is -1; but that causes problems with bitwise JavaScript operators...
	 */
	gara.DEFAULT = 0;

	/**
	 * 
	 * Keyboard event constant representing the DEL key.
	 */
	gara.DEL = 46;

	/**
	 * 
	 * Trim style convenience constant for the most common dialog shell appearance
	 * (value is CLOSE|TITLE|BORDER).
	 * <p><b>Used By=</b><ul>
	 * <li><code>Shell</code></li>
	 * </ul></p>
	 */
	gara.DIALOG_TRIM = 32 | 64 | 2048;

	/**
	 * 
	 * Style constant for align down behavior (value is 1&lt;&lt;10; since align DOWN and align BOTTOM are considered the same).
	 */
	gara.DOWN = 1024;

	/**
	 * 
	 * Indicates that a user-interface component is being dragged; for example dragging the thumb of a scroll bar (value is 1).
	 */
	gara.DRAG = 1;

	/**
	 * 
	 * Style constant for drop down menu/list behavior (value is 1&lt;&lt;2).
	 */
	gara.DROP_DOWN = 4;

	/**
	 * JSWT error constant indicating that a menu which needed
	 * to have the drop down style had some other style instead
	 * (value is 21).
	 */
	gara.ERROR_MENU_NOT_DROP_DOWN = 21;

	/**
	 * JSWT error constant indicating that an attempt was made to
	 * invoke an JSWT operation using a widget which had already
	 * been disposed
	 * (value is 24).
	 */
	gara.ERROR_WIDGET_DISPOSED = 24;

	/**
	 * JSWT error constant indicating that a menu item which needed
	 * to have the cascade style had some other style instead
	 * (value is 27).
	 */
	gara.ERROR_MENUITEM_NOT_CASCADE = 27;

	/**
	 * 
	 * Keyboard event constant representing the END key.
	 */
	gara.END = 35;

	/**
	 * 
	 * Keyboard event constant representing the ENTER key.
	 */
	gara.ENTER = 13;

	/**
	 * 
	 * Keyboard event constant representing the ESC key.
	 */
	gara.ESC = 27;

	/**
	 * 
	 * Keyboard event constant representing the HOME key.
	 */
	gara.HOME = 36;

	/**
	 * 
	 * Style constant for horizontal alignment or orientation behavior (value is 1&lt;&lt;8).
	 */
	gara.HORIZONTAL = 256;

	/**
	 * 
	 * Keyboard event constant representing the F1 key.
	 */
	gara.F1 = 112;

	/**
	 * 
	 * Keyboard event constant representing the F2 key.
	 */
	gara.F2 = 113;

	/**
	 * 
	 * Keyboard event constant representing the F3 key.
	 */
	gara.F3 = 114;

	/**
	 * 
	 * Keyboard event constant representing the F4 key.
	 */
	gara.F4 = 115;

	/**
	 * 
	 * Keyboard event constant representing the F5 key.
	 */
	gara.F5 = 116;

	/**
	 * 
	 * Keyboard event constant representing the F6 key.
	 */
	gara.F6 = 117;

	/**
	 * 
	 * Keyboard event constant representing the F7 key.
	 */
	gara.F7 = 118;

	/**
	 * 
	 * Keyboard event constant representing the F8 key.
	 */
	gara.F8 = 119;

	/**
	 * 
	 * Keyboard event constant representing the F9 key.
	 */
	gara.F9 = 120;

	/**
	 * 
	 * Keyboard event constant representing the F10 key.
	 */
	gara.F10 = 121;

	/**
	 * 
	 * Keyboard event constant representing the F11 key.
	 */
	gara.F11 = 122;

	/**
	 * 
	 * Keyboard event constant representing the F12 key.
	 */
	gara.F12 = 123;

	/**
	 * 
	 * Style constant for full row selection behavior (value is 1&lt;&lt;16).
	 */
	gara.FULL_SELECTION = 65536;

	/**
	 * 
	 * The MessageBox style constant for error icon behavior (value is 1).
	 */
	gara.ICON_ERROR = 1;

	/**
	 * 
	 * The MessageBox style constant for information icon behavior (value is 1&lt;&lt;1).
	 */
	gara.ICON_INFORMATION = 2;

	/**
	 * 
	 * The MessageBox style constant for question icon behavior (value is 1&lt;&lt;2).
	 */
	gara.ICON_QUESTION = 4;

	/**
	 * 
	 * The MessageBox style constant for warning icon behavior (value is 1&lt;&lt;3).
	 */
	gara.ICON_WARNING = 8;

	/**
	 * 
	 * The MessageBox style constant for "working" icon behavior (value is 1&lt;&lt;4).
	 */
	gara.ICON_WORKING = 16;

	/**
	 * 
	 * The MessageBox style constant for an IGNORE button; the only valid combination is ABORT|RETRY|IGNORE (value is 1&lt;&lt;11).
	 */
	gara.IGNORE = 2048;
	
	/**
	 * 
	 * The Layout style for a Loosy layout. (value is 1)
	 */
	gara.LAYOUT_LOOSY = 1;

	/**
	 * 
	 * Style constant for maximize box trim (value is 1&lt;&lt;10).
	 * <p><b>Used By=</b><ul>
	 * <li><code>Decorations</code> and subclasses</li>
	 * </ul></p>
	 */
	gara.MAX = 1024;

	/**
	 * 
	 * Style constant for minimize box trim (value is 1&lt;&lt;7).
	 * <p><b>Used By=</b><ul>
	 * <li><code>Decorations</code> and subclasses</li>
	 * </ul></p>
	 */
	gara.MIN = 128;

	/**
	 * 
	 * Style constant for multi-selection behavior in lists and multiple line support on text fields (value is 1&lt;&lt;1).
	 */
	gara.MULTI = 2;

	/**
	 * 
	 * The <tt>MessageBox</tt> style constant for NO button; valid combinations are YES|NO; YES|NO|CANCEL (value is 1&lt;&lt;7).
	 */
	gara.NO = 128;

	/**
	 * 
	 * Style constant for preventing child radio group behavior (value is 1&lt;&lt;22).
	 * <p><b>Used By=</b><ul>
	 * <li><code>Menu</code></li>
	 * </ul></p>
	 */
	gara.NO_RADIO_GROUP = 4194304;

	/**
	 * 
	 * Style constant to ensure no trimmings are used (value is 1&lt;&lt;3).
	 * <br>Note that this overrides all other trim styles.
	 * <p><b>Used By=</b><ul>
	 * <li><code>Decorations</code> and subclasses</li>
	 * </ul></p>
	 */
	gara.NO_TRIM = 8;

	/**
	 * A constant known to be zero (0; typically used in operations
	 * which take bit flags to indicate that "no bits are set".
	 */
	gara.NONE = 0;

	/**
	 * 
	 * The <tt>MessageBox</tt> style constant for an OK button; valid combinations are OK; OK|CANCEL (value is 1&lt;&lt;5).
	 */
	gara.OK = 32;

	/**
	 * 
	 * Keyboard event constant representing the PAGE DOWN key.
	 */
	gara.PAGE_DOWN = 34;

	/**
	 * 
	 * Keyboard event constant representing the PGAE UP key.
	 */
	gara.PAGE_UP = 33;

	/**
	 * 
	 * Style constant for password behavior (value is 1<<22).
	 */
	gara.PASSWORD = 4194304;

	/**
	 * 
	 * Style constant for pop up menu behavior (value is 1&lt;&lt;3).
	 */
	gara.POP_UP = 8;

	/**
	 * 
	 * Style constant for push button behavior (value is 1&lt;&lt;3).
	 */
	gara.PUSH = 8;

	/**
	 * Style constant for radio button behavior (value is 1&lt;&lt;4).
	 * <p><b>Used By=</b><ul>
	 * <li><code>MenuItem</code></li>
	 * </ul></p>
	 */
	gara.RADIO = 16;

	/**
	 * 
	 * Style constant for read-only behavior (value is 1<<3).
	 */
	gara.READ_ONLY = 8;

	/**
	 * 
	 * Style constant for resize box trim (value is 1&lt;&lt;4).
	 * <p><b>Used By=</b><ul>
	 * <li><code>Decorations</code> and subclasses</li>
	 * </ul></p>
	 */
	gara.RESIZE = 16;

	/**
	 * 
	 * The MessageBox style constant for a RETRY button; valid combinations are ABORT|RETRY|IGNORE; RETRY|CANCEL (value is 1&lt;&lt;10).
	 */
	gara.RETRY = 1024;

	/**
	 * 
	 * Contains the scrollbar width (in px).
	 */
	gara.SCROLLBAR_HEIGHT = 0;
	
	/**
	 * 
	 * Contains the scrollbar width (in px).
	 */
	gara.SCROLLBAR_WIDTH = 0; 
		
	gara.addEventListener(document, "DOMContentLoaded", function () {
		// width
		var elem = document.createElement("div");
		elem.style.width = "200px";
		elem.style.height = "200px";
		elem.style.position = "absolute";
		elem.style.left = "-1000px";
		elem.style.top = "-1000px";
		document.getElementsByTagName("body")[0].appendChild(elem);

		elem.style.overflow = "scroll";
		gara.SCROLLBAR_WIDTH = elem.offsetWidth - elem.clientWidth;
		document.getElementsByTagName("body")[0].removeChild(elem);
		
		// height
		elem = document.createElement("div");
		elem.style.width = "200px";
		elem.style.height = "200px";
		elem.style.position = "absolute";
		elem.style.left = "-1000px";
		elem.style.top = "-1000px";
		document.getElementsByTagName("body")[0].appendChild(elem);

		elem.style.overflow = "scroll";
		gara.SCROLLBAR_HEIGHT = elem.offsetHeight - elem.clientHeight;
		document.getElementsByTagName("body")[0].removeChild(elem);
	}, false);

	/**
	 * 
	 * Style constant for line separator behavior (value is 1&lt;&lt;1).
	 */
	gara.SEPARATOR = 2;

	/**
	 * 
	 * Trim style convenience constant for the most common top level shell appearance
	 * (value is CLOSE|TITLE|MIN|MAX|RESIZE|BORDER).
	 * <p><b>Used By=</b><ul>
	 * <li><code>Shell</code></li>
	 * </ul></p>
	 */
	gara.SHELL_TRIM = 32 | 64 | 128 | 1024 | 16 | 2048;

	/**
	 * 
	 * Style constant for single selection behavior in lists and single line support on text fields (value is 1&lt;&lt;2).
	 */
	gara.SINGLE = 4;

	/**
	 * 
	 * Keyboard event constant representing the SPACE key.
	 */
	gara.SPACE = 32;

	/**
	 * 
	 * Style constant for system modal behavior (value is 1&lt;&lt;17).
	 */
	gara.SYSTEM_MODAL = 131072;

	/**
	 * 
	 * Style constant for title area trim (value is 1&lt;&lt;5).
	 * <p><b>Used By=</b><ul>
	 * <li><code>Decorations</code> and subclasses</li>
	 * </ul></p>
	 */
	gara.TITLE = 32;

	/**
	 * 
	 * Style constant for toolbar behavior (value is 1&lt;&lt;4). (gara only; not part of SWT)
	 */
	gara.TOOLBAR = 16;

	/**
	 * 
	 * Style constant for align top behavior (value is 1&lt;&lt;7; since align UP and align TOP are considered the same).
	 */
	gara.TOP = 128;

	/**
	 * 
	 * Style constant for align up behavior (value is 1&lt;&lt;7; since align UP and align TOP are considered the same).
	 */
	gara.UP = 128;

	/**
	 * 
	 * Style constant for vertical alignment or orientation behavior (value is 1&lt;&lt;9).
	 */
	gara.VERTICAL = 512;

	/**
	 * 
	 * The MessageBox style constant for YES button; valid combinations are YES|NO; YES|NO|CANCEL (value is 1&lt;&lt;6).
	 */
	gara.YES = 64;
	
	return gara;
})(gara || {});