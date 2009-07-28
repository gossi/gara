/*	$Id$

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

/**
 * @summary
 * gara MenuItem Widget
 *
 * @description
 * long description for the MenuItem Widget...
 *
 * @class MenuItem
 * @author Thomas Gossmann
 * @namespace gara.jswt
 * @extends gara.jswt.Item
 */
$class("MenuItem", {
	$extends : gara.jswt.Item,

	$constructor : function(parent, style, index) {
		if (!$class.instanceOf(parent, gara.jswt.Menu)) {
			throw new TypeError("parent is not type of gara.jswt.Menu");
		}
		this.$base(parent, style);
		this._parent = parent;
		this._parent._addItem(this, index);
		this._span = null;
		this._spanText = null;
		this._img = null;
		this._hr = null;

		this._selectionListener = [];

		this._menu = null;
		this._enabled = true;
		this._selected = false;
	},

	/**
	 * @method
	 * Adds a selection listener on the MenuItem
	 *
	 * @author Thomas Gossmann
	 * @param {gara.jswt.SelectionListener} listener the desired listener to be added to this menuitem
	 * @throws {TypeError} if the listener is not an instance SelectionListener
	 * @return {void}
	 */
	addSelectionListener : function(listener) {
		this.checkWidget();
		if (!$class.instanceOf(listener, gara.jswt.SelectionListener)) {
			throw new TypeError("listener is not instance of gara.jswt.SelectionListener");
		}

		if (!this._selectionListener.contains(listener)) {
			this._selectionListener.push(listener);
		}
	},

	_create : function() {
		this.domref = document.createElement("li");
		this.domref.obj = this;
		this.domref.control = this._parent;

		if ((this._style & JSWT.SEPARATOR) == JSWT.SEPARATOR) {
			this.domref.className = "jsWTMenuItemSeparator";
			if ((this._parent.getStyle() & JSWT.BAR) != JSWT.BAR) {
				this._hr = document.createElement("hr");
				this.domref.appendChild(this._hr);
			}
		} else {
			// create item nodes
			this._img = null;

			// set image
			if (this._image != null) {
				this._img = document.createElement("img");
				this._img.obj = this;
				this._img.control = this._parent;
				this._img.src = this._image.src;
				this._img.alt = this._text;

				// put the image into the dom
				this.domref.appendChild(this._img);
				base2.DOM.EventTarget(this._img);
			}

			this._spanText = document.createTextNode(this._text);

			this._span = document.createElement("span");
			this._span.obj = this;
			this._span.control = this._parent;
			this._span.appendChild(this._spanText);
			this.domref.appendChild(this._span);

			base2.DOM.EventTarget(this.domref);
			base2.DOM.EventTarget(this._span);

			/* buffer unregistered user-defined listeners */
			var unregisteredListener = {};
			for (var eventType in this._listener) {
				unregisteredListener[eventType] = this._listener[eventType].concat([]);
			}

			/* Menu event listener (for IE) */
			try {
				var node = this.domref;
				this.domref.attachEvent("onmouseover", function(){
					node.className += " hover";
				});
				this.domref.attachEvent("onmouseout", function(){
					node.className = node.className.replace(new RegExp('\\shover', 'g'), '');
				});
			} catch (e) {}

			/* register user-defined listeners */
			for (var eventType in unregisteredListener) {
				unregisteredListener[eventType].forEach(function(elem, index, arr){
					this.registerListener(eventType, elem);
				}, this);
			}

			if (this._menu != null) {
				this.addClassName("jsWTMenuItemCascade");
				this._menu.update();
			}

			if (!this._enabled) {
				this.addClassName("disabled");
			}

			if ((this._style & JSWT.CHECK) == JSWT.CHECK
					|| (this._style & JSWT.RADIO) == JSWT.RADIO) {
				this.addClassName("checkable");
			}

			if (this._selected) {
				if ((this._style & JSWT.CHECK) == JSWT.CHECK) {
					this.addClassName("check");
				} else if ((this._style & JSWT.RADIO) == JSWT.RADIO) {
					this.addClassName("radio");
				}
			}

			this.domref.className = this._className;
		}
		this._changed = false;
		this.domref;

		var index = this._parent.indexOf(this);
		var parentItems = this._parent.getItems();
		var parentDomref = this._parent.domref;

		var nextNode = index == 0
			? parentDomref.firstChild
			: parentItems[index - 1].domref.nextSibling;

		if (!nextNode) {
			parentDomref.appendChild(this.domref);
		} else {
			parentDomref.insertBefore(this.domref, nextNode);
		}
	},

	dispose : function() {
		this.$base();

		if (this._menu != null) {
			this._menu.dispose();
			delete this._menu;
		}

		if (this._img != null) {
			this.domref.removeChild(this._img);
			delete this._img;
			this._image = null;
		}

		if (this._hr != null) {
			this.domref.removeChild(this._hr);
		}

		if (this._span != null) {
			this.domref.removeChild(this._span);
		}

		if (this._parentNode != null) {
			this._parentNode.removeChild(this.domref);
		}

		delete this._hr;
		delete this._span;
		delete this.domref;
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

	/**
	 * @method
	 * Register listeners for this widget. Implementation for gara.jswt.Widget
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	_registerListener : function(eventType, listener) {
		if (this.domref != null) {
			gara.EventManager.addListener(this.domref, eventType, listener);
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
	 * @param {gara.jswt.SelectionListener} listener the listener to remove from this menuitem
	 * @throws {TypeError} if the listener is not an instance SelectionListener
	 * @return {void}
	 */
	removeSelectionListener : function(listener) {
		this.checkWidget();
		if (!$class.instanceOf(listener, gara.jswt.SelectionListener)) {
			throw new TypeError("listener is not instance of gara.jswt.SelectionListener");
		}

		if (this._selectionListener.contains(listener)) {
			this._selectionListener.remove(listener);
		}
	},

	_select : function(e) {
		e.item = this;
		if ((this._style & JSWT.SEPARATOR) == JSWT.SEPARATOR
				|| !this._enabled) {
			return;
		}

		if ((this._style & JSWT.CHECK) == JSWT.CHECK) {
			this._selected = !this._selected;
			this._changed = true;
		}

		if ((this._style & JSWT.RADIO) == JSWT.RADIO) {
			this._selected = true;
			this._changed = true;
		}

		this.update();

		// blurring menu, if POP_UP
		var parent = this;
		while (parent.getParent && parent.getParent() != null
				&& ($class.instanceOf(parent.getParent(), gara.jswt.Menu)
					|| $class.instanceOf(parent.getParent(), gara.jswt.MenuItem)
				)) {
			parent = parent.getParent();
		}

		if ((parent.getStyle() & JSWT.POP_UP) == JSWT.POP_UP) {
			parent.setVisible(false);
		}

		// notify selection listener
		this._selectionListener.forEach(function(listener, index, arr) {
			listener.widgetSelected(e);
		}, this);
	},

	setEnabled : function(enabled) {
		this._enabled = enabled;
		this._changed = true;

		if (this.domref != null) {
			this.update();
		}
	},

	setImage : function(image) {
		this.$base(image);

		if (this.domref != null) {
			this.update();
		}
	},

	setMenu : function(menu) {
		this.checkWidget();
		if (!$class.instanceOf(menu, gara.jswt.Menu)) {
			throw new TypeError("menu is not instance of gara.jswt.Menu");
		}

		this._menu = menu;
		this._changed = true;
	},

	setSelection : function(selected) {
		this._selected = selected;
		this._changed = true;
		this.update();

		var e = {
			item : this,
			widget : this._menu
		};

		// notify selection listener
		this._selectionListener.forEach(function(listener, index, arr) {
			listener.widgetSelected(e);
		}, this);
	},

	setText : function(text) {
		this.$base(text);

		if (this.domref != null) {
			this.update();
		}
	},

	toString : function() {
		return "[gara.jswt.MenuItem]";
	},

	/**
	 * @method
	 * Unregister listeners for this widget. Implementation for gara.jswt.Widget
	 *
	 * @private
	 * @author Thomas Gossmann
	 * @return {void}
	 */
	_unregisterListener : function(eventType, listener) {
		if (this.domref != null) {
			gara.EventManager.removeListener(this.domref, eventType, listener);
		}

		if (this._img != null) {
			gara.EventManager.removeListener(this._img, eventType, listener);
		}

		if (this._span != null) {
			gara.EventManager.removeListener(this._span, eventType, listener);
		}
	},

	update : function() {
		if (!this.domref) {
			this._create();
		} else if (this._changed){
			this.checkWidget();

			// create image
			if (this._image != null && this._img == null) {
				this._img = document.createElement("img");
				this._img.obj = this;
				this._img.control = this._menu;
				this._img.alt = this._text;
				this._img.src = this._image.src;
				this.domref.insertBefore(this._img, this._span);
				base2.DOM.EventTarget(this._img);

				// event listener
				for (var eventType in this._listener) {
					this._listener[eventType].forEach(function(elem, index, arr) {
						this.registerListener(this._img, eventType, elem);
					}, this);
				}
			}

			// simply update image information
			else if (this._image != null) {
				this._img.src = this._image.src;
				this._img.alt = this._text;
			}

			// delete image
			else if (this._img != null && this._image == null) {
				this.domref.removeChild(this._img);
				this._img = null;

				// event listener
				for (var eventType in this._listener) {
					this._listener[eventType].forEach(function(elem, index, arr) {
						gara.EventManager.removeListener({
							domNode : this._img,
							type: eventType,
							listener : elem
						});
					}, this);
				}
			}

			this.removeClassName("disabled");
			this.removeClassName("checkable");
			this.removeClassName("check");
			this.removeClassName("radio");
			this.removeClassName("jsWTMenuItemCascade");
			if (this._menu != null) {
				this.addClassName("jsWTMenuItemCascade");
				this._menu.update();
			}

			if (!this._enabled) {
				this.addClassName("disabled");
			}

			if ((this._style & JSWT.CHECK) == JSWT.CHECK
					|| (this._style & JSWT.RADIO) == JSWT.RADIO) {
				this.addClassName("checkable");
			}

			if (this._selected) {
				if ((this._style & JSWT.CHECK) == JSWT.CHECK) {
					this.addClassName("check");
				} else if ((this._style & JSWT.RADIO) == JSWT.RADIO) {
					this.addClassName("radio");
				}
			}

			this._spanText.nodeValue = this._text;
			this.domref.className = this._className;

			this._changed = false;
		}

		// update sub menu
		if (this._menu != null) {
			this._menu.update();
		}
	}
});