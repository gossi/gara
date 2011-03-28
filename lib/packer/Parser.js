
var Parser = RegGrp.extend({
  put: function(expression, replacement) {
    if (typeOf(expression) == "string") {
      expression = Parser.dictionary.exec(expression);
    }
    this.base(expression, replacement);
  }
}, {
  dictionary: new RegGrp({
    OPERATOR:    /return|typeof|[\[(\^=,{}:;&|!*?]/.source,
    CONDITIONAL: /\/\*@\w*|\w*@\*\/|\/\/@\w*|@\w+/.source,
    COMMENT1:    /\/\/[^\n]*/.source,
    COMMENT2:    /\/\*[^*]*\*+([^\/][^*]*\*+)*\//.source,
    REGEXP:      /\/(\\[\/\\]|[^*\/])(\\.|[^\/\n\\])*\/[gim]*/.source,
    STRING1:     /'(\\.|[^'\\])*'/.source,
    STRING2:     /"(\\.|[^"\\])*"/.source
  })
});
