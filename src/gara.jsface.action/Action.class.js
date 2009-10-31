$class("Action", {
	$implements : [gara.jsface.action.IAction],
	$constructor : function() {
		this._listeners = [];
	},

	addActionChangedListener : function(listener) {
		if (!$class.instanceOf(listener, gara.jsface.action.ActionChangedListener)) {
			throw new TypeError("listener not type of gara.jsface.action.ActionChangedListener");
		}

		if (!this._listeners.contains(listener)) {
			this._listeners.push(listener);
		}
	},

	getText : $abstract(function() {}),
	getImage : $abstract(function() {}),
	getEnabled : $abstract(function() {}),

	notifyActionChangedListener : function() {
		this._listeners.forEach(function(listener){
			listener.actionChanged(this);
		}, this);
	},

	removeActionChangedListener : function(listener) {
		if (!$class.instanceOf(listener, gara.jsface.action.ActionChangedListener)) {
			throw new TypeError("listener not type of gara.jsface.action.ActionChangedListener");
		}

		this._listeners.remove(listener);
	},

	run : $abstract(function() {})
});
