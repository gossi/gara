var jswtPkg = new gara.Package({
	name : "jswt",
	exports : "JSWT,ControlManager,Widget,Control,Composite,Item,List,ListItem,Tree,TreeItem,TabFolder,TabItem,FocusListener,SelectionListener"
});
gara.jswt.namespace = jswtPkg.namespace;
gara.jswt.toString = function() {
	return "[gara.jswt]";
}

$package("");