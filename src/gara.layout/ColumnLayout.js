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

gara.provide("gara.layout.ColumnLayout", "gara.layout.Layout");

/**
 * @class ColumnLayout
 * @author Thomas Gossmann
 * @extends gara.jsface.layout.Layout
 * @namespace gara.jsface.layout
 */
gara.Class("gara.layout.ColumnLayout", function() { return {
	$extends : gara.layout.Layout,

	$constructor : function (style) {
		this.$super(style);
	},

	construct : function (composite) {
		this.$super(composite);
		composite.addClass("garaColumnLayout");
	},

	deconstruct : function (composite) {
		this.$super(composite);
		composite.removeClass("garaColumnLayout");
	},

	layout : function (composite) {
		var ratio, width, height,
			widths = ["w25", "w50", "w75", "w33", "w66"],
			ratios = [0.25, 0.5, 0.75, 0.32, 0.65],
			overflow = gara.getStyle(composite.handle, "overflow-y");

		composite.handle.style.overflowY = "hidden";

		width = composite.getClientArea().clientWidth;
		height = composite.getClientArea().clientHeight;
		
		composite.getChildren().forEach(function (widget) {
			if (widget instanceof gara.widgets.Scrollable) {
//				if (widget.getHeight() === null) {
//					console.log("ColumnLayout.layout, adjust width to " + height + " on " + widget);
//					widget.adjustHeight(height);
//				}
//				
				// css width
//				if (widget.hasClass("w25") || widget.hasClass("w50") || widget.hasClass("w75") || widget.hasClass("w33") || widget.hasClass("w66")) {
//					widths.forEach(function (cssWidthClass, j) {
//						if (widget.hasClass(cssWidthClass)) {
//							ratio = ratios[j];
//							return;
//						}
//					}, this);
//					
//					widget.adjustWidth(Math.floor(ratio * width) - gara.getNumStyle(widget.handle, "margin-left") - gara.getNumStyle(widget.handle, "margin-right"));
//				}
			}
		}, this);
		
		composite.handle.style.overflowY = overflow;

		this.$super(composite);
	}

//	setHeight : function (height) {
//		console.log("ColumnLayout.setHeight: " + height);
		//var changeable = [], newHeight = height;
//		this.$super(height);

//		if (height !== null) {
//		this.getChildren().forEach(function (widget) {
//			var widgetHeight;
//			if (widget instanceof gara.widgets.Scrollable) {
//				if (!(widget.hasClass("h25") || widget.hasClass("h50" || widget.hasClass("h75") || widget.hasClass("h100") || widget.hasClass("h33") || widget.hasClass("h66")))) {
//					console.log("change height to " + height);
//					widget.setHeight(height);
//					changeable.push(widget);
//				} else {
//					if (widget.getHeight() === null) {
//						widgetHeight = widget.handle.clientHeight - gara.getNumStyle(widget.handle, "padding-top") - gara.getNumStyle(widget.handle, "padding-bottom") - gara.getNumStyle(widget.handle, "border-top") - gara.getNumStyle(widget.handle, "border-bottom");
//						console.log("ColumnLayout.setHeight, widgetHeight: " + widgetHeight);
//						widget.setHeight(widgetHeight);
//						widget.setHeight(null);
//						newHeight -= widgetHeight;
//					}
//				}
//			}
//		}, this);
//		}

//		changeable.forEach(function (widget, i, arr) {
//			var widgetHeight;
//			if (i == arr.length - 1) {
//
//			} else {
//				widgetHeight = Math.floor(widget.getHeight() / height * newHeight);
//				widget.setHeight(widgetHeight);
//				newHeight -= widgetHeight;
//			}
//		}, this);
//	}
};});