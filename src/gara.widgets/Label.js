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

gara.provide("gara.widgets.Label", "gara.widgets.Control");

/**
 * gara Label Widget
 *
 * @class gara.widgets.Label
 * @extends gara.widgets.Control
 */
gara.Class("gara.widgets.Label", function() { return /** @lends gara.widgets.Label# */{
	$extends : gara.widgets.Control,

	/**
	 * Image's DOM reference.
	 *
	 * @private
	 * @type {HTMLElement}
	 */
	imgNode : null,

	/**
	 * Text's DOM reference.
	 *
	 * @private
	 * @type {HTMLElement}
	 */
	txtNode : null,

	/**
	 * The <code>Label</code>'s image.
	 *
	 * @private
	 * @type {Image}
	 */
	image : null,

	/**
	 * The <code>Label</code>'s text.
	 *
	 * @private
	 * @type {String}
	 */
	text : "",

	/**
	 * @constructs
	 * @extends gara.widgets.Control
	 * @param {gara.widgets.Composite|HTMLElement} parent parent dom node or <code>Composite</code>
	 * @param {int} style The style for the Label
	 */
	$constructor : function (parent, style) {
		this.imgNode = null;
		this.txtNode = null;
		this.image = null;
		this.text = "";

		this.$super(parent, style  || 0);
	},

	/**
	 * Register listeners for this widget. Implementation for gara.widgets.Widget
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @returns {void}
	 */
	bindListener : function (eventType, listener) {
		gara.addEventListener(this.handle, eventType, listener);
	},

	/**
	 *
	 * @private
	 */
	createWidget : function () {
		this.createHandle("span");

		// disabling focus
		this.handle.tabIndex = -1;

		// css
		this.addClass("garaLabel");

		this.imgNode = document.createElement("img");
		this.imgNode.widget = this;
		this.imgNode.control = this;
		this.imgNode.style.display = "none";
		this.handle.appendChild(this.imgNode);

		this.txtNode = document.createTextNode(this.text);
		this.handle.appendChild(this.txtNode);
	},
	
	destroyWidget : function () {
		this.imgNode = null;
		this.txtNode = null;
		this.image = null;
		this.text = null;
	},

	/**
	 * Returns the receiver's image.
	 *
	 * @returns {Image} the items image
	 */
	getImage : function () {
		return this.image;
	},

	/**
	 * Returns the receiver's text.
	 *
	 * @returns {String} the text for this item
	 */
	getText : function () {
		return this.text;
	},

	/**
	 * Sets the receiver's image.
	 *
	 * @param {Image} image the new image
	 * @returns {gara.widgets.Label} this
	 */
	setImage : function (image) {
		this.image = image;
		if (image) {
			this.imgNode.src = image.src;
			this.imgNode.style.display = "";
		} else {
			this.imgNode.style.display = "none";
		}
		return this;
	},

	/**
	 * Sets the receiver's text.
	 *
	 * @param {String} text the new text
	 * @returns {gara.widgets.Label} this
	 */
	setText : function (text) {
		this.text = text;
		this.txtNode.nodeValue = text;
		return this;
	},

	/**
	 * Unregister listeners for this widget. Implementation for gara.Widget
	 *
	 * @private
	 * @returns {void}
	 */
	unbindListener : function (eventType, listener) {
		gara.removeEventListener(this.handle, eventType, listener);
	}
};});