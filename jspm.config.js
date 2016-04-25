SystemJS.config({
  transpiler: "plugin-babel",
  packages: {
    "app": {
      "main": "main.js",
      "meta": {
        "*.js": {
          "loader": "plugin-babel"
        }
      }
    }
  },
  meta: {
    "*.box": {
      "loader": "app"
    }
  }
});

SystemJS.config({
  packageConfigPaths: [
    "npm:@*/*.json",
    "npm:*.json",
    "github:*/*.json"
  ],
  map: {
    "assert": "github:jspm/nodelibs-assert@0.2.0-alpha",
    "bitbox": "npm:bitbox@1.0.32",
    "bitbox-codemirror": "npm:bitbox-codemirror@1.0.1",
    "buffer": "github:jspm/nodelibs-buffer@0.2.0-alpha",
    "events": "github:jspm/nodelibs-events@0.2.0-alpha",
    "fs": "github:jspm/nodelibs-fs@0.2.0-alpha",
    "http": "github:jspm/nodelibs-http@0.2.0-alpha",
    "js-beautify": "npm:js-beautify@1.6.2",
    "net": "github:jspm/nodelibs-net@0.2.0-alpha",
    "os": "github:jspm/nodelibs-os@0.2.0-alpha",
    "path": "github:jspm/nodelibs-path@0.2.0-alpha",
    "plugin-babel": "npm:systemjs-plugin-babel@0.0.9",
    "process": "github:jspm/nodelibs-process@0.2.0-alpha",
    "stream": "github:jspm/nodelibs-stream@0.2.0-alpha",
    "systemjs-hot-reloader": "github:capaj/systemjs-hot-reloader@0.5.7",
    "tty": "github:jspm/nodelibs-tty@0.2.0-alpha",
    "url": "github:jspm/nodelibs-url@0.2.0-alpha",
    "util": "github:jspm/nodelibs-util@0.2.0-alpha",
    "vm": "github:jspm/nodelibs-vm@0.2.0-alpha"
  },
  packages: {
    "github:capaj/systemjs-hot-reloader@0.5.7": {
      "map": {
        "debug": "npm:debug@2.2.0",
        "socket.io-client": "github:socketio/socket.io-client@1.4.5",
        "weakee": "npm:weakee@1.0.0"
      }
    },
    "github:jspm/nodelibs-buffer@0.2.0-alpha": {
      "map": {
        "buffer-browserify": "npm:buffer@4.6.0"
      }
    },
    "github:jspm/nodelibs-http@0.2.0-alpha": {
      "map": {
        "http-browserify": "npm:stream-http@2.2.1"
      }
    },
    "github:jspm/nodelibs-os@0.2.0-alpha": {
      "map": {
        "os-browserify": "npm:os-browserify@0.2.1"
      }
    },
    "github:jspm/nodelibs-stream@0.2.0-alpha": {
      "map": {
        "stream-browserify": "npm:stream-browserify@2.0.1"
      }
    },
    "github:jspm/nodelibs-url@0.2.0-alpha": {
      "map": {
        "url-browserify": "npm:url@0.11.0"
      }
    },
    "npm:bitbox-codemirror@1.0.1": {
      "map": {
        "bitbox": "npm:bitbox@1.0.32"
      }
    },
    "npm:buffer@4.6.0": {
      "map": {
        "base64-js": "npm:base64-js@1.1.2",
        "ieee754": "npm:ieee754@1.1.6",
        "isarray": "npm:isarray@1.0.0"
      }
    },
    "npm:config-chain@1.1.10": {
      "map": {
        "ini": "npm:ini@1.3.4",
        "proto-list": "npm:proto-list@1.2.4"
      }
    },
    "npm:debug@2.2.0": {
      "map": {
        "ms": "npm:ms@0.7.1"
      }
    },
    "npm:falafel@1.2.0": {
      "map": {
        "acorn": "npm:acorn@1.2.2",
        "foreach": "npm:foreach@2.0.5",
        "isarray": "npm:isarray@0.0.1",
        "object-keys": "npm:object-keys@1.0.9"
      }
    },
    "npm:inline-process-browser@2.0.1": {
      "map": {
        "falafel": "npm:falafel@1.2.0",
        "through2": "npm:through2@0.6.5"
      }
    },
    "npm:js-beautify@1.6.2": {
      "map": {
        "config-chain": "npm:config-chain@1.1.10",
        "mkdirp": "npm:mkdirp@0.5.1",
        "nopt": "npm:nopt@3.0.6"
      }
    },
    "npm:mkdirp@0.5.1": {
      "map": {
        "minimist": "npm:minimist@0.0.8"
      }
    },
    "npm:nopt@3.0.6": {
      "map": {
        "abbrev": "npm:abbrev@1.0.7"
      }
    },
    "npm:readable-stream@1.0.34": {
      "map": {
        "core-util-is": "npm:core-util-is@1.0.2",
        "inherits": "npm:inherits@2.0.1",
        "isarray": "npm:isarray@0.0.1",
        "stream-browserify": "npm:stream-browserify@1.0.0",
        "string_decoder": "npm:string_decoder@0.10.31"
      }
    },
    "npm:readable-stream@2.1.0": {
      "map": {
        "core-util-is": "npm:core-util-is@1.0.2",
        "inherits": "npm:inherits@2.0.1",
        "inline-process-browser": "npm:inline-process-browser@2.0.1",
        "isarray": "npm:isarray@1.0.0",
        "process-nextick-args": "npm:process-nextick-args@1.0.6",
        "string_decoder": "npm:string_decoder@0.10.31",
        "unreachable-branch-transform": "npm:unreachable-branch-transform@0.5.1",
        "util-deprecate": "npm:util-deprecate@1.0.2"
      }
    },
    "npm:recast@0.11.5": {
      "map": {
        "ast-types": "npm:ast-types@0.8.16",
        "esprima": "npm:esprima@2.7.2",
        "private": "npm:private@0.1.6",
        "source-map": "npm:source-map@0.5.4"
      }
    },
    "npm:stream-browserify@1.0.0": {
      "map": {
        "inherits": "npm:inherits@2.0.1",
        "readable-stream": "npm:readable-stream@1.0.34"
      }
    },
    "npm:stream-browserify@2.0.1": {
      "map": {
        "inherits": "npm:inherits@2.0.1",
        "readable-stream": "npm:readable-stream@2.1.0"
      }
    },
    "npm:stream-http@2.2.1": {
      "map": {
        "builtin-status-codes": "npm:builtin-status-codes@2.0.0",
        "inherits": "npm:inherits@2.0.1",
        "to-arraybuffer": "npm:to-arraybuffer@1.0.1",
        "xtend": "npm:xtend@4.0.1"
      }
    },
    "npm:through2@0.6.5": {
      "map": {
        "readable-stream": "npm:readable-stream@1.0.34",
        "xtend": "npm:xtend@4.0.1"
      }
    },
    "npm:unreachable-branch-transform@0.5.1": {
      "map": {
        "esmangle-evaluator": "npm:esmangle-evaluator@1.0.0",
        "recast": "npm:recast@0.11.5"
      }
    },
    "npm:url@0.11.0": {
      "map": {
        "punycode": "npm:punycode@1.3.2",
        "querystring": "npm:querystring@0.2.0"
      }
    }
  }
});
