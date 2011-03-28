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

gara.provide("gara.viewers.WrappedViewerLabelProvider", "gara.viewers.ColumnLabelProvider");

gara.use("gara.viewers.LabelProvider");
//gara.use("gara.viewers.ILabelProvider");
gara.use("gara.viewers.ViewerCell");

/**
 * @class WrappedViewerLabelProvider
 * @extends gara.viewers.ColumnLabelProvider
 * @namespace gara.viewers
 * @author Thomas Gossmann
 */
gara.Class("gara.viewers.WrappedViewerLabelProvider", function () { return {
	$extends : gara.viewers.ColumnLabelProvider,

	defaultLabelProvider : null,

	$constructor : function (labelProvider) {
		this.$super();

		this.defaultLabelProvider = new gara.viewers.LabelProvider();
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
//		if ($class.instanceOf(provider, gara.viewers.ITableLabelProvider))
//			this.tableLabelProvider = provider;

//		if ($class.instanceOf(provider, gara.viewers.IViewerLabelProvider))
//			this.viewerLabelProvider = provider;

//		if ($class.instanceOf(provider, gara.viewers.ILabelProvider)){
			this.labelProvider = provider;
//		}
	},

	update : function (cell) {
		if (!(cell instanceof gara.viewers.ViewerCell)) {
			throw new TypeError("cell is not instance of gara.viewers.ViewerCell");
		}

		var element = cell.getElement();
		cell.setText(this.getText(element));
		cell.setImage(this.getImage(element));
	}
};});