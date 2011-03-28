
var Encoder = Base.extend({
  constructor: function(pattern, encoder, ignore) {
    this.parser = new Parser(ignore);
    if (pattern) this.parser.put(pattern, "");
    this.encoder = encoder;
  },

  parser: null,
  encoder: Undefined,

  search: function(script) {
    var words = new Words;
    this.parser.putAt(-1, function(word) {
      words.add(word);
    });
    this.parser.exec(script);
    return words;
  },

  encode: function(script) {
    var words = this.search(script);
    words.sort();
    var index = 0;
    forEach (words, function(word) {
      word.encoded = this.encoder(index++);
    }, this);
    this.parser.putAt(-1, function(word) {
      return words.get(word).encoded;
    });
    return this.parser.exec(script);
  }
});
