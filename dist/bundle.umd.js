/*!
 * bitbox-transpiler v1.0.25
 * (c) 2016 Sergiu Toderascu <sergiu.toderascu@gmail.com> (http://bitboxjs.com)
 * Released under the ISC License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.bitbox = global.bitbox || {}, global.bitbox.transform = global.bitbox.transform || {})));
}(this, function (exports) { 'use strict';

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  var toConsumableArray = function (arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    } else {
      return Array.from(arr);
    }
  };

  function isFunction(v) {
  	return typeof v === 'function' || false;
  }

  function event(el) {

  	el = el || {};

  	var callbacks = {},
  	    _id = 0;

  	el.events = {};
  	el.getEvents = function () {
  		return Object.keys(callbacks);
  	};

  	el.update = function (payload, value) {
  		var diff = {};
  		if (value && typeof payload === 'string') {
  			var key = payload;
  			payload = {};
  			payload[key] = value;
  		}
  		if (payload && (typeof payload === 'undefined' ? 'undefined' : _typeof(payload)) === 'object') {
  			Object.keys(payload).map(function (k) {
  				if (el[k] !== payload[k]) {
  					diff[k] = {
  						old: el[k],
  						new: payload[k]
  					};
  					el[k] = payload[k];
  				}
  			});
  		}
  		el.emit('update', payload, diff);
  	};

  	el.sub = function (events, fn) {
  		if (isFunction(fn)) {
  			fn._id = typeof fn._id == 'undefined' ? _id++ : fn._id;
  			events.replace(/\S+/g, function (name, pos) {
  				(callbacks[name] = callbacks[name] || []).push(fn);
  				fn.typed = pos > 0;
  			});
  		}
  		return el;
  	};

  	el.on = function () {
  		var events = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
  		var fn = arguments[1];

  		if (isFunction(fn)) {
  			fn._id = typeof fn._id == 'undefined' ? _id++ : fn._id;

  			if (!Array.isArray(events)) events = [events];
  			events.map(function (name) {

  				if (name !== 'listener' && name !== 'update') {
  					el.events[name] = true;
  					el.emit('listener', name);
  				}

  				(callbacks[name] = callbacks[name] || []).push(fn);
  				//fn.typed = pos > 0
  			});
  		}
  		return el;
  	};

  	el.off = function (events, fn) {
  		if (events == '*') {
  			callbacks = {};
  		} else {
  			if (!Array.isArray(events)) events = [events];
  			events.map(function (name) {
  				if (fn) {
  					var arr = callbacks[name];
  					for (var i = 0, cb; cb = arr && arr[i]; ++i) {
  						if (cb._id == fn._id) {
  							arr.splice(i, 1);
  							i--;
  						}
  					}
  				} else {
  					callbacks[name] = [];
  				}
  			});
  		}
  		return el;
  	};

  	el.one = function (name, fn) {
  		function on() {
  			el.off(name, on);
  			fn.apply(el, arguments);
  		}
  		return el.on(name, on);
  	};

  	el.pub = function (name) {

  		var args = [].slice.call(arguments, 1),
  		    fns = callbacks[name] || [];

  		for (var i = 0, fn; fn = fns[i]; ++i) {
  			if (!fn.busy) {
  				fn.busy = 1;
  				fn.apply(el, fn.typed ? [name].concat(args) : args);
  				if (fns[i] !== fn) {
  					i--;
  				}
  				fn.busy = 0;
  			}
  		}

  		if (callbacks.all && name != '*') {
  			el.trigger.apply(el, ['*', name].concat(args));
  		}

  		return el;
  	};

  	el.emit = function (name) {
  		var args = [].slice.call(arguments, 1),
  		    fns = callbacks[name] || [];

  		for (var i = 0, fn; fn = fns[i]; ++i) {
  			if (!fn.busy) {
  				fn.busy = 1;
  				fn.apply(el, fn.typed ? [name].concat(args) : args);
  				if (fns[i] !== fn) {
  					i--;
  				}
  				fn.busy = 0;
  			}
  		}

  		if (callbacks.all && name != '*') {
  			el.trigger.apply(el, ['*', name].concat(args));
  		}

  		return el;
  	};

  	el.trigger = function (name) {
  		var args = [].slice.call(arguments, 1),
  		    fns = callbacks[name] || [];

  		for (var i = 0, fn; fn = fns[i]; ++i) {
  			if (!fn.busy) {
  				fn.busy = 1;
  				fn.apply(el, fn.typed ? [name].concat(args) : args);
  				if (fns[i] !== fn) {
  					i--;
  				}
  				fn.busy = 0;
  			}
  		}

  		if (callbacks.all && name != '*') {
  			el.trigger.apply(el, ['*', name].concat(args));
  		}

  		return el;
  	};

  	return el;
  }

  var dom = {

  	content: 'content',

  	a: 'a',
  	abbr: 'abbr',
  	address: 'address',
  	area: 'area',
  	article: 'article',
  	aside: 'aside',
  	audio: 'audio',
  	b: 'b',
  	base: 'base',
  	bdi: 'bdi',
  	bdo: 'bdo',
  	big: 'big',
  	blockquote: 'blockquote',
  	body: 'body',
  	br: 'br',
  	button: 'button',
  	canvas: 'canvas',
  	caption: 'caption',
  	cite: 'cite',
  	code: 'code',
  	col: 'col',
  	colgroup: 'colgroup',
  	data: 'data',
  	datalist: 'datalist',
  	dd: 'dd',
  	del: 'del',
  	details: 'details',
  	dfn: 'dfn',
  	dialog: 'dialog',
  	div: 'div',
  	dl: 'dl',
  	dt: 'dt',
  	em: 'em',
  	embed: 'embed',
  	fieldset: 'fieldset',
  	figcaption: 'figcaption',
  	figure: 'figure',
  	footer: 'footer',
  	form: 'form',
  	h1: 'h1',
  	h2: 'h2',
  	h3: 'h3',
  	h4: 'h4',
  	h5: 'h5',
  	h6: 'h6',
  	head: 'head',
  	header: 'header',
  	hr: 'hr',
  	html: 'html',
  	i: 'i',
  	iframe: 'iframe',
  	img: 'img',
  	input: 'input',
  	ins: 'ins',
  	kbd: 'kbd',
  	keygen: 'keygen',
  	label: 'label',
  	legend: 'legend',
  	li: 'li',
  	link: 'link',
  	main: 'main',
  	map: 'map',
  	mark: 'mark',
  	menu: 'menu',
  	menuitem: 'menuitem',
  	meta: 'meta',
  	meter: 'meter',
  	nav: 'nav',
  	noscript: 'noscript',
  	object: 'object',
  	ol: 'ol',
  	optgroup: 'optgroup',
  	option: 'option',
  	output: 'output',
  	p: 'p',
  	param: 'param',
  	picture: 'picture',
  	pre: 'pre',
  	progress: 'progress',
  	q: 'q',
  	rp: 'rp',
  	rt: 'rt',
  	ruby: 'ruby',
  	s: 's',
  	samp: 'samp',
  	script: 'script',
  	section: 'section',
  	select: 'select',
  	small: 'small',
  	source: 'source',
  	span: 'span',
  	strong: 'strong',
  	style: 'style',
  	sub: 'sub',
  	summary: 'summary',
  	sup: 'sup',
  	table: 'table',
  	tbody: 'tbody',
  	td: 'td',
  	textarea: 'textarea',
  	tfoot: 'tfoot',
  	th: 'th',
  	thead: 'thead',
  	time: 'time',
  	title: 'title',
  	tr: 'tr',
  	track: 'track',
  	u: 'u',
  	ul: 'ul',
  	'var': 'var',
  	video: 'video',
  	wbr: 'wbr',

  	// SVG
  	circle: 'circle',
  	clipPath: 'clipPath',
  	defs: 'defs',
  	ellipse: 'ellipse',
  	g: 'g',
  	line: 'line',
  	linearGradient: 'linearGradient',
  	mask: 'mask',
  	path: 'path',
  	pattern: 'pattern',
  	polygon: 'polygon',
  	polyline: 'polyline',
  	radialGradient: 'radialGradient',
  	rect: 'rect',
  	stop: 'stop',
  	svg: 'svg',
  	text: 'text',
  	tspan: 'tspan'

  };

  //

  var __source = {};

  function __source__ (n) {
  	//n.source = n.source.replace(/\=\>/g, ' =>')
  	n.source = n.source.replace(/<([a-z0-9-]+)(.*)=>(.*)<\/([a-z0-9-]+)>$/gm, "<$1$2=>$3");
  	__source[n.name] = n;
  	//console.info('source:', n.name);
  }

  //import importNode 	from './nodes/import'
  //import exportNode 	from './nodes/export'
  //import scriptNode 	from './nodes/script'
  //import styleNode 	from './nodes/style'
  //import modNode 		from './nodes/mod'
  //import { js_beautify as beautify } from 'js-beautify/js/lib/beautify'

  function beautify$1(s) {
  	return s;
  }

  var config = {
  	h: 'box',
  	element: 'bitbox.element'
  };

  var index = [];
  var meta = {};

  var nodes = {
  	clearMeta: function clearMeta() {
  		meta = { import: {}, export: {}, local: {} };
  	},
  	mustreturn: false,
  	lastNode: null,
  	methods: [],
  	pairs: {},
  	routes: [],
  	init: [],
  	inlineThunks: [],
  	body: '',
  	observableKeys: [],
  	delegateKeys: [],
  	box: [],
  	imports: [],
  	exports: [],
  	boxes: [],
  	keys: {},
  	bits: [],

  	//import: (node) => importNode(node, meta.import),
  	//export: exportNode,
  	//script: scriptNode,
  	//mod: modNode,

  	_style: function _style(node, opts) {
  		node.props.scope = '{ name: "' + node.parent.name + '", key: ' + node.parent.props.key + ' }';
  		node.attrs.push({ key: 'text', type: 'keyed', value: 'text' });
  		return this.tag(node, opts);
  	},
  	_script: function _script(node, opts) {
  		node.attrs.push({ key: 'text', type: 'keyed', value: 'text' });
  		return this.tag(node, opts);
  	},


  	styles: [],
  	inits: [],
  	convertprops: convertprops,
  	objectToArray: function objectToArray(obj) {
  		return Object.keys(obj).map(function toItem(k) {
  			return obj[k];
  		});
  	},
  	selfClosing: function selfClosing(node, opts) {
  		node.content = -1;
  		node.selfClosing = true;
  		return this.tag(node, opts);
  	},


  	// text: (text) => {
  	// 	//console.log('text', text)
  	// 	let p = { ...text.props }
  	// 	p = `{ ${convertprops(p)} }`
  	//
  	// 	const t = text.body.trim(); //replace(/\`/g, '')
  	// 	if (t.startsWith('`') && t.endsWith('`'))
  	// 		return "$tree.push(text(" + p + ", " + text.body + "));"
  	// 	else
  	// 		return "$tree.push(text(" + p + ", `" + (text.body.replace(/\`/g, '\`')) + "`));"
  	// },

  	tag: function tag(node, opts) {

  		config = _extends({}, config, opts);

  		//console.log('tag-node: ' + node.name, node.body)
  		this.lastNode = node;
  		var isnative = dom[node.name] === node.name ? true : false;
  		var mustreturn = false;
  		var outerexpr = '';
  		var innerexpr = '';
  		var innerexprclose = '';
  		var outerexprclose = '';
  		var isInlineThunk = false;

  		if (!node.object) node.object = {};

  		node.object.attributes = [].concat(toConsumableArray(node.attrs));
  		if (node.attrs.length) {
  			for (var ei in node.attrs) {
  				var prop = node.attrs[ei];
  				if (prop) {
  					if (prop.rel && prop.rel === 'def') {

  						node.jsname = toCamel(node.name);

  						node.type = 'box';
  						this.boxes.push(node);

  						var _args = prop.value.trim();
  						_args = _args ? _args.substr(0, _args.length - 1) + ')' : null;
  						node.args = _args;
  						var newbox = ['', ''];
  						if (node.parent === 'root' || node.parent.name === 'mod') {
  							//newbox = [`box.set(`, `)`]
  						} else {
  								//newbox = [`${node.parent.name}.${ toCamel(node.name) } = `, ``]
  								//newbox = [``, ``]
  							}

  						var _export2 = '';
  						var _boxset = '';
  						if (node.parent === 'root' || node.parent.name === 'mod') {
  							if (node.props.export) {
  								_export2 = '\nexport ';
  								if (node.props.default) _export2 = _export2 + 'default ';
  								delete node.props.export;
  								delete node.props.default;
  							}
  						}

  						var bits = this.bits.filter(function (value, index, self) {
  							return self.indexOf(value) === index;
  						}).map(function (b) {
  							return b[0] + ': ' + b[1];
  						}).join(',');
  						this.bits = [];

  						// box(${ toCamel(node.name) }, { ${bits} });
  						outerexpr += '' + _export2 + newbox[0] + ' function ' + toCamel(node.name) + _args + ' {\n                            const ' + config.h + ' = arguments[1];\n                            ';

  						if (node.parent === 'root') {

  							var loads = Object.keys(meta.local).map(function (load) {
  								return 'new bitbox(' + node.jsname + '$box, ' + load + ')';
  							});

  							outerexpr += 'const $box = arguments[1];\n';
  							outerexpr += this.inits.join('\n') + '\n';
  							outerexpr += loads.join('\n') + '\n';
  							this.keys = {};
  							this.inits = [];
  							outerexpr = outerexpr.replace(/this\$box/g, node.jsname + '$box');
  							node.content = node.content.replace(/this\$box/g, node.jsname + '$box');
  						}

  						outerexprclose = outerexprclose + ('\n}' + newbox[1] + _boxset);
  						delete node.props[prop.key];
  					}

  					switch (prop.key) {
  						// case 'from':
  						// 	node.props.from = `'${node.props.from.replace(/['"`]/g, '')}/${node.name}!box'`
  						// 	meta.import[toCamel(node.name)] = node.props.from //.replace(/['"`]/g, '')
  						// 	this.imports.push(`import { ${toCamel(node.name)} } from ${node.props.from}`)
  						// 	delete node.props.from
  						// break;
  						case 'text':
  							if (prop.value) node.content = '`' + node.body.replace(/\`/gm, '\\`') + '`';
  							delete node.props.text;
  							break;
  						case 'snippet':
  							node.snippet = prop.value;
  							if (node.snippet) {
  								node.props.snippet = node.body ? '`' + node.body.replace(/\`/gm, '\\`') + '`' : null;
  							}
  							break;
  						case 'if':
  							outerexpr += 'if ' + prop.value + ' {';
  							outerexprclose = '}';
  							node.parent._if = true;
  							delete node.props.if;
  							break;
  						case 'else':
  							outerexpr += 'else {';
  							outerexprclose = '}';
  							delete node.props.else;
  							break;
  						case 'for':
  							if (prop.rel === 'invoke') {
  								innerexpr += 'for ' + prop.value + ' {';
  								innerexprclose = '}';
  								node.__tree = true;
  								delete node.props.for;
  							}
  							break;
  						case 'switch':
  							innerexpr += 'switch ' + prop.value + ' {';
  							innerexprclose = '}';
  							node._switch = true;
  							delete node.props.switch;
  							break;
  					}

  					if (prop.key.endsWith('.map')) {
  						if (node.childrens > 1) throw new Error('Only one root element allowed for map, got ' + node.childrens + '\n' + node.body);
  						var hasContent = node.content === -1 || node.content.trim().length;
  						if (hasContent && !node.selfClosing) {
  							innerexpr += prop.key + '(' + prop.value + ' => {';
  							innerexprclose = '})';
  						} else {
  							node.content = '' + prop.key + prop.value;
  						}
  						delete node.props[prop.key];
  					}

  					if (prop.key.endsWith('.each')) {
  						innerexpr += prop.key.replace('.each', '.forEach') + '(' + prop.value + ' => {';
  						innerexprclose = '})';
  						node.__tree = true;
  						delete node.props[prop.key];
  					}

  					if (prop.rel === 'invoke') {

  						if (node.props[prop.key]) {

  							//console.log('-->', prop)

  							node.invoke = node.name + '.' + prop.key + prop.value;
  							//console.log('node.invoke', node.props)
  							// const imet = prop.key === 'color' || prop.key === 'style'
  							// 	? `bitbox.${prop.key}`
  							// 	: prop.key
  							var x = prop.key.startsWith('-') ? prop.key.substr(1) : prop.key;
  							node.props[prop.key] = '' + toCamel(x) + prop.value;
  							//delete node.props[prop.key]
  						}
  					}
  				}
  			}
  		}

  		// if (node.props.style) {
  		// 	node.props.style = normalizeStyle(node.props.style)
  		// }

  		if (node.return) {
  			// let n = `${ node.content }`
  			// if (node.content.trim().indexOf('...') === 0)
  			// 	n = `${ node.content }`
  			node.content = 'return (' + node.content + ')';
  			//node.content = n.indexOf('$tree') === 0 ? n : `$tree.push(${ n });`
  		}

  		var _export = '';
  		if (node.props.export) {
  			_export = '\nexport ';
  			if (node.props.default) _export = _export + 'default ';
  			delete node.props.export;
  			delete node.props.default;
  		}

  		if (node.props.case) {
  			var caseex = 'case ' + node.props.case + ':';
  			node.props.key = '\'case-' + node.props.case.replace(/['"`]/g, '') + '\'';
  			if (node.props.case === true) {
  				var keys = Object.keys(node.props);
  				var caseval = keys[keys.indexOf('case') + 1];
  				node.props.key = caseval;
  				delete node.props[caseval];
  				if (caseval === 'default') caseex = 'default:';else caseex = 'case \'' + caseval + '\':';
  			}
  			outerexpr = '' + caseex;
  			outerexprclose = 'break;';
  			delete node.props.case;
  		}

  		if (node.props.default && node.parent.props.switch) {
  			outerexpr = 'default:';
  			outerexprclose = 'break;';
  			delete node.props.default;
  		}

  		var attrs = node.props ? '' + convertprops(node.props) : '';

  		var bodyornode = '';
  		var bodyornodeend = '';
  		var name = node.name;

  		if (node.type !== 'box') {

  			if (node.name === 'mod') {

  				bodyornode = '';
  				bodyornodeend = '';
  			} else {

  				name = '' + toCamel(node.name);

  				if (node.content === -1) {
  					node.content = '';

  					if (node.invoke_zz) {} else {
  						if (meta.local[name + '__s']) {} else {

  							var __bind = '{}'; //node.props.bind || node.props.bit || 'this'
  							var key = name;

  							if (node.key) {
  								//node.props.module = `"${node.key}"`
  								//__bind = `${node.key}`
  								//this.bits.push([node.key, name])
  								_export = '' + _export + (node.key.indexOf('.') > -1 ? '' : 'const ') + toCamel(node.key) + ' = ';
  							}

  							var parentMap = Object.keys(node.parent.props).filter(function (k) {
  								return k.endsWith('.map');
  							}).pop();
  							if (parentMap) {
  								node.props.return = true;
  								//delete node.parent.props[parentMap]
  							}

  							var treectx = !node.parent.box && node.parent.parent !== 'root' ? ['$tree.push(', ');'] : ['', ''];

  							var isnew = false;
  							if (node.props.new) {
  								isnew = true;
  								delete node.props.new;
  							}

  							if (node.props.return || node.parent.box) {
  								treectx = ['return(', ')'];
  								delete node.props.return;
  							}

  							node.object.key = key;
  							node.object.props = '{' + attrs + '}';

  							var nn = node.comprop || node.dotprop || name;
  							var bxname = nn === 'element' ? '' + config.element : nn;

  							node.parent.childrens = typeof node.parent.childrens !== 'undefined' ? node.parent.childrens + 1 : 1;

  							// if (node.snippet == 2) {
  							// 	node.props.snippetJS = beautify(node.content, {
  							// 		indent_with_tabs: true,
  							// 		indent_size: 4
  							// 	})
  							// 	node.props.snippetJS = `\`${node.props.snippetJS.replace(/\`/gm, '\\`')}\``
  							// }

  							var p = _extends({}, node.props);
  							attrs = p ? '' + convertprops(p) : '';
  							var a = node.props.props || node.props['@'] ? '' + (node.props.props || node.props['@'].substring(1)) : attrs ? '{ ' + attrs + ' }' : ''; // `undefined`
  							var bt = !node.name.startsWith('bitbox');
  							//node.parent.parent !== 'root'
  							//console.log('node',node)
  							if (isnew || isnative) bodyornode = '' + treectx[0] + config.h + '(\'' + node.name + '\'' + (a ? ',' : '') + a + ')' + treectx[1];else if (bt) bodyornode = '' + treectx[0] + config.h + '(' + bxname + (a ? ',' : '') + a + ')' + treectx[1];else bodyornode = '' + treectx[0] + bxname + '(' + a + ')' + treectx[1];
  						}
  					}
  					bodyornodeend = '';
  				} else {
  					if (meta.local[name + '__s']) {} else {

  						var _bind = '{}'; //node.props.bind || node.props.bit || 'this'
  						var _key = name;
  						if (node.key) {
  							// node.props.module = `"${node.key}"`
  							// __bind = `${node.key}`
  							// this.bits.push([node.key, name])
  							_export = '' + _export + (node.key.indexOf('.') > -1 ? '' : 'const ') + toCamel(node.key) + ' = ';
  						}

  						var _parentMap = Object.keys(node.parent.props).filter(function (k) {
  							return k.endsWith('.map');
  						}).pop();
  						if (_parentMap) {
  							node.props.return = true;
  							//delete node.parent.props[parentMap]
  						}

  						var _treectx = !node.parent.box && node.parent.parent !== 'root' ? ['$tree.push(', ');'] : ['', ''];

  						var _isnew = false;
  						if (node.props.new) {
  							_isnew = true;
  							delete node.props.new;
  						}
  						if (node.props.return || node.parent.box) {
  							_treectx = ['return(', ')'];
  							//console.log('node box', node)
  							delete node.props.return;
  						}

  						var _nn = node.comprop || node.dotprop || name;
  						var _bxname = _nn === 'element' ? '' + config.element : _nn;

  						var _hasContent = node.content.trim().length;
  						var re = /^\$tree\.push\(([\s\S]*)\)\;$/g;
  						//const treeMatch = node.content.trim().match(re)

  						var treewrap = node.childrens > 1 || node._if || node._switch || node.__tree ? ['($tree => {', 'return $tree })([])'] : ['', ''];

  						node.parent.childrens = typeof node.parent.childrens !== 'undefined' ? node.parent.childrens + 1 : 1;

  						if (node.childrens === 1 && !node.__tree) {
  							//console.log('childrens===1', node.name, node.content)
  							//node.content = node.content.trim().substr(11, node.content.length - 14)
  							node.content = node.content.trim().replace(re, "$1");
  						}

  						if (node.snippet == 2) {
  							var snippetJS = beautify$1(node.content, {
  								indent_with_tabs: true,
  								indent_size: 4
  							});
  							var snippet = node.props.snippet;
  							snippetJS = '`' + snippetJS.replace(/\`/gm, '\\`') + '`';
  							node.props.snippet = '{ in: ' + snippet + ', out: ' + snippetJS + ' }';
  						}

  						var _p = _extends({}, node.props);
  						attrs = _p ? '' + convertprops(_p) : '';
  						var _a = node.props.props || node.props['@'] ? '' + (node.props.props || node.props['@'].substring(1)) : attrs ? '{ ' + attrs + ' }' : ''; //`undefined`

  						var _bt = !node.name.startsWith('bitbox'); // && node.parent.parent !== 'root'

  						if (_isnew || isnative) bodyornode = '' + _treectx[0] + config.h + '(\'' + node.name + '\'' + (_a ? ',' : '') + _a + (_hasContent ? ',' : '') + treewrap[0];else if (_bt) bodyornode = '' + _treectx[0] + config.h + '(' + _bxname + (_a ? ',' : '') + _a + (_hasContent ? ',' : '') + treewrap[0];else bodyornode = '' + _treectx[0] + _bxname + '(' + _a + (_a && _hasContent ? ',' : '') + treewrap[0];

  						bodyornodeend = treewrap[1] + ')' + _treectx[1];
  						//console.log(node)
  						// if (node.name === 'xx') {
  						// 	console.log(`
  						// 	/** istree: ${istree}, childrens: ${node.childrens} */
  						// 	/** wrap start */
  						// 	${bodyornode}
  						// 	/** content */
  						// 	${node.content}
  						// 	/** wrap end */
  						// 	${bodyornodeend}
  						// 	`)
  						// 	//console.log(treeMatch)
  						// 	//console.log(node)
  						// }
  					}
  				}
  			}
  		} else {

  				if (node.returning) {
  					bodyornode = '/** return **/\n';
  					bodyornodeend = '';
  				} else {

  					var _p2 = _extends({}, node.parent.props, node.props);
  					delete _p2['export'];
  					delete _p2['default'];
  					delete _p2[node.parent.name];
  					attrs = _p2 ? ', {' + convertprops(_p2) + ' }' : '';
  					name = '\'' + node.name + '\'';
  					var nargs = node.args.replace('(', '').replace(')', '').split(',');

  					var en = node.props.register ? typeof node.props.register === 'string' && node.props.register.indexOf('-') > -1 ? node.props.register : '\'' + node.name + '-box\'' : '\'' + node.name + '\'';

  					if (node.childrens > 1) throw new Error('Box must have only one root element, got ' + node.childrens + '\n' + node.body);

  					bodyornode = '';
  					bodyornodeend = '';

  					__source__({
  						js: ('' + outerexpr + bodyornode + innerexpr + node.content + innerexprclose + bodyornodeend + outerexprclose).trim(),
  						source: '' + node.tag + node.body + '</' + node.name + '>',
  						name: '' + node.name
  					});
  				}
  			}

  		index[node.i] = typeof index[node.i] !== 'undefined' ? index[node.i] + 1 : 1;

  		var args = ''; //keyvars.length ? `let { ${ keyvars.join(`, `) } } = props;` : ``
  		var isbody = false;

  		var ret = '' + _export + outerexpr + ' ' + bodyornode + args + innerexpr + node.content + innerexprclose + bodyornodeend + ' ' + outerexprclose;

  		return ret.replace(/\n\n/g, '\n');
  	},
  	isString: function isString(str) {
  		var strreg = /['"`]([^'`"]+)["'`]/g;
  		return strreg.exec(str.trim());
  	}
  };

  function convertprops(p) {
  	var a = arguments.length <= 1 || arguments[1] === undefined ? ': ' : arguments[1];
  	var b = arguments.length <= 2 || arguments[2] === undefined ? ', ' : arguments[2];

  	var props = _extends({}, p);
  	var keys = Object.keys(props);
  	var result = [];
  	var events = [];

  	var rest = [];

  	keys.forEach(function (key) {

  		var value = props[key];

  		if (key === 'class') {

  			result.push('className' + a + value);
  		} else if (key === 'style') {
  			result.push('' + key + a + value);
  		} else if (key.indexOf('...') === 0) {
  			result.push('' + toCamel(key));
  		} else {
  			if (key === value) result.push('' + toCamel(key));else result.push('' + toCamel(key) + a + value);
  		}
  	});

  	// if (events.length)
  	// 	result.push(`on${ a } { ${ events.join(b) } }`)

  	return result.join(b);
  }

  function toCamel(subj, all) {
  	if (subj && subj.indexOf('-') > -1) {
  		var parts = subj.split('-');
  		subj = parts.map(function (p, i) {
  			return !all && i === 0 ? p : p.substr(0, 1).toUpperCase() + p.substr(1);
  		}).join('');
  	}
  	return !all ? subj : subj.substr(0, 1).toUpperCase() + subj.substr(1);
  }

  //import { js_beautify as beautify } from 'js-beautify/js/lib/beautify'

  function beautify(s) {
      return s;
  }

  function Printer(parent) {
      this.parent = parent;
      this.content = '';
      this.spacer = '';
      this.indent = parent ? parent.indent : '';
      this.isFirstItem = true;
  }

  Printer.prototype.addSpace = function (space) {
      this.spacer += space;
      if (space.indexOf("\n") !== -1) {
          this.indent = /[^\n]*$/.exec(space)[0];
      } else {
          this.indent += space;
      }
  };

  Printer.prototype.add = function (data, ignoreComma) {
      this.content += this.spacer;
      this.spacer = '';
      this.content += data;
  };

  var Parser = function () {
      function Parser() {
          var _this = this;

          var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
          classCallCheck(this, Parser);

          event(this);

          this.token = {};
          this.chars = [];
          this.index = [];
          this.attrs = [];
          this.props = {};
          this.nodes = [];
          this.text = [];
          this.tree = {};
          this.result = '';
          this.node = {};

          this.token = { '<': 1, '</': 1 };

          var elements = [];
          var printer = new Printer(null);

          //this.on('run', () => {

          printer = new Printer(null);

          var i = 0;
          var isnode = false;

          //})

          this.on('open', function (name, node) {
              i++;
              if (name === '___bitbox') node.component = { key: node.attrs[0].key, attr: node.attrs };else node.component = node.parent.component;

              // if (node.tag && node.tag.endsWith('=>')) {
              //     node.return = true
              // }

              elements.unshift([name, node.attrs]);
              printer = new Printer(printer);
              isnode = true;
          });

          this.on('text', function (text) {

              var lines = text.split("\n");
              var isFirst = true;
              lines.forEach(function (line) {

                  var lineMatch = /^(\s*)(.*?)(\s*)$/.exec(line);
                  var preSpace = lineMatch[1],
                      mainText = lineMatch[2],
                      postSpace = lineMatch[3];

                  if (!isFirst) printer.addSpace("\n");

                  if (mainText.length > 0) {
                      var fc = mainText[0];
                      if (isnode === true && (fc === '`' || fc === "'" || fc === '"')) {
                          printer.add(mainText);
                      } else {
                          printer.add(mainText);
                      }
                  }
                  isFirst = false;
              });
          });

          this.on('close', function (name, node) {
              isnode = false;
              var element = elements.shift();
              var content = printer.content;
              printer = printer.parent;
              node.content = content;

              if (typeof nodes[name] === 'function') printer.add(nodes[name](node, _this.options));else printer.add(nodes.tag(node, _this.options));
              i--;
              //if (i === 0) this.emit('done')
          });

          this.on('self-closing', function (name, node) {
              //isnode = false
              //var element = elements.shift()
              //var content = printer.content
              //printer = printer.parent
              //node.content = content

              if (typeof nodes[name] === 'function') printer.add(nodes[name](node, _this.options));else printer.add(nodes.selfClosing(node, _this.options));
              //i--
              //if (i === 0) this.emit('done')
          });

          this.on('done', function () {
              //console.log('parser-done', printer.content);
              //printer.content = printer.content.replace(/^\s*\n/gm, '\n')
              _this.compiled = printer.content;
              _this.write(_this.compiled);
              printer = new Printer(null);
          });

          this.extract();
      }

      createClass(Parser, [{
          key: 'balanced',
          value: function balanced() {
              var result = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
              var pairs = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];


              var s = result.out ? result.out : result.input;

              var c = 0,
                  _o = [],
                  _c = [],
                  _x = [],
                  st = '<',
                  canclose = -1,
                  openat = 0,
                  sp = [],
                  sub = s,
                  pair = false,
                  openpos = 0,
                  closepos = 0,
                  subs = '',
                  isopen = false,
                  eqpos = 0,
                  element = {},
                  keys = [],
                  key = void 0;

              var open = pairs.map(function (p) {
                  return p.charAt(0);
              });
              var close = pairs.map(function (p) {
                  return p.charAt(1);
              });
              var openMatch = null;
              var closeMatch = null;
              var currentOpen = false;

              var subcopy = s;
              var values = [];

              result.pairs = {};
              result.error = false;
              result.return = false;
              //result.attr = result.attr ? result.attr : {}
              result.out = '';
              result.props = result.props ? result.props : [];

              var tagreg = /^<([^\(\s\=\/\>]+)/;
              var tagmatch = tagreg.exec(s);
              if (tagmatch) {
                  //console.log('tagmatch', tagmatch)
                  var name = tagmatch[1].split(':');
                  result.name = name[0];
                  if (result.name.indexOf('[') > -1) {
                      var rn = result.name.replace(/\[/g, '.').replace(/\]/g, '.');
                      subcopy = s = s.replace(result.name, rn);
                      result.comprop = '' + result.name;
                      result.name = rn;
                  }
                  if (result.name.indexOf('.') > -1) {
                      //result.name = result.name.split('.')[0]
                      result.dotprop = '' + result.name;
                  }
                  result.key = name[1] || null;
              }

              for (var i = 0; i < s.length; i++) {
                  var ch = s.charAt(i);

                  result.pos = i;

                  if (ch === st && s.charAt(i + 1) !== '/' && canclose === -1) {
                      canclose = i;
                      openat = i;
                      //let s1 = s.substr(i+1).split(' ').shift()
                      //result.name = s1.replace('=','').replace('>','')
                  }

                  if (canclose > -1) {

                      if (!currentOpen) {
                          var oi = open.indexOf(ch);
                          if (oi > -1) {
                              openMatch = ch;
                              closeMatch = close[oi];
                          }
                      }

                      if (ch === openMatch) {

                          currentOpen = openMatch;
                          c++;
                          _o.push(i);

                          if (!isopen) {
                              var s1 = s.substring(0, i);
                              var tst = s1.replace(/\s+/g, ' ').split(' ');
                              var pk = tst.pop();
                              key = pk.length ? pk : tst.pop() + ' ';
                              //console.log('OPEN', result.name, key, openMatch)
                              keys.unshift(key);
                          }

                          isopen = true;
                      } else if (ch === closeMatch) {

                          c--;
                          _c.push(i);

                          if (c === 0) {
                              var _key = keys.shift();
                              var rel = _key.endsWith('=') ? 'assign' : 'invoke';

                              if (_key.indexOf('<') === 0) {
                                  result.box = true;
                                  _key = _key.substr(1);
                                  rel = 'def';
                              }
                              var type = openMatch + closeMatch;

                              currentOpen = false;
                              openMatch = null;
                              closeMatch = null;

                              isopen = false;
                              openpos = _o.shift();
                              closepos = _c.pop();
                              var value = s.substring(openpos, closepos + 1);
                              //console.log('CLOSE'.bgRed, result.name.bgGreen, key.bgBlue, value.bgGreen)

                              result.__i = result.props.push({
                                  key: _key.trim().replace('=', ''),
                                  value: value, type: type, rel: rel
                              });

                              subcopy = subcopy.replace(_key + value, result.__i);
                              //console.log('CLOSE', result.name, key, type, value)
                              //console.log('SUBCOPY', subcopy)
                              _o = [];
                              _c = [];
                          } else {
                              //openpos = _o.shift()
                              //closepos = _c.pop()
                              //console.log('ERROR', key)
                              //console.log('RESULT', result)
                              // result.error = {
                              //     type: 'unbalanced',
                              //     input: s.substring(openpos, closepos + 1)
                              // }
                              // return result
                          }
                          if (c < 0) {
                              result.error = 'c < 0';
                              return result;
                          }
                      }
                      if (ch === '>') {
                          if (c === 0) {
                              if (s[i - 1] === '=') result.return = true;

                              if (s[i - 1] === '/') result.selfClosing = true;

                              var tag = s.substring(canclose, i + 1);
                              result.tag = tag;
                              //console.log(result.name.bgRed + tag.bgYellow)

                              subcopy = subcopy.substring(openat + 1, i);
                              //console.log('subcopy>>>>>>>>', subcopy)

                              subcopy = subcopy.split('>').shift().trim();
                              if (result.return || result.selfClosing) subcopy = subcopy.substring(0, subcopy.length - 1).trim();

                              canclose = 0;
                              result.out = subcopy.replace(/\s+/g, ' ').trim();
                              return result;
                          } else {
                              //console.log('\nIGNORE '.red, s.substring(openat, i).bgYellow + '>'.bgRed)
                          }
                      }
                  }
              }
              if (c === 0) return result;
              result.error = 'c !== 0';
              return result;
          }
      }, {
          key: 'extract',
          value: function extract() {
              var _this2 = this;

              var i = 0,
                  node = null,
                  roots = 0,
                  frompos = 0;

              this.on('<', function (pos, tok) {

                  var str = _this2.string(pos);
                  if (str.indexOf('</') === 0) return;

                  var innerpos = pos + tok.length;
                  var innerstr = str.slice(innerpos);
                  var props = {};

                  var a = str;

                  var b = null;

                  if (a.length) {

                      b = _this2.balanced({ input: a, __i: 0 }, ['()', '{}', '[]']);

                      b.out = b.out.replace(/([\w\-]+)\s?=?\s?['"`]([^'`"]+)["'`]/g, function (match, key, value) {
                          var type = 'static';
                          // if (key === 'class') {
                          //     value = '{' + value.split(' ').map(c => `'${ c }': true`).join(', ') + '}'
                          //     type = '{}'
                          // }
                          b.__i = b.props.push({ key: key, value: value, type: type, rel: 'assign' });
                          return b.__i;
                      });

                      frompos = pos + b.pos;
                      if (b.out.startsWith(b.name)) b.out = b.out.substr(b.name.length);

                      b.out = b.out.trim();
                      var c = b.out.split(' ').map(function (i) {
                          var index = parseInt(i);
                          if (index) {
                              return b.props[index - 1];
                          } else if (i.length) {
                              var reg = /[^A-Za-z0-9-]/;
                              var v = i.split('=');
                              if (v.length === 2) {
                                  return {
                                      key: v[0].startsWith('-') ? 'arg' + v[0] : v[0],
                                      value: v[1],
                                      type: 'value'
                                  };
                              }
                              if (i.indexOf('...') === 0) return { key: i, type: 'spread' };
                              // if (i.startsWith('+') || i.startsWith('-'))
                              //     return {
                              //         key: i.substr(1),
                              //         value: i[0] === '+' ? true : false,
                              //         type: '10'
                              //     }
                              return {
                                  key: i.startsWith('-') ? 'arg' + i : i,
                                  value: i.startsWith('-') ? true : i,
                                  type: 'keyed'
                              };
                          } else {
                              return null;
                          }
                      });
                      b.props = c;
                  }

                  if (b && b.name && !b.error) {
                      (function () {

                          var tag = b.tag || '';
                          var name = b.name;
                          var key = b.key;
                          var attrs = b.props;
                          var props = {};

                          attrs.forEach(function (attr, i) {
                              if (attr) if (attr.key === ':' + key) delete b.props[i];else props[attr.key] = attr.type === 'static' ? '\'' + attr.value + '\'' : attr.value;
                          });

                          var parent = _this2.index[_this2.index.length - 1] ? _this2.index[_this2.index.length - 1] : 'root';
                          node = { i: i, tag: tag, name: name, key: key, attrs: attrs, props: props, parent: parent, start: { pos: pos, tok: tok } };
                          node.type = b.selfClosing ? 'self-closing' : 'normal';
                          node.box = b.box;
                          var nmatch = node.name.match(/([a-z-0-9.]+)/);
                          node.name = node.name && nmatch ? nmatch[1] : node.name;
                          node.camelName = _this2.toCamel(node.name);
                          node.comprop = b.comprop;
                          node.dotprop = b.dotprop;

                          //console.log('node', node)

                          if (_this2.text.length) {
                              var text = _this2.text.pop();
                              if (text) _this2.emit('text', _this2.string(text, pos));
                          }

                          _this2.node = node;

                          if (b.selfClosing) {
                              node.body = null;
                              _this2.text.push(pos + tag.length);
                              _this2.emit('self-closing', name, node);
                              _this2.emit('node', node);
                          } else {
                              _this2.index.push(node);
                              _this2.emit('open', name, node);
                              _this2.text.push(pos + tag.length);
                          }

                          i++;
                      })();
                  }
              });

              this.on('</', function (pos, tok) {

                  var start = _this2.index.pop();

                  if (start) {
                      var close = _this2.string(pos, pos + tok.length + start.name.length + 1);
                      if (close === '</' + start.name + '>') {
                          i--;
                          node = start;
                      } else {
                          node = null;
                          _this2.index.push(start);
                      }
                  }

                  if (node) {
                      node.body = _this2.string(node.start.pos + node.tag.length, pos);

                      if (node.box) {
                          //node.returning = 1
                          var retreg = /(.+return([^<\/>]+)<\/>)/gm;
                          var isret = retreg.exec(node.body + '</>');
                          if (isret) {
                              node.returning = isret[2].trim();
                          }
                      }

                      node.end = { pos: pos, tok: tok };
                      node.type = 'normal';
                      if (_this2.text.length) {
                          var text = _this2.text.pop();
                          if (text) _this2.emit('text', _this2.string(text, pos));
                      }
                      _this2.text.push(pos + tok.length + node.name.length + 1);
                      _this2.emit('close', node.name, node);
                      _this2.emit('node', node);
                  }
              });
          }
      }, {
          key: 'toCamel',
          value: function toCamel(subj, all) {
              if (subj && subj.indexOf('-') > -1) {
                  var parts = subj.split('-');
                  subj = parts.map(function (p, i) {
                      return !all && i === 0 ? p : p.substr(0, 1).toUpperCase() + p.substr(1);
                  }).join('');
              }
              return !all ? subj : subj.substr(0, 1).toUpperCase() + subj.substr(1);
          }
      }, {
          key: 'exprattr',
          value: function exprattr(str) {
              str = str.replace(/\n/g, ' ').replace(/\t/g, '').trim();
              var re = /((\w+\.)+)?(\w+)\s?(\([^)]+\))/gi; ///(\w+)\s?(\([^)]+\))([\s\/\>])/gi;
              var exprs = [];
              var result = str.replace(re, function (m, obj, iobj, type, expr, s) {
                  exprs.push({ type: type, expr: expr, obj: obj });
                  return '';
              });
              return { result: result, exprs: exprs };
          }
      }, {
          key: 'string',
          value: function string(a, b) {
              if (typeof a === 'string') {
                  this._string = a; //.replace(/\n/g, ' ').replace(/\t/g, '').trim()
                  this.result = this._string;
                  return this._string;
              }
              return this._string.slice(a, b);
          }
      }, {
          key: 'update',
          value: function update(payload, value) {
              var _this3 = this;

              var diff = {};

              if (value && typeof payload === 'string') {
                  var key = payload;
                  payload = {};
                  payload[key] = value;
              }
              if (payload && (typeof payload === 'undefined' ? 'undefined' : _typeof(payload)) === 'object') {
                  Object.keys(payload).map(function (k) {
                      if (_this3[k] !== payload[k]) {
                          diff[k] = {
                              old: _this3[k],
                              new: payload[k]
                          };
                          _this3[k] = payload[k];
                      }
                  });
              }

              this.emit('update', payload, diff);
          }
      }, {
          key: 'run',
          value: function run() {
              var _this4 = this;

              this.chars = [];
              this.index = [];
              this.attrs = [];
              this.props = {};
              this.nodes = [];
              this.text = [];
              this.tree = {};
              this.result = '';
              this.compiled = '';

              this.emit('run', this.token);

              var string = this.string(0);

              var _iteratorNormalCompletion = true;
              var _didIteratorError = false;
              var _iteratorError = undefined;

              try {
                  var _loop = function _loop() {
                      var char = _step.value;

                      var index = _this4.chars.push(char) - 2;

                      if (char !== '"' && char !== '`' && char !== '\'') {
                          Object.keys(_this4.token).forEach(function (token) {

                              var s = _this4.string(index).startsWith(token);

                              if (s === true) {
                                  _this4.emit(token, index, token);
                              }
                          });
                      }
                  };

                  for (var _iterator = string[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                      _loop();
                  }
              } catch (err) {
                  _didIteratorError = true;
                  _iteratorError = err;
              } finally {
                  try {
                      if (!_iteratorNormalCompletion && _iterator.return) {
                          _iterator.return();
                      }
                  } finally {
                      if (_didIteratorError) {
                          throw _iteratorError;
                      }
                  }
              }

              this.emit('done');
              return this.compiled;
          }
      }, {
          key: 'fromString',
          value: function fromString(content, fn) {
              this.fn = fn;
              this.source = content;
              //let a = content //.replace(/\s+/g, ' ') //.trim()
              //let eqreg = /(\s+)?(\=)(\s+)?/g
              //a = a.replace(eqreg, '=')
              this.string(content);
              this.emit('ready');
              return this.run();
          }
      }, {
          key: 'parse',
          value: function parse(content, options, fn) {
              nodes.clearMeta();
              nodes.boxes = [];
              this.fn = fn;
              this.options = options;
              //let eqreg = /(\s+)?(\=)(\s+)?/g
              //content = content.replace(eqreg, '=')
              this.source = content;
              this.string(content);
              this.emit('ready');
              this.run();
              //this.compiled = this.compiled.replace(/^\s*[\r\n]/gm, '')
              if (typeof fn === 'function') return fn.call(null, this.source, this.compiled);
              return beautify(this.compiled, {
                  indent_with_tabs: true,
                  indent_size: 4
              });
              //return this.compiled
          }
      }, {
          key: 'transform',
          value: function transform(code, opts) {
              return {
                  code: this.parse('<mod>' + code + '</mod>', opts),
                  node: this.node
              };
          }
      }, {
          key: 'write',
          value: function write(content) {
              if (typeof this.fn === 'function') this.fn.call(null, this.source, content);
          }
      }]);
      return Parser;
  }();

  function transform(source, options) {
      var result = new Parser().transform(source, options);
      return result.code.trim();
  }

  function translate(load) {
      return transform(load.source);
  }

  exports.translate = translate;
  exports['default'] = transform;

  Object.defineProperty(exports, '__esModule', { value: true });

}));