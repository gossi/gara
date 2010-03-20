load("lib/packer/base2.js");
load("lib/packer/package.js");
load("lib/packer/Parser.js");
load("lib/packer/Words.js");
load("lib/packer/Encoder.js");
load("lib/packer/Privates.js");
load("lib/packer/Base62.js");
load("lib/packer/Packer.js");
load("lib/packer/Minifier.js");
load("lib/packer/Shrinker.js");
load("lib/packer/Words.js");

importPackage(java.io);

// arguments
var base62   = false;
var shrink   = false;
var privates = false;
var srcDir;
var destDir;

forEach(arguments, function(arg) {
	if (/^-(esp|sep|spe|eps|pes|pse|es|se|ep|pe|sp|ps|e|s|p)$/.test(arg)) {
		base62 = arg.indexOf('e') != -1;
		shrink = arg.indexOf('s') != -1;
		privates = arg.indexOf('p') != -1;
	}
	else if (/^-(\?|h(elp)?)$/.test(arg)) {
		help(System.out);
		quit();
	}
	else if (srcDir && !destDir){
		destDir = arg;
	}
	else if (!destDir){
		srcDir = arg;
	}
	else {
		die(format("Parameter '%1' is not recognized.", arg));
	}
});

if (arguments.length == 0) {
	help(System.out);
} else {
	if (!srcDir){die("No source dir supplied");}
	if (!destDir){destDir = srcDir;}

	print('Running Dean Edwards\' "Packer".');
	print('Source > ' + srcDir);
	print('Destination > ' + destDir);
	print('Options > shrink: ' + (shrink ? "yes" : "no") + ", base62: " + (base62 ? "yes" : "no") + ", privates: "+ (privates ? "yes" : "no"));

	var files = getFileListing(new File(srcDir));
	var packer = new Packer;

	// run the file list
	forEach(files, function(file){
		var src = file.getPath();
		var dest = file.getPath().replaceFirst(new File(srcDir).getPath().replaceAll("\\\\", "\\\\\\\\"), new File(destDir).getPath().replaceAll("\\\\", "\\\\\\\\"));

		if (file.isDirectory()) {
			// create directory if not existent
			dest = new File(dest);
			dest.mkdirs();
			print("Directory created: " + dest.getPath());
		} else {
			if (file.getName().endsWith(".js")) {
				if (src == dest) {
					dest = dest.replaceFirst("(.+)\.([^.]{2,})$", "$1-p.$2");
				}

				print(format("Packing from %1 to %2", src, dest));
				var script = readFile(file.getPath());
				var packedScript = packer.pack(script, base62, shrink, privates);
				writeFile(dest, packedScript);
			}
			else if (file.getName() == "package.xml") {

			}
		}
	});
}

function getFileListing(aStartingDir) {
	var result = [];
	var filesAndDirs = aStartingDir.listFiles();
	forEach (filesAndDirs, function(f) {
		var file = new File(f);

		if (file.isFile() && !file.getName().startsWith(".") && (file.getName().endsWith(".js") || file.getName().endsWith("package.xml"))) {
			result.push(file);
		}

		if (file.isDirectory() && !file.getName().startsWith(".")) {
			result.push(file);
			var subDir = getFileListing(file);
			for (var f in subDir) {
				result.push(subDir[f]);
			}
		}
	});
	return result;
}

function writeFile (file, stream) {
	var buffer = new PrintWriter(new FileWriter(file));
	buffer.print(stream);
	buffer.close();
}

function help(out) {
	out.println();
	out.println('Compress a JavaScript source directory using Dean Edwards\' "Packer".');
	out.println('  Version : 3.0');
	out.println('  Syntax  : >pack.js source [dest] [-options]');
	out.println('  Options :');
	out.println('    e: base62 encode');
	out.println('    s: shrink variables');
	out.println('    p: privates');
	out.println('    ?,h,help: this help');
}

function die(msg) {
	System.err.println();
	System.err.println(msg);
	help(System.err);
	quit();
}