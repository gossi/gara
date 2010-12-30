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

gara.provide("gara.events.DisposeListener");

/**
 * @interface gara.events.DisposeListener
 * @name gara.events.DisposeListener
 * @class
 * 
 * TODO: Remove class in favor of interface
 */

gara.Class("gara.events.DisposeListener", /** @lends gara.events.DisposeListener# */ {
	/**
	 * Sent when a widget gets disposed.
	 */
	widgetDisposed : function () {}
});