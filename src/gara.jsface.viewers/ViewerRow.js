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

gara.provide("gara.jsface.viewers.ViewerRow");

gara.use("gara.jsface.viewers.ViewerCell");

/**
 * @class ViewerRow
 * @extends gara.jsface.viewers.ViewerRow
 * @namespace gara.jsface.viewers
 * @author Thomas Gossmann
 */
gara.Class("gara.jsface.viewers.ViewerRow", {

	$constructor : function () {

	},

	/**
	 * @method
	 *
	 * @abstract
	 */
	getItem : function () {},

	/**
	 * @method
	 *
	 * @abstract
	 */
	getColumnCount : function () {},

	/**
	 * @method
	 *
	 * @abstract
	 */
	getImage : function (columnIndex) {},

	/**
	 * @method
	 *
	 * @abstract
	 */
	setImage : function (columnIndex, image) {},

	/**
	 * @method
	 *
	 * @abstract
	 */
	getText : function (columnIndex) {},

	/**
	 * @method
	 *
	 * @abstract
	 */
	setText : function (columnIndex, text) {},

	getCell : function (column) {
		if (column >= 0) {
			return new gara.jsface.viewers.ViewerCell(this, column, this.getElement());
		}

		return null;
	},

	/**
	 * @method
	 *
	 * @abstract
	 */
	getElement : function () {},

	/**
	 * @method
	 *
	 * @abstract
	 */
	getControl : function () {}
});