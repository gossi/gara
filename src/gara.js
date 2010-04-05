/*	$Id: MessageBox.class.js 180 2009-07-28 18:28:51Z tgossmann $

		gara - Javascript Toolkit
	===========================================================================

		Copyright (c) 2007 Thomas Gossmann

		Homepage:
			http://gara.creative2.net

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

if (typeof(gara) !== "undefined") {
	var gara = {};
}

(function() {
	// Var defs and inits
	// #########################################################################

	// gara
	var elements, i, loadLib, config = {
			global : window,
			baseUrl : "./",
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
		classqs = {},
		provideClass = "", superClass = "",
		useqs = {},
		childs = {},
		ccbc = 1, fireChain, fireReady, fireSuper, chainSuper, fixContexts, fixDescriptor,
		Class = function () {}, PropModifier;

	// Language fixes
	// #########################################################################

	if (typeof Array.isArray !== 'function') {
		Array.isArray = function (value) {
			return Object.prototype.toString.apply(value) === '[object Array]';
		};
	}

	// Default config
	// #########################################################################

	// Get script base path
	elements = document.getElementsByTagName("script");
	for (i = 0; i < elements.length; ++i) {
		if (elements[i].src && (elements[i].src.indexOf("gara.js") != -1)) {
			config.baseUrl = elements[i].src.substring(0, elements[i].src.lastIndexOf("/"));
			break;
		}
	}

	config.libs = config.baseUrl + "/../lib/";

	// load global config
	if (typeof (gara) == "object") {
		for (var e in gara) {
			config[e] = gara[e];
		}
	}

	gara = {};
	gara.toString = function () {return "[gara]";};
	gara.version = "1.0b3";

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
		}
	})();

	loadLib = function (uri) {
		var xhr = gara.XHR(), code;
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

	if (typeof (base2) == "undefined" || typeof (base2.DOM) == "undefined") {
		loadLib("base2-dom-fp.js");
	}
	base2.JavaScript.bind(window);

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

	// Resource Management
	// #########################################################################

	resourcesBase = ["gara.app", "gara.jsface.action", "gara.jsface.viewers", "gara.jswt.widgets", "gara.jswt.events", "gara.jswt", "gara"],
 	resourcesBasePaths = [config.baseUrl + "/gara.app", config.baseUrl + "/gara.jsface.action", config.baseUrl + "/gara.jsface.viewers", config.baseUrl + "/gara.jswt.widgets", config.baseUrl + "/gara.jswt.events", config.baseUrl + "/gara.jswt", config.baseUrl + "/gara"],
	callbackqs[cbc] = {resources : []};

	gara.setResourcePath = gara.registerModulePath = function (resource, path) {
		resourcesBase.push(resource);
		resourcesBasePaths.push(path);
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

	gara.require = function (names, callback) {
		gara.ls(names);
		names = typeof(names) === "string" ? [names] : names;
		names.forEach(function (name) {
			if (!classesReady.contains(name)) {
				classqs[ccbc].classes.push(name);
			}
		});
		if (callback) {
			gara.ready(callback);
		}
	};

	gara.use = function(names) {
		gara.ls(names);
		names = typeof(names) === "string" ? [names] : names;
		names.forEach(function (name) {
			if (!loadQueue.contains(getQualifiedName(name))) {
				if (!Object.prototype.hasOwnProperty.call(useqs, provideClass)) {
					useqs[provideClass] = [];
				}
				useqs[provideClass].push(name);
			}
		});
	};

	gara.$super = function (name) {
		gara.ls(name);
		gara.use(name);
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

		console.log("ready: " + name);

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
			}
		}

		descriptor.getClass = function () {
			return name;
		};
	};

	fixContexts = function (name) {
		var compName = "", components, nextContext, context = config.global, i;
		components = name.split(".");
		// create context if not existent
		for (i = 0; i < components.length - 1; ++i) {
			nextContext = context[components[i]];
			compName += "." + components[i];

			if (typeof nextContext == "undefined") {
				nextContext = {
					toString : function () {
						return "["+compName.substring(1)+"]";
					}
				};
				context[components[i]] = nextContext;
			}

			context = nextContext;
		}
	};

	gara.Class = function (name, descriptor) {
		chainSuper(name, descriptor || name, function (name, descriptor) {
			var lambda, base;

			descriptor = descriptor || name;
			base = descriptor.$extends || Class;

			if (descriptor === name) {
				if (this instanceof gara.Class) {
					lambda = base.extend(descriptor);
					return new lambda();
				}
				return base.extend(descriptor);
			} else {
				fixContexts(name);
				fixDescriptor(name, descriptor);

				// create class
				this.base = base.extend(descriptor);
				eval(name + " = this.base");

				// load uses
				//loadUse(name);
				fireSuper(name);
				if (Object.prototype.hasOwnProperty.call(useqs, name)) {
					gara.require(useqs[name], function() {
						fireReady(name)
					});
				} else {
					fireReady(name);
				}
			}
		});
	};

	gara.Singleton = function (name, descriptor) {
		chainSuper(name, descriptor, function (name, descriptor) {
			var base = descriptor.$extends || Class;
			fixContexts(name);
			fixDescriptor(name, descriptor);
			this.base = base.extend(descriptor);
			eval(name + " = new this.base()");
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

})();