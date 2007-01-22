// for inheritance, from: http://phrogz.net/JS/Classes/OOPinJS2.html
Function.prototype.inheritsFrom = function(parentClassOrObject) { 
	if (parentClassOrObject.constructor == Function) { 
		//Normal Inheritance 
		this.prototype = new parentClassOrObject;
		this.prototype.constructor = this;
		this.prototype.parent = parentClassOrObject.prototype;
	} else { 
		//Pure Virtual Inheritance 
		this.prototype = parentClassOrObject;
		this.prototype.constructor = this;
		this.prototype.parent = parentClassOrObject;
	} 
	return this;
}
function strReplace(string, search, replace) {
	output = "" + string;
	while( output.indexOf(search) > -1 ) {
		pos = output.indexOf(search);
		output = "" + (output.substring(0, pos) + replace +
			output.substring((pos + search.length), output.length));
	}
	return output;
}

function uniqueId() {
	var d = new Date();
	var ID = d.getDate()+""+d.getMonth() + 1+""+d.getFullYear()+""+d.getHours()+""+d.getMinutes()+""+d.getSeconds()+""+d.getMilliseconds();
	return ID;
}

function error(sClass, sMethod, sMessage) {
	alert("Error\n-----\n\n" + sClass + "::" + sMethod + "\n" + sMessage);
}
Array.prototype.indexOf = function(value) {
	var key = false;
	for( var i = 0; i < this.length; ++i ) {
		if( this[i] == value ) {
			key = i;
			break;
		}
	}
	
	return key;
}

/**
 * 
 * @deprecated
 */
Array.prototype.getKey = Array.prototype.indexOf;

/**
 * Proves if the searchterm is in the array or not
 * @param mNeedle the searchterm
 * @return true if the Needle exists or false if the needle isn't in the array
 */
Array.prototype.contains = function(mNeedle) {
	for( var i = 0; i < this.length; ++i ) {
		if( this[i] == mNeedle ) {
			return true;
		}
	}
	
	return false;
}

/**
 * 
 * @deprecated
 */
//Array.prototype.inArray = Array.prototype.contains;

Array.prototype.remove = function(iOffset) {
	if (iOffset < this.length) {
		this.splice(iOffset, 1);
	}
}

function Exception(sMessage, sErrClass, sErrMethod) {
	this.sMessage;
	this.sErrClass;
	this.sErrMethod;
	this.sType = "Exception";

	if (typeof(sMessage) == "string") {
		this.sMessage = sMessage;
	}

	if (typeof(sErrClass) == "string") {
		this.sErrClass = sErrClass;
	}

	if (typeof(sErrMethod) == "string") {
		this.sErrMethod = sErrMethod;
	}
}

Exception.prototype.getErrClass = function() {
	return this.sErrClass;
}

Exception.prototype.getExceptionType = function() {
	return this.sType;	
}

Exception.prototype.getErrMethod = function() {
	return this.sErrMethod;
}

Exception.prototype.getMessage = function() {
	return this.sMessage;
}

Exception.prototype.setErrClass = function(sErrClass) {
	this.sErrClass = sErrClass;
}

Exception.prototype.setErrMethod = function(sErrMethod) {
	this.sErrMethod = sErrMethod;
}

Exception.prototype.setMessage = function(sMessage) {
	this.sMessage = sMessage;
}

Exception.prototype.toString = function() {
	return "[Exception] " + this.sMessage;
}
//function WronbObjectException(sMessage, sErrClass, sErrMethod) {
//	this.sType = "WrongObjectException";
//
//	if (typeof(sMessage) == "string") {
//		this.sMessage = sMessage;
//	}
//
//	if (typeof(sErrClass) == "string") {
//		this.sErrClass = sErrClass;
//	}
//
//	if (typeof(sErrMethod) == "string") {
//		this.sErrMethod = sErrMethod;
//	}
//}

function WrongObjectException(sMessage, sErrClass, sErrMethod) {
	this.sType = "WrongObjectException";
	
	Exception.prototype.constructor.call(this, sMessage, sErrClass, sErrMethod);
}

WrongObjectException.inheritsFrom(Exception);
function OutOfBoundsException(sMessage, sErrClass, sErrMethod) {
	this.sType = "OutOfBoundsException";
	
	Exception.prototype.constructor.call(this, sMessage, sErrClass, sErrMethod);
}

OutOfBoundsException.inheritsFrom(Exception);
function DefectInterfaceImplementationException(sMessage, sErrClass, sErrMethod) {
	this.aMissingMethods = new Array();
	this.sType = "DefectInterfaceImplementationException";
	
	Exception.prototype.constructor.call(this, sMessage, sErrClass, sErrMethod);
}

DefectInterfaceImplementationException.inheritsFrom(Exception);

DefectInterfaceImplementationException.prototype.addMissingMethod = function(sMethod) {
	this.aMissingMethods.push(sMethod);
}

DefectInterfaceImplementationException.prototype.getMissingMethods = function() {
	var sReturn = "";
	
	for (var i = 0; i < this.aMissingMethods.length; ++i) {
		sReturn += this.aMissingMethods[i] + ", ";
	}
	sReturn = sReturn.substring(0, -2);
	return sReturn;
}

DefectInterfaceImplementationException.prototype.toString = function() {
	return "[DefectInterfaceImplementationException] " + this.sMessage + 
		"\nMissing Methods: " + this.getMissingMethods();
}
function AbstractList () {
	Array.prototype.constructor.call(this);
}

AbstractList.inheritsFrom(Array);

AbstractList.prototype.empty = function() {
	return this.length == 0;
}

AbstractList.prototype.size = function() {
	return this.length;
}

AbstractList.prototype.get = function(iOffset) {
	if (iOffset > this.length) {
		throw new OutOfBoundsException("[AbstractList] Index (" + iOffset + ") out of bounds");
	} else {
		return this[iOffset];
	}
}
function Queue() {
	AbstractList.prototype.constructor.call(this);
}

Queue.inheritsFrom(AbstractList);

Queue.prototype.peek = function() {
	if (this.empty()) {
		return false;
	} else {
		return this[0];
	}
}

Queue.prototype.pop = function() {
	return this.shift();
}
function Stack() {
	//this.aEntries = new Array();
	AbstractList.prototype.constructor.call(this);
}

Stack.inheritsFrom(AbstractList);

Stack.prototype.peek = function() {
	if (this.empty()) {
		return false;
	} else {
		return this[this.length - 1];
	}
}

//Stack.prototype.pop = function() {
//	return this.aEntries.pop();
//}
// constants... hust
function ExceptionHandler() {
	this.ER_ALERT = 1;
	this.ER_LOG = 2;
	this.sErrorMessage;
	this.sErrorDescription = "";
	this.log;
	this.iErrorReporting = this.ER_ALERT;
}

ExceptionHandler.prototype.setErrorReporting = function(iER) {
	this.iErrorReporting = iER;	
}

ExceptionHandler.prototype.setLog = function(log) {
	this.log = log;
}

ExceptionHandler.prototype.exceptionRaised = function(e) {
	
	this.buildError(e);
	
	switch (this.iErrorReporting) {
		
		case this.ER_LOG:
			//sError = strReplace("\n", "\n<br/>", sError);
			this.Log.addError(this.sErrorMessage, this.sErrorDescription);
			break;

		case this.ER_ALERT:
		default:
			alert(this.sErrorMessage + "\n" + this.sErrorDescription);
			break;
	}
}

ExceptionHandler.prototype.buildError = function(e) {

	this.sErrorDescription = "";

	if (e instanceof Exception) {
		var sExceptionType = e.getExceptionType();
		this.sErrorMessage = "[" + sExceptionType + "] " + e.getMessage();
		
		if (typeof(e.getErrClass()) != "undefined" 
			&& typeof(e.getErrMethod()) != "undefined") {	
			this.sErrorDescription = e.getErrClass() + "::" + e.getErrMethod() + "\n";
		}
	
		if (e instanceof(DefectInterfaceImplementationException)) {
			this.sErrorDescription += "\nMissing Methods: " + e.getMissingMethods();
		}
	} else if (typeof(e) == "string"){
		this.sErrorMessage = e;
	} else {
		this.sErrorMessage = e.toString();		
	}
}
function InterfaceTester() {
}

InterfaceTester.prototype.isIWriter = function(Obj) {
	var bOk = true;
	var e = new DefectInterfaceImplementationException();

	if (!Obj.update) {
		bOk = false;
		e.addMissingMethod('update');
	}

	if (bOk) {
		delete e;
		return true;
	} else {
		throw e;
	}
}
function LogNode(sText, sDescription) {
//	this.sText = "bla";
	this.sDescription = "";
	this.parentNode = null;
	//this.log = null;
	this.nodes = new Array();

	this.setText(sText);
	this.setDescription(sDescription);
}

LogNode.prototype.setText = function(sText) {
	if (typeof(sText) != "string") {
		sText = "";
	}
	this.sText = sText;
}

LogNode.prototype.setDescription = function(sDescription) {
	if (typeof(sDescription) != "string") {
		sDescription = "";
	}
	this.sDescription = sDescription;
}

LogNode.prototype.setLog = function(log) {
	if (log instanceof(Log)) {
		this.log = log;
	}
}

LogNode.prototype.getLog = function() {
	return this.log;
}

LogNode.prototype.getText = function() {
	return this.sText;
}

LogNode.prototype.getDescription = function() {
	return this.sDescription;
}

/**
 * The content should be filled by the childs of this class
 * @abstract 
 */
LogNode.prototype.getImage = function() {
	return null;
}

LogNode.prototype.hasNodes = function() {
	return this.nodes.length > 0;
}

LogNode.prototype.getNodes = function() {
	return this.nodes;
}

LogNode.prototype.getNodesCount = function() {
	return this.nodes.length;
}

LogNode.prototype.addNode = function(node) {
	this.nodes.push(node);
}

LogNode.prototype.setParent = function(parentNode) {
	this.parentNode = parentNode;
}

LogNode.prototype.getParent = function() {
	return this.parentNode;
}
function LogFolderNode(sText, sDescription) {
	LogNode.prototype.constructor.call(this, sText, sDescription);
}
LogFolderNode.inheritsFrom(LogNode);

LogFolderNode.prototype.getImage = function() {
	image = new Image();
	image.src = gaia.getBaseUrl() + "/res/images/folder.png";

	return image;
}

LogFolderNode.prototype.addNode = function(node) {
	LogNode.prototype.addNode.call(this, node);
	if (typeof(this.log) != "undefined") {
		this.log.notifyWriter(this);
	}
}
function LogMessageNode(sText, sDescription) {
//	this.sText;
	LogNode.prototype.constructor.call(this, sText, sDescription);
}
LogMessageNode.inheritsFrom(LogNode);

LogMessageNode.prototype.getImage = function() {
	image = new Image();
	image.src = gaia.getBaseUrl() + "/res/images/message.png";

	return image;
}
function LogWarningNode(sText, sDescription) {
	LogNode.prototype.constructor.call(this, sText, sDescription);
}
LogWarningNode.inheritsFrom(LogNode);

LogWarningNode.prototype.getImage = function() {
	image = new Image();
	image.src = jsRIA.getBaseUrl() + "/res/images/warning.png";

	return image;
}
function LogErrorNode(sText, sDescription) {
	LogNode.prototype.constructor.call(this, sText, sDescription);
}
LogErrorNode.inheritsFrom(LogNode);

LogErrorNode.prototype.getImage = function() {
	image = new Image();
	image.src = jsRIA.getBaseUrl() + "/res/images/error.png";

	return image;
}
function Log() {
	this.aWriter = new Array();
	this.root = new LogFolderNode();
	this.root.setLog(this);
	this.folders = new Stack();
	this.folders.push(this.root);
	this.currentFolder = this.root;
}

Log.prototype.addMessage = function(sText, sDescription) {
	var message = new LogMessageNode(sText, sDescription)
	message.setLog(this);
	this.append(message);
}

Log.prototype.addError = function(sText, sDescription) {
	var error = new LogErrorNode(sText, sDescription);
	error.setLog(this);
	this.append(error);
}

Log.prototype.createFolder = function(sText, sDescription) {
	var folder = new LogFolderNode(sText, sDescription);
	folder.setLog(this);	
	return folder;
}

Log.prototype.pushLogFolder = function(folder) {
	if (folder instanceof(LogFolderNode)) {
		this.append(folder);
		this.folders.push(folder);
		this.currentFolder = folder;
	}
}

Log.prototype.popLogFolder = function() {
	if (this.folders.peek() != this.root) {
		var returnFolder = this.folders.pop();
		this.currentFolder = this.folders.peek();
		this.notifyWriter(-1);
		return returnFolder;
	}
}

Log.prototype.append = function(node) {
	if (node instanceof(LogNode)) {
		node.setParent(this.currentFolder);
		this.currentFolder.addNode(node);
		this.notifyWriter(node);
	}
}

Log.prototype.addWriter = function(newWriter) {

//	if (!newWriter instanceof(LogWriter)) {
//		throw new WrongObjectException('newWriter is not instance of LogWriter', 'Log', 'addWriter');
//	}
	try {
		gaia.getInterfaceTester().isIWriter(newWriter);
	} catch (e) {
		gaia.getExceptionHandler().exceptionRaised(e);
	}
	this.aWriter.push(newWriter);

	// pass the root message to the writer...
	newWriter.setRoot(this.root);
}

Log.prototype.notifyWriter = function(node) {
	for (var i = 0; i < this.aWriter.length; ++i) {
		this.aWriter[i].update(node);
	}
}
function LogWriter() {
	this.root = null;
	this.builds = new Array();
	this.elements = new Object();
	this.html = null;
}

LogWriter.prototype.setRoot = function(rootNode) {
	if (rootNode instanceof(LogFolderNode)) {
		this.root = rootNode;
		this.html = document.createElement('ul');
		this.builds.push(this.root)
		this.elements[0] = this.html;
	}
}

LogWriter.prototype.build = function() {
	this.update();
	return this.html;
}

LogWriter.prototype.update = function(node) {
	if (typeof(node) == "undefined") {
		node = this.root;
	}
	
	if (node != -1 && node != this.root) {
		node = node.getParent();
	}
	
	this.doUpdate(node);
}

LogWriter.prototype.doUpdate = function(parentNode) {

	// go up ...
	if (parentNode == -1) {
		return;
	}

	var childs = parentNode.getNodes();
	
	for (var i = 0; i < childs.length; ++i) {
		var node = childs[i];
		
		if (this.builds.contains(node)) {
			continue;
		}

		var parentNode = node.getParent();
		var isRoot = parentNode == this.root;
		var iOffset = this.builds.getKey(parentNode);
		var parentElement = this.elements[iOffset];
		var newElement;
		if (node instanceof(LogFolderNode)) {
			var caption = this.createNode(node);
			newElement = document.createElement('ul');
			newElement.style.listStyleImage = "url('"+node.getImage().src+"')";

			if (i + 1 <= childs.length
			&& this.builds.contains(childs[i + 1]) ) {
				parentElement.insertBefore(newElement, childs[i + 1]);
				parentElement.insertBefore(caption, newElement);
			} else {
				parentElement.appendChild(caption);
				parentElement.appendChild(newElement);
			}
		} else {
			newElement = this.createNode(node);
			if (i + 1 <= childs.length
			&& this.builds.contains(childs[i + 1]) ) {
				parentElement.insertBefore(newElement, childs[i + 1]);
			} else {
				parentElement.appendChild(newElement);
			}
		}
		
		this.builds.push(node);
		this.elements[this.builds.length - 1] = newElement;
		
		// apply childs, if node is a folder
		if (node instanceof(LogFolderNode)) {
			this.doUpdate(node);
		}
	}
}

LogWriter.prototype.createNode = function(node) {
	var newNode;
	newNode = document.createElement('li');
	newNode.appendChild(document.createTextNode(node.getText()));
	newNode.style.listStyleImage = "url('"+node.getImage().src+"')";
	
	return newNode;
}
function Console() {
	LogWriter.prototype.constructor.call(this);
}
Console.inheritsFrom(LogWriter);

Console.prototype.open = function() {
	var iTop = 100;
	var iLeft = screen.width - 50 - 450;
	var consoleUrl = this.jsRIA.getBaseUrl() + "/res/console.html";
	var consoleWin = window.open(consoleUrl, 'ConsoleWin', 
		'width=450,height=600,top=' + iTop + 
		',left=' + iLeft + ',location=no,menubar=no,status=no,toolbar=no,' +
		'resizable=yes,scrollbars=yes');
	
	var html = this.build();

	consoleWin.onload = function() {
		consoleWin.document.getElementsByTagName('body')[0].appendChild(html);
	}
}

Console.prototype.printOpenBox = function() {
	var body = document.getElementsByTagName('body')[0];
	var box = document.createElement('div');
	box.setAttribute('style', 
	'position: absolute; top: 10px; right: 10px; padding: 10px;' +
	'border: 1px solid #000; background-color: #c0d2ec; width: 100px;');
	box['innerHTML'] = 
	'<input type="button" style="font-family: Verdana; font-size: 10px;"' +
	'onclick="jsRIA.getConsole().open()" value="Open Console"/>';
	
	body.appendChild(box);
}

Console.prototype.toString = function() {
	return "Console";
}
/**
 * Firebug LogWriter
 * 
 * @author Thomas Gossmann
 * @class Firebug
 * @constructor
 */
function Firebug() {
	this.updated = new Array();
	this.root = null;
}

/**
 * set the root element in the FirebugWriter.
 * 
 * @author Thomas Gossmann
 * @param {LogNode} the root node
 * @type void
 */
Firebug.prototype.setRoot = function(root) {
	this.root = root;
}

/**
 * Update the passed node
 * 
 * @author Thomas Gossmann
 * @param {LogNode} the node to update
 * @type void
 */
Firebug.prototype.update = function(node) {
	if (typeof(node) == "undefined") {
		return;
	}
	else if (node == -1) {
		console.groupEnd();
	}
	else if (this.updated.contains(node)) {
		return;
	}
	else if (node instanceof(LogErrorNode)) {
		console.error(node.getText());
	}
	else if (node instanceof(LogMessageNode)) {
		console.info(node.getText());
	}
	else if (node instanceof(LogWarningNode)) {
		console.warn(node.getText());
	}
	else if (node instanceof(LogFolderNode) && node != this.root) {
		console.group(node.getText());
	}
	else if (node instanceof(LogNode)) {
		// do nothing
	}
	
	this.updated.push(node);
}

/**
 * Simply tells, what object _this_ is
 * 
 * @author Thomas Gossmann
 */
Firebug.prototype.toString = function() {
	return "[object Firebug]";
}
/**
 * Event
 * 
 * @author Thomas Gossmann
 * @class RIAEvent
 * @constructor
 */
function EventListener() {
	/**
	 * Targetted Object
	 */
	this.target = null;

	/**
	 * Method of the target to call
	 */
	this.method = null;

	/**
	 * Function to call if not a method of an object
	 */
	this.fnct = null;

	/**
	 * The original Event object
	 */
	this.event = null;
}

//EventListener.prototype.addEventListener = function(htmlObject, eventType) {
//	this.manager.registerEvent(htmlObject, eventType, this);	
//}

/**
 * Implements IEventListener of the W3C Event-Model
 * 
 * @author Thomas Gossmann
 * @type void
 * @param {Event} the W3C Event
 */
EventListener.prototype.handleEvent = function(e) {
	if (e instanceof EventListener) {
		e = e.event;
	}
	e = e ? e : window.event;
	e.source = typeof(e.target) != "undefined" ? e.target : e.srcElement;
	// TODO: Check this!
//	e.x = e.pageX ? e.pageX : e.clientX;
//	e.y = e.pageY ? e.pageY : e.clientY;
	this.event = e;

	// stop bubbling
	if (this.event.stopPropagation) {
		this.event.stopPropagation();
		this.event.preventDefault();
	} else if (this.event.cancelBubble) {
		this.event.cancelBubble = true;
		this.event.returnValue  = false;
	}

	// execute
	if (this.fnct != null) {
		eval("this.fnct(this)");
	} else {
		var obj = this.target;
		eval("obj."+this.method+"(this)");
	}
}

EventListener.prototype.setFunction = function(fnct) {
	this.fnct = fnct;
}

EventListener.prototype.setManager = function(manager) {
	this.manager = manager;
}

EventListener.prototype.setMethod = function(method) {
	this.method = method;
}

EventListener.prototype.setTarget = function(target) {
	this.target = target;
}

EventListener.prototype.toString = function() {
	return "[object EventListener]";
}
function EventManager() {
	this.listeners = new Array();

	var cleanup = new EventListener();
	cleanup.setTarget(this);
	cleanup.setMethod("unregisterAllEvents");
	this.addEventListener(window, "unload", cleanup);
}

EventManager.prototype.addEventListener = function(domNode, eventType, listener) {
	var listenerFn = listener;
	if (domNode.addEventListener) {
		domNode.addEventListener(eventType, listenerFn, false);
	} else if (domNode.attachEvent) {
		listenerFn = function(e) {
			listener.handleEvent(e);
		}
		domNode.attachEvent("on" + eventType, listenerFn);
	} else {
		throw new Error("Event registration not supported");
	}
	var event = {
		domNode: domNode,
		eventType: eventType,
		listener: listenerFn
	};
	this.listeners.push(event);

//	gaia.getLog().addMessage("Add event handler: " + eventType + " on " + domNode.nodeName + "[" + domNode.innerHTML + "] obj(" + listener + ")");

	return event;
}

EventManager.prototype.removeEventListener = function(event) {
	var domNode = event.domNode;
	if (domNode.removeEventListener) {
		domNode.removeEventListener(event.eventType, event.listener, false);
	} else if (domNode.detachEvent) {
		domNode.detachEvent("on" + event.eventType, event.listener);
	}

	if (this.listeners.contains(event)) {
		var iIndex = this.listeners.indexOf(event);
		this.listeners.remove(iIndex);
	}

//	gaia.getLog().addMessage("Remove event handler: " + event.eventType + " on " + domNode.nodeName + "[" + domNode.innerHTML + "] obj(" + event.listener + ")");
}

EventManager.prototype.unregisterAllEvents = function() {
	while (this.listeners.length > 0) {
		var event = this.listeners.pop();
		var domNode = event.domNode;
		if (domNode.removeEventListener) {
			domNode.removeEventListener(event.eventType, event.listener, false);
		} else if (domNode.detachEvent) {
			domNode.detachEvent("on" + event.eventType, event.listener);
		}
	}
}
gaia = {
	xmlDoc : null,
	baseUrl : "",
	bDependsDocLoaded : false,
	sMainScriptUrl : null,
	bUseBaseUrl : false,

	init : function() {
		this.getBaseUrl();
		this.interfaceTester = new InterfaceTester();
		this.console = new Console();
		this.log = new Log();
		this.exceptionHandler = new ExceptionHandler();
		this.exceptionHandler.setLog(this.log);
		this.log.addWriter(this.console);
		this.exceptionHandler.setErrorReporting(this.exceptionHandler.ER_LOG);
		this.eventManager = new EventManager();
	},

	toString : function() {
		return "[object Gaia]";
	},

	setBaseUrl : function(sBaseUrl) {
		this.baseUrl = sBaseUrl;
	},

	getBaseUrl : function() {
		if (this.baseUrl != null) {
			return this.baseUrl;
		}
		
		var elements = document.getElementsByTagName('script');
	
		for (var i = 0; i < elements.length; ++i) {
			if( elements[i].src && (elements[i].src.indexOf("gaia.js") != -1) ) {
				var src = elements[i].src;
				src = src.substring(0, src.lastIndexOf('/'));

				this.baseUrl = src;
				break;
			}
		}
		
		// Get document base path
		var documentBasePath = document.location.href;
		if (documentBasePath.indexOf('?') != -1) {
			documentBasePath = documentBasePath.substring(0, documentBasePath.indexOf('?'));
		}
		var documentURL = documentBasePath;
		var documentBasePath = documentBasePath.substring(0, documentBasePath.lastIndexOf('/'));
		
		// If not HTTP absolute
		if (this.baseUrl.indexOf('://') == -1 && this.baseUrl.charAt(0) != '/') {
			// If site absolute
			this.baseUrl = documentBasePath + "/" + this.baseUrl;
		}
		
		return this.baseUrl;
	},
	
	getExceptionHandler : function() {
		return this.exceptionHandler;	
	},
	
	getInterfaceTester : function() {
		return this.interfaceTester;
	},
	
	getEventManager : function() {
		return this.eventManager;
	},
	
	getLog : function() {
		return this.log;
	},
	
//	this.getConsole = function() {
//		return this.console;
//	}
	
	setMainScriptUrl : function(sScriptUrl, bUseBaseUrl) {
		this.sMainScriptUrl = sScriptUrl;
		
		if (typeof(bUseBaseUrl) == "undefined")	{
			this.bUseBaseUrl = false;
		}
	}

}
gaia.init();
if (typeof(console) != "undefined") {
	gaia.getLog().addWriter(new Firebug());
}
InterfaceTester.prototype.isFocusListener = function(obj) {
	var bOk = true;
	var e = new DefectInterfaceImplementationException();

	if (!obj.focusGained) {
		bOk = false;
		e.addMissingMethod('focusGained');
	}
	
	if (!obj.focusLost) {
		bOk = false;
		e.addMissingMethod('focusLost');
	}

	if (bOk) {
		delete e;
		return true;
	} else {
		throw e;
	}
}

InterfaceTester.prototype.isListener = function(obj) {
	var bOk = true;
	var e = new DefectInterfaceImplementationException();

	if (!obj.handleEvent) {
		bOk = false;
		e.addMissingMethod("handleEvent");
	}

	if (bOk) {
		delete e;
		return true;
	} else {
		throw e;
	}
}

InterfaceTester.prototype.isSelectionListener = function(obj) {
	var bOk = true;
	var e = new DefectInterfaceImplementationException();

	if (!obj.widgetSelected) {
		bOk = false;
		e.addMissingMethod('widgetSelected');
	}

	if (bOk) {
		delete e;
		return true;
	} else {
		throw e;
	}
}
function ControlManager() {
	this.activeControl = null;
	this.controls = new Array();
	
	var listener = {
		controlManager : null,
		setControlManager : function(cm) {
			this.controlManager = cm;
		},
		handleEvent : function(e) {
			e = e ? e : window.event;
			e.source = e.target ? e.target : e.srcElement;
			e.x = e.pageX ? e.pageX : e.clientX;
			e.y = e.pageY ? e.pageY : e.clientY;
			this.event = e;
			var cm = this.controlManager;
			eval("cm.handleEvent(this)");
		}
	};
	listener.setControlManager(this);

	var em = gaia.getEventManager();
	em.addEventListener(window, "keydown", listener);
	em.addEventListener(window, "mousedown", listener);
}

ControlManager.prototype.addControl = function(control) {
	if (!this.controls.contains(control)) {
		this.controls.push(control);
	}
}

ControlManager.prototype.focusGained = function(control) {
	if (!control instanceof Control) {
		throw new WrongObjectException("control is not instance of Control", "ControlManager", "focusGained");
	}

	this.activeControl = control;
}

ControlManager.prototype.focusLost = function(control) {
	// dummy method
}

ControlManager.prototype.handleEvent = function(e) {
	if (e.event.type == "keydown") {
		if (this.activeControl != null && this.activeControl.keyHandler) {
			this.activeControl.keyHandler(e);
		}
	}

	if (e.event.type == "mousedown") {
		if (this.activeControl != null) {
			this.activeControl.looseFocus();
			this.activeControl = null;
		}
	}
}

ControlManager.prototype.removeControl = function(control) {
	if (this.controls.contains(control)) {
		if (this.activeControl == control) {
			this.activeControl = null;
		}
		var iIndex = this.controls.indexOf(control);
		this.controls.remove(iIndex);
	}
}

ControlManager.prototype.toString = function() {
	return "[object ControlManager]";
}
jsWT = {
	controlManager : new ControlManager(),

	toString : function() {
		return "[object jsWT]";
	},
	
	getControlManager : function() {
		return this.controlManager;		
	}
};
function Widget() {
	this.domref = null;
	//this.listeners = new Object();
}

Widget.prototype.addListener = function(eventType, listener) {
	try {
		gaia.getInterfaceTester().isListener(listener);
	} catch(e) {
		gaia.getExceptionHandler().exceptionRaised(e);
	}
	
	var eventListener = new EventListener();
	eventListener.setTarget(listener);
	eventListener.setMethod("handleEvent");
	
	if (this.domref != null) {
		var events = this.registerListener(eventType, eventListener);
		eventListener.events = events;
	}
	
	if (!this.listeners.hasOwnProperty(eventType)) {
		this.listeners[eventType] = new Array();
	}

	this.listeners[eventType].push(eventListener);
}

Widget.prototype.getDomRef = function() {
	return this.domref;
}

Widget.prototype.removeListener = function(eventType, listener) {
	// remove listener
	if (this.listeners[eventType].contains(listener)) {
		var iIndex = this.listeners[eventType].indexOf(listener);
		var eventListener = this.listeners[eventType][iIndex];
		this.listeners[eventType].remove(iIndex);
		
		if (eventListener.hasOwnProperty("events")) {
			for (var i = 0; i < eventListener.events.length; ++i) {
				var event = eventListener.events[i];
				gaia.getEventManager().removeEventListener(event);
			}
		}
		
		delete eventListener;
	}
}

/**
 * Sets the html node for this item
 * 
 * @author Thomas Gossmann
 * @param {HTMLElement} node the dom node for this item
 * @type void
 */
Widget.prototype.setDomRef = function(node) {
	this.domref = node;

	if (!this.domref.obj) {
		this.domref.obj = this;
	}
}
function Control() {
	this.aItems = new Array();
	this.sClassName = "jsWT";
	
	Widget.prototype.constructor.call(this);

	this.focushack = null;
	this.bHasFocus = false;
	this.aFocusListeners = new Array();

	// add Control to the ControlManager
	var ctrlManager = jsWT.getControlManager();
	ctrlManager.addControl(this);
	
	this.addFocusListener(ctrlManager);
}

Control.inheritsFrom(Widget);

Control.prototype.addClassName = function(sClassName) {
	this.sClassName += " " + sClassName;
}

/**
 * Adds a focus changed listener on the tree
 * 
 * @author Thomas Gossmann
 * @param {IFocusListener} the desired listener to be added to this control
 * @throws DefectInterfaceImplementation if the listener misses some methods
 * @type void
 */
Control.prototype.addFocusListener = function(listener) {
	try {
		gaia.getInterfaceTester().isFocusListener(listener);
	} catch(e) {
		gaia.getExceptionHandler().exceptionRaised(e);
	}

	this.aFocusListeners.push(listener);
}

Control.prototype.addItem = function(newItem) {
	
	if (!newItem instanceof Item) {
		return error('Control', 'addItem', 'New Item is not instance of Item');
	}
	
	this.aItems.push(newItem);
}

Control.prototype.forceFocus = function() {
	this.focushack.focus();
}

Control.prototype.isFocusControl = function() {
	return this.bHasFocus;
}

Control.prototype.looseFocus = function() {
	this.focushack.blur();
}

Control.prototype.onFocus = function() {
	this.bHasFocus = true;

	// notify focus listeners
	for (var i = 0; i < this.aFocusListeners.length; ++i) {
		this.aFocusListeners[i].focusGained(this);
	}
}

Control.prototype.onBlur = function() {
//	alert("widget blur");
	this.bHasFocus = false;

	// notify focus listeners
	for (var i = 0; i < this.aFocusListeners.length; ++i) {
		this.aFocusListeners[i].focusLost(this);
	}
}

Control.prototype.removeClassName = function(sClassName) {
	this.sClassName = strReplace(this.sClassName, " " + sClassName, "");
}

/**
 * Removes a focus listener from this control
 * 
 * @author Thomas Gossmann
 * @param {IFocusListener} the listener to remove from this control
 * @type void
 */
Control.prototype.removeFocusListener = function(listener) {
	if (this.aFocusListeners.contains(listener)) {
		var iOffset = this.aFocusListeners.getKey(listener);
		this.aFocusListeners.remove(iOffset);
	}
}

Control.prototype.setClassName = function(sClassName) {
	this.sClassName = sClassName;
}

Control.prototype.update = function() {
	this.paint();
}
function ItemNotExistsException(sMessage, sClass, sMethod) {
	Exception.prototype.constructor.call(this, sMessage, sClass, sMethod);
}
ItemNotExistsException.inheritsFrom(Exception);
/**
 * Tree control.
 * 
 * @author Thomas Gossmann
 * @class Tree
 * @constructor
 * @extends Control
 * @throws WrongObjectException if the parentElement is not a valid HTMLElement
 */
function Tree(parentElement) {
//	if (!parentElement instanceof(HTMLElement)) {
//		throw new WrongObjectException("parentElement ist not a HTMLElement", "Tree", "Tree");
//	}
	this.listeners = {};
	Control.prototype.constructor.call(this);

	this.aSelection = new Array();
	this.aSelectionListeners = new Array();
	this.bShowLines = true;
	this.sClassName = "jsWTTree";
	this.parentElement = parentElement
	this.aTopItems = new Array();
	this.activeItem = null;
	this.inactiveItem = null;
	this.shiftItem = null;
	
	this.addFocusListener(this);
}
Tree.inheritsFrom(Control);

/**
 * Activates an item
 * 
 * @author Thomas Gossmann
 * @private
 * @param {TreeItem} the item to activate
 * @type void
 */
Tree.prototype.activateItem = function(item) {
	// set a previous active item inactive
	if (this.activeItem != null) {
		this.activeItem.setActive(false);
	}

	this.activeItem = item;
	this.activeItem.setActive(true);
	this.update();
}

/**
 * Adds an item to the tree. This is automatically done by instantiating a new item.
 * 
 * @author Thomas Gossmann
 * @private
 * @param {TreeItem} newItem the new item to be added
 * @type void
 * @throws WrongObjectException
 */
Tree.prototype.addItem = function(newItem) {
	if (!newItem instanceof TreeItem) {
		throw new WrongObjectException("New item is not instance of TreeItem", "Tree", "addItem");
	}

	var parentItem = newItem.getParent()
	if (parentItem == this) {
		this.aItems.push(newItem);
//		gaia.getLog().addMessage("Add Root Item (" + newItem.getText() + ") length: " + this.aItems.length);
	} else {
		var iIndex = this.aItems.indexOf(parentItem)
			+ getDescendents(parentItem)
			+ 1;

		this.aItems.splice(iIndex, 0, newItem);
	}

	function getDescendents(item) {
		var iChilds = 0;
		if (item.hasChilds()) {
			var aItems = item.getItems();
			for (var i = 0; i < aItems.length; ++i) {
				if (aItems[i].hasChilds()) {
					iChilds += getDescendents(aItems[i]);
				}
				iChilds++;
			}
		}
		return iChilds;
	}
}

/**
 * Adds a selection listener on the tree
 * 
 * @author Thomas Gossmann
 * @param {ISelectionListener} the desired listener to be added to this tree
 * @throws DefectInterfaceImplementation if the listener misses some methods
 * @type void
 */
Tree.prototype.addSelectionListener = function(listener) {
	try {
		gaia.getInterfaceTester().isSelectionListener(listener);
	} catch(e) {
		gaia.getExceptionHandler().exceptionRaised(e);
	}

	this.aSelectionListeners.push(listener);
}

/**
 * Adds an item on the top level to this tree. Is automatically done by instantiating a new item.
 * 
 * @author thomas Gossmann
 * @param {TreeItem} item new item for the top level
 * @type void
 */
Tree.prototype.addTopItem = function(item) {
	if (!item instanceof TreeItem) {
		throw new WrongObjectException("New item is not instance of TreeItem", "Tree", "addTopItem");
	}

	this.aTopItems.push(item);
}

Tree.prototype.selectHandler = function(e) {
	var item = e.event.source.obj;
	if (e.ctrlKey && !e.shiftKey) {
		if (this.aSelection.contains(item)) {
			this.deselect(item);
		} else {
			this.select(item, true);
		}
	} else if (!e.ctrlKey && e.shiftKey) {
		this.selectRange(item, false);
	} else if (e.ctrlKey && e.shiftKey) {
		this.selectRange(item, true);
	} else {
		this.select(item, false);
	}

	if (!this.isFocusControl()) {
		this.forceFocus();
	}
}

/**
 * Deselects a specific item
 * 
 * @author Thomas Gossmann
 * @type void
 * @param {TreeItem} the item to deselect
 * @private
 */
Tree.prototype.deselect = function(item) {
	if (!item instanceof TreeItem) {
		throw new WrongObjectException("item not instance of TreeItem", "Tree", "deselect");
	}

	if (this.aSelection.contains(item)
			&& item.getTree() == this) {
		this.aSelection.remove(this.aSelection.indexOf(item));
		this.notifySelectionListener();
		item.setUnselected();
		this.shiftItem = item;
		this.activateItem(item);
	}
}

/**
 * Deselect all items in the tree
 * 
 * @author Thomas Gossmann
 * @type void
 */
Tree.prototype.deselectAll = function() {
	for (var i = this.aSelection.length; i >= 0; --i) {
		this.deselect(this.aSelection[i]);
	}
	this.update();
}

Tree.prototype.focusGained = function() {
	if (this.inactiveItem != null && this.activeItem == null) {
		this.activeItem = this.inactiveItem;
		this.inactiveItem = null;
		this.activeItem.setActive(true);
		this.update();
	}
}

Tree.prototype.focusLost = function() {
	if (this.activeItem != null) {
		this.activeItem.setActive(false);
		this.inactiveItem = this.activeItem;
		this.activeItem = null;
		this.update();
	}
}

/**
 * Gets a specifiy item with a zero-related index
 * 
 * @author Thomas Gossmann
 * @param {int} index the zero-related index
 * @throws OutOfBoundsException if the index does not live within this tree
 * @return the item
 * @type TreeItem
 */
Tree.prototype.getItem = function(index) {
	if (index >= this.aItems.length) {
		throw new OutOfBoundsException("Your item lives outside of this list", "Tree", "getItem");
	}

	return this.aItems[index];
}

/**
 * Returns the amount of the items in the tree
 * 
 * @author Thomas Gossmann
 * @return the amount
 * @type int
 */
Tree.prototype.getItemCount = function() {
	return this.aItems.length;
}

/**
 * Returns an array with all the items in the tree
 * 
 * @author Thomas Gossmann
 * @return the array with the items
 * @type Array
 */
Tree.prototype.getItems = function() {
	return this.aItems;
}

/**
 * Gets whether the Lines of the Tree are Visible or not
 * 
 * @author Thomas Gossmann
 * @return true if the lines are visible and false if they are not
 * @type boolean
 */
Tree.prototype.getLinesVisible = function() {
	return this.bShowLines;
}
/**
 * Returns an array with the items which are currently selected in the tree
 * 
 * @author Thomas Gossmann
 * @return an array with items
 * @type Array
 */
Tree.prototype.getSelection = function() {
	return this.aSelection;
}

/**
 * Returns the amount of the selected items in the tree
 * 
 * @author Thomas Gossmann
 * @return the amount
 * @type int
 */
Tree.prototype.getSelectionCount = function() {
	return this.aSelection.length;
}

/**
 * Looks for the index of an item
 * 
 * @author Thomas Gossmann
 * @param {ListItem} item the item the index is looked up
 * @throws WrongObjectException if item is not instance of ListItem
 * @throws ItemNotExistsException if the item does not exist in this list
 * @type int
 */
Tree.prototype.indexOf = function(item) {
	if (!item instanceof(TreeItem)) {
		throw new WrongObjectException("item not instance of TreeItem", "Tree", "indexOf");
	}

	if (!this.aItems.contains(item)) {
		throw new ItemNotExistsException(item, "Tree", "indexOf");
	}

	return this.aItems.getKey(item);
}

Tree.prototype.keyHandler = function(el) {
	
//	window.status = "keycode: " + e.keyCode;
	if (this.activeItem == null) {
		return;
	}

	var e = el.event;
	
	switch (e.keyCode) {
		case 38 : // up
			// determine previous item
			var prev;
			var aSiblings;

			if (this.activeItem == this.aItems[0]) {
				// item is root;
				prev = false;
			} else {
				var parentWidget = this.activeItem.getParent();
				if (parentWidget == this) {
					aSiblings = this.aTopItems;
				} else {
					aSiblings = parentWidget.getItems();
				}
				var iSibOffset = aSiblings.indexOf(this.activeItem);
	
				// prev item is parent
				if (iSibOffset == 0) {
					prev = parentWidget;
				} else {
					var prevSibling = aSiblings[iSibOffset - 1];
					prev = getLastItem(prevSibling);
				}
			}
			
			if (prev) {
				if (!e.ctrlKey && !e.shiftKey) {
					//this.deselect(this.activeItem);
					this.select(prev, false);
				} else if (e.ctrlKey && e.shiftKey) {
					this.selectRange(prev, true);
				} else if (e.shiftKey) {
					this.selectRange(prev, false);
				} else if (e.ctrlKey) {
					this.activateItem(prev);
				}
			}
		break;

		case 40 : // down
			// determine next item
			var next;
			var aSiblings;
			
			// item is last;
			if (this.activeItem == this.aItems[this.aItems.length - 1]) {
				next = false;
			} else {
				var parentWidget = this.activeItem.getParent();
				if (parentWidget == this) {
					aSiblings = this.aTopItems;
				} else {
					aSiblings = parentWidget.getItems();
				}
				var iSibOffset = aSiblings.indexOf(this.activeItem);
	
				if (this.activeItem.hasChilds() && this.activeItem.isExpanded()) {
					next = this.activeItem.getItems()[0];
				} else if (this.activeItem.hasChilds() && !this.activeItem.isExpanded()) {
					next = this.aItems[this.aItems.indexOf(this.activeItem) + countItems(this.activeItem) + 1];
				} else {
					next = this.aItems[this.aItems.indexOf(this.activeItem) + 1];
				}
//				 else if (iSibOffset < aSiblings.length - 1){
//					next = aSiblings[iSibOffset + 1];
//				} else if (iSibOffset == aSiblings.length - 1 && this.activeItem.getParent() != this) {
//
//				} else {
//					next = this.aItems[this.aItems.indexOf(this.activeItem) + 1];
//				}
			}

			if (next) {
				if (!e.ctrlKey && !e.shiftKey) {
					//this.deselect(this.activeItem);
					this.select(next, false);
				} else if (e.ctrlKey && e.shiftKey) {
					this.selectRange(next, true);
				} else if (e.shiftKey) {
					this.selectRange(next, false);
				} else if (e.ctrlKey) {
					this.activateItem(next);
				}
			}
			break;
		
		case 37: // left
			// collapse tree
			var buffer = this.activeItem;
			this.activeItem.collapse();
			this.activateItem(buffer);
			this.update();
			break;

		case 39: // left
			// collapse tree
			this.activeItem.expand();
			this.update();
			break;
			
		case 32 : // space
			if (this.aSelection.contains(this.activeItem) && e.ctrlKey) {
				this.deselect(this.activeItem);
			} else {
				this.select(this.activeItem, true);
			}
			break;
			
		case 36 : // home
			if (!e.ctrlKey && !e.shiftKey) {
				this.select(this.aItems[0], false);
			} else if (e.shiftKey) {
				this.selectRange(this.aItems[0], false);
			} else if (e.ctrlKey) {
				this.activateItem(this.aItems[0]);
			}
			break;
			
		case 35 : // end
			if (!e.ctrlKey && !e.shiftKey) {
				this.select(this.aItems[this.aItems.length-1], false);
			} else if (e.shiftKey) {
				this.selectRange(this.aItems[this.aItems.length-1], false);
			} else if (e.ctrlKey) {
				this.activateItem(this.aItems[this.aItems.length-1]);
			}
			break;
	}

	function getLastItem(item) {
		if (item.isExpanded() && item.hasChilds()) {
			return getLastItem(item.getItems()[item.getItems().length - 1]);
		} else {
			return item;
		}
	}
	
	function countItems(item) {
		var items = 0;
		var childs = item.getItems();
		
		for (var i = 0; i < childs.length; ++i) {
			items++;
			if (childs[i].hasChilds()) {
				items += countItems(childs[i]);
			}
		}
		
		return items;
	}
}

/**
 * Notifies all listeners if selection has changed
 * 
 * @author Thomas Gossmann
 * @type void
 * @private
 */
Tree.prototype.notifySelectionListener = function() {
	for (var i = 0; i < this.aSelectionListeners.length; ++i) {
		this.aSelectionListeners[i].widgetSelected(this);
	}
}

Tree.prototype.registerListener = function(eventType, listener) {
	var em = gaia.getEventManager();
	var evs = [];
	evs.push(em.addEventListener(this.domref, eventType, listener));
	return evs;
}

/**
 * Removes a selection listener from this list
 * 
 * @author Thomas Gossmann
 * @param {ISelectionListener} the listener to remove from this list
 * @type void
 */
Tree.prototype.removeSelectionListener = function(listener) {
	if (this.aSelectionListeners.contains(listener)) {
		var iOffset = this.aSelectionListeners.getKey(listener);
		this.aSelectionListeners.remove(iOffset);
	}
}

/**
 * Selects a specific item
 * 
 * @author Thomas Gossmann
 * @type void
 * @param {TreeItem} the item to select
 * @param {boolean} true for adding to the current selection, false will select only this item
 * @private
 */
Tree.prototype.select = function(item, bAdd) {
	if (!item instanceof TreeItem) {
		throw new WrongObjectException("item not instance of TreeItem", "Tree", "select");
	}

	if (!bAdd) {
		while (this.aSelection.length) {
			this.aSelection.pop().setUnselected();
		}
	}
	
	if (!this.aSelection.contains(item)
			&& item.getTree() == this) {
		this.aSelection.push(item);
		item.setSelected();
		this.shiftItem = item;
		this.activateItem(item);
		this.notifySelectionListener();
	}
}

/**
 * Select all items in the list
 * 
 * @author Thomas Gossmann
 * @type void
 */
Tree.prototype.selectAll = function() {
	for (var i = 0; i < this.aItems.length; ++i) {
		this.select(this.aItems[i], true);
	}
	this.update();
}

Tree.prototype.selectRange = function(item, bAdd) {
	if (!bAdd) {
		while (this.aSelection.length) {
			this.aSelection.pop().setUnselected();
		}
	}
	
	var iIndexShift = this.indexOf(this.shiftItem);
	var iIndexItem = this.indexOf(item);
	var iFrom = iIndexShift > iIndexItem ? iIndexItem : iIndexShift;
	var iTo = iIndexShift < iIndexItem ? iIndexItem : iIndexShift;

	for (var i = iFrom; i <= iTo; ++i) {
		this.aSelection.push(this.aItems[i]);
		this.aItems[i].setSelected();
	}

	this.notifySelectionListener();
	this.activateItem(item);
}

/**
 * Sets lines visible or invisible.
 * 
 * @author Thomas Gossmann
 * @type void
 * @param {boolean} true if the lines shoulb be visible or false for invisibility
 */
Tree.prototype.setLinesVisible = function(show) {
	this.bShowLines = show;
}

/**
 * Toggles selection of an item.
 * 
 * @author Thomas Gossmann
 * @param {TreeItem} tree item to toggle the selection
 * @type void
 */
Tree.prototype.toggleSelection = function(item) {
	if (this.aSelection.contains(item)) {
		this.deselect(item);
	} else {
		this.select(item);
	}
//	this.update();
//	this.focushack.focus();
}


Tree.prototype.toString = function() {
	return "[object Tree]";
}

/**
 * Updates the control. All changes to child items are recognized and updated 
 * as well.
 * 
 * @author Thomas Gossmann
 * @type void
 */
Tree.prototype.update = function() {

	if (this.domref == null) {
		this.setDomRef(document.createElement("ul"));
		
		// for keeping track of the focus on the tree widget
		this.focushack = document.createElement("input");
		this.focushack.obj = this;
		this.focushack.style.position = "absolute";
		this.focushack.style.left = "-9999px";
		this.domref.appendChild(this.focushack);
		
		// create events
		var em = gaia.getEventManager();
		var keyHandlerEvent = new EventListener();
		var focusEvent = new EventListener();
		var onblurEvent = new EventListener();
		var onfocusEvent = new EventListener();

		// parametrize and add events
		onfocusEvent.setTarget(this);
		onfocusEvent.setMethod("onFocus");
		em.addEventListener(this.focushack, "focus", onfocusEvent);

		onblurEvent.setTarget(this);
		onblurEvent.setMethod("onBlur");
		em.addEventListener(this.focushack, "blur", onblurEvent);
		
		keyHandlerEvent.setTarget(this);
		keyHandlerEvent.setMethod("keyHandler");
		em.addEventListener(this.focushack, "keydown", keyHandlerEvent);
		
		focusEvent.setTarget(this);
		focusEvent.setMethod("forceFocus");
		this.addListener("mousedown", focusEvent);
	}

	this.removeClassName("jsWTTreeNoLines");
	this.removeClassName("jsWTTreeLines");	

	if (this.bShowLines) {
		this.addClassName("jsWTTreeLines");
	} else {
		this.addClassName("jsWTTreeNoLines");
	}

	this.domref.className = this.sClassName;
	this.updateItems(this.aTopItems, this.domref);
	this.parentElement.appendChild(this.domref);
}

/**
 * Updates an itemList.
 * 
 * Iterates over the item list. If an item is not painted yet, the item would be
 * created and appended to the parent node. Items that needs to be updated
 * will be updated in their correspondenting HTML node.
 * 
 * @author Thomas Gossmann
 * @private
 * @param {Array} itemList with the items to update
 * @param {HTMLElement} the parent node where new items are appended
 * @type void
 */
Tree.prototype.updateItems = function(itemList, parentHtmlNode) {
	var iItemCount = itemList.length
	for (var i = 0; i < iItemCount; ++i) {
		var item = itemList[i];
		var bottom = i == (iItemCount - 1);

		// create item ...
		if (!item.isCreated()) {
			node = item.create(bottom);
			parentHtmlNode.appendChild(node);
			
			var keyHandlerEvent = new EventListener();
			keyHandlerEvent.setTarget(this);
			keyHandlerEvent.setMethod("keyHandler");
	
			item.addListener("keydown", keyHandlerEvent);
		}

		// ... or update it
		if (item.hasChanged()) {
			item.update();
			item.releaseChange();
		}


		if (item.hasChilds()) {
			var childContainer = item.getChildContainer();
			this.updateItems(item.getItems(), childContainer);			
		}

		if (bottom && item.getClassName().indexOf("bottom") == -1) {
			item.addClassName("bottom");
			if (item.hasChilds()) {
				var cc = item.getChildContainer();
				cc.className = "bottom";
			}
		} else if (!bottom && item.getClassName().indexOf("bottom") != -1) {
			item.removeClassName("bottom");
			if (item.hasChilds()) {
				var cc = item.getChildContainer();
				cc.className = null;
			}
		}
	}
}
/**
 * Item.
 * 
 * @author Thomas Gossmann
 * @class Item
 * @extends Widget
 * @constructor
 */
function Item() {
	this.sText = "";
	this.sClassName = "";
	this.image = null;
	this.bChanged = false;
	this.bActive = false;
}
Item.inheritsFrom(Widget);

/**
 * Adds a CSS class to the item
 * 
 * @author Thomas Gossmann
 * @param {String} sClassName new class
 * @type void
 */
Item.prototype.addClassName = function(sClassName) {
	this.sClassName += " " + sClassName;
	this.bChanged = true;
}

/**
 * Returns the CSS class names
 * 
 * @author Thomas Gossmann
 * @return the class names
 * @type String
 */
Item.prototype.getClassName = function() {
	return this.sClassName;
}

/**
 * Returns the node of that item
 * 
 * @author Thomas Gossmann
 * @return the node of that item
 * @type HTMLElement
 */
Item.prototype.getHtmlNode = function() {
	return this.htmlNode;
}

/**
 * Returns the image for that item
 * 
 * @author Thomas Gossmann
 * @return the image
 * @type Image
 */
Item.prototype.getImage = function() {
	return this.image;
}

/**
 * Returns the text
 * 
 * @author Thomas Gossmann
 * @return the text
 * @type String
 */
Item.prototype.getText = function() {
	return this.sText;
}

/**
 * Tells wether there is new data available since last question.
 * 
 * @author Thomas Gossmann
 * @return true if data changed, false if not
 * @type boolean
 */
Item.prototype.hasChanged = function() {
	return this.bChanged;
}

/**
 * Tells wether the item is created or not
 * 
 * @author Thomas Gossmann
 * @return true if the item is created or false if not
 * @type boolean
 */
Item.prototype.isCreated = function() {
	return this.domref != null;
}

/**
 * Reset the change notification buffer to recognize new changes. 
 * 
 * @author Thomas Gossmann
 * @type void
 */
Item.prototype.releaseChange = function() {
	this.bChanged = false;
}

/**
 * Removes a CSS class name from this item.
 * 
 * @author Thomas Gossmann
 * @param {String} sClassName the class name that should be removed
 * @type void
 */
Item.prototype.removeClassName = function(sClassName) {
	this.sClassName = strReplace(this.sClassName, sClassName, "");
	this.bChanged = true;
}

/**
 * Sets the item active or inactive
 * 
 * @author Thomas Gossmann
 * @param {boolean} bActive true for active and false for inactive
 * @type void
 */
Item.prototype.setActive = function(bActive) {
	this.bActive = bActive;
	if (bActive) {
		this.addClassName("active");
	} else {
		this.removeClassName("active");
	}
	this.bChanged = true;
}

/**
 * Sets the class name for the item
 * 
 * @author Thomas Gossmann
 * @param {String} sClassName the new class name
 * @type void
 */
Item.prototype.setClassName = function(sClassName) {
	this.sClassName = sClassName;
	this.bChanged = true;
}

/**
 * Sets the image for the item
 * 
 * @author Thomas Gossmann
 * @param {Image} image the new image
 * @type void
 */
Item.prototype.setImage = function(image) {
//	if (!(image instanceof Image) && image != null) {
//		throw new WrongObjectException('image is not instance of Image', 'Item', 'setImage');
//	}
	
	this.image = image;
	this.bChanged = true;
}

/**
 * Set wether this item is painted
 * 
 * @author Thomas Gossmann
 * @param {boolean} bIsPainted true for painted, false for not
 * @type void
 */
Item.prototype.setPainted = function(bIsPainted) {
	this.bIsPainted = bIsPainted;

	if (bIsPainted) {
		this.bChanged = false;
	}
}

/**
 * Sets the text for the item
 * 
 * @author Thomas Gossmann
 * @param {String} sText the new text
 * @type void
 */
Item.prototype.setText = function(sText) {
	this.sText = sText;
	this.bChanged = true;
}

/**
 * String representation of this object
 * 
 * @author Thomas Gossmann
 * @return A String describing this object
 * @type String
 */
Item.prototype.toString = function() {
	return "[object Item]";
}
function TreeItem(parentNode) {
	if ((!parentNode instanceof(Tree)) || (!parentNode instanceof(TreeItem))) {
		throw new WrongObjectException('Passed parent is neither a Tree nor a TreeItem', 'TreeItem', 'TreeItem');
	}
	this.listeners = new Object();
	Item.prototype.constructor.call(this);

	this.aChilds = new Array();
	this.bIsExpanded = true;
	this.childContainer = null;
	this.parentItem = null;
	this.tree = null;
	


	if (parentNode instanceof(Tree)) {
		this.parentItem = parentNode;
		this.tree = parentNode;
		this.tree.addItem(this);
		parentNode.addTopItem(this);
	} else if (parentNode instanceof(TreeItem)) {
		this.parentItem = parentNode;
		this.tree = parentNode.getTree();
		this.tree.addItem(this);
		parentNode.addItem(this);
	}

	// domNode references
	this.img = null;
	this.toggler = null;
	this.textSpan = null;
	this.textSpanBox = null;
}

TreeItem.inheritsFrom(Item);

TreeItem.prototype.addItem = function(newItem) {
	if (!newItem instanceof TreeItem) {
		throw new WrongObjectException("New item is not instance of TreeItem", "TreeItem", "addItem");
	}

	this.aChilds.push(newItem);
}

TreeItem.prototype.collapse = function() {
	if (this.childContainer != null) {
		this.childContainer.style.display = "none";
	}

	this.deselectChilds();
	this.bIsExpanded = false;
	this.bChanged = true;
}


/**
 * Internal method for creating a node representing an item. This is used for
 * creating a new item or put updated content to an existing node of an earlier
 * painted item.
 * 
 * @author Thomas Gossmann
 * @private
 * @param {boolean} wether this item is at the bottom position or not
 * @return the created or updated node
 * @type HTMLElement
 */
TreeItem.prototype.create = function(bottom) {
	/*
	 * DOM of created item:
	 * 
	 * <li>
	 *  <span class="toggler [togglerExpanded] [togglerCollapsed]"></span>
	 *  <span class="textBox">
	 *   [<img src=""/>]
	 *   <span class="text"></span>
	 *  </span>
	 * </li>
	 */

	if (bottom) {
		this.addClassName("bottom");
	}

	// create events
	var em = gaia.getEventManager();
	var toggleChildsEventListeners = new Array();
	var selectHandlerEventListeners = new Array();
	var toggleChildsEvent = new EventListener();
	var selectHandlerEvent = new EventListener();

	// parametrize and add events
	toggleChildsEvent.setTarget(this);
	toggleChildsEvent.setMethod("toggleChilds");

	selectHandlerEvent.setTarget(this.tree);
	selectHandlerEvent.setMethod("selectHandler");

	// create item node
	this.domref = document.createElement("li");
	this.domref.className = this.getClassName();
	this.domref.obj = this;

	// create item nodes
	this.img = null;
	this.toggler = document.createElement("span");
	this.toggler.obj = this;
	this.textSpanBox = document.createElement("span");
	this.textSpanBox.obj = this;
	this.textSpan = document.createElement("span");
	this.textSpan.obj = this;

	// set this.toggler
	this.toggler.className = "toggler";
	this.toggler.className += this.hasChilds() 
		? (this.isExpanded()
			? " togglerExpanded"
			: " togglerCollapsed")
		: "";
	this.domref.appendChild(this.toggler);

	// set image
	if (this.image != null) {
		this.img = document.createElement("img");
		this.img.obj = this;
		this.img.src = this.image.src;
		this.img.alt = this.sText;

		// add event listener
		toggleChildsEventListeners.push(
			em.addEventListener(this.img, "dblclick", toggleChildsEvent));
		selectHandlerEventListeners.push(
			em.addEventListener(this.img, "mousedown", selectHandlerEvent));

		// put the image into the dom
		this.textSpanBox.appendChild(this.img);
	}

	// set text
	this.textSpan.className = "text";
	this.textSpan['innerHTML'] = this.sText;

	// set box
	this.textSpanBox.className = "textBox";
	this.textSpanBox.appendChild(this.textSpan);
	this.domref.appendChild(this.textSpanBox);
	
	// if childs are available, create container for them
	if (this.hasChilds()) {
		this.childContainer = document.createElement('ul');
		if (bottom) {
			this.childContainer.className = "bottom";
		}

		if (this.isExpanded()) {
			this.childContainer.style.display = "block";
		} else {
			this.childContainer.style.display = "none";
		}
		
		this.domref.appendChild(this.childContainer);
	}

	// add Events
	em.addEventListener(this.toggler, "click", toggleChildsEvent);
	
	toggleChildsEventListeners.push(
		em.addEventListener(this.textSpan, "dblclick", toggleChildsEvent));
	selectHandlerEventListeners.push(
		em.addEventListener(this.textSpan, "mousedown", selectHandlerEvent));

	// add Events, previously added before the item was created
	for (var eventType in this.listeners) {
		for (var i = 0; i < this.listeners[eventType].length; ++i) {
			var listener = this.listeners[eventType][i];
			var evs = this.registerListener(eventType, listener);
			listener.events = evs;
		}
	}

	// add internal events to the listeners object (for updating purposes)
	if (!this.listeners.hasOwnProperty("dblclick")) {
		this.listeners.dblclick = new Array();
	}

	if (!this.listeners.hasOwnProperty("mousedown")) {
		this.listeners.mousedown = new Array();
	}

	toggleChildsEvent.events = toggleChildsEventListeners;
	selectHandlerEvent.events = selectHandlerEventListeners;
	this.listeners.dblclick.push(toggleChildsEvent);
	this.listeners.mousedown.push(selectHandlerEvent);

	return this.domref;
}

TreeItem.prototype.createChildContainer = function() {
	this.childContainer = document.createElement('ul');

	if (this.getClassName().indexOf("bottom") != -1) { // bottom
		this.childContainer.className = "bottom";
	}

	if (this.isExpanded()) {
		this.childContainer.style.display = "block";
	} else {
		this.childContainer.style.display = "none";
	}
	
	this.domref.appendChild(this.childContainer);
}

TreeItem.prototype.deselectChilds = function() {
	for (var i = 0; i < this.aChilds.length; ++i) {
		if (this.aChilds[i].hasChilds()) {
			this.aChilds[i].deselectChilds();
		}
		this.tree.deselect(this.aChilds[i]);
	}
}

TreeItem.prototype.expand = function() {
	if (this.childContainer != null) {
		this.childContainer.style.display = "block";
	}
	this.bIsExpanded = true;
	this.bChanged = true;
}

TreeItem.prototype.getChildContainer = function() {
	if (this.childContainer == null) {
		this.createChildContainer();
	}
	return this.childContainer;
}

TreeItem.prototype.getItemCount = function() {
	return this.aChilds.length;
}

TreeItem.prototype.getItems = function() {
	return this.aChilds;
}

TreeItem.prototype.getParentItem = function() {
	return this.parentItem;
}

TreeItem.prototype.getParent = function() {
	if (this.parentItem != null) {
		return this.parentItem;
	} else {
		return this.tree;		
	}
}

TreeItem.prototype.getTree = function() {
	return this.tree;
}

TreeItem.prototype.hasChilds = function() {
	return this.aChilds.length > 0;
}

TreeItem.prototype.isExpanded = function() {
	return this.bIsExpanded;
}

TreeItem.prototype.registerListener = function(eventType, listener) {
	var em = gaia.getEventManager();
	var evs = [];
	if (this.img != null) {
		evs.push(em.addEventListener(this.img, eventType, listener));
	}

	evs.push(em.addEventListener(this.textSpan, eventType, listener));
	return evs;
}

/**
 * Sets the item active or inactive (Override from Item)
 * 
 * @author Thomas Gossmann
 * @param {boolean} bActive true for active and false for inactive
 * @type void
 */
TreeItem.prototype.setActive = function(bActive) {
	this.bActive = bActive;

	//TODO Respect selection flag from tree	
	var htmlNode = this.domref.getElementsByTagName("span")[1].getElementsByTagName("span")[0];

	if (bActive) {
		htmlNode.className += " active";
	} else {
		htmlNode.className = htmlNode.className.replace(/ *active/, "");
	}

	this.bChanged = true;
}

TreeItem.prototype.setChildContainer = function(container) {
	if (!container instanceof HTMLElement) {
		throw new WrongObjectException("container is not instance of HTMLElement", "TreeItem", "setChildContainer");
	}

	this.childContainer = container;
}

/**
 * Set this item selected. Respects the trees selection style (jsWT.FULL_SELECTION)
 * or normal selection
 * 
 * @author Thomas Gossmann
 * @private
 * @type void
 */
TreeItem.prototype.setSelected = function() {
	if ((this.parentItem != this.tree && this.parentItem.isExpanded())
			|| this.parentItem == this.tree) {

		//TODO Respect selection flag from tree	
		var span = this.domref.getElementsByTagName("span")[1].getElementsByTagName("span")[0];
		span.className = "text selected";
	}
}

/**
 * Set this item unselected. Respects the trees selection style (jsWT.FULL_SELECTION)
 * or normal selection
 * 
 * @author Thomas Gossmann
 * @private
 * @type void
 */
TreeItem.prototype.setUnselected = function() {
	//TODO: Respect selection flag from tree	
	var span = this.domref.getElementsByTagName("span")[1].getElementsByTagName("span")[0];
	span.className = "text";
}

TreeItem.prototype.toggleChilds = function() {
	if (this.isExpanded()) {
		this.collapse();
	} else {
		this.expand();
	}
	
	if (!this.tree.isFocusControl()) {
		this.tree.forceFocus();
	}

	this.tree.update();
}

TreeItem.prototype.toString = function() {
	return "[object TreeItem]";
}

TreeItem.prototype.update = function() {
	if (this.hasChilds()) {
		this.toggler.className = strReplace(this.toggler.className, " togglerCollapsed", "");
		this.toggler.className = strReplace(this.toggler.className, " togglerExpanded", "");

		if (this.isExpanded()) {
			this.toggler.className += " togglerExpanded";
		} else {
			this.toggler.className += " togglerCollapsed";
		}
	}

	if (this.image != null && this.img == null) {
		// create image
		this.img = document.createElement("img");
		this.img.obj = this;
		this.img.alt = this.sText;
		this.img.src = this.image.src;
		this.textSpanBox.insertBefore(this.img, this.textSpan);
		
		// adding event listeners
		var em = gaia.getEventManager();
		for (var eventType in this.listeners) {
			for (var i = 0; i < this.listeners[eventType].length; ++i) {
				var listener = this.listeners[eventType][i];
				var event = em.addEventListener(this.img, eventType, listener);
				listener.events.push(event);
			}
		}
	} else if (this.image != null) {
		// simply update image information
		this.img.src = this.image.src;
		this.img.alt = this.sText;
	} else if (this.img != null && this.image == null) {
		// delete image
		
		// deregister all listeners on the image
		var em = gaia.getEventManager();
		for (var eventType in this.listeners) {
			for (var i = 0; i < this.listeners[eventType].length; ++i) {
				var listener = this.listeners[eventType][i];
				var events = listener.events;
				for (var j = 0; j < events.length; ++j) {
					var event = events[j];
					if (event.domNode == this.img) {
						em.removeEventListener(event);
						events.remove(j);
					}
				}
			}
		}

		// remove from dom
		this.textSpanBox.removeChild(this.img);
		this.img = null;
	}
	
	// if childs are available, create container for them
	if (this.hasChilds() && this.childContainer == null) {
		this.createChildContainer();
	} else if (!this.hasChilds() && this.childContainer != null) {
		// delete childContainer
		this.domref.removeChild(this.childContainer);
		this.childContainer = null;
	}

	this.domref.className = this.getClassName();
}
function ListItem(control) {
	if (!control instanceof List) {
		throw new WrongObjectException("Control is not instance of List", "ListItem", "ListItem");
	}

	control.addItem(this);
	Item.prototype.constructor.call(this);
}

ListItem.inheritsFrom(Item);
/**
 * List control.
 * 
 * @author Thomas Gossmann
 * @class List
 * @constructor
 * @extends Control
 * @throws WrongObjectException if the parentElement is not a valid HTMLElement
 */
function List(parentElement) {
	if (!parentElement instanceof(HTMLElement)) {
		throw new WrongObjectException("parentElement ist not a HTMLElement", "List", "List");
	}
	Control.prototype.constructor.call(this);

	this.list = null;
	this.aSelection = new Array();
	this.aSelectionListeners = new Array();
	this.sClassName = 'jsWTList';
	this.parentElement = parentElement
}
List.inheritsFrom(Control);

/**
 * Adds an item to the list. This is automatically done by instantiating a new item.
 * 
 * @author Thomas Gossmann
 * @param {ListItem} newItem the new item to be added
 * @type void
 */
List.prototype.addItem = function(newItem) {
	
	if (!newItem instanceof ListItem) {
		throw new WrongObjectException("New item is not instance of ListItem", "List", "addItem");
	}

	this.aItems.push(newItem);
}

/**
 * Adds a selection listener on the list
 * 
 * @author Thomas Gossmann
 * @param {ISelectionListener} the desired listener to be added to this list
 * @throws DefectInterfaceImplementation if the listener misses some methods
 * @type void
 */
List.prototype.addSelectionListener = function(listener) {
	try {
		jsRIA.getInterfaceTester().isSelectionListener(listener);
	} catch(e) {
		jsRIA.getExceptionHandler().exceptionRaised(e);
	}

	this.aSelectionListeners.push(listener);
}

/**
 * Internal method for creating a node representing an item. This is used for creating
 * a new item or put updated content to an existing node of an earlier painted item.
 * 
 * @author Thomas Gossmann
 * @private
 * @param {ListItem} the item
 * @param {HTMLElement} a node, that should be updated (optional)
 * @return the created or updated node
 * @type HTMLElement
 */
List.prototype.createItem = function(item, node) {
	var img;	
	if (typeof(node) == "undefined") {
		node = document.createElement('li');
	}
	node['innerHTML'] = item.getText();
	node.className = item.getClassName();
	if (img = item.getImage()) {
		node.style.backgroundImage = "url('"+img.src+"')";
	}

	return node;
}

/**
 * Deselect a specific item, a range of items or an array with indices of items to 
 * deselect. Therefore here is what the parameters are for:
 * 
 * One parameter:
 * 
 * int means a zero-relative index to deselect
 * int[] means an array with indices to deselect
 * 
 * Two parameters:
 * 
 * Two parameters are for range selections. The first one is the start where the
 * second parameter determines the end of the range
 * 
 * @author Thomas Gossmann
 * @param first see description
 * @param second see description
 * @throws OutOfBoundsException if the index is not in the list
 * @type void
 */
List.prototype.deselect = function(first, second) {

	// one argument
	if (typeof(second) == "undefined") {

		// argument == array
		if (first instanceof(Array)) {
			for (var i = 0; i < first.length; ++i) {
				try {
					this.deselect(first[i]);
				} catch(e) {
					throw(e);
				}
			}
		}

		// argument == index
		else if (typeof(first) == "number") {

			try {
				var item = this.getItem(first);
			} catch(e) {
				throw e;
			}

			if (this.aSelection.contains(first)) {
				item.removeClassName("selected");
				this.aSelection.remove(this.aSelection.getKey(first));
				this.notifySelectionListener();
			}
		}
	}

	// two arguments (from - to)
	else {

		var range = new Array();
		for (var i = first; i <= second; ++i) {
			range.push(i);
		}

		try {
			this.deselect(range);
		} catch(e) {
			throw(e);
		}
	}
}

/**
 * Select all items in the list
 * 
 * @author Thomas Gossmann
 * @type void
 */
List.prototype.deselectAll = function() {
	try {
		this.deselect(0, this.aItems.length - 1);
		this.update();
	} catch(e) {
		throw(e);
	}
}

/**
 * Gets a specifiy item with a zero-related index
 * 
 * @author Thomas Gossmann
 * @param {int} index the zero-related index
 * @throws OutOfBoundsException if the index does not live within this list
 * @return the item
 * @type ListItem
 */
List.prototype.getItem = function(index) {
	if (index >= this.aItems.length) {
		throw new OutOfBoundsException("Your item lives outside of this list", "List", "getItem");
	}
	
	return this.aItems[index];
}

/**
 * Returns the amount of the items in the list
 * 
 * @author Thomas Gossmann
 * @return the amount
 * @type int
 */
List.prototype.getItemCount = function() {
	return this.aItems.length;
}

/**
 * Returns an array with all the items in the list
 * 
 * @author Thomas Gossmann
 * @return the array with the items
 * @type Array
 */
List.prototype.getItems = function() {
	return this.aItems;
}

/**
 * Returns an array with the items which are currently selected in the list
 * 
 * @author Thomas Gossmann
 * @throws OutOfBoundsException if an index is removed form the list (should never happen!)
 * @return an array with items
 * @type Array
 */
List.prototype.getSelection = function() {
	var returnArray = new Array();
	
	for (var i = 0; i < this.aSelection.length; ++i) {
		try {
			var index = this.aSelection[i];
			var item = this.getItem(index);
			returnArray.push(item);
		} catch(e) {
			throw e;
		}
	}
	
	return returnArray;
}

/**
 * Returns the amount of the selected items in the list
 * 
 * @author Thomas Gossmann
 * @return the amount
 * @type int
 */
List.prototype.getSelectionCount = function() {
	return this.aSelection.length;
}

/**
 * Returns a zero-relative index of the item which is currently
 * selected or -1 if no item is selected
 * 
 * @author Thomas Gossmann
 * @return a zero-relative index of the currently selected item or -1 if no item is selected
 * @type int
 */
List.prototype.getSelectionIndex = function() {
	if (this.aSelection.length > 0) {
		return this.aSelection[0];
	} else {
		return -1;
	}
}

/**
 * Returns an array with zero-relative indices of the selection
 * 
 * @author Thomas Gossmann
 * @return an array with zero-relative indices of the selection
 * @type Array
 */
List.prototype.getSelectionIndices = function() {
	return this.aSelection;
}

/**
 * Looks for the index of an item
 * 
 * @author Thomas Gossmann
 * @param {ListItem} item the item the index is looked up
 * @throws WrongObjectException if item is not instance of ListItem
 * @throws ItemNotExistsException if the item does not exist in this list
 * @type int
 */
List.prototype.indexOf = function(item) {
	if (!item instanceof(ListItem)) {
		throw new WrongObjectException("item not instance of ListItem", "List", "indexOf");
	}

	if (!this.aItems.contains(item)) {
		throw new ItemNotExistsException(item.getText(), "List", "indexOf");
	}

	return this.aItems.getKey(item);
}

/**
 * Tests if a zero-related index is selected
 * 
 * @author Thomas Gossmann
 * @param {int} index the zero-related index to test
 * @return true if selected or false if not
 * @type boolean
 */
List.prototype.isSelected = function(index) {
	return this.aSelection.contains(index);
}

/**
 * Notifies all listeners if selection has changed
 * 
 * @author Thomas Gossmann
 * @type void
 * @private
 */
List.prototype.notifySelectionListener = function() {
	for (var i = 0; i < this.aSelectionListeners.length; ++i) {
		this.aSelectionListeners[i].widgetSelected(this);
	}
}

/**
 * Removes a selection listener from this list
 * 
 * @author Thomas Gossmann
 * @param {ISelectionListener} the listener to remove from this list
 * @type void
 */
List.prototype.removeSelectionListener = function(listener) {
	if (this.aSelectionListeners.contains(listener)) {
		var iOffset = this.aSelectionListeners.getKey(listener);
		this.aSelectionListeners.remove(iOffset);
	}
}

/**
 * Select a specific item, a range of items or an array with indices of items to 
 * select. Therefore here is what the parameters are for:
 * 
 * One parameter:
 * 
 * int means a zero-relative index to select
 * int[] means an array with indices to select
 * 
 * Two parameters:
 * 
 * Two parameters are for range selections. The first one is the start where the
 * second parameter determines the end of the range
 * 
 * @author Thomas Gossmann
 * @param first see description
 * @param second see description
 * @throws OutOfBoundsException if the index is not in the list
 * @type void
 */
List.prototype.select = function(first, second) {

	// one argument
	if (typeof(second) == "undefined") {
		
		// argument == array
		if (first instanceof(Array)) {
			
			for (var i = 0; i < first.length; ++i) {
				try {
					this.select(first[i]);
				} catch(e) {
					throw(e);
				}
			}
		}

		// argument == index
		else if (typeof(first) == "number") {
			try {
				var item = this.getItem(first);
			} catch(e) {
				throw e;
			}

			if (!this.aSelection.contains(first)) {
				item.addClassName("selected");
				this.aSelection.push(first);
				this.notifySelectionListener();
			}
		}
	}

	// two arguments (from - to)
	else {

		var range = new Array();
		for (var i = first; i <= second; ++i) {
			range.push(i);
		}

		try {
			this.select(range);
		} catch(e) {
			throw(e);
		}
	}
}

/**
 * Select all items in the list
 * 
 * @author Thomas Gossmann
 * @type void
 */
List.prototype.selectAll = function() {
	try {
		this.select(0, this.aItems.length - 1);
		this.update();
	} catch(e) {
		throw(e);
	}
}

/**
 * Set a item at a specified index
 * 
 * @author Thomas Gossmann
 * @param {int} zero-related index
 * @param {ListItem} the item to put at the index
 * @throws WrongObjectException if item is not a ListItem
 * @throws OutOfBoundsException if the index is not yet assigned
 * @type void
 */
List.prototype.setItem = function(index, item) {
	if (!item instanceof(ListItem)) {
		throw new WrongObjectException("item not instance of ListItem", "List", "setItem");
	}

	if (index >= this.aItems.length) {
		throw new OutOfBoundsException("index not assigned", "List", "setItem");
	}

	this.aItems[index] = item;
}

/**
 * Sets the items of this list
 * 
 * @author Thomas Gossmann
 * @param {Array} a list of new items
 * @type void
 */
List.prototype.setItems = function(aItems) {
	this.aItems = aItems;
}

/**
 * 
 * @throws OutOfBoundsException
 */
List.prototype.toggleSelection = function(input) {
	var iIndex;
	if (typeof(input) == "object") {
		try {
			iIndex = this.indexOf(input);
		} catch(e) {
			throw e;
		}
	} else if (typeof(input) == "number") {
		iIndex = input;
	}

	if (this.aSelection.contains(iIndex)) {
		this.deselect(iIndex);
	} else {
		this.select(iIndex);
	}
	this.update();
}

/**
 * Updates the control. All changes to child items are recognized and updated 
 * as well.
 * 
 * @author Thomas Gossmann
 * @type void
 */
List.prototype.update = function() {
	
	if (this.list == null) {
		this.list = document.createElement('ul');
		this.list.className = this.sClassName;
	}

	for (var i = 0; i < this.aItems.length; ++i) {
		var item = this.aItems[i];

		// paint item ...
		if (!item.isPainted()) {
			node = this.createItem(item);
			this.list.appendChild(node);
			item.setPainted(true);
			item.setHtmlNode(node);

			// add Event Handler			
			var p = new ParamSet();
			p.addParam(item);

			item.addEventHandler("click", this, "toggleSelection", p);
		}

		// ... or update it
		else if (item.hasChanged()) {
			this.createItem(item, item.getHtmlNode());
			item.releaseChange();
		}
	}

	this.parentElement.appendChild(this.list);
}
