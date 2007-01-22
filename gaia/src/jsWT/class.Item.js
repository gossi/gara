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