/*	$Id: MenuItem.class.js 181 2009-08-02 20:51:16Z tgossmann $

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

gara.provide("gara.jswt.widgets.MenuItem");

gara.use("gara.EventManager");
gara.use("gara.jswt.JSWT");
gara.use("gara.jswt.events.SelectionListener");

gara.require("gara.jswt.widgets.Item");
gara.require("gara.jswt.widgets.Menu");

/**
 * @summary
 * gara MenuItem Widget
 *
 * @description
 * long description for the MenuItem Widget...
 *
 * @class MenuItem
 * @author Thomas Gossmann
 * @namespace gara.jswt.widgets
 * @extends gara.jswt.widgets.Item
 */
gara.Class("gara.jswt.widgets.MenuItem", {
	$extends : gara.jswt.widgets.Item,

	$constructor : function(parent, style, index) {
		if (!gara.instanceOf(parent, gara.jswt.widgets.Menu)) {
			throw new TypeError("parent is not type of gara.jswt.widgets.Menu");
		}
		this.$base(parent, style);
		this._parent._addItem(this, index);
		this._span = null;
		this._spanText = null;
		this._img = null;
		this._hr = null;

		this._selectionListener = [];

		this._menu = null;
		this._enabled = true;
		this._visible = true;
		this._selected = false;

		this._create();
	},

	/**
	 * @method
	 * Adds a selection listener on the MenuItem
	 *
	 * @author Thomas Gossmann
	 * @param {gara.jswt.events.SelectionListener} listener the desired listener to be added to this menuitem
	 * @throws {TypeError} if the listener is not an instance SelectionListener
	 * @return {void}
	 */
	addSelectionListener : function(listener) {
		this.checkWidget();
		if (!gara.instanceOf(listener, gara.jswt.events.SelectionListener)) {
			throw new TypeError("listener is not instance of gara.jswt.events.SelectionListener");
		}

		if (!this._selectionListener.contains(listener)) {
			this._selectionListener.push(listener);
		}
	},

	_create : function() {
		this.handle = document.createElement("li");
		this.handle.widget = this;
		this.handle.control = this._parent;
		this.handle.className = this._classes.join(" ");
		this.handle.style.display = this._visible ? "block" : "none";

		base2.DOM.Event(this.handle);
		this.handle.setAttribute("id", this.getId());
		this.handle.setAttribute("role", "menuitem");
		this.handle.setAttribute("aria-disabled", !this._enabled);
		this.handle.setAttribute("aria-labelledby", this.getId() + "-label");
		if ((this._style & gara.jswt.JSWT.SEPARATOR) == gara.jswt.JSWT.SEPARATOR) {
			this.handle.className = "jsWTMenuItemSeparator";
			if ((this._parent.getStyle() & gara.jswt.JSWT.BAR) != gara.jswt.JSWT.BAR) {
				this._hr = document.createElement("hr");
				this.handle.appendChild(this._hr);
				this.handle.setAttribute("aria-disabled", true);
			}
		} else {
			if ((this._style & gara.jswt.JSWT.RADIO) == gara.jswt.JSWT.RADIO) {
				this.handle.setAttribute("role", "menuitemradio");
			}

			if ((this._style & gara.jswt.JSWT.CHECK) == gara.jswt.JSWT.CHECK) {
				this.handle.setAttribute("role", "menuitemcheckbox");
			}

			if ((this._style & gara.jswt.JSWT.RADIO) == gara.jswt.JSWT.RADIO
					|| (this._style & gara.jswt.JSWT.CHECK) == gara.jswt.JSWT.CHECK) {
				this.handle.setAttribute("aria-checked", this._selected);
			}

			// create image node
			this._img = document.createElement("img");
			this._img.id = this.getId() + "-image";
			this._img.widget = this;
			this._img.control = this._parent;

			base2.DOM.Event(this._img);
			this._img.setAttribute("role", "presentation");

			// set image
			if (this._image != null) {
				this._img.src = this._image.src;
			} else {
				this._img.style.display = "none";
			}

			// create text node
			this._spanText = document.createTextNode(this._text);
			this._span = document.createElement("span");
			this._span.id = this.getId() + "-label";
			this._span.role = "presentation";
			this._span.widget = this;
			this._span.control = this._parent;
			this._span.className = "text";
			this._span.appendChild(this._spanText);

			base2.DOM.Event(this._span);
			this._span.setAttribute("role", "presentation");

			this.handle.appendChild(this._img);
			this.handle.appendChild(this._span);
			this.handle.setAttribute("aria-haspopup", ((this._style & gara.jswt.JSWT.CASCADE) == gara.jswt.JSWT.CASCADE) && this._menu != null);

			// css
			this.setClass("jsWTMenuItemCascade", ((this._style & gara.jswt.JSWT.CASCADE) == gara.jswt.JSWT.CASCADE) && this._menu != null);
			this.setClass("jsWTMenuItemCheck", (this._style & gara.jswt.JSWT.CHECK) == gara.jswt.JSWT.CHECK);
			this.setClass("jsWTMenuItemRadio", (this._style & gara.jswt.JSWT.RADIO) == gara.jswt.JSWT.RADIO);

			// listeners
			for (var eventType in this._listener) {
				this._listener[eventType].forEach(function(elem, index, arr){
					this.registerListener(eventType, elem);
				}, this);
			}
		}

		// add to dom tree
		var index = this._parent.indexOf(this);
		var parentItems = this._parent.getItems();
		var parentDomref = this._parent.handle;

		var nextNode = index == 0
			? parentDomref.firstChild
			: parentItems[index - 1].handle.nextSibling;

		if (!nextNode) {
			parentDomref.appendChild(this.handle);
		} else {
			parentDomref.insertBefore(this.handle, nextNode);
		}
	},

	dispose : function() {
		this.$base();

		if (this._menu != null) {
			this._menu.dispose();
			delete this._menu;
		}

		if (this._img != null) {
			this.handle.removeChild(this._img);
			delete this._img;
			this._image = null;
		}

		if (this._hr != null) {
			this.handle.removeChild(this._hr);
		}

		if (this._span != null) {
			this.handle.removeChild(this._span);
		}

		if (this._parentNode != null) {
			this._parentNode.removeChild(this.handle);
		}

		delete this._hr;
		delete this._span;
		delete this.handle;
	},

	getEnabled : function() {
		return this._enabled;
	},

	getMenu : function() {
		return this._menu;
	},

	getParent : function() {
		return this._parent;
	},

	getSelection : function() {
		return this._selected;
	},

	getVisible : function() {
		return this._visible;
	},

	/**
	 * @method
	 * Register listeners for this widget. Implementation for gara.jswt.Widget
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	_registerListener : function(eventType, listener) {
		if (this.handle != null) {
			gara.EventManager.addListener(this.handle, eventType, listener);
		}

		if (this._img != null) {
			gara.EventManager.addListener(this._img, eventType, listener);
		}

		if (this._span != null) {
			gara.EventManager.addListener(this._span, eventType, listener);
		}
	},

	/**
	 * @method
	 * Removes a selection listener from this MenuItem
	 *
	 * @author Thomas Gossmann
	 * @param {gara.jswt.events.SelectionListener} listener the listener to remove from this menuitem
	 * @throws {TypeError} if the listener is not an instance SelectionListener
	 * @return {void}
	 */
	removeSelectionListener : function(listener) {
		this.checkWidget();
		if (!gara.instanceOf(listener, gara.jswt.events.SelectionListener)) {
			throw new TypeError("listener is not instance of gara.jswt.events.SelectionListener");
		}

		if (this._selectionListener.contains(listener)) {
			this._selectionListener.remove(listener);
		}
	},

	setEnabled : function(enabled) {
		this._enabled = enabled;
		if (this.handle != null) {
			this.handle.setAttribute("aria-disabled", !this._enabled);
		}

		return this;
	},

	setImage : function(image) {
		this.$base(image);

		if (this.handle) {
			// update image
			if (this._image != null) {
				this._img.src = this._image.src;
				this._img.style.display = "";
			}

			// hide image
			else {
				this._img.src = "";
				this._img.style.display = "none";
			}
		}
		return this;
	},

	setMenu : function(menu) {
		this.checkWidget();
		if (!gara.instanceOf(menu, gara.jswt.widgets.Menu)) {
			throw new TypeError("menu is not instance of gara.jswt.widgets.Menu");
		}

		this._menu = menu;
		this.setClass("jsWTMenuItemCascade", ((this._style & gara.jswt.JSWT.CASCADE) == gara.jswt.JSWT.CASCADE) && this._menu != null);
		if (this.handle) {
			this._menu.update();
			this.handle.setAttribute("aria-haspopup", ((this._style & gara.jswt.JSWT.CASCADE) == gara.jswt.JSWT.CASCADE) && this._menu != null);
		}

		return this;
	},

	setSelection : function(selected) {
		// select when enabled and either radio or check type
		if (this._enabled) {
			var e = {
				item : this,
				widget : this._parent
			};

			if (((this._style & gara.jswt.JSWT.RADIO) == gara.jswt.JSWT.RADIO
					|| (this._style & gara.jswt.JSWT.CHECK) == gara.jswt.JSWT.CHECK)) {
				this._selected = selected;
				this.handle.setAttribute("aria-checked", this._selected);
			}

			if ((this._style & gara.jswt.JSWT.RADIO) == gara.jswt.JSWT.RADIO) {
				if (!this._parent._managingRadioChecks) {
					this._parent._managingRadioChecks = true;
					var pos = this._parent.indexOf(this);

					// removing selection upwards
					var i = pos - 1;
					while (i >= 0 && (this._parent.getItem(i).getStyle() & gara.jswt.JSWT.RADIO) == gara.jswt.JSWT.RADIO) {
						this._parent.getItem(i--).setSelection(false);
					}

					// removing selection downwards
					i = pos + 1;
					while (i < this._parent.getItems().length && (this._parent.getItem(i).getStyle() & gara.jswt.JSWT.RADIO) == gara.jswt.JSWT.RADIO) {
						this._parent.getItem(i++).setSelection(false);
					}
					this._parent._managingRadioChecks = false;
				}
			}

			// notify selection listener
			this._selectionListener.forEach(function(listener, index, arr) {
				listener.widgetSelected(e);
			}, this);
		}

		return this;
	},

	setText : function(text) {
		this.$base(text);

		if (this.handle && (this._style & gara.jswt.JSWT.SEPARATOR) != gara.jswt.JSWT.SEPARATOR) {
			this._spanText.nodeValue = this._text;
		}
		return this;
	},

	setVisible : function(visible) {
		this._visible = visible;
		this._changed = true;
		if (this.handle) {
			this.handle.style.display = this._visible ? "block" : "none";
		}

		return this;
	},

	/**
	 * @method
	 * Unregister listeners for this widget. Implementation for gara.jswt.widgets.Widget
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	_unregisterListener : function(eventType, listener) {
		if (this.handle != null) {
			gara.EventManager.removeListener(this.handle, eventType, listener);
		}

		if (this._img != null) {
			gara.EventManager.removeListener(this._img, eventType, listener);
		}

		if (this._span != null) {
			gara.EventManager.removeListener(this._span, eventType, listener);
		}
	},

	update : function() {
		this.checkWidget();

		if (!this.handle) {
			this._create();
		}

		// update sub menu
		if (this._menu != null) {
			this._menu.update();
		}
	}
});