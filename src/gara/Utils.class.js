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
 * @class Utils
 * @author Thomas Gossmann
 * @namespace gara
 */
$class("Utils", {
	$constructor : function() {},
	getStyle : $static(function(element, styleProp) {
		var style = "";
		if (document.defaultView && document.defaultView.getComputedStyle){
			style = document.defaultView.getComputedStyle(element, "").getPropertyValue(styleProp);
		} else if(element.currentStyle){
			styleProp = styleProp.replace(/\-(\w)/g, function (match, p1){
				return p1.toUpperCase();
			});
			style = element.currentStyle[styleProp];
		}
		return style;
	})
});