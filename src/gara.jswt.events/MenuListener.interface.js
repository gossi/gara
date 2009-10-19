/*	$Id: MenuListener.interface.js 180 2009-07-28 18:28:51Z tgossmann $

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
 * @interface MenuListener
 * @author Thomas Gossmann
 * @namespace gara.jswt
 */
$interface("MenuListener", {
	menuHidden : function(widget) {
		
	},
	
	menuShown : function(widget) {
		
	},
	
	toString : function() {
		return "[gara.jswt.MenuListener]";
	}
});