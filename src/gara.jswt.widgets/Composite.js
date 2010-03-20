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

gara.provide("gara.jswt.widgets.Composite");

//gara.use("gara.jswt.widgets.Control");

gara.parent("gara.jswt.widgets.Scrollable",

/**
 * @class Composite
 * @author Thomas Gossmann
 * @extends gara.jswt.widgets.Scrollable
 * @namespace gara.jswt.widgets
 */
function() {gara.Class("gara.jswt.widgets.Composite", {
	$extends : gara.jswt.widgets.Scrollable,

	/**
	 * @field
	 * True, if this is composite, false if composite is inherited
	 * @private
	 * @tpye {boolean}
	 */
	isComposite : false,

	/**
	 * @constructor
	 */
	$constructor : function (parent, style) {
		this.$super(parent, style);
	},

	dispose : function () {
		this.$super();

		if (this.parentNode != null && this.isComposite) {
			this.parentNode.removeChild(this.handle);
			delete this.handle;
		}
	},

	createWidget : function (element, preventAppending) {
		if (typeof(element) == "undefined") {
			this.addClass("jsWTComposite");
			this.createHandle("div");
			this.handle.tabIndex = -1;
			this.isComposite = true;
		} else {
			this.$super(element, preventAppending);
		}
	},

	getChildren : function () {
		var widgets = [], child, i,
			childs =  this.getClientArea().childNodes;

		for (i = 0, len = childs.length; i < len; i++) {
			child = childs[i];
			if (child.widget && child.widget instanceof gara.jswt.widgets.Widget) {
				widgets.push(child.widget);
			}
		}
		return widgets;
	}

//	handleEvent : function(e) {
//		this.$super(e);
//	},
})});