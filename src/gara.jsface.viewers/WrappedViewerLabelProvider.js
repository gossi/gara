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

gara.provide("gara.jsface.viewers.WrappedViewerLabelProvider");

gara.require("gara.jsface.viewers.LabelProvider");
gara.require("gara.jsface.viewers.ILabelProvider");
gara.require("gara.jsface.viewers.ColumnLabelProvider");
gara.require("gara.jsface.viewers.ViewerCell");

$package("gara.jsface.viewers");

/**
 * @class WrappedViewerLabelProvider
 * @extends gara.jsface.viewers.ColumnLabelProvider
 * @namespace gara.jsface.viewers
 * @author Thomas Gossmann
 */
$class("WrappedViewerLabelProvider", {
	$extends : gara.jsface.viewers.ColumnLabelProvider,

	defaultLabelProvider : $static(new gara.jsface.viewers.LabelProvider()),

	$constructor : function(labelProvider) {
		this.$base();

		this._labelProvider = this.defaultLabelProvider;
		this._tableLabelProvider;
		this._viewerLabelProvider;

		this.setProviders(labelProvider);
	},

	getLabelProvider : function() {
		return this._labelProvider;
	},

	getImage : function(element) {
		return this.getLabelProvider().getImage(element);
	},

	getText : function(element) {
		return this.getLabelProvider().getText(element);
	},

	setProviders : function(provider) {
//		if ($class.instanceOf(provider, gara.jsface.viewers.ITableLabelProvider))
//			this._tableLabelProvider = provider;

//		if ($class.instanceOf(provider, gara.jsface.viewers.IViewerLabelProvider))
//			this._viewerLabelProvider = provider;

		if ($class.instanceOf(provider, gara.jsface.viewers.ILabelProvider)){this._labelProvider = provider;}
	},

	update : function(cell) {
		if (!$class.instanceOf(cell, gara.jsface.viewers.ViewerCell)) {
			throw new TypeError("cell is not instance of gara.jsface.viewers.ViewerCell");
		}

		var element = cell.getElement();
		cell.setText(this.getText(element));
		cell.setImage(this.getImage(element));
	}
});
$package("");