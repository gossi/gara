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
	},

	setHeight : function (height) {
		this.$super(height);
		this.setChildrenHeight(height);
		return this;
	},

	setChildrenHeight : function (height) {
		var resizeable = [], auto = [], percent = [], lastHeight, css = [], ratio, widgetHeight,
			classes = ["h25", "h50", "h75", "h33", "h66"];
			ratios = [0.25, 0.5, 0.75, 0.3333, 0.6666];;

		this.getChildren().forEach(function (widget) {
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
				if (widget.getHeight() > 1) {
					height -= widget.getHeight();
				} else if (widget.hasClass("h25") || widget.hasClass("h50") || widget.hasClass("h75") || widget.hasClass("h33") || widget.hasClass("h66")) {
//					console.log(this + ".setHeight push css");
					css.push(widget);
				} else if (widget.getHeight() === null) {
//					console.log(this + ".setHeight push auto");
	//				resizeable.push(widget);
					auto.push(widget);
				} else if (widget.getHeight() >= 0 && widget.getHeight() <= 1) {
	//				resizeable.push(widget);
					percent.push(widget);
				}
			}
		}, this);

		lastHeight = height;

		auto.forEach(function (widget, i, arr) {
			if (i === arr.length - 1) {
//				console.log("Layout.setHeight last-auto("+lastHeight+")");
	//			widget.setHeight(newHeight);
	//			widget.setHeight(null);
				widget.handle.style.height = lastHeight + "px";
			} else {
				widgetHeight = Math.floor(lastHeight / auto.length);
//				console.log("Layout.setHeight auto("+widgetHeight+")");
	//			widget.setHeight(widgetHeight);
	//			widget.setHeight(null);
				widget.handle.style.height = widgetHeight + "px";
				lastHeight -= widgetHeight;
			}
		}, this);

		percent.forEach(function (widget, i, arr) {
			if (i === arr.length - 1) {
//				console.log("Layout.setHeight last-percent("+lastHeight+")");
	//			widget.setHeight(newHeight);
	//			widget.setHeight(null);
				widget.handle.style.height = lastHeight + "px";
			} else {
				widgetHeight = Math.floor(widget.getHeight() * height);
//				console.log("Layout.setHeight percent("+widgetHeight+")");
	//			widget.setHeight(widgetHeight);
	//			widget.setHeight(null);
				widget.handle.style.height = widgetHeight + "px";
				lastHeight -= widgetHeight;
			}
		}, this);

		css.forEach(function (widget, i, arr) {
			if (i === arr.length - 1) {
//				console.log("Layout.setHeight last-css("+lastHeight+")");
				widget.handle.style.height = lastHeight + "px";
			} else {
				classes.forEach(function (cssClass, j) {
					if (widget.hasClass(cssClass)) {
						ratio = ratios[j];
						return;
					}
				}, this);
				widgetHeight = Math.floor(ratio * height);
//				console.log("Layout.setHeight css("+widgetHeight+")");
	//			widget.setHeight(widgetHeight);
	//			widget.setHeight(null);
				widget.handle.style.height = widgetHeight + "px";
				lastHeight -= widgetHeight;
			}
		}, this);
	},

//	setWidth : function (width) {
//		return this.$super(width);
//	},

	unbindListener : function (eventType, listener) {
		gara.EventManager.removeListener(this.handle, eventType, listener);
	}

//	handleEvent : function(e) {
//		this.$super(e);
//	},
};});