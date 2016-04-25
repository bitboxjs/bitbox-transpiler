import dom 			from './dom'
import __source__ 	from './source'

import importNode 	from './nodes/import'
import exportNode 	from './nodes/export'
import scriptNode 	from './nodes/script'
import styleNode 	from './nodes/style'
import modNode 		from './nodes/mod'

const config = {
	h: 'bitbox.h',
	element: 'bitbox.element'
}

var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
  };

  function escapeHtml(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
      return entityMap[s];
    });
  }

let scope = 'box'
let index = []
let boxname = ''
const LINE_COMMENT = /^\s*\/\/.*$/gm;
const JS_COMMENT = /\/\*[^\x00]*?\*\//gm;
let meta = { }

let nodes = {
	clearMeta: () => {
		meta = { import: {}, export: {}, local: {} }
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

	import: (node) => importNode(node, meta.import),
	export: exportNode,
	//script: scriptNode,
	//mod: modNode,

	style(node) {
		node.props.scope = `{ name: "${node.parent.name}", key: ${node.parent.props.key} }`
		node.attrs.push({ key: 'text', type: 'keyed', value: 'text' })
		return this.tag(node)
	},

	script(node) {
		node.attrs.push({ key: 'text', type: 'keyed', value: 'text' })
		return this.tag(node)
	},

	styles: [],
	inits: [],
	convertprops,
	objectToArray(obj) {
	    return Object.keys(obj).map(function toItem(k) {
	        return obj[k];
	    });
	},


	selfClosing(node) {
		node.content = -1
		return this.tag(node)
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

	tag(node) {

		//console.log('tag-node: ' + node.name, node.body)
		this.lastNode = node
		let isnative = dom[node.name] === node.name ? true : false
		let mustreturn = false
		let outerexpr = ''
		let innerexpr = ''
		let innerexprclose = ''
		let outerexprclose = ''
		let isInlineThunk = false

		if (!node.object)
			node.object = {}

		node.object.attributes = [...node.attrs]
		if (node.attrs.length) {
			for(let ei in node.attrs) {
				let prop = node.attrs[ei]
				if (prop) {
					if (prop.rel && prop.rel === 'def') {

						node.jsname = toCamel(node.name)

						node.type = 'box'
						this.boxes.push(node)

						let args = prop.value.trim()
						args = args ? `${ args.substr(0, args.length - 1) })` : null
						node.args = args
						let newbox = [``,``]
						if (node.parent === 'root' || node.parent.name === 'mod') {
							//newbox = [`box.set(`, `)`]
						} else {
							newbox = [`${node.parent.name}.${ toCamel(node.name) } = `, ``]
							//newbox = [``, ``]
						}

						let _export = ``;
						let _boxset = ``;
						if (node.parent === 'root' || node.parent.name === 'mod') {
							//__source__(node);
							if (node.props.set || node.props.box) {
								_boxset = `\nbox(${toCamel(node.name)});`
								delete node.props.set
								delete node.props.box
							}
							if (node.props.export) {
								_export = `\nexport `
								if (node.props.default)
									_export = `${_export}default `
								delete node.props.export
								delete node.props.default
							}
						}

						const bits = this.bits.filter((value, index, self) => self.indexOf(value) === index).map(b => {
							return `${b[0]}: ${b[1]}`
						}).join(',')
						this.bits = []

						// box(${ toCamel(node.name) }, { ${bits} });
						outerexpr += `
						${_export}${newbox[0]} function ${ toCamel(node.name) }${ args } {`

							if (node.parent === 'root') {

								const loads = Object.keys(meta.local).map(load => `new bitbox(${node.jsname}$box, ${load})`)
								outerexpr += ``
								outerexpr += `${ this.inits.join('\n')}\n`
								outerexpr += `${ loads.join('\n')}\n`
								this.keys = {}
								this.inits = []
								outerexpr = outerexpr.replace(/this\$box/g, `${node.jsname}$box`)
								node.content = node.content.replace(/this\$box/g, `${node.jsname}$box`)
							}

						outerexprclose = outerexprclose + `}${newbox[1]}${_boxset}`
						delete node.props[prop.key]
					}

					switch(prop.key) {
						// case 'from':
						// 	node.props.from = `'${node.props.from.replace(/['"`]/g, '')}/${node.name}!box'`
						// 	meta.import[toCamel(node.name)] = node.props.from //.replace(/['"`]/g, '')
						// 	this.imports.push(`import { ${toCamel(node.name)} } from ${node.props.from}`)
						// 	delete node.props.from
						// break;
						case 'text':
							if (prop.value)
								node.content = `\`${node.body.replace(/\`/gm, '\\`')}\``
							delete node.props.text
						break;
						case 'snippet':
							node.props.snippet = `\`${node.body.replace(/\`/gm, '\\`')}\``
						break;
						case 'if':
							outerexpr += `if ${ prop.value } {`
							outerexprclose = `}`
							node.parent._if = true
							delete node.props.if
						break;
						case 'else':
							outerexpr += `else {`
							outerexprclose = `}`
							delete node.props.else
						break;
						case 'for':
							if (prop.rel === 'invoke') {
								innerexpr += `for ${ prop.value } {`
								innerexprclose = `}`
								delete node.props.for
							}
						break;
						case 'switch':
							innerexpr += `switch ${ prop.value } {`
							innerexprclose = `}`
							node._switch = true
							delete node.props.switch
						break;
					}

					if (prop.key.endsWith('.map')) {
						if (node.childrens > 1)
							throw(new Error(`Only one root element allowed for map, got ${node.childrens}\n${node.body}`))
						innerexpr += `${ prop.key }(${ prop.value } => `
						innerexprclose = `)`
						delete node.props[prop.key]
					}

					if (prop.rel === 'invoke') {

						if (node.props[prop.key]) {

							//console.log('-->', prop.key)

							node.invoke = `${ node.name }.${ prop.key }${ prop.value }`
							//console.log('node.invoke', node.props)
							const imet = prop.key === 'color' || prop.key === 'style'
								? `bitbox.${prop.key}`
								: prop.key
							node.props[prop.key] = `${toCamel(imet)}${ prop.value }`
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
			node.content = `return (${node.content})`
			//node.content = n.indexOf('$tree') === 0 ? n : `$tree.push(${ n });`
		}

		if (node.props.case) {
			let caseex = `case ${ node.props.case }:`
			node.props.key = `'case-${ node.props.case.replace(/['"`]/g, '') }'`
			if (node.props.case === true) {
				let keys = Object.keys(node.props)
				let caseval = keys[keys.indexOf('case') + 1]
				node.props.key = caseval
				delete node.props[caseval]
				if (caseval === 'default')
					caseex = `default:`
				else
					caseex = `case '${ caseval }':`
			}
			outerexpr = `${ caseex }`
			outerexprclose = `break;`
			delete node.props.case
		}

		if (node.props.default && node.parent.props.switch) {
			outerexpr = `default:`
			outerexprclose = `break;`
			delete node.props.default
		}

		let attrs = node.props ? `${ convertprops(node.props) }` : ``

		let bodyornode = ''
		let bodyornodeend = ''
		let name = node.name

		if (node.type !== 'box') {

			if (node.name === 'mod') {

				bodyornode = ``
				bodyornodeend = ``

			} else {

				name = `${ toCamel(node.name) }`

				if (node.content === -1) {
					node.content = ''

					if (node.invoke_zz) {
					} else {
						if (meta.local[name+'__s']) {
						} else {

							let __bind = '{}' //node.props.bind || node.props.bit || 'this'
							let key = name

							if (node.key) {
								node.props.module = `"${node.key}"`
								__bind = `${node.key}`
								this.bits.push([node.key, name])
							}

							let treectx = node.parent.parent === 'root' ? ['',''] : ['$tree.push(',');']

							let isnew = false
							if (node.props.new) {
								isnew = true
								delete node.props.new
							}

							if (node.props.return || node.parent.box) {
								treectx = [`return(`,`)`]
								delete node.props.return
							}


							let p = { ...node.props }
							attrs = p ? `${ convertprops(p) }` : ``
							const a = `{ ${ attrs } }`

							node.object.key = key
							node.object.props = `{${ attrs }}`

							const nn = (node.comprop || node.dotprop || name)
							const bxname = nn === 'element' ? `${config.element}` : nn

							node.parent.childrens = typeof node.parent.childrens !== 'undefined'
								? node.parent.childrens + 1
								: 1

							//isnative ||
							if (isnew)
								bodyornode = `${treectx[0]}${config.h}('${bxname}', ${a})${treectx[1]}`
							else
								bodyornode = `${treectx[0]}${bxname}(${a})${treectx[1]}`
						}
					}
					bodyornodeend = ``
				} else {
					if (meta.local[name+'__s']) {} else {

						let __bind = '{}' //node.props.bind || node.props.bit || 'this'
						let key = name
						if (node.key) {
							node.props.module = `"${node.key}"`
							__bind = `${node.key}`
							this.bits.push([node.key, name])
						}


						let treectx = (!node.parent.box && node.parent.parent !== 'root')
							? ['$tree.push(',');']
							: ['','']

						let isnew = false
						if (node.props.new) {
							isnew = true
							delete node.props.new
						}

						if (node.props.return || node.parent.box) {
							treectx = [`return(`,`)`]
							delete node.props.return
						}


						let p = { ...node.props }

						attrs = p ? `${ convertprops(p) }` : ``


						const nn = (node.comprop || node.dotprop || name)
						const bxname = nn === 'element' ? `${config.element}` : nn

						//const istree = node.content.trim().startsWith('$tree')
						const hasContent = node.content.trim().length

						const re = /^\$tree\.push\(([\s\S]*)\)\;$/gm

						const treeMatch = node.content.trim().match(re)

						const treewrap = node.childrens > 1 || node._if || node._switch
							? [`($tree => {`,`return $tree })([])`]
							: [``,``]

						const a = `{ ${attrs} }${hasContent ? ',' : ''}`

						node.parent.childrens = typeof node.parent.childrens !== 'undefined'
							? node.parent.childrens + 1
							: 1

						if (node.childrens === 1) {
							//node.content = node.content.trim().substr(11, node.content.length - 14)
							node.content = node.content.trim().replace(re, "$1")
						}

						if (isnew)
							bodyornode = `${treectx[0]}${config.h}('${bxname}', ${a}${treewrap[0]}`
						else
							bodyornode = `${treectx[0]}${bxname}(${a}${treewrap[0]}`

						bodyornodeend = `${treewrap[1]})${treectx[1]}`
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
				bodyornode = `/** return **/\n`
				bodyornodeend = ``
			} else {

					let p = {
						...node.parent.props,
						...node.props
					}
					delete p['export']
					delete p['default']
					delete p[node.parent.name]
					attrs = p ? `, {${ convertprops(p)} }` : ``
					name = `'${ node.name }'`
					const nargs = node.args.replace('(', '').replace(')', '').split(',')

					const en = node.props.register
						? typeof node.props.register === 'string' && node.props.register.indexOf('-') > -1
							? node.props.register
							: `'${node.name}-box'`
						: `'${node.name}'`


					if (node.childrens > 1)
						throw(new Error(`Box must have only one root element, got ${node.childrens}\n${node.body}`))

					bodyornode = ``
					bodyornodeend = ``

					__source__({
						js: `${outerexpr}${bodyornode}${innerexpr}${node.content}${innerexprclose}${bodyornodeend}${outerexprclose}`.trim(),
						source: `${node.tag}${node.body}</${node.name}>`,
						name: `${node.name}`
					})
			}
		}

		index[node.i] = typeof index[node.i] !== 'undefined' ? index[node.i] + 1 : 1

		let args = `` //keyvars.length ? `let { ${ keyvars.join(`, `) } } = props;` : ``
		let isbody = false

		let ret = `${ outerexpr }${ bodyornode }${ args }${ innerexpr }${ node.content }${ innerexprclose }${ bodyornodeend }${ outerexprclose }`

		return ret.trim(); //.replace(/\n\n/g, '\n')
	},

	isString(str) {
		let strreg = /['"`]([^'`"]+)["'`]/g
		return strreg.exec(str.trim())
	}

}

export default nodes;


function normalizeStyle(subject) {

	let pxkeys = ['width', 'height', 'left', 'top', 'right', 'bottom', 'padding-', 'margin-', 'font-size', 'border-radius']

	let result = subject.replace(/(\w+[-]?\w+)\s?[:]\s?([^,\[\{\}]+)?(\[([^\]]+)\])?/g, (_, key, value="", __, pos="") => {

		key = key.trim()
		if (value)
			value = value.trim()

		let sub = key.split('-')[0] + '-';
		let ispx = pxkeys.indexOf(sub)
		if (ispx < 0) ispx = pxkeys.indexOf(key)

		if (ispx > -1 && value[0] !== `"` && value[0] !== `'`)
			if (!value.length && pos.length) {
				value = pos.trim()
				value = value.split(',')
				value = value.map(x => {
					x = x.trim()
					if (x.endsWith('%'))
						return `(${ x.substr(0, x.length-1) }) + "% "`
					else
						return parseInt(x) >= 0 ? `(${ x }) + "px "` : `${ x }`
				}).join(' + ')
			} else if (value.endsWith('%')) {
				value = `(${ value.substr(0, value.length-1) }) + "%"`
			} else {
				value = parseInt(value) >= 0 ? `(${ value }) + "px"` : `${ value }`
			}
		else if (value.length && pos.length) value = value + __
		key = toCamel(key)
		if (parseInt(value) >= 0) value = `'${ value }'`
		//console.log('res > ', { key, value }, parseInt(value))
		return `${ key }: ${ value }`
	})
	//console.log('normalizeStyle >> result', result, '\n\n')
	return result

}
function convertprops(p, a = ': ', b = ', ') {
	let props = { ...p }
	let keys = Object.keys(props)
	let result = []
	let events = []

	let rest = []

	keys.forEach(key => {

		let value = props[key]

		if (key.indexOf('on-') === 0) {
			events.push(`${ key.replace('on-', '') }${ a }${ value === key ? toCamel(value) : value }`)
			delete props[key]
		} else if (key === 'on') {
			const v = value.substr(1, value.length - 2)
			if (v) {
				events.push(`${ v }`)
				delete props[key]
			} else {
				result.push(`on`)
			}

		} else if (key === 'class') {
			if (value.indexOf('[') === 0) {
				const parts = value.substr(1, value.length - 2).split(',')
				value = '{ ' + parts.map(p => p + ': true').join(', ') + ' }'
			}

			result.push(`${ key }${ a }${ value }`)
		} else if (key === 'style') {
			result.push(`${ key }${ a }${ value }`)
		} else if (key.indexOf('...') === 0) {
			result.push(`${ toCamel(key) }`)
		} else {
			if (key === value)
				result.push(`${toCamel(key)}`)
			else
				result.push(`${toCamel(key)}${ a }${ value }`)
		}
	})

	if (events.length)
		result.push(`on${ a } { ${ events.join(b) } }`)

	return result.join(b)

}

function toCamel(subj, all) {
	if (subj && subj.indexOf('-') > -1) {
		var parts = subj.split('-');
		subj = parts.map(function(p, i) { return !all && i === 0 ? p : p.substr( 0, 1 ).toUpperCase() + p.substr( 1 )}).join('')
	}
	return !all ? subj : subj.substr( 0, 1 ).toUpperCase() + subj.substr( 1 )
}
