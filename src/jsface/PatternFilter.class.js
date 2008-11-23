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
 * @class PatternFilter
 * @extends ViewerFilter
 * @namespace gara.jsface
 * @author Thomas Gossmann
 */
$class("PatternFilter", {
	$extends : gara.jsface.ViewerFilter,

	/**
	 * @constructor
	 */
	$constructor : function() {
		this._pattern = "";
	},

	isElementVisible : function(viewer, element) {
		return this._isParentMatch(viewer, element) || this._isLeafMatch(viewer, element);
	},

	_isLeafMatch : function(viewer, element) {
		var lblProvider = viewer.getLabelProvider();
		if ($class.instanceOf(lblProvider, gara.jsface.ITableLabelProvider)) {
			var cols = viewer.getControl().getColumnCount();
			for (var i = 0; i < cols; ++i) {
				var labelText = lblProvider.getColumnText(element, i);
				if (labelText != null) {
					var result = this._match(labelText);
					if (result) {
						return result;
					}
				}
			}
			return false;
		} else {
			var labelText = lblProvider.getText(element);
			if (labelText == null) {
				return false;
			}
	        return this._match(labelText);
		}

	},

	_isParentMatch : function(viewer, element) {
		var cp = viewer.getContentProvider();

		if ($class.instanceOf(cp, gara.jsface.ITreeContentProvider)) {
			var children = cp.getChildren(element);

	        if (children != null && children.length > 0) {
				var elementFound = false;
				for (var i = 0; i < children.length && !elementFound; i++) {
					elementFound = this.isElementVisible(viewer, children[i]);
				}
				return elementFound;
			}
		}
        return false;
	},

	_match : function(text) {
		return text.toLowerCase().indexOf(this._pattern.toLowerCase()) != -1;
	},

	select : function(viewer, parentElement, element) {
		if (this._pattern == "") {
			return true;
		}
		var result = this.isElementVisible(viewer, element);
		return result;
	},
	
	setPattern : function(pattern) {
		this._pattern = pattern;
	},

	toString : function() {
		return "[gara.jsface.PatternFilter]";
	}
});
	