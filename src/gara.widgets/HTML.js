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

gara.provide("gara.widgets.HTML", "gara.widgets.Scrollable");

/**
 * gara Label Widget
 *
 * @class gara.widgets.HTML
 * @extends gara.widgets.Scrollable
 */
gara.Class("gara.widgets.HTML", function() { return /** @lends gara.widgets.HTML# */ {
	$extends : gara.widgets.Scrollable,

	/**
	 * HTML's DOM reference.
	 *
	 * @private
	 * @type {HTMLElement}
	 */
	html : null,

	/**
	 * @constructs
	 * @extends gara.widgets.Scrollable
	 * @param {gara.widgets.Composite|HTMLElement} parent parent dom node or composite
	 * @param {int} style the style for the HTML-Widget
	 */
	$constructor : function (parent, style) {
		this.html = null;
		this.$super(parent, style  || 0);
	},

	/**
	 * Register listeners for this widget. Implementation for gara.widgets.Widget
	 *
	 * @private
	 * @returns {void}
	 */
	bindListener : function (eventType, listener) {
		gara.addEventListener(this.handle, eventType, listener);
	},

	/**
	 * @private
	 */
	createWidget : function () {
		this.createHandle("div");

		// disabling focus
		this.handle.tabIndex = -1;

		this.html = document.createElement("html");
		this.handle.appendChild(this.html);
	},
	
	destroyWidget : function () {
		this.html = null;
	},

	/**
	 * Returns the HTML
	 *
	 * @returns {String} the html
	 */
	getHTML : function () {
		return this.html.innerHTML;
	},

	/**
	 * Sets the html
	 *
	 * @param {String} html new html
	 * @returns {gara.widgets.HTML} this
	 */
	setHTML : function (html) {
		this.html.innerHTML = html;
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