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

gara.provide("gara.viewers.PatternFilter", "gara.viewers.ViewerFilter");

//gara.use("gara.viewers.ITableLabelProvider");
//gara.use("gara.viewers.ITreeContentProvider");

/**
 * @class PatternFilter
 * @extends gara.viewers.ViewerFilter
 * @namespace gara.viewers
 * @author Thomas Gossmann
 */
gara.Class("gara.viewers.PatternFilter", function () { return {
	$extends : gara.viewers.ViewerFilter,

	/**
	 * @constructor
	 */
	$constructor : function () {
		this.pattern = "";
	},

	isElementVisible : function (viewer, element) {
		return this.isParentMatch(viewer, element) || this.isLeafMatch(viewer, element);
	},

	/**
	 * @method
	 *
	 * @private
	 */
	isLeafMatch : function (viewer, element) {
		var lblProvider = viewer.getLabelProvider(), cols, i, labelText, result;
		if (lblProvider.getColumnText) {
			cols = viewer.getControl().getColumnCount();
			for (i = 0; i < cols; ++i) {
				labelText = lblProvider.getColumnText(element, i);
				if (labelText !== null) {
					result = this.match(labelText);
					if (result) {
						return result;
					}
				}
			}
			return false;
		} else {
			labelText = lblProvider.getText(element);
			if (labelText === null) {
				return false;
			}
	        return this.match(labelText);
		}

	},

	/**
	 * @method
	 *
	 * @private
	 */
	isParentMatch : function (viewer, element) {
		var cp = viewer.getContentProvider(), children, elementFound, i;

		if (cp.getChildren) {
			children = cp.getChildren(element);

	        if (children !== null && children.length > 0) {
				elementFound = false;
				for (i = 0; i < children.length && !elementFound; i++) {
					elementFound = this.isElementVisible(viewer, children[i]);
				}
				return elementFound;
			}
		}
        return false;
	},

	/**
	 * @method
	 *
	 * @private
	 */
	match : function (text) {
		return text.toLowerCase().indexOf(this.pattern.toLowerCase()) !== -1;
	},

	select : function (viewer, parentElement, element) {
		if (this.pattern === "") {
			return true;
		}
		return this.isElementVisible(viewer, element);
	},

	setPattern : function (pattern) {
		this.pattern = pattern;
	}
};});