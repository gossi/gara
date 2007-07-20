/**
 * @class Control
 * @author Thomas Gossmann
 * @extends Widget
 * @namespace gara.jswt
 */
$class("Control", {
	$extends : Widget,

	/**
	 * @method
	 * @private
	 */
	$constructor : function() {
		this.$base();

		// add Control to the ControlManager and add as focus listener
		this._focusListener = [];
		this._hasFocus = false;

		ctrlManager.addControl(this);
		this.addFocusListener(ctrlManager);
	},

	/**
	 * @method
	 * Adds a focus changed listener on the control
	 * 
	 * @author Thomas Gossmann
	 * @param {FocusListener} the desired listener to be added to this control
	 * @throws {TypeError} if the listener is not implementing the FocusListener interface
	 * @returns {void}
	 */
	addFocusListener : function(listener) {
		if (!$class.implementationOf(listener, gara.jswt.FocusListener)) {
			throw new TypeError("listener is not a gara.jswt.FocusListener");
		}

		this._focusListener.push(listener);
	},

	/**
	 * @method
	 * Forces this control to gain focus
	 * 
	 * @returns {void}
	 */
	forceFocus : function() {
		this._hasFocus = true;

		this.removeClassName(this._baseClass + "Inactive");
		this.addClassName(this._baseClass + "Active");
		this.update();

		// notify focus listeners
		for (var i = 0, len = this._focusListener.length; i < len; ++i) {
			this._focusListener[i].focusGained(this);
		}
	},

	/**
	 * @method
	 * @abstract
	 * @private
	 */
	handleEvent : $abstract(function(e){}),

	/**
	 * @method
	 * Tells wether the control has focus or not
	 * 
	 * @returns {boolean} true for having the focus and false if not
	 */
	isFocusControl : function() {
		return this._hasFocus;
	},

	/**
	 * @method
	 * Forces this control to loose focus
	 * 
	 * @returns {void}
	 */
	looseFocus : function() {
		this._hasFocus = false;
	
		this.removeClassName(this._baseClass + "Active");
		this.addClassName(this._baseClass + "Inactive");
		this.update();

		// notify focus listeners
		for (var i = 0, len = this._focusListener.length; i < len; ++i) {
			this._focusListener[i].focusLost(this);
		}
	},

	/**
	 * @method
	 * Removes a focus listener from this control
	 * 
	 * @param {FocusListener} the listener to remove from this control
	 * @throws {TypeError} wether this is not a FocusListener
	 * @returns {void}
	 */
	removeFocusListener : function(listener) {
		if (!listener.$class.implementsInterface(gara.jswt.FocusListener)) {
			throw new TypeError("listener is not a gara.jswt.FocusListener");
		}

		if (this._focusListener.contains(listener)) {
			this._focusListener.remove(listener);
		}
	},

	toString : function() {
		return "[gara.jswt.Control";
	},

	update : $abstract(function() {})
});