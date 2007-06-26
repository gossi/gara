/**
 * @class OutOfBoundsException
 * @description
 * i'm thrown when somethings going out of bounds
 * @author Thomas Gossmann
 * @extends Exception
 * @namespace gara
 */
$class("OutOfBoundsException", {
	$extends : Exception,
	
	$constructor: function(message) {
		this.message = String(message);
		this.name = $class.typeOf(this);
	},
	
	toString : function() {
		return "[gara.OutOfBoundsException]";
	}
});