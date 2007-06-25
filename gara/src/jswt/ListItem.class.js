/**
 * gara ListItem for List Widget
 * 
 * @class ListItem
 * @author Thomas Gossmann
 * @namespace gara.jswt
 * @extends Item
 */
$class("ListItem", {
	$extends : Item,

	/**
	 * @method
	 * Constructor
	 * 
	 * @private
	 * @author Thomas Gossmann
	 * @param {gara.jswt.List} list the List Widget for this item
	 * @throws {TypeError} if the list is not a List widget
	 * @returns {gara.jswt.ListItem}
	 */
	$constructor : function(list) {
		if (!$class.instanceOf(list, List)) {
			throw new TypeError("list is not type of List");
		}
		this.$base();
		this._list = list;
		this._list.addItem(this);
		this._span = null;
		this._spanText = null;
		this._img = null;
	},

	/**
	 * @method
	 * Internal creation process of this item
	 * 
	 * @private
	 * @author Thomas Gossmann
	 * @returns {void}
	 */
	create : function() {
		this.domref = document.createElement("li");
		this.domref.className = this._className;
		this.domref.obj = this;
		this.domref.control = this._list;

		// create item nodes
		this._img = null;

		// set image
		if (this.image != null) {
			this._img = document.createElement("img");
			this._img.obj = this;
			this._img.control = this._list;
			this._img.src = this.image.src;
			this._img.alt = this._text;

			// put the image into the dom
			this.domref.appendChild(this._img);
		}

		this._spanText = document.createTextNode(this._text);
		
		this._span = document.createElement("span");
		this._span.obj = this;
		this._span.control = this._list;
		this._span.appendChild(this._spanText);
		this.domref.appendChild(this._span);

		// register listener
		for (var eventType in this._listener) {
			this._listener[eventType].forEach(function(elem, index, arr) {
				this.registerListener(eventType, elem);
			}, this);
		}

		return this.domref;
	},

	/**
	 * @method
	 * Register listeners for this widget. Implementation for gara.jswt.Widget
	 * 
	 * @private
	 * @author Thomas Gossmann
	 * @returns {void}
	 */
	registerListener : function(eventType, listener) {
		if (this._img != null) {
			gara.eventManager.addListener(this._img, eventType, listener);
		}

		if (this._span != null) {
			gara.eventManager.addListener(this._span, eventType, listener);
		}
	},

	/**
	 * @method
	 * Updates the list item
	 * 
	 * @author Thomas Gossmann
	 * @returns {void}
	 */
	update : function() {
		// create image
		if (this.image != null && this._img == null) {
			this._img = document.createElement("img");
			this._img.obj = this;
			this._img.control = this._list;
			this._img.alt = this.sText;
			this._img.src = this.image.src;
			this.domref.insertBefore(this._img, this._span);
			
			// event listener
			for (var eventType in this._listener) {
				this._listener[eventType].forEach(function(elem, index, arr) {
					this.registerListener(this._img, eventType, elem);
				}, this);
			}
		}

		// simply update image information
		else if (this.image != null) {
			this._img.src = this.image.src;
			this._img.alt = this._text;
		}

		// delete image
		else if (this._img != null && this.image == null) {
			this.domref.removeChild(this._img);
			this._img = null;

			// event listener
			for (var eventType in this._listener) {
				this._listener[eventType].forEach(function(elem, index, arr) {
					gara.eventManager.removeListener({
						domNode : this._img,
						type: eventType, 
						listener : elem
					});
				}, this);
			}
		}

		this._spanText.value = this._text;
		this.domref.className = this._className;
	}
});