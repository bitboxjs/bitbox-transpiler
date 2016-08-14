import bitbox from 'bitbox'
import editor from 'bitbox-codemirror'
import view from './index.box'

export default bitbox.app({
	client: {
		width: window.innerWidth,
		height: window.innerHeight
	}
})

bitbox.services({
	transpile(v) {
		return v
	}
})

bitbox.signals({
	resized: [
		function({ state }) {
			state.set('client', {
				width: window.innerWidth,
				height: window.innerHeight
			})
		}
	],
	set: [
		function({ state, services, input }) {
			state.select(input.path).set('value', input.value)
		}
	],
	transpile: [
		function({ state, services, input }) {
			try {
				const value = services.transpile(input.value)
				localStorage.setItem('@source', input.value)
				state.select(input.path).set('value', value)
			} catch(e) {
				console.log(e)
			}
		}
	]
})

bitbox.modules({
	//devtools: devtools(),
	source: editor({
		value: localStorage.getItem('@source') || `const hi = (name) => <h1>name</h1>`
	}),
	output: editor({
		value: ``
	})
})

bitbox(view)

window.onresize = () => bitbox.signals('resized')()
/** */
