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

/**
 * @class Scrollable
 * @author Thomas Gossmann
 * @extends gara.jswt.widgets.Control
 * @namespace gara.jswt.widgets
 */
$class("Scrollable", {
	$extends : gara.jswt.widgets.Control,

	/**
	 * @constructor
	 */
	$constructor : function(parent, style) {
		this.$base(parent, style);
	},

	getClientArea : function() {
		return this.scrolledHandle();
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
		if (e.keyCode == JSWT.ARROW_UP || e.keyCode == JSWT.ARROW_DOWN
				|| e.keyCode == JSWT.ARROW_LEFT || e.keyCode == JSWT.ARROW_RIGHT
				|| e.keyCode == JSWT.PAGE_UP || e.keyCode == JSWT.PAGE_DOWN
				|| e.keyCode == JSWT.HOME || e.keyCode == JSWT.END
				|| e.keyCode == JSWT.SPACE || (e.keyCode == 65 && e.ctrlKey)) {
			e.preventDefault();
		}
	},

	_scrolledHandle : function() {
		return this.handle;
	}
});