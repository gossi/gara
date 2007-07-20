//eval(gara.namespace);
var jswtPkg = new gara.Namespace({
	name : "jswt",
	exports : "Widget,Control,List,Tree,Item,ListItem,TreeItem,FocusListener,SelectionListener",
	imports : "gara"
});

eval(jswtPkg.imports);