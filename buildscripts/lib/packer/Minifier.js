
var Minifier = Base.extend({
  minify: function(script) {
    // packing with no additional options
    script += "\n";
    script = script.replace(Minifier.CONTINUE, "");
    script = Minifier.comments.exec(script);
    script = Minifier.clean.exec(script);
    script = Minifier.whitespace.exec(script);
    script = Minifier.concat.exec(script);
    return script;
  }
}, {
  CONTINUE: /\\\r?\n/g,
  
  init: function() {
    this.concat = new Parser(this.concat).merge(Packer.data);
    extend(this.concat, "exec", function(script) {
      var parsed = this.base(script);
      while (parsed != script) {
        script = parsed;
        parsed = this.base(script);
      }
      return parsed;
    });
    forEach.csv("comments,clean,whitespace", function(name) {
      this[name] = Packer.data.union(new Parser(this[name]));
    }, this);
    this.conditionalComments = this.comments.copy();
    this.conditionalComments.putAt(-1, " $3");
    this.whitespace.removeAt(2); // conditional comments
    this.comments.removeAt(2);
  },
  
  clean: {
    "\\(\\s*([^;)]*)\\s*;\\s*([^;)]*)\\s*;\\s*([^;)]*)\\)": "($1;$2;$3)", // for (;;) loops
    "throw[^};]+[};]": IGNORE, // a safari 1.3 bug
    ";+\\s*([};])": "$1"
  },

  comments: {
    ";;;[^\\n]*\\n": REMOVE,
    "(COMMENT1)\\n\\s*(REGEXP)?": "\n$3",
    "(COMMENT2)\\s*(REGEXP)?": function(match, comment, $2, regexp) {
      if (/^\/\*@/.test(comment) && /@\*\/$/.test(comment)) {
        comment = Minifier.conditionalComments.exec(comment);
      } else {
        comment = "";
      }
      return comment + " " + (regexp || "");
    }
  },

  concat: {
    "(STRING1)\\+(STRING1)": function(match, a, $2, b) {
      return a.slice(0, -1) + b.slice(1);
    },
    "(STRING2)\\+(STRING2)": function(match, a, $2, b) {
      return a.slice(0, -1) + b.slice(1);
    }
  },
  
  whitespace: {
    "\\/\\/@[^\\n]*\\n": IGNORE,
    "@\\s+\\b": "@ ", // protect conditional comments
    "\\b\\s+@": " @",
    "(\\d)\\s+(\\.\\s*[a-z\\$_\\[(])": "$1 $2", // http://dean.edwards.name/weblog/2007/04/packer3/#comment84066
    "([+-])\\s+([+-])": "$1 $2", // c = a++ +b;
    "(\\w)\\s+([\\u0080-\\uffff])": "$1 $2", // http://code.google.com/p/base2/issues/detail?id=78
    "\\b\\s+\\$\\s+\\b": " $ ", // var $ in
    "\\$\\s+\\b": "$ ", // object$ in
    "\\b\\s+\\$": " $", // return $object
//  "\\b\\s+#": " #",   // CSS
    "\\b\\s+\\b": SPACE,
    "\\s+": REMOVE
  }
});
