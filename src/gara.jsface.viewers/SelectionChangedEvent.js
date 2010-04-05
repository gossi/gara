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

gara.provide("gara.jsface.viewers.SelectionChangedEvent");

/**
 * @class SelectionChangedEvent
 * @namespace gara.jsface.viewers
 * @author Thomas Gossmann
 */
gara.Class("gara.jsface.viewers.SelectionChangedEvent", {

	/**
	 * @field
	 * Contains the source of this event
	 *
	 * @private
	 * @type {gara.jsface.viewers.Viewer}
	 */
	source : null,

	/**
	 * @field
	 * Contains the selection
	 *
	 * @private
	 * @type {Object[]}
	 */
	selection : null,

	$constructor : function (source, selection) {
		this.source = source;
		this.selection = selection;
	},

	getSelection : function () {
		return this.selection;
	},

	getSource : function () {
		return this.source;
	}
});