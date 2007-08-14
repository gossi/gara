//eval(gara.namespace);
var jswtPkg = new gara.Namespace({
	name : "jswt",
	exports : "ControlManager,Widget,Control,Composite,Item,List,ListItem,Tree,TreeItem,TabFolder,TabItem,FocusListener,SelectionListener",
	imports : "gara"
});

eval(jswtPkg.imports);