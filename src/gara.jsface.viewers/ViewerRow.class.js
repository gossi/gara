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
 * @class ViewerRow
 * @extends gara.jsface.viewers.ViewerRow
 * @namespace gara.jsface.viewers
 * @author Thomas Gossmann
 */
$class("ViewerRow", {
	$constructor : function() {
		this.$base();
	},

	getItem : $abstract(function() {}),

	getColumnCount : $abstract(function() {}),

	getImage : $abstract(function(columnIndex) {}),

	setImage : $abstract(function(columnIndex, image) {}),

	getText : $abstract(function(columnIndex) {}),

	setText : $abstract(function(columnIndex, text) {}),

	getCell : function(column) {
		if (column >= 0) {
			return new gara.jsface.viewers.ViewerCell(this, column, this.getElement());
		}

		return null;
	},

	getElement : $abstract(function() {}),

	getControl : $abstract(function() {})

});