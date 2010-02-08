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

gara.use("gara.jswt.JSWT");

gara.require("gara.jswt.widgets.Control");


/**
 * @class Scrollable
 * @author Thomas Gossmann
 * @extends gara.jswt.widgets.Control
 * @namespace gara.jswt.widgets
 */
gara.Class("gara.jswt.widgets.Scrollable", {
	$extends : gara.jswt.widgets.Control,

	/**
	 * @constructor
	 */
	$constructor : function(parent, style) {
		this.$base(parent, style);
	},

	getClientArea : function() {
		return this._scrolledHandle();
	},

	getHorizontalScrollbar : function() {
		return this._scrolledHandle().clientWidth < this._scrolledHandle().scrollWidth && this._scrolledHandle().style.overflowX != "hidden";
	},

	getVerticalScrollbar : function() {
		return this._scrolledHandle().clientHeight < this._scrolledHandle().scrollHeight && this._scrolledHandle().style.overflowY != "hidden";
	},

	handleEvent : function(e) {
		this.$base(e);
	},

	_preventScrolling : function(e) {
		if (e.keyCode == gara.jswt.JSWT.ARROW_UP || e.keyCode == gara.jswt.JSWT.ARROW_DOWN
				|| e.keyCode == gara.jswt.JSWT.ARROW_LEFT || e.keyCode == gara.jswt.JSWT.ARROW_RIGHT
				|| e.keyCode == gara.jswt.JSWT.PAGE_UP || e.keyCode == gara.jswt.JSWT.PAGE_DOWN
				|| e.keyCode == gara.jswt.JSWT.HOME || e.keyCode == gara.jswt.JSWT.END
				|| e.keyCode == gara.jswt.JSWT.SPACE || (e.keyCode == 65 && e.ctrlKey)) {
			e.preventDefault();
		}
	},

	_scrolledHandle : function() {
		return this.handle;
	}
});