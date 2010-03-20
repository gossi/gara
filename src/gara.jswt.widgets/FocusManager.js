/*	$Id: ControlManager.class.js 181 2009-08-02 20:51:16Z tgossmann $

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

gara.provide("gara.jswt.widgets.FocusManager");

gara.use("gara.jswt.widgets.Widget");

gara.require("gara.EventManager");

/**
 * @class FocusManager
 * @author Thomas Gossmann
 * @namespace gara.jswt.widgets
 * @private
 */
gara.ready(function() {gara.Singleton("gara.jswt.widgets.FocusManager", {

	/**
	 * @field
	 *
	 * @private
	 * @type gara.jswt.wigets.Widget
	 */
	activeWidget : null,

	/**
	 * @field
	 *
	 * @private
	 * @type Array
	 */
	widgets : [],

	$constructor : function () {
		gara.EventManager.addListener(document, "keydown", this);
		gara.EventManager.addListener(document, "keypress", this);
		gara.EventManager.addListener(document, "keyup", this);
//		gara.EventManager.addListener(document, "mousedown", this);
	},

	/**
	 * @method
	 * Adds a widget to the FocusManager. The FocusManager registers itself
	 * at the widget.
	 *
	 * @param {gara.jswt.widgets.Widget} widget the widget
	 * @return {void}
	 */
	addWidget : function (widget) {
		if (!(widget instanceof gara.jswt.widgets.Widget)) {
			throw new TypeError("widget is not a gara.jswt.widgets.Widget");
		}

		if (!this.widgets.contains(widget)) {
			this.widgets.push(widget);
			widget.addDisposeListener(this);
			widget.addListener("focus", this);
			widget.addListener("blur", this);
		}
	},

	/**
	 * @method
	 * Internal event handler to pass keyboard events and focussing the acitve
	 * widget
	 *
	 * @private
	 * @param {Event} e the event
	 * @return {void}
	 */
	handleEvent : function (e) {
		switch (e.type) {
		case "keydown":
		case "keypress":
		case "keyup":
			if (this.activeWidget !== null && this.activeWidget.handleEvent) {
				this.activeWidget.handleEvent(e);
			}
			break;

		case "focus":
			if (e.target.widget instanceof gara.jswt.widgets.Widget) {
				if (e.target.widget.focusGained) {
					e.target.widget.focusGained(e);
				}
				this.activeWidget = e.target.widget;
			}
			break;

		case "blur":
			if (e.target.widget instanceof gara.jswt.widgets.Widget) {
				if (e.target.widget.focusLost) {
					e.target.widget.focusLost(e);
				}
				this.activeWidget = null;
			}
			break;
		}
	},

	/**
	 * @method
	 * Removes a widget from the FocusManager. The FocusManager removes the
	 * previous registered when added with addWidget.
	 *
	 * @param {gara.jswt.widgets.Widget} widget the widget
	 * @return {void}
	 */
	removeWidget : function (widget) {
		if (!(widget instanceof gara.jswt.widgets.Widget)) {
			throw new TypeError("widget is not a gara.jswt.widgets.Widget");
		}

		if (this.widgets.contains(widget)) {
			if (this.activeWidget === widget) {
				this.activeWidget = null;
			}
			widget.removeDisposeListener(this);
			widget.removeListener("focus", this);
			widget.removeListener("blur", this);
			this.widgets.remove(widget);
		}
	},

	/**
	 * @method
	 * Implementation for the the DisposeListener. Once a Widget from
	 * FocusManager's Collection gets disposed we will be notified about that
	 * event here and can remove the widget from the FocusManager as well.
	 *
	 * @private
	 * @param {gara.jswt.widget.Widget} widget the disposed Widget
	 * @return {void}
	 */
	widgetDisposed : function (widget) {
		this.removeWidget(widget);
	}
})});