//eval(gara.namespace);
var jswtPkg = new gara.Namespace({
	name : "jswt",
	exports : "Widget,Control,List,Item,ListItem,FocusListener,SelectionListener",
	imports : "gara"
});

eval(jswtPkg.imports);