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

gara.provide("gara.viewers.CellLabelProvider", "gara.viewers.BaseLabelProvider");

gara.use("gara.viewers.TableColumnViewerLabelProvider");
gara.use("gara.viewers.WrappedViewerLabelProvider");

/**
 * @class CellLabelProvider
 * @extends gara.viewers.BaseLabelProvider
 * @namespace gara.viewers
 * @author Thomas Gossmann
 */
gara.Class("gara.viewers.CellLabelProvider", function() { return {
	$extends : gara.viewers.BaseLabelProvider,

	$constructor : function() {
		this.$super();
	},

	/**
	 * @method
	 *
	 * @static
	 */
	createViewerLabelProvider : gara.$static(function(labelProvider) {
		if (labelProvider instanceof gara.viewers.CellLabelProvider) {
			return labelProvider;
		}

		// labelProvider instanceof gara.viewers.ITableLabelProvider
		if (labelProvider.getColumnText || labelProvider.getColumnImage) {
			return new gara.viewers.TableColumnViewerLabelProvider(labelProvider);
		}

		return new gara.viewers.WrappedViewerLabelProvider(labelProvider);
	}),

	/**
	 * @method
	 *
	 * @abstract
	 */
	update : function(cell){}
};});