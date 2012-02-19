/*

		gara - Javascript Toolkit
	===========================================================================

		Copyright (c) 2007 Thomas Gossmann

		Homepage:
			http://garathekit.org

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

"use strict";

gara.provide("gara.widgets.Item");

/**
 * 'Abstract' Item class
 * @class gara.widgets.Item
 * @extends gara.widgets.Widget
 */
gara.widgets.Item = gara.Class(gara.widgets.Widget, /** @lends gara.widgets.Item# */ {
	/**
	 * 
	 * Holds the active static.
	 *
	 * @private
	 */
	active : false,

	/**
	 * 
	 * The <code>Item</code>'s image.
	 *
	 * @private
	 */
	image : null,

	/**
	 * 
	 * The <code>Item</code>'s text.
	 *
	 * @private
	 */
	text : "",

	/**
	 * Creates a new Item.
	 * 
	 * @constructs
	 * @extends gara.widgets.Widget
	 * @param {gara.widgets.List} parent the parent <code>Control</code> widget
	 * @param {int} style information for this <code>Item</code>
	 */
	constructor : function (parent, style) {
		this.super(parent, style);
		this.active = false;
		this.image = null;
		this.text = "";
	},
	
	destroyWidget : function () {
		this.image = null;
		this.text = null;
		
//		if (this.parentNode !== null) {
//			this.parentNode.removeChild(this.handle);
//		}
		
		this.super();
	},

	/**
	 * Returns the items image.
	 *
	 * @author Thomas Gossmann
	 * @return {Image} the items image
	 */
	getImage : function () {
		return this.image;
	},

	/**
	 * Returns the items text.
	 *
	 * @return {String} the text for this item
	 */
	getText : function () {
		return this.text;
	},

	/**
	 * Sets the item active state.
	 *
	 * @private
	 * @param {boolean} active <code>true</code> for active and <code>false</code> for inactive
	 * @returns {gara.widgets.Item} this
	 */
	setActive : function (active) {
		this.active = active;
		this.setClass("garaActiveItem", this.active);
		return this;
	},

	/**
	 * Sets the image for the item.
	 *
	 * @param {Image} image the new image
	 * @returns {gara.widgets.Item} this
	 */
	setImage : function (image) {
		this.image = image;
		return this;
	},

	/**
	 * Sets the text for the item.
	 *
	 * @param {String} text the new text
	 * @returns {gara.widgets.Item} this
	 */
	setText : function (text) {
		this.text = text;
		return this;
	}
});