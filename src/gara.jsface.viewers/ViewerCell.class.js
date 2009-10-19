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
 * @class ViewerCell
 * @namespace gara.jsface.viewers
 * @author Thomas Gossmann
 */
$class("ViewerCell", {

	$constructor : function(rowItem, columnIndex, element) {
		this._row = rowItem;
		this._columnIndex = columnIndex;
		this._element = element;
	},

	getColumnIndex : function() {
		return this._columnIndex;
	},

	getControl : function() {
		return this._row.getControl();
	},

	getElement : function() {
		if (this._element != null) {
			return this._element;
		}
		return this._row.getElement();
	},

	getText : function() {
		return this._row.getText(columnIndex);
	},

	getImage : function() {
		return this._row.getImage(columnIndex);
	},

	getItem : function() {
		return this._row.getItem();
	},

	getViewerRow : function() {
		return this._row;
	},

	setText : function(text) {
		this._row.setText(this._columnIndex, text);
	},

	setImage : function(image) {
		this._row.setImage(this._columnIndex, image);
	},

	setColumn : function(columnIndex) {
		this._columnIndex = columnIndex;
	},

	update : function(rowItem, columnIndex, element) {
		this._row = rowItem;
		this._columnIndex = columnIndex;
		this._element = element;
	}
});