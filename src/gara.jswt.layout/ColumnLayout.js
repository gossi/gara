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

gara.provide("gara.jswt.layout.ColumnLayout", "gara.jswt.layout.Layout");

/**
 * @class ColumnLayout
 * @author Thomas Gossmann
 * @extends gara.jsface.layout.Layout
 * @namespace gara.jsface.layout
 */
gara.Class("gara.jswt.layout.ColumnLayout", function() { return {
	$extends : gara.jswt.layout.Layout,

	$constructor : function (parent) {
		this.$super(parent);
		this.addClass("jsWTColumnLayout");
	},

	setChildrenHeight : function (height) {
		var resizeable = [], newHeight = height;

		this.getChildren().forEach(function (widget) {
			var widgetHeight;
			if (widget instanceof gara.jswt.widgets.Scrollable) {
				if (widget.getHeight() === null) {
					resizeable.push(widget);
				}
			}
		}, this);

		resizeable.forEach(function (widget, i, arr) {
			widget.handle.style.height = height + "px";
		}, this);

		return this;
	}

//	setHeight : function (height) {
//		console.log("ColumnLayout.setHeight: " + height);
		//var changeable = [], newHeight = height;
//		this.$super(height);

//		if (height !== null) {
//		this.getChildren().forEach(function (widget) {
//			var widgetHeight;
//			if (widget instanceof gara.jswt.widgets.Scrollable) {
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