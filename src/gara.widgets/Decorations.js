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

gara.provide("gara.widgets.Decorations", "gara.widgets.Composite");

gara.use("gara.widgets.Menu");
gara.use("gara.widgets.Display");

/**
 * @class Composite
 * @author Thomas Gossmann
 * @extends gara.widgets.Scrollable
 * @namespace gara.widgets
 */
gara.Class("gara.widgets.Decorations", function() { return {
	$extends : gara.widgets.Composite,

	image : null,
	text : "",
	menuBar : null,
	stub : null,
	title : null,
	titleRight : null,
	titleTextNode : null,
	titleImage : null,
	titleButtons : null,
	titleCloseButton : null,
	titleMinButton : null,
	titleMaxButton : null,
	minis : gara.$static({}),

	/**
	 * @constructor
	 */
	$constructor : function (parent, style) {
		var self = this;
		this.image = null;
		this.text = "";
		this.menuBar = null;
		this.box = null;
		this.dX = 0;
		this.dY = 0;
		this.offsetX = 0;
		this.offsetY = 0;
		this.overflow = null;
		this.stub = null;
		this.title = null;
		this.titleRight = null;
		this.titleTextNode = null;
		this.titleImage = null;
		this.titleButtons = null;
		this.titleCloseButton = null;
		this.titleMinButton = null;
		this.titleMaxButton = null;

		this.enabled = false;
		this.maximized = false;
		this.minimized = false;
		this.defaultButton = null;

		this.resizeNNW = null;
		this.resizeWNW = null;
		this.resizeN = null;
		this.resizeNNE = null;
		this.resizeENE = null;
		this.resizeE = null;
		this.resizeW = null;
		this.resizeSSW = null;
		this.resizeWSW = null;
		this.resizeS = null;
		this.resizeSSE = null;
		this.resizeESE = null;
		
		this.adjustedHeight = false;
		this.adjustedWidth = false;
		this.restoreWidth = null;
		this.restoreHeight = null;
		
		this.menuBarResizeListener = {
			controlResized : function (e) {
				if (self.height > 0) {
					self.clientArea.style.height = (self.handle.clientHeight - (self.title ? self.title.offsetHeight : 0) - self.menuBarNode.offsetHeight) + "px";
				}
			}	
		};

		this.$super(parent, gara.widgets.Decorations.checkStyle(style));
		this.addFocusListener(this);
	},

	adjustHeight : function (height) {
		if (this.minimized || this.maximized) {
			this.restoreHeight = height;
			return;
		}
		
		this.$super(height);
		
		if (height > 1) {
			this.clientArea.style.height = (height - (this.title ? this.title.offsetHeight : 0) - this.menuBarNode.offsetHeight) + "px";
		}
	},

	adjustWidth : function (width) {
		if (this.minimized || this.maximized) {
			this.restoreWidth = width;
			return;
		}
		this.$super(width);
		
		if (width > 1) {
			this.clientArea.style.width = width + "px";
		}
	},
	
	/**
	 * @method
	 * Register listeners for this widget. Implementation for gara.widgets.Widget
	 *
	 * @private
	 * @return {void}
	 */
	bindListener : function (eventType, listener) {
		gara.addEventListener(this.handle, eventType, listener);
	},

	destroyWidget : function () {
		this.resizeNNW = null;
		this.resizeWNW = null;
		this.resizeN = null;
		this.resizeNNE = null;
		this.resizeENE = null;
		this.resizeE = null;
		this.resizeW = null;
		this.resizeSSW = null;
		this.resizeWSW = null;
		this.resizeS = null;
		this.resizeSSE = null;
		this.resizeESE = null;
		
		this.menuBarNode = null;
		this.clientArea = null;
		this.defaultButton = null;
		
		if (this.stub !== null) {
			this.handle.parentNode.removeChild(this.stub);
			this.stub = null;
		}
		
		this.$super();
	},

	checkStyle : gara.$static(function (style) {
		if ((style & gara.NO_TRIM) !== 0) {
			style &= ~(gara.CLOSE | gara.TITLE | gara.MIN | gara.MAX | gara.RESIZE | gara.BORDER);
		}

		if ((style & (gara.MIN | gara.MAX | gara.CLOSE)) !== 0) {
			style |= gara.TITLE;
		}

//		if ((style & gara.CLOSE) !== 0) {
//			style |= gara.TITLE;
//		}

		return style;
	}),

	/**
	 * @private
	 */
	createWidget : function () {
		this.createHandle("div");

		// aria
		this.handle.setAttribute("role", "group");
		
		// add css classes
		this.addClass("garaDecorations");
		this.setClass("garaBorder", (this.style & gara.BORDER) !== 0);
		this.moveParent = this.getParent() instanceof gara.widgets.Widget
			? this.getParent().handle
			: (this.getParent() instanceof gara.widgets.Display
					? this.getParent().getClientArea()
					: this.getParent());

		// title
		if ((this.style & gara.TITLE) !== 0) {
			this.title = document.createElement("div");
			this.title.className = "garaDecorationsTitle";
			this.title.widget = this;

			// title left, a node for sliding doors css-technic to apply styles
			this.titleRight = document.createElement("div");
			this.titleRight.className = "garaDecorationsTitleRight";
			this.titleRight.widget = this;

			this.title.appendChild(this.titleRight);

			// buttons
			if ((this.style & (gara.MIN | gara.MAX | gara.CLOSE)) !== 0) {
				this.titleButtons = document.createElement("div");
				this.titleButtons.className = "garaDecorationsTitleButtons";
				this.titleButtons.widget = this;

//				var clearer = document.createElement("div");
//				clearer.className = "garaDialogBarClearer";

				this.titleCloseButton = document.createElement("span");
				this.titleCloseButton.className = "garaDecorationsCloseButton" + (((this.style & gara.CLOSE) !== 0) ? " garaDecorationsCloseButtonActive" : " garaDecorationsCloseButtonDeactive");;
				this.titleButtons.appendChild(this.titleCloseButton);
				this.title.appendChild(this.titleButtons);

				if ((this.style & (gara.MIN | gara.MAX)) !== 0) {
					this.titleMinButton = document.createElement("span");
					this.titleMinButton.className = "garaDecorationsMinButton" + (((this.style & gara.MIN) !== 0) ? " garaDecorationsMinButtonActive" : " garaDecorationsMinButtonDeactive");
					this.titleMinButton.widget = this;
					this.titleButtons.appendChild(this.titleMinButton);

					this.titleMaxButton = document.createElement("span");
					this.titleMaxButton.className = "garaDecorationsMaxButton" + (((this.style & gara.MAX) !== 0) ? " garaDecorationsMaxButtonActive" : " garaDecorationsMaxButtonDeactive");
					this.titleMaxButton.widget = this;
					this.titleButtons.appendChild(this.titleMaxButton);
				}

				gara.addEventListener(this.titleButtons, "click", this);
			}

			this.titleTextNode = document.createElement("div");
			this.titleTextNode.className = "garaDecorationsTitleText";
			this.titleTextNode.id = this.getId() + "-label";
			this.titleTextNode.widget = this;
			this.titleImage = document.createElement("img");
			this.titleImage.widget = this;
			this.titleText = document.createTextNode(this.text);

			if (this.image) {
				this.titleImage.src = this.image.src;
			} else {
				this.titleImage.style.display = "none";
			}

			this.titleTextNode.appendChild(this.titleImage);
			this.titleTextNode.appendChild(this.titleText);
			this.title.appendChild(this.titleTextNode);

			this.handle.appendChild(this.title);
			this.handle.setAttribute("aria-labelledby", this.getId() + "-label");

//			gara.addEventListener(this.title, "mousedown", this);
		}

		// resize
		if ((this.style & gara.RESIZE) !== 0) {
			this.resizeNNW = document.createElement("div");
			this.resizeWNW = document.createElement("div");
			this.resizeN = document.createElement("div");
			this.resizeNNE = document.createElement("div");
			this.resizeENE = document.createElement("div");
			this.resizeE = document.createElement("div");
			this.resizeW = document.createElement("div");
			this.resizeSSW = document.createElement("div");
			this.resizeWSW = document.createElement("div");
			this.resizeS = document.createElement("div");
			this.resizeSSE = document.createElement("div");
			this.resizeESE = document.createElement("div");

			this.resizeNNW.className = "garaResize garaResizeNNW";
			this.resizeWNW.className = "garaResize garaResizeWNW";
			this.resizeN.className = "garaResize garaResizeN";
			this.resizeNNE.className = "garaResize garaResizeNNE";
			this.resizeENE.className = "garaResize garaResizeENE";
			this.resizeE.className = "garaResize garaResizeE";
			this.resizeW.className = "garaResize garaResizeW";
			this.resizeSSW.className = "garaResize garaResizeSSW";
			this.resizeWSW.className = "garaResize garaResizeWSW";
			this.resizeS.className = "garaResize garaResizeS";
			this.resizeSSE.className = "garaResize garaResizeSSE";
			this.resizeESE.className = "garaResize garaResizeESE";

			this.handle.appendChild(this.resizeNNW);
			this.handle.appendChild(this.resizeWNW);
			this.handle.appendChild(this.resizeN);
			this.handle.appendChild(this.resizeNNE);
			this.handle.appendChild(this.resizeENE);
			this.handle.appendChild(this.resizeE);
			this.handle.appendChild(this.resizeW);
			this.handle.appendChild(this.resizeSSW);
			this.handle.appendChild(this.resizeWSW);
			this.handle.appendChild(this.resizeS);
			this.handle.appendChild(this.resizeSSE);
			this.handle.appendChild(this.resizeESE);
		}

		// menubar
		this.menuBarNode = document.createElement("div");
		this.menuBarNode.className = "garaDecorationsMenuBar";
		this.menuBarNode.style.display = "none";
		this.handle.appendChild(this.menuBarNode);

		// content
		this.clientArea = document.createElement("div");
		this.clientArea.className = "garaClientArea garaDecorationsClientArea";
		this.handle.appendChild(this.clientArea);

		this.addListener("mousedown", this);
		
		if ((this.style & gara.RESIZE) !== 0
				|| (this.style & gara.TITLE) !== 0) {
			this.stub = document.createElement("div");
			this.stub.className = "garaStub";
			this.stub.style.display = "none";
			this.handle.parentNode.insertBefore(this.stub, this.handle);
		}
	},
	
	focusGained : function (e) {
		if (this.defaultButton !== null) {
			this.defaultButton.setFocus();
		}
	},
	
	getDefaultButton : function () {
		return this.defaultButton;
	},

	getImage : function () {
		return this.image;
	},
	
	getMaximized : function () {
		return this.maximized;
	},

	getMenuBar : function () {
		return this.menuBar;
	},
	
	getMinimized : function () {
		return this.minimized;
	},

	getText : function () {
		return this.text;
	},

	/**
	 * @method
	 *
	 * @private
	 */
	handleEvent : function (e) {
		var offset, getOffset = function (elem) {
				var currentLeft = currentTop = 0;
				if (elem.offsetParent) {
					do {
						currentLeft += elem.offsetLeft;
						currentTop += elem.offsetTop;
					} while (elem = elem.offsetParent);
				}
				return [currentLeft, currentTop];
			}, resizeN, resizeE, resizeS, resizeW;

		e.widget = this;
		this.event = e;

		switch (e.type) {
		case "click":
			switch (e.target) {
			case this.titleCloseButton:
				this.setVisible(false);
				break;

			case this.titleMinButton:
				this.setMinimized(!this.minimized);
				e.stopPropagation();
				break;

			case this.titleMaxButton:
				this.setMaximized(!this.maximized);
				break;
			}
			break;


		case "mousedown":
			// move
			if ((e.target === this.title
					|| e.target === this.titleRight
					|| e.target === this.titleButtons
					|| e.target === this.titleTextNode)
					&& !this.maximized && !this.minimized) {
				
				this.makeAbsolute();

				gara.addEventListener(this.moveParent, "mousemove", this);
				gara.addEventListener(this.title, "mouseup", this);

				this.doX = e.clientX - this.handle.offsetLeft;
				this.doY = e.clientY - this.handle.offsetTop;

				this.overflow = this.moveParent.style.overflow;
				this.moveParent.style.overflow = "hidden";

				offset = getOffset(this.moveParent);
				this.offsetX = offset[0];
				this.offsetY = offset[1];

				this.moving = true;
			}

			// resize
			if ((e.target === this.resizeNNW || e.target === this.resizeWNW
					|| e.target === this.resizeNNE || e.target === this.resizeENE
					|| e.target === this.resizeN || e.target === this.resizeS)
					|| e.target === this.resizeW || e.target === this.resizeE
					|| e.target === this.resizeSSW || e.target === this.resizeWSW
					|| e.target === this.resizeSSE || e.target === this.resizeESE
					&& !this.maximized && !this.minimized) {

				this.makeAbsolute();
				
				gara.addEventListener(this.moveParent, "mousemove", this);
				gara.addEventListener(gara.widgets.Display.getDefault().getClientArea(), "mouseup", this);

				this.dX = e.clientX;
				this.dY = e.clientY;
				this.doX = e.clientX - this.handle.offsetLeft;
				this.doY = e.clientY - this.handle.offsetTop;

				offset = getOffset(this.moveParent);
				this.offsetX = offset[0];
				this.offsetY = offset[1];
				this.offsetTop = this.handle.offsetTop;
				this.offsetLeft = this.handle.offsetLeft;
				this.offsetWidth = this.handle.offsetWidth;
				this.offsetHeight = this.handle.offsetHeight;
				this.minHeight = this.title ? this.title.offsetHeight : 1;
				this.minWidth = 1 + (this.titleRight ? this.titleRight.offsetWidth * 2 : 0) + (this.titleButtons ? this.titleButtons.offsetWidth : 0);

				this.resizing = true;

				switch (e.target) {
				case this.resizeNNW:
				case this.resizeWNW:
					this.resizeMethod = "NW";
					break;

				case this.resizeN:
					this.resizeMethod = "N";
					break;

				case this.resizeNNE:
				case this.resizeENE:
					this.resizeMethod = "NE";
					break;

				case this.resizeW:
					this.resizeMethod = "W";
					break;

				case this.resizeE:
					this.resizeMethod = "E";
					break;

				case this.resizeSSW:
				case this.resizeWSW:
					this.resizeMethod = "SW";
					break;

				case this.resizeS:
					this.resizeMethod = "S";
					break;

				case this.resizeSSE:
				case this.resizeESE:
					this.resizeMethod = "SE";
					break;
				}
			}
			break;

		case "mousemove":
			if (this.moving) {
				if (e.clientX > this.offsetX && e.clientY > this.offsetY
						&& e.clientX < (this.offsetX + this.moveParent.clientWidth)
						&& e.clientY < (this.offsetY + this.moveParent.clientHeight)) {
					this.x = e.clientX - this.doX;
					this.y = e.clientY - this.doY;
					
					if (this.handle !== null) {
						this.handle.style.left = (this.x - this.positionOffsetX) + "px";
						this.handle.style.top = (this.y - this.positionOffsetY) + "px";
					}
				}
			}

			if (this.resizing) {
				if (e.clientX > this.offsetX && e.clientY > this.offsetY
						&& e.clientX < (this.offsetX + this.moveParent.clientWidth)
						&& e.clientY < (this.offsetY + this.moveParent.clientHeight)) {

					resizeN = function () {
						if (this.offsetHeight + (this.offsetTop - (e.clientY - this.doY)) > this.minHeight) {
							this.handle.style.top = (e.clientY - this.doY) + "px";
							this.setHeight(this.offsetHeight + (this.offsetTop - (e.clientY - this.doY)));
						}
					};
					resizeW = function () {
						if (this.offsetWidth + (this.offsetLeft - (e.clientX - this.doX)) > this.minWidth) {
							this.handle.style.left = (e.clientX - this.doX) + "px";
							this.setWidth(this.offsetWidth + (this.offsetLeft - (e.clientX - this.doX)));
						}
					};
					resizeE = function () {
						if ((this.offsetWidth  + e.clientX - this.dX) > this.minWidth) {
							this.setWidth(this.offsetWidth  + e.clientX - this.dX);
						}
					};
					resizeS = function () {
						if ((this.offsetHeight  + e.clientY - this.dY) > this.minHeight) {
							this.setHeight(this.offsetHeight  + e.clientY - this.dY);
						}
					};

					switch (this.resizeMethod) {
					case "NW":
						resizeW.call(this);
						resizeN.call(this);
						break;
					case "N":
						resizeN.call(this);
						break;
					case "NE":
						resizeN.call(this);
						resizeE.call(this);
						break;
					case "E":
						resizeE.call(this);
						break;
					case "SE":
						resizeE.call(this);
						resizeS.call(this);
						break;
					case "S":
						resizeS.call(this);
						break;
					case "SW":
						resizeS.call(this);
						resizeW.call(this);
						break;
					case "W":
						resizeW.call(this);
						break;

					}
					this.layout();
				}
			}
			break;

		case "mouseup":
			if (this.moving) {
				this.moveParent.style.overflow = this.overflow;
				gara.removeEventListener(this.moveParent, "mousemove", this);
				gara.removeEventListener(this.title, "mouseup", this);
				this.moving = false;
			}

			if (this.resizing) {
				gara.removeEventListener(this.moveParent, "mousemove", this);
				gara.removeEventListener(gara.widgets.Display.getDefault().getClientArea(), "mouseup", this);
				this.resizing = false;
			}
			break;
		}
	},
	
	/**
	 * @method
	 * 
	 * @private
	 */
	makeAbsolute : function () {
		if (this.handle.style.position !== "absolute") {
			this.positionOffsetX = this.positionOffsetY = 0;
//			this.setLocation(this.handle.offsetLeft, this.handle.offsetTop);
			this.setLocation(this.handle.offsetLeft - 1, this.handle.offsetTop - 1); // -1 is experimental but seems to work
			this.handle.style.position = "absolute";
			
			if (this.stub !== null) {
				this.stub.style.display = "block";
			}
		}
	},
	
	menuShell : function () {
		return this;
	},
	
	releaseChildren : function () {
		if (this.menu !== null) {
			this.menu.release();
			this.menu = null;
		}
		
		this.$super();
	},

	/**
	 * @method
	 *
	 * @private
	 */
	scrolledHandle : function () {
		return this.clientArea;
	},
	
	setDefaultButton : function (button) {
		this.checkWidget();
		if (!(button instanceof gara.widgets.Button)) {
			throw new TypeError("button not instanceof gara.widgets.Button");
		}
		
		if (button !== null  
				&& (button.isDisposed() 
				|| button.menuShell() !== this 
				|| (button.getStyle() & gara.PUSH) === 0
				|| button === this.defaultButton)) {
			return;
		}
		
		if (this.defaultButton !== null) {
			this.defaultButton.removeClass("garaButtonDefault");
		}
		this.defaultButton = button;
		this.defaultButton.addClass("garaButtonDefault");
	},
	
	setHeight : function (height) {
		this.$super(height);
		
		if (!this.adjustedHeight && height !== null && this.stub !== null) {
			this.stub.style.height = height + "px";
			this.adjustedHeight = true;
		}
		return this;
	},

	setImage : function (image) {
		this.image = image;

		if (this.titleImage) {
			if (this.image) {
				this.titleImage.src = this.image.src;
				this.titleImage.style.display = "inline";
			} else {
				this.titleImage.style.display = "none";
			}
		}

		return this;
	},

	setMaximized : function (maximized) {
		var parent = this.getParent().getClientArea ? this.getParent().getClientArea() : this.getParent(),
			id = this.getParent().getId ? this.getParent().getId() : this.getParent().id,
			width, height;

		if (maximized) {
			if (this.minimized) {
				gara.widgets.Decorations.minis[id][gara.widgets.Decorations.minis[id].indexOf(this)] = undefined;
			}
//			else {
//				this.x = this.handle.offsetLeft;
//				this.y = this.handle.offsetTop;
//			}
			
			if (this.restoreWidth === null) {
				this.restoreWidth = this.handle.offsetWidth;
			}
			if (this.restoreHeight === null) {
				this.restoreHeight = this.handle.offsetHeight;
			}
			
			// body
			if (parent === gara.widgets.Display.getDefault().getClientArea()) {
				parent = document.documentElement;
			}
			
			this.makeAbsolute();

			this.handle.style.left = 0;
			this.handle.style.top = 0;
			this.handle.style.width = parent.clientWidth + "px";
			this.handle.style.height = parent.clientHeight + "px";
			this.clientArea.style.width = parent.clientWidth + "px";
			this.clientArea.style.height = (parent.clientHeight - (this.title ? this.title.clientHeight : 0) - this.menuBarNode.offsetHeight) + "px";
		}
		
		this.maximized = maximized;
		this.minimized = false;
		this.setClass("garaDecorationsMinimized", this.minimized);
		this.setClass("garaDecorationsMaximized", this.maximized);
		
		if (!maximized) {
			this.handle.style.left = this.x + "px";
			this.handle.style.top = this.y + "px";
			this.adjustWidth(this.restoreWidth);
			this.adjustHeight(this.restoreHeight);
			this.restoreWidth = null;
			this.restoreHeight = null;
		}
		this.layout();

		return this;
	},

	setMenuBar : function (menu) {
		if (this.menuBar === menu) {
			return this;
		}
		
		if (this.menuBar !== null) {
			this.menuBar.removeControlListener(this.menuBarResizeListener);
			this.menuBarNode.removeChild(this.menuBar.handle);
			this.menuBarNode.style.display = "none";
		}

		if (menu) {
			if (!(menu instanceof gara.widgets.Menu)
					&& !((menu.getStyle() & gara.BAR) !== 0)) {
				throw new TypeError("menu not instance of gara.widgets.Menu and not of BAR style");
			}

			menu.setVisible(true);
			menu.addControlListener(this.menuBarResizeListener);
			this.menuBarNode.appendChild(menu.handle);
			this.menuBarNode.style.display = "block";
		}
		this.menuBar = menu;

		// recalculate widget height
		if (this.height > 0) {
			this.clientArea.style.height = (this.handle.clientHeight - (this.title ? this.title.offsetHeight : 0) - this.menuBarNode.offsetHeight) + "px";
			this.layout();
		}

		return this;
	},

	setMinimized : function (minimized) {
		var parent = this.getParent().getClientArea ? this.getParent().getClientArea() : this.getParent(),
			id = this.getParent().getId ? this.getParent().getId() : this.getParent().id,
			left = false, i;

		this.minimized = minimized;
		this.maximized = false;
		this.setClass("garaDecorationsMinimized", this.minimized);
		this.setClass("garaDecorationsMaximized", this.maximized);

		if (minimized) {
			if (this.restoreWidth === null) {
				this.restoreWidth = this.handle.offsetWidth;
			}
			if (this.restoreHeight === null) {
				this.restoreHeight = this.handle.offsetHeight;
			}
			
			this.makeAbsolute();
			
			this.handle.style.top = "";
			this.handle.style.bottom = 0;
			this.handle.style.width = "";
			this.handle.style.height = "";
			if (this.menuBar) {
				this.menuBarNode.style.display = "none";
			}

			// finding left
			if (!Object.prototype.hasOwnProperty.call(gara.widgets.Decorations.minis, id)) {
				gara.widgets.Decorations.minis[id] = [this];
				left = 0;
			} else {
				// trim array
				len = gara.widgets.Decorations.minis[id].length;
				i = len - 1;
				while (i >= 0 && gara.widgets.Decorations.minis[id][i] === undefined) {
					gara.widgets.Decorations.minis[id].splice(i, 1);
					i--;
					len--;
				}

				// find first empty offset
				for (i = 0; i < len; i++) {
					if (gara.widgets.Decorations.minis[id][i] === undefined) {
						left = i;
						break;
					}
				}

				if (left === false) {
					left = len;
					gara.widgets.Decorations.minis[id][gara.widgets.Decorations.minis[id].length] = this;
				} else {
					gara.widgets.Decorations.minis[id][left] = this;
				}
			}

			this.handle.style.left = ((left * 190) + 10) + "px";
		} else {
			if (this.menuBar) {
				this.menuBarNode.style.display = "block";
			}
			this.handle.style.left = this.x + "px";
			this.handle.style.top = this.y + "px";
			this.handle.style.bottom = "";
			this.adjustWidth(this.restoreWidth);
			this.adjustHeight(this.restoreHeight);
			this.restoreWidth = null;
			this.restoreHeight = null;
			gara.widgets.Decorations.minis[id][gara.widgets.Decorations.minis[id].indexOf(this)] = undefined;
			this.layout();
		}
		
		return this;
	},

	setText : function (text) {
		this.text = text;
		if (this.titleText) {
			this.titleText.nodeValue = text;
		}
		return this;
	},

	setWidth : function (width) {
		this.$super(width);
		
		if (!this.adjustedWidth && width !== null && this.stub !== null) {
			this.stub.style.width = width + "px";
			this.adjustedWidth = true;
		}
		return this;
	},

	/**
	 * @method
	 *
	 * @private
	 */
	unbindListener : function (eventType, listener) {
		gara.removeEventListener(this.handle, eventType, listener);
	},
	
	update : function () {
		this.clientArea.style.height = (this.handle.clientHeight - (this.title ? this.title.offsetHeight : 0) - this.menuBarNode.offsetHeight) + "px";
		this.clientArea.style.width = this.handle.clientWidth + "px";
	}
};});