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

gara.provide("gara.jswt.widgets.Shell", "gara.jswt.widgets.Decorations");

gara.use("gara.jswt.widgets.Display");

/**
 * @class Shell
 * @author Thomas Gossmann
 * @extends gara.jswt.widgets.Decorations
 * @namespace gara.jswt.widgets
 */
gara.Class("gara.jswt.widgets.Shell", function() { return {
	$extends : gara.jswt.widgets.Decorations,

	/**
	 * @constructor
	 */
	$constructor : function (parent, style) {

		if (!(parent instanceof gara.jswt.widgets.Shell) && !(parent instanceof gara.jswt.widgets.Display)) {
			style = parent | gara.jswt.JSWT.SHELL_TRIM;
			parent = gara.jswt.widgets.Display.getDefault();
		} else {
			style |= gara.jswt.JSWT.DIALOG_TRIM;
		}

		this.$super(parent, gara.jswt.widgets.Shell.checkStyle(style));
	},

	checkStyle : gara.$static(function (style) {
		style = gara.jswt.widgets.Decorations.checkStyle(style);

		return style;
	}),

	/**
	 * @private
	 */
	createWidget : function () {
		var x = this.parent instanceof gara.jswt.widgets.Display ? document.documentElement.clientWidth : this.parent.getClientArea().clientWidth,
			y = this.parent instanceof gara.jswt.widgets.Display ? document.documentElement.clientHeight : this.parent.getClientArea().clientHeight;
		this.$super();
		this.addClass("jsWTShell");

		this.positionOffsetX = 0;
		this.positionOffsetY = 0;

		this.setWidth(Math.floor(x / 2));
		this.setHeight(Math.floor(y / 2));
		this.setLocation(Math.floor(x / 4), Math.floor(y / 4));
		this.handle.style.display = "none";
	},

	/**
	 * @method
	 *
	 * @private
	 */
	handleEvent : function (e) {
		this.$super(e);
	},

	open : function () {
		this.handle.style.display = "block";
		this.forceFocus();
	}
};});