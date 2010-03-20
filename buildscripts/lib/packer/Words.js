
var Words = Collection.extend({
  add: function(word) {
    if (!this.has(word)) this.base(word);
    word = this.get(word);
    if (!word.index) {
      word.index = this.size();
    }
    word.count++;
    return word;
  },

  sort: function(sorter) {
    return this.base(sorter || function(word1, word2) {
      // sort by frequency
      return (word2.count - word1.count) || (word1.index - word2.index);
    });
  }
}, {
  Item: {
    constructor: function(word) {
      this.toString = K(word);
    },

    index: 0,
    count: 0,
    encoded: ""
  }
});
