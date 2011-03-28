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

gara.provide("gara.layout.RowLayout", "gara.layout.Layout");

/**
 * @class RowLayout
 * @author Thomas Gossmann
 * @extends gara.jsface.layout.Layout
 * @namespace gara.jsface.layout
 */
gara.Class("gara.layout.RowLayout", function() { return {
	$extends : gara.layout.Layout,

	$constructor : function (style) {
		this.$super(style);
	},

	construct : function (composite) {
		composite.addClass("garaRowLayout");
		this.$super(composite);
	},

	deconstruct : function (composite) {
		composite.removeClass("garaRowLayout");
		this.$super(composite);
	},

	layout : function (composite) {
		var resizeable = [], lastHeight, ratio, widgetHeight,
			autoHeight = [], percentHeight = [], cssHeight = [],
			heights = ["h25", "h50", "h75", "h33", "h66"],
			widths = ["w25", "w50", "w75", "w33", "w66"],
			ratios = [0.25, 0.5, 0.75, 0.3333, 0.6666],
			width = composite.getClientArea().clientHeight, 
			height = composite.getClientArea().clientWidth;
		
		composite.getChildren().forEach(function (widget) {
			if (widget instanceof gara.widgets.Scrollable) {
			
				// no width
//				if (widget.getWidth() === null) {
//					widget.adjustWidth(width);
//				}
	
				// height
				if (widget.getHeight() > 1) {
					height -= widget.getHeight();
				} else if (widget.hasClass("h25") || widget.hasClass("h50") || widget.hasClass("h75") || widget.hasClass("h33") || widget.hasClass("h66")) {
					cssHeight.push(widget);
				} else if (widget.getHeight() === null) {
					autoHeight.push(widget);
				} else if (widget.getHeight() >= 0 && widget.getHeight() <= 1) {
					percentHeight.push(widget);
				}
			}
		}, this);
		
		lastHeight = height;

//		autoHeight.forEach(function (widget, i, arr) {
//			if (i === arr.length - 1) {
//				widget.adjustHeight(lastHeight);
//			} else {
//				widgetHeight = Math.floor(lastHeight / autoHeight.length);
//				widget.adjustHeight(widgetHeight);
//				lastHeight -= widgetHeight;
//			}
//		}, this);

//		percentHeight.forEach(function (widget, i, arr) {
//			if (i === arr.length - 1) {
//				widget.adjustHeight(lastHeight);
//			} else {
//				widgetHeight = Math.floor(widget.getHeight() * height);
//				widget.adjustHeight(widgetHeight);
//				lastHeight -= widgetHeight;
//			}
//		}, this);

//		cssHeight.forEach(function (widget, i, arr) {
//			if (i === arr.length - 1) {
//				widget.adjustHeight(lastHeight);
//			} else {
//				heights.forEach(function (cssHeightClass, j) {
//					if (widget.hasClass(cssHeightClass)) {
//						ratio = ratios[j];
//						return;
//					}
//				}, this);
//				widgetHeight = Math.floor(ratio * height);
//				widget.adjustHeight(widgetHeight);
//				lastHeight -= widgetHeight;
//			}
//		}, this);
		this.$super(composite);
	}
};});