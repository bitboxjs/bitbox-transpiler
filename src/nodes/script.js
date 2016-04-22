// export default function(node) {
// 	return `${ node.body }`
// }

export default function(node) {
	if (node.box === true)
		return this.tag(node)
	let p = { ...node.props }
	p = p ? `${ this.convertprops(p) }` : ``
	return `$tree.push(script({${ p }}, \`${ node.body }\`));`

}
