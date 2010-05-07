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

gara.provide("gara.jswt.layout.Layout", "gara.jswt.widgets.Composite");

gara.use("gara.EventManager");

/**
 * @class Layout
 * @author Thomas Gossmann
 * @extends gara.jswt.widgets.Composite
 * @namespace gara.jsface.layout
 */
gara.Class("gara.jswt.layout.Layout", function() { return {
	$extends : gara.jswt.widgets.Composite,

	$constructor : function (parent) {
		this.$super(parent);
		this.addClass("jsWTLayout");

		if (parent.style && parent.style.position === "absolute") {
			gara.EventManager.addListener(window, "resize", this);
		}
	},

	createWidget : function () {
		this.$super();
		//this.resize();
	},

	handleEvent : function (e) {
		if (e.type === "resize") {
			this.resize();
		}
	},

	/**
	 * @method
	 * Recalculates this layout, based on the parents dimensions
	 */
	resize : function () {
		var tempHeight = this.getHeight();

		if (this.parent.style && this.parent.style.position === "absolute") {
			this.setWidth(this.parent.offsetWidth);
			this.setHeight(this.parent.offsetHeight);
		} else {


//			if (!(this.hasClass("w25") || this.hasClass("w50") || this.hasClass("w75") || this.hasClass("w33") || this.hasClass("w66"))) {
//				console.log("Layout.resize() -> set width");
//				this.setWidth(this.handle.offsetWidth - gara.getNumStyle(this.handle, "margin-left") - gara.getNumStyle(this.handle, "margin-right"));
//			}
//			if (!(this.hasClass("h25") || this.hasClass("h50") || this.hasClass("h75") || this.hasClass("h33") || this.hasClass("h66"))) {
//				console.log("Layout.resize -> width");
				this.setHeight(this.handle.offsetHeight - gara.getNumStyle(this.handle, "margin-top") - gara.getNumStyle(this.handle, "margin-bottom"));
//			}
			this.height = tempHeight;


		}

		this.getChildren().forEach(function (widget) {
			if (widget instanceof gara.jswt.layout.Layout) {
				widget.resize();
			}
		}, this);
	}
};});