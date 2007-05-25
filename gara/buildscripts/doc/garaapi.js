function selectNamespace (namespace) {
	if (parent.namespace && parent.main) {
		parent.namespace.location.href = namespace + "._nav.html";
		parent.main.location.href = namespace + "._overview.html";
	}
}