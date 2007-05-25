function publish_begin(allFiles, context) {
	inform("Begin.");
	context.template = new JsPlate(context.t+"file.tmpl");
	context.output = "<?xml version=\"1.0\"?>\n<files>\n";
}

function publish_each(file, context) {
	context.output += context.template.process(file);
	inform("Published.");
}

function publish_finish(allFiles, context) {
	context.output += "\n</files>\n";
	if (context.d) {
		SaveFile(context.d, "jsdoc.xml", context.output);
	}
	inform("Finished.");
}