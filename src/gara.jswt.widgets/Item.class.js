/*	$Id: Item.class.js 163 2008-11-01 17:17:05Z tgossmann $

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
 * 'Abstract' Item class
 * @class Item
 * @author Thomas Gossmann
 * @extends gara.jswt.widgets.Widget
 * @namespace gara.jswt.widgets
 */
$class("Item", {
	$extends : gara.jswt.widgets.Widget,

	/**
	 * @constructor
	 * Constructor of gara.jswt.widgets.Item
	 *
	 * @author Thomas Gossmann
	 * @param {gara.jswt.widgets.List} parent the parent <code>Control</code> widget
	 * @param {int} [style] style information for this <code>Item</code>
	 * @return {gara.jswt.widgets.Item}
	 */
	$constructor : function(parent, style) {
		this.$base(parent, style);
		this._image = null;
		this._text = "";

		// css
		this._classes = [];
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
	 * Sets the item active or inactive
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @param {boolean} active true for active and false for inactive
	 * @return {void}
	 */
	_setActive : function(active) {
		this._active = active;
		this.setClass("active", this._active);
	},

	/**
	 * @method
	 * Sets the image for the item
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
	 * Sets the text for the item
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
		return "[gara.jswt.widgets.Item]";
	}
});