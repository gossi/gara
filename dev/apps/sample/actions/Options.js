gara.provide("sample.actions.Options", "gara.action.Action");

gara.Class("sample.actions.Options", function () { return {

	$extends : gara.action.Action,

	/**
	 * @constructor
	 */
	$constructor : function () {
		this.$super();
	},
	
	getId : function () {
		return "sample.actions.Options";
	},
	
	getText : function () {
		return "Options";
	},
	
	getEnabled : function () {
		return true;
	},
	
	run : function () {
		console.log("sample.action.Options run");
	}
};});