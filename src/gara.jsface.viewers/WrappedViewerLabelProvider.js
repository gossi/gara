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

gara.provide("gara.jsface.viewers.WrappedViewerLabelProvider", "gara.jsface.viewers.ColumnLabelProvider");

gara.use("gara.jsface.viewers.LabelProvider");
//gara.use("gara.jsface.viewers.ILabelProvider");
gara.use("gara.jsface.viewers.ViewerCell");

/**
 * @class WrappedViewerLabelProvider
 * @extends gara.jsface.viewers.ColumnLabelProvider
 * @namespace gara.jsface.viewers
 * @author Thomas Gossmann
 */
gara.Class("gara.jsface.viewers.WrappedViewerLabelProvider", {
	$extends : gara.jsface.viewers.ColumnLabelProvider,

	defaultLabelProvider : null,

	$constructor : function (labelProvider) {
		this.$super();

		this.defaultLabelProvider = new gara.jsface.viewers.LabelProvider();
		this.labelProvider = this.defaultLabelProvider;
		this.tableLabelProvider;
		this.viewerLabelProvider;

		this.setProviders(labelProvider);
	},

	getLabelProvider : function () {
		return this.labelProvider;
	},

	getImage : function (element) {
		if (this.getLabelProvider().getImage) {
			return this.getLabelProvider().getImage(element);
		}
		return null;
	},

	getText : function (element) {
		if (this.getLabelProvider().getText) {
			return this.getLabelProvider().getText(element);
		}
		return "";
	},

	setProviders : function (provider) {
//		if ($class.instanceOf(provider, gara.jsface.viewers.ITableLabelProvider))
//			this.tableLabelProvider = provider;

//		if ($class.instanceOf(provider, gara.jsface.viewers.IViewerLabelProvider))
//			this.viewerLabelProvider = provider;

//		if ($class.instanceOf(provider, gara.jsface.viewers.ILabelProvider)){
			this.labelProvider = provider;
//		}
	},

	update : function (cell) {
		if (!(cell instanceof gara.jsface.viewers.ViewerCell)) {
			throw new TypeError("cell is not instance of gara.jsface.viewers.ViewerCell");
		}

		var element = cell.getElement();
		cell.setText(this.getText(element));
		cell.setImage(this.getImage(element));
	}
});