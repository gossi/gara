/*	$Id $

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

gara.provide("gara.jswt.widgets.Scrollable");

gara.parent("gara.jswt.widgets.Control",

/**
 * @class Scrollable
 * @author Thomas Gossmann
 * @extends gara.jswt.widgets.Control
 * @namespace gara.jswt.widgets
 */
function() {gara.Class("gara.jswt.widgets.Scrollable", {
	$extends : gara.jswt.widgets.Control,

	/**
	 * @constructor
	 */
	$constructor : function (parent, style) {
		this.$super(parent, style);
	},

	getClientArea : function () {
		return this.scrolledHandle();
	},

	getHorizontalScrollbar : function () {
		return this.scrolledHandle().clientWidth < this.scrolledHandle().scrollWidth && this.scrolledHandle().style.overflowX != "hidden";
	},

	getVerticalScrollbar : function () {
		return this.scrolledHandle().clientHeight < this.scrolledHandle().scrollHeight && this.scrolledHandle().style.overflowY != "hidden";
	},

	handleEvent : function (e) {
		this.$super(e);
	},

	/**
	 * @method
	 *
	 * @private
	 */
	scrolledHandle : function () {
		return this.handle;
	}
})});