bitbox = 'default' in bitbox ? bitbox['default'] : bitbox;

Array.prototype.map.call(document.querySelectorAll('script[type="bitbox"]'), function(source) {
	var code = bitbox_transpiler.default(source.textContent)
	var s = document.createElement('script')
	s.textContent = code
	document.body.appendChild(s)
})
