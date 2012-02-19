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

gara.provide("gara.widgets.Scrollable");

//gara.use("gara.widgets.Composite");

/**
 * @class gara.widgets.Scrollable
 * @extends gara.widgets.Control
 */
gara.widgets.Scrollable = gara.Class(gara.widgets.Control, /** @lends gara.widgets.Scrollable# */ {
	/**
	 * @constructs
	 * @extends gara.widgets.Control
	 */
	constructor : function (parent, style) {
		this.super(parent, style);
		if (parent instanceof gara.widgets.Composite) {
			parent.layout();
		}
	},

	/**
	 * Returns the receiver's client area.
	 * 
	 * @returns {HTMLElement} the scrolled HTMLElement
	 */
	getClientArea : function () {
		return this.scrolledHandle();
	},

	/**
	 * Returns true when the receiver has a horizontal scrollbar, false otherwise
	 * 
	 * @returns {boolean} true wether there is a horizontal scrollbar otherwise false 
	 */
	getHorizontalScrollbar : function () {
		return this.scrolledHandle().clientWidth < this.scrolledHandle().scrollWidth && this.scrolledHandle().style.overflowX !== "hidden";
	},

	/**
	 * Returns true when the receiver has a vertical scrollbar, false otherwise
	 * 
	 * @returns {boolean} true wether there is a vertical scrollbar otherwise false 
	 */
	getVerticalScrollbar : function () {
		return this.scrolledHandle().clientHeight < this.scrolledHandle().scrollHeight && this.scrolledHandle().style.overflowY !== "hidden";
	},

	/**
	 * Returns the scrolled handle of the receiver
	 * 
	 * @private
	 * @returns {HTMLElement}
	 */
	scrolledHandle : function () {
		return this.handle;
	}
});