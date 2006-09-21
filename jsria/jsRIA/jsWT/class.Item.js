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
	this.bIsPainted = false;
	this.bChanged = false;
	this.htmlNode;
	this.aEventHandlers = new Object();
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


Item.prototype.addEventHandler = function(type, obj, method, p, htmlNode) {

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
//			alert(e);
		}
	} else {
		htmlNode.attachEvent("on" + type, targetObj.handleEvent);
	}
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

Item.prototype.handleEvent = function(e, htmlNode) {
	if (typeof(htmlNode) == "undefined") {
		htmlNode = this.htmlNode;
	}
	
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
 * Tells wether the item is painted or not
 * 
 * @author Thomas Gossmann
 * @return true if the item is painted or false if not
 * @type boolean
 */
Item.prototype.isPainted = function() {
	return this.bIsPainted;
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

Item.prototype.removeClassName = function(sClassName) {
	this.sClassName = strReplace(this.sClassName, sClassName, "");
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
 * Sets the html node for this item
 * 
 * @author Thomas Gossmann
 * @param {HTMLElement} node the html node for this item
 * @type void
 */
Item.prototype.setHtmlNode = function(node) {
	this.htmlNode = node;
}

/**
 * Sets the image for the item
 * 
 * @author Thomas Gossmann
 * @param {Image} image the new image
 * @type void
 */
Item.prototype.setImage = function(image) {

	if (!(image instanceof Image)) {
		throw new WrongObjectException('NewImage is not instance of Image', 'Item', 'setImage');
	}
	
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