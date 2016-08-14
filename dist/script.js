Array.prototype.map.call(document.querySelectorAll('script[type="bitbox"]'), function(source) {
	var code = bitbox.transform(source.textContent)
	var s = document.createElement('script')
	s.textContent = code
	document.body.appendChild(s)
})
