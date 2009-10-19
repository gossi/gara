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
 * @class CellLabelProvider
 * @extends gara.jsface.viewers.BaseLabelProvider
 * @namespace gara.jsface.viewers
 * @author Thomas Gossmann
 */
$class("CellLabelProvider", {
	$extends : gara.jsface.viewers.BaseLabelProvider,

	$constructor : function() {
		this.$base();
	},

	createViewerLabelProvider : $static(function(labelProvider) {
		if ($class.instanceOf(labelProvider, gara.jsface.viewers.ITableLabelProvider)) {
			return new gara.jsface.viewers.TableColumnViewerLabelProvider(labelProvider);
		}

		if ($class.instanceOf(labelProvider, gara.jsface.viewers.CellLabelProvider)) {
			return labelProvider;
		}
		return new gara.jsface.viewers.WrappedViewerLabelProvider(labelProvider);
	}),

	update : $abstract(function(cell){})
});