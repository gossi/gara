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

gara.provide("gara.jswt.widgets.Label");

gara.require("gara.jswt.widgets.Control");
gara.require("gara.jswt.widgets.Composite");

/**
 * gara Label Widget
 *
 * @class Label
 * @author Thomas Gossmann
 * @namespace gara.jswt.widgets
 * @extends gara.jswt.widgets.Control
 */
gara.Class("gara.jswt.widgets.Label", {
	$extends : gara.jswt.widgets.Control,

	/**
	 * @constructor
	 * @param {gara.jswt.Composite|HTMLElement} parent parent dom node or composite
	 * @param {int} style The style for the Label
	 */
	$constructor : function(parent, style) {
		this._imgNode = null;
		this._txtNode = null;
		this._image = null;
		this._text = "";

		this.$base(parent, style  || 0);
	},

	_createWidget : function() {
		this.$base("div");

		// css
		this.addClass("jsWTLabel");

		this._imgNode = document.createElement("img");
		this._imgNode.widget = this;
		this._imgNode.control = this;
		this._imgNode.style.display = "none";
		this.handle.appendChild(this._imgNode);

		this._txtNode = document.createTextNode(this._text);
		this.handle.appendChild(this._txtNode);
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
		gara.EventManager.addListener(this.handle, eventType, listener);
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
		if (image) {
			this._imgNode.src = image.src;
			this._imgNode.style.display = "";
		} else {
			this._imgNode.style.display = "none";
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
	setText : function(text) {
		this._text = text;
		this._txtNode.nodeValue = text;
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
	_unregisterListener : function(eventType, listener) {
		gara.EventManager.removeListener(this.handle, eventType, listener);
	},

	update : function() {

	}
});