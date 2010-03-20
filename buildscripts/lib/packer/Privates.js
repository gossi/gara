
var Privates = Encoder.extend({
  constructor: function() {
    return this.base(Privates.PATTERN, function(index) {
      return "_" + Packer.encode62(index);
    }, Privates.IGNORE);
  },

  search: function(script) {
    var words = this.base(script),
       _private = words.get("_private");
    if (_private) _private.count = 99999;
    return words;
  }
}, {
  IGNORE: {
    CONDITIONAL: IGNORE,
    "(OPERATOR)(REGEXP)": IGNORE
  },
  
  PATTERN: /\b_[\da-zA-Z$][\w$]*\b/g
});
