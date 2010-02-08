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

gara = {};

(function() {
base2.JavaScript.bind(window);

gara.config = {
	global : window,
	baseUrl : "./",
	disableIncludes : false
};

// Get script base path
var elements = document.getElementsByTagName("script");
for (var i = 0; i < elements.length; ++i) {
	if( elements[i].src && (elements[i].src.indexOf("gara.js") != -1) ) {
		gara.config.baseUrl = elements[i].src.substring(0, elements[i].src.lastIndexOf("/"));
		break;
	}
}

// Get document base path
//var documentBasePath = document.location.href;
//if (documentBasePath.indexOf('?') != -1) {
//	documentBasePath = documentBasePath.substring(0, documentBasePath.indexOf('?'));
//}
//var documentURL = documentBasePath;
//var documentBasePath = documentBasePath.substring(0, documentBasePath.lastIndexOf('/'));
//
//// If not HTTP absolute
//if (baseUrl.charAt(0) != '/') {
//	// If site absolute
//	baseUrl = documentBasePath + "/" + baseUrl;
//}

if (typeof(garaConfig) == "object") {
	var e;
	for (e in garaConfig) {
		gara.config[e] = garaConfig[e];
	}
}

// private members
var loadedUrls = [];
var loadedResources = [];
var packagePaths = {
	"gara.app" : "gara.app",
	"gara.jsface.action" : "gara.jsface.action",
	"gara.jsface.viewers" : "gara.jsface.viewers",
	"gara.jswt.widgets" : "gara.jswt.widgets",
	"gara.jswt.events" : "gara.jswt.events",
	"gara.jswt" : "gara.jswt",
	"gara" : "gara"
};



gara.XHR = function() {
	var XMLHTTP_PROGIDS = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'];
	var xmlhttp = null;
	if (xmlhttp == null) {
		if (typeof XMLHttpRequest != "undefined") {
			xmlhttp = XMLHttpRequest;
		} else {
			for (var i = 0; i < 3; ++i) {
				var progid = XMLHTTP_PROGIDS[i];
				try {
					xmlhttp = ActiveXObject(progid);
				} catch (e) {}

				if (xmlhttp) {
					XMLHTTP_PROGIDS = [progid];
					break;
				}
			}
		}
	}
	return new xmlhttp();
};

gara.setPackagePath = function(pkg, path) {
	packagePaths[pkg] = path;
}

gara.loadScript = function(uri) {
	var xhr = gara.XHR();
	xhr.open('GET', uri, false);
	try {
		xhr.send(null);
		//var code = "(function(){" + xhr.responseText + "})();";
		var code = xhr.responseText;
		if (window.execScript) {
			window.execScript(code);
			return null;
		}
		return gara.config.global.eval ? gara.config.global.eval(code) : eval(code);
	} catch(e){
		console.error(e);
	}
}

gara.require = function(resource) {
	if (gara.config.disableIncludes) {
		return;
	}
	if (!loadedResources.contains(resource)) {
		// resolve path
		for (var pkg in packagePaths) {
			if (resource.match(pkg)) {
				var tail = resource.replace(pkg, "").replace(/\./g,"/");
				var path = gara.config.baseUrl + "/" + packagePaths[pkg] + tail + ".js";
				gara.loadScript(path);
				break;
			}
		}
	}
}

var currentResource;
var usesQueue = {};

gara.provide = function(resource) {
	if (!loadedResources.contains(resource)) {
		currentResource = resource;
		loadedResources.push(resource);
	}
}

gara.use = function(resource) {
	if (gara.config.disableIncludes) {
		return;
	}
	if (!loadedResources.contains(resource)) {
		if (!usesQueue.hasOwnProperty(currentResource)) {
			usesQueue[currentResource] = [];
		}
		usesQueue[currentResource].push(resource);
	}
}

loadUse = function(resource) {
	if (usesQueue.hasOwnProperty(resource)) {
		for (var i = 0; i < usesQueue[resource].length; i++) {
			var r = usesQueue[resource][i];
			if (!loadedResources.contains(r)) {
				// resolve path
				for (var pkg in packagePaths) {
					if (r.match(pkg)) {
						var tail = r.replace(pkg, "").replace(/\./g,"/");
						var path = gara.config.baseUrl + "/" + packagePaths[pkg] + tail + ".js";
						gara.loadScript(path);
						break;
					}
				}
			}
		}
	}
}

//##############################################################################
//The $class Library, version 1.5-debug
//Copyright 2006, Jeff Lau
//License: http://creativecommons.org/licenses/LGPL/2.1/
//Contact: jlau@uselesspickles.com
//Web:     www.uselesspickles.com
//##############################################################################
//CUSTOMIZE FOR PORTABILITY:
//
//Portions of the $class library depend on having a reference to the global
//object. By default, the $class library is configured to work with web
//browsers by expecting the global object to be named "self". To configure
//the $class library to work in other environments, create a global variable
//named "GLOBAL_NAMESPACE_OBJECT_NAME" that contains a String representing the
//name of an object that refers to the global object. This variable must be
//defined before making any calls to the $class library.
//
//Example:
//var GLOBAL_NAMESPACE_OBJECT_NAME = "global";
//
//##############################################################################
//DEBUG WARNING LOGGING:
//
//The debug version of the $class library attempts to log warning  and error
//messages by methods "console.warn" and "console.error". These are logging
//methods supported by the Firebug plugin for the Firefox web browser. If you
//are debugging in a different environment and would like to log warnings/errors
//in some way, create a global named "console" with methods named "warn" and
//"error". These methods should expect to receive a single argument and should
//log/display the value in whatever way is appropriate for your logging needs.
//The logging methods should be defined before any calls to the $class
//library to ensure all warnings are logged.
//
//Example:
//var console = {
//  warn: function(message) {
//    alert("Warning: " + message);
//  },
//
//  error: function(message) {
//    alert("Error: " + message);
//  }
//};
//
//##############################################################################

$class_library = {
	version: "1.5-debug",

	_getGlobalObjectName: function() {
		try {
			this._globalObjectName = GLOBAL_NAMESPACE_OBJECT_NAME;
		} catch (error) {
			this._globalObjectName = "self";
		}

		this._getGlobalObjectName = Function("return this._globalObjectName");

		return this._globalObjectName;
	},

	_getGlobalObject: function() {
		this._globalObject = eval("(" + this._getGlobalObjectName() + ")");
		this._getGlobalObject = Function("return this._globalObject");

		return this._globalObject;
	},

	_warn: function() {
		var global = this._getGlobalObject();

		if (global.console && global.console.warn) {
			global.console.warn.apply(global.console, arguments);
		}
	},

	_error: function() {
		var global = this._getGlobalObject();

		if (global.console && global.console.error) {
			global.console.error.apply(global.console, arguments);
		}

		var message = "";

		for (var i = 0; i < arguments.length; ++i) {
			if (i) {
				message += "; ";
			}

			message += arguments[i];
		}

		throw new Error(message);
	},

	_copyObject: function(obj1, obj2) {
		var result = (arguments.length == 2 && obj1) ? obj1 : {};
		var source = ((arguments.length == 2) ? obj2 : obj1) || {};

		for (var i in source) {
			result[i] = source[i];
		}

		return result;
	},

	_surrogateCtor: function() {}
};

//##############################################################################

function $package(name) {
  // if being called as a constructor...
  if (this instanceof $package) {
    this._name = name;

    return;
  }

  if (!name) {
    $package._currentPackage = null;
    return;
  }

  var components = name.split(".");
  var context = $class_library._getGlobalObject();

  for (var i = 0; i < components.length; ++i) {
    var nextContext = context[components[i]];

    if (!(nextContext instanceof $package)) {
      if (components[i] in context) {
        $class_library._error("Error in $package(\"" + name + "\"): [" +
                          components.slice(0, i + 1).join(".") +
                          "] is already defined and is not a package.");
  }

  nextContext = new $package(components.slice(0, i + 1).join("."));
      context[components[i]] = nextContext;
    }

    context = nextContext;
  }

  $package._currentPackage = context;
}

$package.prototype = {
  getName: function() {
    return this._name;
  },

  toString: function() {
    return "[$package " + this.getName() + "]";
  }
};

//##############################################################################

function $class(name, descriptor) {
	var lambda = false;
	if (typeof(descriptor) == "undefined") {
		descriptor = name;
		name = "lambda";
		lambda = true;
	}

	var components = name.split(".");
	var context = $class_library._getGlobalObject();
	for (var i = 0; i < components.length; ++i) {
		var nextContext = context[components[i]];

		if (typeof nextContext == "undefined") {
			nextContext = {};
			context[components[i]] = nextContext;
		}

		context = nextContext;
	}

	// if being called as a constructor...
	if (this instanceof $class && !lambda) {
		this._name = name;
		this._isNative = descriptor.isNative;
		this._ctor = descriptor.ctor;
		this._baseCtor = descriptor.baseCtor || (this._ctor == Object ? null : Object);
		this._isFinal = Boolean(descriptor.isFinal);
		this._isAbstract = false;
		this._interfaces = {};
		this._abstractMethods = {};
		this._finalMethods = {};
		this._interfaceMethods = {};

		// if not creating $class for Object...
		if (this._ctor != Object) {
			// if inheriting something other than Object...
			if (this._baseCtor != Object && this._ctor != Object) {
				// if this $class object is being created internally by the $class function...
				if (descriptor.calledFrom$class) {
					// a 'surrogate' constructor used to create inheritance relationship
					// without actually invoking the base class's constructor code
					$class_library._surrogateCtor.prototype = this._baseCtor.prototype;
					this._ctor.prototype = new $class_library._surrogateCtor();
					this._ctor.prototype.constructor = this._ctor;
				}

				// inherit info about the base class
				var baseClassInfo = this._baseCtor.$class;
				this._interfaces = $class_library._copyObject(baseClassInfo._interfaces);
				this._abstractMethods = $class_library._copyObject(baseClassInfo._abstractMethods);
				this._finalMethods = $class_library._copyObject(baseClassInfo._finalMethods);
			}

			// store this class info on the prototype
			this._ctor.prototype._$class = this;
		}

		return;
	}

	if ($package._currentPackage) {
		name = $package._currentPackage.getName() + "." + name;
	}

	var baseCtor = descriptor.$extends || Object;

	if (!(baseCtor instanceof Function)) {
		$class._propertyError(name, "$extends", "Must be a constructor function");
	}

	if (baseCtor.$class && baseCtor.$class._isFinal) {
		$class._propertyError(name, "$extends", "Cannot extend [" + baseCtor.$class.getName() + "] because its constructor is declared $final.");
	}

	var isFinal = false;
	var ctorName = name.replace(/[^.]*\./g, "");
	var ctor = descriptor.$constructor || descriptor[ctorName];

	if (ctor instanceof $class._ModifiedProperty && ctor.getModifier() == "final") {
		ctor = ctor.getValue();
		isFinal = true;
	}

	if (!ctor) {
		var global = $class_library._getGlobalObject();

		$class_library._warn("No constructor specified for class [" + name + "]; using an empty default constructor.");
		ctor = new Function();
	}

	if (!(ctor instanceof Function)) {
		$class._propertyError("$constructor", "Must be a function");
	}

	ctor = $class._wrapCtorMethod(ctor, baseCtor);
	ctor.$class = new $class(name, {ctor:ctor, baseCtor:baseCtor, isFinal:isFinal, calledFrom$class:true});

	// implement interfaces
	if (descriptor.$implements != null) {
		var ifaces = descriptor.$implements;

		// convert to an array if it is a single object
		if (!(ifaces instanceof Array)) {
			ifaces = [ifaces];
		}

		for (var i = 0, ifacesLength = ifaces.length; i < ifacesLength; ++i) {
			// make sure the 'interface' to extend is really an interface
			if (!(ifaces[i] instanceof $interface)) {
				$class._propertyError(name, "$implements", "$interface or array of $interfaces expected");
			}

			ctor.$class._implement(ifaces[i]);
		}
	}

	var specialProperties = {$constructor:true,$extends:true,$implements:true,$static:true};
	specialProperties[ctorName] = true;

	// process all properties in the class descriptor
	for (var propertyName in descriptor) {
		// skip over special properties
		if (specialProperties.hasOwnProperty(propertyName)) {
			continue;
		}

		var value = descriptor[propertyName];
		var modifier = "";

		if (value instanceof $class._ModifiedProperty) {
			modifier = value.getModifier();
			value = value.getValue();

			if (value instanceof $class._ModifiedProperty) {
				$class._propertyError(name, propertyName, "Only one modifier may be used per value");
			}

			switch (modifier) {
				case "static":
					ctor.$class._addStatic(propertyName, value, modifier);
					continue;

				case "abstract":
				case "final":
					if (!(value instanceof Function)) {
						$class._propertyError(name, propertyName, "The $" + modifier + " modifier may only be applied to function values.");
					}
					break;
			}
		}

		ctor.$class._addProperty(propertyName, value, modifier);
	}

	// collect names of all interface methods that are not implemented
	var missingInterfaceMethods = ctor.$class._getMissingInterfaceMethods();

	// if any interface methods are not implemented, we have a problem
	if (missingInterfaceMethods.length != 0) {
		var message = "The following interface methods must be implemented: ";

		for (var i = 0; i < missingInterfaceMethods.length; ++i) {
			message += "[" + missingInterfaceMethods[i] + "] ";
		}

		$class._error(name, message);
	}

	// if any abstract methods are remaining, this class is abstract
	for (var methodName in ctor.$class._abstractMethods) {
		ctor.$class._isAbstract = true;
		break;
	}

	// set default toString method
	if (ctor.prototype.toString == Object.prototype.toString) {
		ctor.prototype.toString = new Function("return \"[object \" + gara.typeOf(this) + \"]\";");
	}

	// store the constructor so it is accessible by the specified name
	try {
		if (lambda) {
			return new ctor;
		} else {
			eval(name + " = ctor;");
		}
	} catch (error) {
		$class._error(name, "Invalid class name: " + error.message);
	}

	// call the static initializer
	if (descriptor.$static instanceof Function) {
		try {
			descriptor.$static.call(ctor);
		} catch (error) {
			$class._error(name, "Error while executing static initializer: " + error.message);
		}
	} else if (descriptor.$static != null) {
		$class._propertyError(name, "$static", "function expected");
	}

	loadUse(name);
}

//##############################################################################

$class.prototype = {
  //############################################################################

  getName: function() {
    return this._name;
  },

  //############################################################################

  getConstructor: function() {
    return this._ctor;
  },

  //############################################################################

  getSuperclass: function() {
    return this._baseCtor ? this._baseCtor.$class : null;
  },

  //############################################################################

  isInstance: function(obj) {
    return $class.instanceOf(obj, this._ctor);
  },

  //############################################################################

  implementsInterface: function(iface) {
    return this._interfaces.hasOwnProperty(iface.getName());
  },

  //############################################################################

  toString: function() {
    return "[$class " + this._name + "]";
  },

  //############################################################################

  _implement: function(iface) {
    $class_library._copyObject(this._interfaces, iface._interfaces);
    $class_library._copyObject(this._interfaceMethods, iface._methods);
  },

  //############################################################################

  _addStatic: function(propertyName, value) {
    this._ctor[propertyName] = value;
  },

  //############################################################################

  _addProperty: function(propertyName, value, modifier) {
    // don't override anything that is final
if (this._finalMethods.hasOwnProperty(propertyName)) {
  var className = this._finalMethods[propertyName];
  $class._propertyError(this._name, propertyName, "Cannot override a final property (originally declared final in class [" + className + "])");
}

switch (modifier) {
  case "final":
    this._finalMethods[propertyName] = this._name;
    break;

  case "abstract":
    this._abstractMethods[propertyName] = this._name;
    value = $class._createAbstractMethod(this._name, propertyName);
    break;
}

// if the property is overriding one from an inherited class...
if (propertyName in this._ctor.prototype) {
  var baseValue = this._ctor.prototype[propertyName];

  // only allow functions to be overridden
  if (!(baseValue instanceof Function) || !(value instanceof Function)) {
    $class._propertyError(this._name, propertyName, "Only function properties can be overridden (with another function)");
  } else {
    if ($class._uses$base.test(value) && !this._abstractMethods.hasOwnProperty(propertyName)) {
      // wrap the method to give it access to the special $base property
          value = $class._wrapExtendedMethod(value, baseValue);
        }
      }

      delete this._abstractMethods[propertyName];
    }

    this._ctor.prototype[propertyName] = value;
  },

  //############################################################################

  _getMissingInterfaceMethods: function() {
    var result = new Array();

    for (var methodName in this._interfaceMethods) {
      if (!(this._ctor.prototype[methodName] instanceof Function)) {
        var ifaceName = this._interfaceMethods[methodName];
        result.push(ifaceName + "." + methodName);
  }
}

// don't need this info any more
    delete this._interfaceMethods;

    return result;
  }

  //############################################################################
};

//##############################################################################

$class._uses$base = /\bthis\.\$base\b/;

//##############################################################################

$class._error = function(name, message) {
  $class_library._error("Error in $class(\"" + name + "\"" + ", ...): " + message);
};

//##############################################################################

$class._propertyError = function(name, propertyName, message) {
  $class_library._error("Error in $class(\"" + name + "\"" + ", ...), property [" + propertyName + "]: " + message);
};

//##############################################################################

$class._wrapCtorMethod = function(method, baseMethod) {
  // automatically call the base class constructor if inheriting something
  // other than Object and the constructor does not already call it
  var call$base = !$class._uses$base.test(method) && baseMethod != Object;
  var result = $class._createCtorWrapper(call$base);

  result._$class_wrappedMethod = method;
  result.toString = $class._wrappedMethod_toString;

  return result;
};

//##############################################################################

$class._createCtorWrapper = function(call$base) {
  return function() {
    var method = arguments.callee;

    if (method.$class._isAbstract && this.constructor == method) {
      var message = "Attempted instantiation of the abstract class [" +
                method.$class._name + "]. Abstract methods: ";

  for (var methodName in method.$class._abstractMethods) {
    message += "[" + method.$class._abstractMethods[methodName] + "." +
               methodName + "] ";
      }

      $class_library._error(message);
    }

    var previousBase = this.$base;
    this.$base = method.$class._baseCtor;

    try {
      if (call$base) {
        this.$base.apply(this, arguments);
      }

      return method._$class_wrappedMethod.apply(this, arguments);
    } finally {
      this.$base = previousBase;
    }
  };
};

//##############################################################################

$class._wrapExtendedMethod = function(method, baseMethod) {
  var result = $class._createExtendedMethodWrapper();

  result._$class_wrappedMethod = method;
  result._$class_baseMethod = baseMethod;
  result.toString = $class._wrappedMethod_toString;

  return result;
};

//##############################################################################

$class._createExtendedMethodWrapper = function() {
  return function() {
    var method = arguments.callee;

    var previousBase = this.$base;
    this.$base = method._$class_baseMethod;

    try {
      return method._$class_wrappedMethod.apply(this, arguments);
    } finally {
      this.$base = previousBase;
    }
  };
};

//##############################################################################

$class._wrappedMethod_toString = function() {
  return String(this._$class_wrappedMethod);
};

//##############################################################################

$class._createAbstractMethod = function(name, propertyName) {
  return function() {
    $class_library._error("The abstract method [" + propertyName + "] declared " +
                      "by class [" + name + "] was invoked on an object of type [" +
                      $class.typeOf(this) + "].");
  };
};

//##############################################################################

$class._ModifiedProperty = function(modifier, value) {
  this._modifier = modifier;
  this._value = value;
};

$class._ModifiedProperty.prototype = {
  getModifier: function() {
    return this._modifier;
  },

  getValue: function() {
    return this._value;
  }
};

//##############################################################################

$class.resolve = function(qualifiedName) {
  try {
    return eval("(" + $class_library._getGlobalObjectName() + "." + qualifiedName + ")");
  } catch(error) {
    $class_library._warn("$class.resolve(\"" + qualifiedName + "\") failed: " + error);
    return undefined;
  }
}

//##############################################################################

$class.implementationOf = function(obj, iface) {
  return $class.getClass(obj).implementsInterface(iface);
};

//##############################################################################

$class.instanceOf = function(obj, type) {
  if (type instanceof $interface) {
    return $class.implementationOf(obj, type);
  }

  switch (typeof obj) {
    case "object":
  return (obj instanceof type) ||
         // special case for null
         (obj === null && type == Null) ||
         // allow RegExp to be considered an instance of Function
         (obj instanceof RegExp) && (type == Function);

case "number":
  return (type == Number);

case "string":
  return (type == String);

case "boolean":
  return (type == Boolean);

case "function":
  return (type == Function) ||
         // see if it's really a RegExp (because typeof identifies regular
         // expressions as functions in Firefox)
         (obj instanceof RegExp) && (type == RegExp);

case "undefined":
      return (type == Undefined);
  }

  return false;
};

//##############################################################################

$class.typeOf = function(obj) {
  return $class.getClass(obj).getName();
};

//##############################################################################

$class.getClass = function(obj) {
  if (obj == null) {
    if (obj === undefined) {
      return Undefined.$class;
    }

    return Null.$class;
  }

  return obj._$class || Object.$class;
};

//##############################################################################

$class.instantiate = function(ctor, args) {
  if (ctor.$class && ctor.$class.isNative()) {
    return ctor.apply($class_library._getGlobalObject(), args);
  } else {
    $class_library._surrogateCtor.prototype = ctor.prototype;
    var result = new $class_library._surrogateCtor();
    ctor.apply(result, args);

    return result;
  }
};

//##############################################################################

function $interface(name, descriptor) {
  var components = name.split(".");
  var context = $class_library._getGlobalObject();
  for (var i = 0; i < components.length; ++i) {
    var nextContext = context[components[i]];

    if (typeof nextContext == "undefined") {
      nextContext = {};
      context[components[i]] = nextContext;
    }

    context = nextContext;
  }
  // if being called as a constructor...
  if (this instanceof $interface) {
    this._name = name;
    this._methods = {};
    this._methodsArray = null;
    this._interfaces = {};
    this._interfaces[name] = this;
    return;
  }

  if ($package._currentPackage) {
    name = $package._currentPackage.getName() + "." + name;
  }

  var iface = new $interface(name);

  // extend interfaces
  if (descriptor.$extends != null) {
    var ifaces = descriptor.$extends;

    // convert to an array if it is a single object
if (!(ifaces instanceof Array)) {
  ifaces = [ifaces];
}

for (var i = 0, ifacesLength = ifaces.length; i < ifacesLength; ++i) {
  // make sure the 'interface' to extend is really an interface
  if (!(ifaces[i] instanceof $interface)) {
    $interface._propertyError(name, "$extends", "$interface or array of $interfaces expected");
      }

      iface._extend(ifaces[i]);
    }
  }

  var specialProperties = {$extends:true};
  var invalidProperties = {$constructor:true,$implements:true,$static:true};

  // process all properties in the descriptor
  for (var propertyName in descriptor) {
    // skip over the special properties
if (specialProperties.hasOwnProperty(propertyName)) {
  continue;
}

// check for invalid properties
if (invalidProperties.hasOwnProperty(propertyName)) {
  $interface._propertyError(name, propertyName, "invalid property for an $interface");
}

var value = descriptor[propertyName];

if (value instanceof $class._ModifiedProperty && value.getModifier() == "static") {
  iface._addStatic(propertyName, value.getValue());
} else if (value instanceof Function) {
  iface._addMethod(propertyName);
} else {
  $interface._propertyError(name, propertyName, "Function or static value expected");
    }
  }

  // store the interface so it can be referenced by the specified name
  try {
    eval(name + " = iface;");
  } catch (error) {
    $interface._error(name, "Invalid interface name: " + error.message);
  }
}

//##############################################################################

$interface.prototype = {
  //############################################################################

  getName: function() {
    return this._name;
  },

  //############################################################################

  hasMethod: function(methodName) {
    return Boolean(this._methods[methodName]);
  },

  //############################################################################

  getMethods: function() {
    if (!this._methodsArray) {
      this._methodsArray = [];

      for (var methodName in this._methods) {
        this._methodsArray.push(methodName);
      }
    }

    return this._methodsArray;
  },

  //############################################################################

  toString: function() {
    return "[$interface " + this._name + "]";
  },

  //############################################################################

  _extend: function(iface) {
    $class_library._copyObject(this._methods, iface._methods);
    $class_library._copyObject(this._interfaces, iface._interfaces);
  },

  //############################################################################

  _addStatic: function(propertyName, value) {
    this[propertyName] = value;
  },

  //############################################################################

  _addMethod: function(propertyName) {
    this._methods[propertyName] = this._name;
  }

  //############################################################################
};

//##############################################################################

$interface._error = function(name, message) {
  $class_library._error("Error in $interface(\"" + name + "\"" + ", ...): " + message);
};

//##############################################################################

$interface._propertyError = function(name, propertyName, message) {
  $class_library._error("Error in $interface(\"" + name + "\"" + ", ...), property [" + propertyName + "]: " + message);
};

//##############################################################################

function $abstract(method) {
  return new $class._ModifiedProperty("abstract", method);
}

function $static(value) {
  return new $class._ModifiedProperty("static", value);
}

function $final(method) {
  return new $class._ModifiedProperty("final", method);
}

//##############################################################################

$package.$class   = new $class("$package",   {ctor:$package});
$class.$class     = new $class("$class",     {ctor:$class});
$interface.$class = new $class("$interface", {ctor:$interface});

Object.$class   = new $class("Object",   {isNative:true, ctor:Object});
Array.$class    = new $class("Array",    {isNative:true, ctor:Array});
String.$class   = new $class("String",   {isNative:true, ctor:String});
Number.$class   = new $class("Number",   {isNative:true, ctor:Number});
Boolean.$class  = new $class("Boolean",  {isNative:true, ctor:Boolean});
Function.$class = new $class("Function", {isNative:true, ctor:Function});
RegExp.$class   = new $class("RegExp",   {isNative:true, ctor:RegExp, baseCtor:Function});
Date.$class     = new $class("Date",     {isNative:true, ctor:Date});

Error.$class          = new $class("Error",          {isNative:true, ctor:Error});
EvalError.$class      = new $class("EvalError",      {isNative:true, ctor:EvalError,      baseCtor:Error});
RangeError.$class     = new $class("RangeError",     {isNative:true, ctor:RangeError,     baseCtor:Error});
ReferenceError.$class = new $class("ReferenceError", {isNative:true, ctor:ReferenceError, baseCtor:Error});
SyntaxError.$class    = new $class("SyntaxError",    {isNative:true, ctor:SyntaxError,    baseCtor:Error});
TypeError.$class      = new $class("TypeError",      {isNative:true, ctor:TypeError,      baseCtor:Error});
URIError.$class       = new $class("URIError",       {isNative:true, ctor:URIError,       baseCtor:Error});

//##############################################################################

$class("Undefined", {
  Undefined: $final(function() {
    $class_library._error("Attempted instantiation of the Undefined class.");
  })
});

$class("Null", {
  Null: $final(function() {
    $class_library._error("Attempted instantiation of the Null class.");
  })
});

//##############################################################################

$class("Exception", {
  $extends: Error,

  Exception: function(message) {
    this.message = String(message);
    this.name = $class.typeOf(this);
  },

  getName: $final(function() {
    return this.name;
  }),

  getMessage: $final(function() {
    return this.message;
  }),

  toString: $final(function() {
    return "[error " + this.getName() + "] " + this.getMessage();
  })
});

//##############################################################################

/* gara Wrapper functions */

gara.Class = $class;
gara.Interface = $interface;

gara.abstract = $abstract;
gara.static = $static;
gara.final = $final;

gara.instanceOf = $class.instanceOf;
gara.getClass = $class.getClass;
gara.implementationOf = $class.implementationOf;
gara.typeOf = $class.typeOf;
gara.resolve = $class.resolve;

if (typeof(base2) == "undefined" && typeof(base2.DOM) == "undefined") {
	gara.loadScript(gara.config.baseUrl + "/base2-dom-fp.js");
}
})();