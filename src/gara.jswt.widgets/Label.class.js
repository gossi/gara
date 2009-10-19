/*	$Id: TabFolder.class.js 181 2009-08-02 20:51:16Z tgossmann $

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

/**
 * gara Label Widget
 *
 * @class Label
 * @author Thomas Gossmann
 * @namespace gara.jswt.widgets
 * @extends gara.jswt.widgets.Control
 */
$class("Label", {
	$extends : gara.jswt.widgets.Control,

	/**
	 * @constructor
	 * @param {gara.jswt.Composite|HTMLElement} parent parent dom node or composite
	 * @param {int} style The style for the Label
	 */
	$constructor : function(parent, style) {
		this.$base(parent, style);

		// TabFolder default style
//		if (this._style == JSWT.DEFAULT) {
//			this._style = 0;
//		}
		this._imgNode = null;
		this._txtNode = null;
		this._image = null;
		this._text = "";
	},

	create : function() {
		this.handle = document.createElement("div");
		this.handle.widget = this;
		this.handle.control = this;
		this.handle.className = "Label";

		if (this._image != null) {
			this._imgNode = document.createElement("img");
			this._imgNode.widget = this;
			this._imgNode.control = this;
			this._imgNode.src = this._image.src;
			this.handle.appendChild(this._imgNode);
		}

		this._txtNode = document.createTextNode(this._text);
		this.handle.appendChild(this._txtNode);

		/* If parent is not a composite then it *must* be a HTMLElement
		 * but because of IE there is no cross-browser check. Or no one I know of.
		 */
		if (!$class.instanceOf(this._parent, gara.jswt.widgets.Composite)) {
			this._parentNode = this._parent;
		}

		if (this._parentNode != null) {
			this._parentNode.appendChild(this.handle);
		}
	},

	/**
	 * @method
	 * Returns the items image
	 *
	 * @author Thomas Gossmann
	 * @return {Image} the items image
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
	 * Register listeners for this widget. Implementation for gara.jswt.widgets.Widget
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	_registerListener : function(eventType, listener) {
		if (this.handle != null) {
			gara.EventManager.addListener(this.handle, eventType, listener);
		}
	},

	/**
	 * @method
	 * Sets the image for the Label
	 *
	 * @author Thomas Gossmann
	 * @param {Image} image the new image
	 * @return {void}
	 */
	setImage : function(image) {
		this._image = image;
		return this;
	},

	/**
	 * @method
	 * Sets the text for the Label
	 *
	 * @author Thomas Gossmann
	 * @param {String} text the new text
	 * @return {void}
	 */
	setText : function(text) {
		this._text = text;
		return this;
	},

	toString : function() {
		return "[gara.jswt.widgets.Label]";
	},

	/**
	 * @method
	 * Unregister listeners for this widget. Implementation for gara.jswt.Widget
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	_unregisterListener : function(eventType, listener) {
		if (this.handle != null) {
			gara.EventManager.removeListener(this.handle, eventType, listener);
		}
	},

	update : function() {
		if (!this.domref) {
			this.create();
		} else {
			// create image
			if (this._image != null && this._imgNode == null) {
				this._imgNode = document.createElement("img");
				this._imgNode.widget = this;
				this._imgNode.control = this;
				this._imgNode.src = this._image.src;
				this.handle.insertBefore(this._img, this._txtNode);
			}

			// simply update image information
			else if (this._image != null) {
				this._imgNode.src = this._image.src;
			}

			// delete image
			else if (this._imgNode != null && this._image == null) {
				this.handle.removeChild(this._imgNode);
				this._imgNode = null;
			}

			this._txtNode.value = this._text;
		}
	}
});