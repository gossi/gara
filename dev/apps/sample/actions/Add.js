gara.provide("sample.actions.Add", "gara.action.Action");

gara.Class("sample.actions.Add", function () { return {

	$extends : gara.action.Action,

	/**
	 * @constructor
	 */
	$constructor : function () {
		this.$super();
	},
	
	getId : function () {
		return "sample.actions.Add";
	},
	
	getText : function () {
		return "Add Something";
	},
	
	getEnabled : function () {
		return true;
	},
	
	run : function () {
		console.log("sample.action.Add run");
	}
};});