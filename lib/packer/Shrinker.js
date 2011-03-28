
var Shrinker = Base.extend({
  decodeData: function(script) {
    // put strings and regular expressions back
    var data = this._data; // encoded strings and regular expressions
    delete this._data;
    return script.replace(Shrinker.ENCODED_DATA, function(match, index) {
      return data[index];
    });
  },

  encodeData: function(script) {
    // encode strings and regular expressions
    var data = this._data = []; // encoded strings and regular expressions
    return Packer.data.exec(script, function(match, operator, regexp) {
      var replacement = "\x01" + data.length + "\x01";
      if (regexp) {
        replacement = operator + replacement;
        match = regexp;
      }
      data.push(match);
      return replacement;
    });
  },
  
  shrink: function(script) {
    script = this.encodeData(script);
    
    // Windows Scripting Host cannot do regexp.test() on global regexps.
    function global(regexp) {
      // This function creates a global version of the passed regexp.
      return new RegExp(regexp.source, "g");
    };
        
    // identify blocks, particularly identify function blocks (which define scope)
    var BLOCK         = /((catch|do|if|while|with|function)\b[^~{};]*(\(\s*[^{};]*\s*\))\s*)?(\{[^{}]*\})/;
    var BLOCK_g       = global(BLOCK);
    var BRACKETS      = /\{[^{}]*\}|\[[^\[\]]*\]|\([^\(\)]*\)|~[^~]+~/;
    var BRACKETS_g    = global(BRACKETS);
    var ENCODED_BLOCK = /~#?(\d+)~/;
    var IDENTIFIER    = /[a-zA-Z_$][\w\$]*/g;
    var SCOPED        = /~#(\d+)~/;
    var VAR_g         = /\bvar\b/g;
    var VARS          = /\bvar\s+[\w$]+[^;#]*|\bfunction\s+[\w$]+/g;
    var VAR_TIDY      = /\b(var|function)\b|\sin\s+[^;]+/g;
    var VAR_EQUAL     = /\s*=[^,;]*/g;
    
    var blocks = []; // store program blocks (anything between braces {})
    var total = 0;
    // encoder for program blocks
    function encodeBlocks($, prefix, blockType, args, block) {
      if (!prefix) prefix = "";
      if (blockType == "function") {
        // decode the function block (THIS IS THE IMPORTANT BIT)
        // We are retrieving all sub-blocks and will re-parse them in light
        // of newly shrunk variables
        block = args + decodeBlocks(block, SCOPED);
        prefix = prefix.replace(BRACKETS, "");
        
        // create the list of variable and argument names
        args = args.slice(1, -1);
        
        if (args != "_no_shrink_") {
          var vars = match(block, VARS).join(";").replace(VAR_g, ";var");
          while (BRACKETS.test(vars)) {
            vars = vars.replace(BRACKETS_g, "");
          }
          vars = vars.replace(VAR_TIDY, "").replace(VAR_EQUAL, "");
        }
        block = decodeBlocks(block, ENCODED_BLOCK);
        
        // process each identifier
        if (args != "_no_shrink_") {
          var count = 0, shortId;
          var ids = match([args, vars], IDENTIFIER);
          var processed = {};
          for (var i = 0; i < ids.length; i++) {
            id = ids[i];
            if (!processed["#" + id]) {
              processed["#" + id] = true;
              id = rescape(id);
              // encode variable names
              while (new RegExp(Shrinker.PREFIX + count + "\\b").test(block)) count++;
              var reg = new RegExp("([^\\w$.])" + id + "([^\\w$:])");
              while (reg.test(block)) {
                block = block.replace(global(reg), "$1" + Shrinker.PREFIX + count + "$2");
              }
              var reg = new RegExp("([^{,\\w$.])" + id + ":", "g");
              block = block.replace(reg, "$1" + Shrinker.PREFIX + count + ":");
              count++;
            }
          }
          total = Math.max(total, count);
        }
        var replacement = prefix + "~" + blocks.length + "~";
        blocks.push(block);
      } else {
        var replacement = "~#" + blocks.length + "~";
        blocks.push(prefix + block);
      }
      return replacement;
    };

    // decoder for program blocks
    function decodeBlocks(script, encoded) {
      while (encoded.test(script)) {
        script = script.replace(global(encoded), function(match, index) {
          return blocks[index];
        });
      }
      return script;
    };
    
    // encode blocks, as we encode we replace variable and argument names
    while (BLOCK.test(script)) {
      script = script.replace(BLOCK_g, encodeBlocks);
    }
    
    // put the blocks back
    script = decodeBlocks(script, ENCODED_BLOCK);
    
    var shortId, count = 0;
    var shrunk = new Encoder(Shrinker.SHRUNK, function() {
      // find the next free short name
      do shortId = Packer.encode52(count++);
      while (new RegExp("[^\\w$.]" + shortId + "[^\\w$:]").test(script));
      return shortId;
    });
    script = shrunk.encode(script);
    
    return this.decodeData(script);
  }
}, {
  ENCODED_DATA: /\x01(\d+)\x01/g,
  PREFIX:       "\x02",
  SHRUNK:       /\x02\d+\b/g
});
