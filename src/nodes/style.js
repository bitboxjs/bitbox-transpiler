const CSS_SELECTOR = /(^|\}|\{)\s*([^\{\}]+)\s*[^\$](?=\{)/g
const CSS_COMMENT = /\/\*[^\x00]*?\*\//gm

export function parse(tag, style, type) {
	return style.replace(CSS_COMMENT, '').replace(CSS_SELECTOR, function(m, p1, p2) {
		return p1 + ' ' + p2.split(/\s*,\s*/g).map(function(sel) {
			var s = sel.trim().replace(/:box\s*/, '').trim()
			return `${ tag }${ s && s.indexOf(':') !== 0 && s.indexOf('.') !== 0 && s.indexOf('#') !== 0 ? ' > ' : '' }${ s } `
		}).join(',')
	}).trim()
}

export default function(node) {

	if (node.box === true)
		return this.tag(node)

	node.props.scope = `{ box: "${node.parent.name}", key: "${node.parent.key}" }`

	node.body = node.body.replace(/\s+/g, ' ').replace(/\\/g, '\\\\').trim()

	let p = { ...node.props }
	p = p ? `${ this.convertprops(p) }` : ``

	return `$tree.push(style({${ p }}, \`${ node.body }\`));`

}
