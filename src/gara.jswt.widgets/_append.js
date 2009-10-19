var jswtPkg = new gara.Package({
	name : "jswt.widgets",
	exports : "FocusManager,Widget,Control,Composite,Item,List,ListItem,Tree,TreeItem,TabFolder,TabItem"
});
gara.jswt.namespace = jswtPkg.namespace;
gara.jswt.toString = function() {
	return "[gara.jswt.widgets]";
}

$package("");