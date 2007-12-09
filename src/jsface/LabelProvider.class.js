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
 * @class LabelProvider
 * @namespace gara.jsface
 * @author Thomas Gossmann
 * @implements gara.jsface.ILabelProvider
 * 
 * A label provider implementation which, by default, uses an element's toString
 * value for its text and null for its image. This class may be used as is, or
 * subclassed to provide richer labels. Subclasses may override any of the
 * following methods:
 * <ul>
 * <li>isLabelProperty</li>
 * <li>getImage</li>
 * <li>getText</li>
 * </ul>
 */
$class("LabelProvider", {
	$implements : gara.jsface.ILabelProvider,

	/**
	 * @constructor
	 */
	$constructor : function() {
	},

	getImage : function() {
		
	},

	getText : function() {
		
	},
	
	isLabelProperty : function(element, property) {
		
	},

	toString : function() {
		return "[gara.jsface.LabelProvider]";
	}
});