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

gara.provide("gara.jswt.layout.RowLayout", "gara.jswt.layout.Layout");

/**
 * @class RowLayout
 * @author Thomas Gossmann
 * @extends gara.jsface.layout.Layout
 * @namespace gara.jsface.layout
 */
gara.Class("gara.jswt.layout.RowLayout", function() { return {
	$extends : gara.jswt.layout.Layout,

	$constructor : function (style) {
		this.$super(style);
	},

	construct : function (composite) {
		composite.addClass("jsWTRowLayout");
		this.$super(composite);
	},

	deconstruct : function (composite) {
		composite.removeClass("jsWTRowLayout");
		this.$super(composite);
	},

	layout : function (composite) {
		this.$super(composite);
	}
};});