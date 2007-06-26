/**
 * @class FocusListener
 * @interface
 * @author Thomas Gossmann
 * @namespace gara.jswt
 */

$interface("FocusListener", {
	focusGained : function() {
	},
	
	focusLost : function() {
	},
	
	toString : function() {
		return "[gara.jswt.FocusListener]";
	}
});
