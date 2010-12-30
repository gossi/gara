
global.Packer = Base.extend({
  constructor: function() {
    this.minifier = new Minifier;
    this.shrinker = new Shrinker;
    this.privates = new Privates;
    this.base62   = new Base62;
  },

  minifier: null,
  shrinker: null,
  privates: null,
  base62:   null,

  pack: function(script, base62, shrink, privates) {
    script = this.minifier.minify(script);
    if (shrink){script = this.shrinker.shrink(script);}
    if (privates){script = this.privates.encode(script);}
    if (base62){script = this.base62.encode(script);}
    return script;
  }
}, {
  version: "3.1",

  init: function() {
    eval("var e=this.encode62=" + Base62.ENCODE62);
  },

  data: new Parser({
    "STRING1": IGNORE,
    'STRING2': IGNORE,
    "CONDITIONAL": IGNORE, // conditional comments
    "(OPERATOR)\\s*(REGEXP)": "$1$2"
  }),

  encode52: function(c) {
    // Base52 encoding (a-Z)
    function encode(c) {
      return (c < 52 ? '' : encode(parseInt(c / 52))) +
        ((c = c % 52) > 25 ? String.fromCharCode(c + 39) : String.fromCharCode(c + 97));
    };
    var encoded = encode(c);
    if (/^(do|if|in)$/.test(encoded)){encoded = encoded.slice(1) + 0;}
    return encoded;
  }
});
