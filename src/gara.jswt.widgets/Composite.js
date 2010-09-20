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

gara.provide("gara.jswt.widgets.Composite", "gara.jswt.widgets.Scrollable");

//gara.use("gara.jswt.widgets.Control");

/**
 * @class Composite
 * @author Thomas Gossmann
 * @extends gara.jswt.widgets.Scrollable
 * @namespace gara.jswt.widgets
 */
gara.Class("gara.jswt.widgets.Composite", function() { return {
	$extends : gara.jswt.widgets.Scrollable,
	
	/**
	 * @field
	 * A specific Layout for this Composite
	 * 
	 * @private
	 * @type {gara.jswt.layout.Layout}
	 */
	layoutInformation : null,

	/**
	 * @constructor
	 */
	$constructor : function (parent, style) {
		this.$super(parent, style);

		this.layoutInformation = null;
		//this.resize();
	},

	/**
	 * @method
	 * Register listeners for this widget. Implementation for gara.jswt.widgets.Widget
	 *
	 * @private
	 * @return {void}
	 */
	bindListener : function (eventType, listener) {
		gara.EventManager.addListener(this.handle, eventType, listener);
	},

	createHandle : function (element) {
		this.$super(element);
		this.addClass("garaComposite");
	},

	createWidget : function () {
		this.createHandle("div");
		this.handle.tabIndex = -1;
	},

	/**
	 * @method
	 * 
	 * @summary
	 * Returns a (possibly empty) array containing the receiver's children.
	 * 
	 * @description
	 * Returns a (possibly empty) array containing the receiver's children. Children are returned 
	 * in the order that they are drawn. The topmost control appears at the beginning of the array. 
	 * Subsequent controls draw beneath this control and appear later in the array. 
	 * 
	 * @return {gara.jswt.widgets.Control[]} an array of children
	 */
	getChildren : function () {
		var temp = {}, child, i, len, z, layers = {}, max = 0, controls = [],
			childs = this.getClientArea().childNodes;

		// SELECT childNodes FROM this.getClientArea() WHERE childNode[widget] 
		// 		ORDER BY childNode.style.zIndex DESC
		for (i = 0, len = childs.length; i < len; i++) {
			child = childs[i];
			if (child.widget && child.widget !== this && child.widget instanceof gara.jswt.widgets.Control) {
				z = child.widget.handle.style.zIndex === "" ? 0 : child.widget.handle.style.zIndex;
				if (!layers[z]) {
					layers[z] = [];
				}
				layers[z][layers[z].length] = child.widget;
				max = Math.max(max, z);
			}
		}

		for (i = max; i >= 0; i--) {
			if (layers[i]) {
				layers[i].forEach(function (widget) {
					controls[controls.length] = widget;
				}, this);
			}
		}
		
		return controls;
	},
	
	getLayout : function () {
		return this.layoutInformation;
	},

	/**
	 * @method
	 *
	 * @private
	 */
	layout : function () {
		var resizeable = [], lastHeight, ratio, widgetHeight,
			autoHeight = [], percentHeight = [], cssHeight = [],
			heights = ["h25", "h50", "h75", "h33", "h66"],
			widths = ["w25", "w50", "w75", "w33", "w66"],
			ratios = [0.25, 0.5, 0.75, 0.3333, 0.6666],
			height = this.getClientArea().clientHeight,
			width = this.getClientArea().clientWidth;

		if (this.layoutInformation !== null) {
			return this.layoutInformation.layout(this);
		}

		this.getChildren().forEach(function (widget) {
//			console.log("Composite.layout: " + widget + " " + widget.getHeight());
			if (widget instanceof gara.jswt.widgets.Scrollable) {
//				if (!(widget.hasClass("h25") || widget.hasClass("h50" || widget.hasClass("h75") || widget.hasClass("h100") || widget.hasClass("h33") || widget.hasClass("h66") || widget.getHeight() >= 0 && widget.getHeight() <= 1))) {
//					console.log(this + ".setHeight push changeable");
//					changeable.push(widget);
//				} else {
//					if (widget.getHeight() === null) {
//						widgetHeight = widget.handle.clientHeight - gara.getNumStyle(widget.handle, "padding-top") - gara.getNumStyle(widget.handle, "padding-bottom") - gara.getNumStyle(widget.handle, "border-top") - gara.getNumStyle(widget.handle, "border-bottom");
//	//					console.log("Composite.setHeight, widgetHeight: " + widgetHeight);
//						widget.setHeight(widgetHeight);
//						widget.setHeight(null);
//						newHeight -= widgetHeight;
//					}
//				}

				// css width
				if (widget.hasClass("w25") || widget.hasClass("w50") || widget.hasClass("w75") || widget.hasClass("w33") || widget.hasClass("w66")) {
					widths.forEach(function (cssHeightClass, j) {
						if (widget.hasClass(cssHeightClass)) {
							ratio = ratios[j];
							return;
						}
					}, this);
					widget.adjustWidth(Math.floor(ratio * width));
				} 
				
				// no width
				else if (widget.getWidth() === null) {
					widget.adjustWidth(width);
				}

				// height
				if (widget.getHeight() > 1) {
					height -= widget.getHeight();
				} else if (widget.hasClass("h25") || widget.hasClass("h50") || widget.hasClass("h75") || widget.hasClass("h33") || widget.hasClass("h66")) {
//					console.log(this + ".setHeight push cssHeight");
					cssHeight.push(widget);
				} else if (widget.getHeight() === null) {
//					console.log(this + ".setHeight push autoHeight");
	//				resizeable.push(widget);
					autoHeight.push(widget);
				} else if (widget.getHeight() >= 0 && widget.getHeight() <= 1) {
	//				resizeable.push(widget);
					percentHeight.push(widget);
				}
			}
		}, this);

		lastHeight = height;

//		widths.forEach(function (widget) {
//
//		});

		autoHeight.forEach(function (widget, i, arr) {
			if (i === arr.length - 1) {
//				console.log("Layout.setHeight last-autoHeight("+lastHeight+")");
	//			widget.setHeight(newHeight);
	//			widget.setHeight(null);
//				console.log("Composite.layout(autoHeight) " + widget + " " + lastHeight);
//				widget.handle.style.height = lastHeight + "px";
				widget.adjustHeight(lastHeight);
			} else {
				widgetHeight = Math.floor(lastHeight / autoHeight.length);
//				console.log("Layout.setHeight autoHeight("+widgetHeight+")");
	//			widget.setHeight(widgetHeight);
	//			widget.setHeight(null);
//				console.log("Composite.layout(autoHeight) " + widget + " " + widgetHeight);
//				widget.handle.style.height = widgetHeight + "px";
				widget.adjustHeight(widgetHeight);
				lastHeight -= widgetHeight;
			}
		}, this);

		percentHeight.forEach(function (widget, i, arr) {
			if (i === arr.length - 1) {
//				console.log("Layout.setHeight last-percentHeight("+lastHeight+")");
	//			widget.setHeight(newHeight);
	//			widget.setHeight(null);
//				widget.handle.style.height = lastHeight + "px";
				widget.adjustHeight(lastHeight);
			} else {
				widgetHeight = Math.floor(widget.getHeight() * height);
//				console.log("Layout.setHeight percentHeight("+widgetHeight+")");
	//			widget.setHeight(widgetHeight);
	//			widget.setHeight(null);
				widget.adjustHeight(widgetHeight);
//				widget.handle.style.height = widgetHeight + "px";
				lastHeight -= widgetHeight;
			}
		}, this);

		cssHeight.forEach(function (widget, i, arr) {
			if (i === arr.length - 1) {
//				console.log("Layout.setHeight last-cssHeight("+lastHeight+")");
				widget.adjustHeight(lastHeight);
//				widget.handle.style.height = lastHeight + "px";
			} else {
				heights.forEach(function (cssHeightClass, j) {
					if (widget.hasClass(cssHeightClass)) {
						ratio = ratios[j];
						return;
					}
				}, this);
				widgetHeight = Math.floor(ratio * height);
//				console.log("Layout.setHeight cssHeight("+widgetHeight+")");
	//			widget.setHeight(widgetHeight);
	//			widget.setHeight(null);
				widget.adjustHeight(widgetHeight);
//				widget.handle.style.height = widgetHeight + "px";
				lastHeight -= widgetHeight;
			}
		}, this);
	},
	
	releaseChildren : function () {
		this.getChildren().forEach(function (control) {
			control.release();
		});
	},

	setLayout : function (layout) {
		if (!(layout instanceof gara.jswt.layout.Layout)) {
			throw new TypeError("layout not instance of gara.jswt.layout.Layout");
		}
		
		if (this.layoutInformation !== null) {
			this.layoutInformation.deconstruct(this);
		}
		this.layoutInformation = layout;
		this.layoutInformation.construct(this);
		return this;
	},

	unbindListener : function (eventType, listener) {
		gara.EventManager.removeListener(this.handle, eventType, listener);
	}
};});