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

gara.provide("gara.jswt.widgets.Item");

gara.parent("gara.jswt.widgets.Widget",

/**
 * 'Abstract' Item class
 * @class Item
 * @author Thomas Gossmann
 * @extends gara.jswt.widgets.Widget
 * @namespace gara.jswt.widgets
 */
function() {gara.Class("gara.jswt.widgets.Item", {
	$extends : gara.jswt.widgets.Widget,

	/**
	 * @field
	 * Holds the active static.
	 *
	 * @private
	 */
	active : false,

	/**
	 * @field
	 * The <code>Item</code>'s image.
	 *
	 * @private
	 */
	image : null,

	/**
	 * @field
	 * The <code>Item</code>'s text.
	 *
	 * @private
	 */
	text : "",

	/**
	 * @constructor
	 * Constructor of gara.jswt.widgets.Item
	 *
	 * @author Thomas Gossmann
	 * @param {gara.jswt.widgets.List} parent the parent <code>Control</code> widget
	 * @param {int} style information for this <code>Item</code>
	 * @return {gara.jswt.widgets.Item}
	 */
	$constructor : function (parent, style) {
		this.$super(parent, style);
		this.classes = []; // reset Widget's style
		this.active = false;
		this.image = null;
		this.text = "";
	},

	/**
	 * @method
	 * Returns the items image
	 *
	 * @author Thomas Gossmann
	 * @return {Image} the items image
	 */
	getImage : function () {
		return this.image;
	},

	/**
	 * @method
	 * Returns the items text
	 *
	 * @author Thomas Gossmann
	 * @return {String} the text for this item
	 */
	getText : function () {
		return this.text;
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
	setActive : function (active) {
		this.active = active;
		this.setClass("active", this.active);
	},

	/**
	 * @method
	 * Sets the image for the item
	 *
	 * @author Thomas Gossmann
	 * @param {Image} image the new image
	 * @return {void}
	 */
	setImage : function (image) {
		this.image = image;
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
	setText : function (text) {
		this.text = text;
		return this;
	}
})});