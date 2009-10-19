var jswtPkg = new gara.Package({
	name : "jswt",
	exports : "IBaseLabelProvider,ILabelProvider,ITableLabelProvider,LabelProvider"
});
gara.jsface.namespace = jswtPkg.namespace;
gara.jsface.toString = function() {
	return "[gara.jsface]";
}

$package("");