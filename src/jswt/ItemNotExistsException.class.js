/**
 * @class ItemNotExistsException
 * @author Thomas Gossmann
 * @namespace gara.jswt
 */
$class("ItemNotExistsException", {
	$extends : Exception,
	
	$constructor : function(message) {
		this.message = String(message);
		this.name = $class.typeOf(this);
	},
	
	toString : function() {
		return "[gara.jswt.ItemNotExistsException]";
	}
});