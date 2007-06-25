/**
 * 'Abstract' Item class
 * @class Item
 * @author Thomas Gossmann
 * @extends Widget
 * @namespace gara.jswt
 */
$class("Item", {
	$extends : Widget,

	/**
	 * @method
	 * Constructor
	 * 
	 * @private
	 * @author Thomas Gossmann
	 * @returns {gara.jswt.Item}
	 */
	$constructor : function() {
		this.$base();
		this._changed = false;
		this._image = null;
		this._text = "";
	},

	/**
	 * @method
	 * Returns the items image
	 * 
	 * @author Thomas Gossmann
	 * @returns {Image} the items image
	 */
	getImage : function() {
		return this._image;
	},
	
	/**
	 * @method
	 * Returns the items text
	 * 
	 * @author Thomas Gossmann
	 * @return {String} the text for this item
	 */
	getText : function() {
		return this._text;
	},
	
	/**
	 * @method
	 * Tells wether there is new data available since last question.
	 * 
	 * @author Thomas Gossmann
	 * @return {boolean} true if data changed, false if not
	 */
	hasChanged : function() {
		return this._changed;
	},
	
	/**
	 * @method
	 * Tells wether the item is created or not
	 * 
	 * @author Thomas Gossmann
	 * @returns {boolean} true if the item is created or false if not
	 */
	isCreated : function() {
		return this.domref != null;
	},
	
	/**
	 * @method
	 * Reset the change notification buffer to recognize new changes. 
	 * 
	 * @author Thomas Gossmann
	 * @returns {void}
	 */
	releaseChange : function() {
		this._changed = false;
	},

	/**
	 * @method
	 * Sets the item active or inactive
	 * 
	 * @author Thomas Gossmann
	 * @param {boolean} active true for active and false for inactive
	 * @returns {void}
	 */
	setActive : function(active) {
		this._active = active;
		if (active) {
			this.addClassName("active");
		} else {
			this.removeClassName("active");
		}
		this._changed = true;
	},

	/**
	 * @method
	 * Sets the image for the item
	 * 
	 * @author Thomas Gossmann
	 * @param {Image} image the new image
	 * @throws {TypeError} when image is not instance of Image
	 * @returns {void}
	 */
	setImage : function(image) {
		if(!$class.instanceOf(image, Image)) {
			throw new TypeError("image not instance of Image");
		}
		
		this._image = image;
		this._changed = true;
	},

	/**
	 * @method
	 * Set this item selected
	 * 
	 * @author Thomas Gossmann
	 * @returns {void}
	 */
	setSelected : function() {
		this.addClassName("selected");
	},

	/**
	 * @method
	 * Sets the text for the item
	 * 
	 * @author Thomas Gossmann
	 * @param {String} text the new text
	 * @returns {void}
	 */
	setText : function(text) {
		this._text = text;
		this._changed = true;
	},

	/**
	 * @method
	 * Set this item unselected
	 * 
	 * @author Thomas Gossmann
	 * @returns {void}
	 */
	setUnselected : function() {
		this.removeClassName("selected");
	}
});