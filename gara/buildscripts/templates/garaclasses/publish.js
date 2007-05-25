function publish_begin(allFiles, context) {
	inform("Begin.");
	context.template = new JsPlate(context.t+"file.tmpl");
}

function publish_each(file, context) {
	if (file.name.substr(0, 1) != '_') {
		context.output = "<?xml version=\"1.0\"?>\n<files>\n";
		context.output += context.template.process(file);
		context.output += "\n</files>\n";
		SaveFile(context.d, file.name.replace(/\.js$/, "") + ".xml", context.output);
	}
}

function publish_finish(allFiles, context) {
	inform("Finished.");
}