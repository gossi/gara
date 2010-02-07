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

gara.provide("gara.jsface.viewers.ITableLabelProvider");

gara.require("gara.jsface.viewers.IBaseLabelProvider");

$package("gara.jsface.viewers");

/**
 * @interface ITableLabelProvider
 * @extends gara.jsface.viewers.IBaseLabelProvider
 * @namespace gara.jsface.viewers
 * @author Thomas Gossmann
 *
 * Extends <code>IBaseLabelProvider</code> with the methods to provide the text
 * and/or image for each column of a given element. Used by table viewers.
 */
$interface("ITableLabelProvider", {
	$extends : gara.jsface.viewers.IBaseLabelProvider,

	/**
	 * @method
	 * Returns the label image for the given column of the given element.
	 *
	 * @param {Object} element the object representing the entire row, or <code>null</code> indicating that no input object is set in the viewer
	 * @param {int} columnIndex the zero-based index of the column in which the label appears
	 * @returns Image or <code>null</code> if there is no image for the given object at columnIndex
	 */
	getColumnImage : function(element, columnIndex) {},

	/**
	 * @method
	 * Returns the label text for the given column of the given element.
	 *
	 * @param {Object} element the object representing the entire row, or <code>null</code> indicating that no input object is set in the viewer
	 * @param {int} columnIndex the zero-based index of the column in which the label appears
	 * @returns String or or <code>null</code> if there is no text for the given object at columnIndex
	 */
	getColumnText : function(element, columnIndex) {}
});
$package("");