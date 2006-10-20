function Widget() {
	this.htmlNode = null;
	this.aEventHandlers = new Object();
	this.bHasFocus = false;
}

Widget.prototype.addEventHandler = function(type, obj, method, p, htmlNode) {

	if (typeof(p) == "undefined") {
		p = null;
	}
	
	if (typeof(htmlNode) == "undefined") {
		htmlNode = this.htmlNode;
		targetObj = this;
	} else {
		targetObj = htmlNode.handleEvent;
	}
	
	if (!this.aEventHandlers[type]) {
		this.aEventHandlers[type] = new Array();
	}
	var et = this.aEventHandlers[type];
	et.push([obj, method, p, htmlNode]);
	

	if (htmlNode.addEventListener) {
		try {
			htmlNode.addEventListener(type, targetObj, false);
		} catch(e) {
			alert(e + "obj: " + obj);
		}
	} else {
		htmlNode.attachEvent("on" + type, targetObj.handleEvent);
	}
}

Widget.prototype.onFocus = function() {
	this.bHasFocus = true;
	window.status = "got focus " + this;
}

Widget.prototype.onBlur = function() {
	this.bHasFocus = false;
	window.status = "lost focus" + this;
}

Widget.prototype.getHtmlNode = function() {
	return this.htmlNode;
}

Widget.prototype.handleEvent = function(e, htmlNode) {
	if (typeof(e) == "undefined") {
		e = window.event;
	}

	if (typeof(htmlNode) == "undefined") {
		htmlNode = this.htmlNode;
	}

//	if (e.type == "keydown") {
//		alert("keydown event on " + htmlNode);
//	}
	if (this.aEventHandlers[e.type]) {
		var aHandlers = this.aEventHandlers[e.type];
		for (var i = 0; i < aHandlers.length; ++i) {
			var aHandler = aHandlers[i];

			if (aHandler[3] == htmlNode) {
				if (aHandler[2] == null) {
					eval("aHandler[0]." + aHandler[1] + "(this, e)");
				} else {
					eval("aHandler[0]." + aHandler[1] + "(this, e, aHandler[2])");
				}
			}
		}
	}
}

/**
 * Sets the html node for this item
 * 
 * @author Thomas Gossmann
 * @param {HTMLElement} node the html node for this item
 * @type void
 */
Widget.prototype.setHtmlNode = function(node) {
	this.htmlNode = node;
}