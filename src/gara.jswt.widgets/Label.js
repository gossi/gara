/*	$Id: TabFolder.class.js 181 2009-08-02 20:51:16Z tgossmann $

		gara - Javascript Toolkit
	================================================================================================================

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

	================================================================================================================
*/

gara.provide("gara.jswt.widgets.Label", "gara.jswt.widgets.Control");

/**
 * gara Label Widget
 *
 * @class Label
 * @author Thomas Gossmann
 * @namespace gara.jswt.widgets
 * @extends gara.jswt.widgets.Control
 */
gara.Class("gara.jswt.widgets.Label", function() { return {
	$extends : gara.jswt.widgets.Control,

	/**
	 * @field
	 * Image's DOM reference.
	 *
	 * @private
	 * @type {HTMLElement}
	 */
	imgNode : null,

	/**
	 * @field
	 * Text's DOM reference.
	 *
	 * @private
	 * @type {HTMLElement}
	 */
	txtNode : null,

	/**
	 * @field
	 * The <code>Label</code>'s image.
	 *
	 * @private
	 * @type {Image}
	 */
	image : null,

	/**
	 * @field
	 * The <code>Label</code>'s text.
	 *
	 * @private
	 * @type {String}
	 */
	text : "",

	/**
	 * @constructor
	 * @param {gara.jswt.Composite|HTMLElement} parent parent dom node or composite
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
	 * @method
	 * Register listeners for this widget. Implementation for gara.jswt.widgets.Widget
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	bindListener : function (eventType, listener) {
		gara.EventManager.addListener(this.handle, eventType, listener);
	},

	/**
	 * @method
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
	 * Sets the image for the Label
	 *
	 * @author Thomas Gossmann
	 * @param {Image} image the new image
	 * @return {void}
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
	 * @method
	 * Sets the text for the <code>Label</code>
	 *
	 * @author Thomas Gossmann
	 * @param {String} text the new text
	 * @return {void}
	 */
	setText : function (text) {
		this.text = text;
		this.txtNode.nodeValue = text;
		return this;
	},

	/**
	 * @method
	 * Unregister listeners for this widget. Implementation for gara.jswt.Widget
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	unbindListener : function (eventType, listener) {
		gara.EventManager.removeListener(this.handle, eventType, listener);
	},

	update : function () {

	}
};});