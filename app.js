import bitbox from 'bitbox'
import editor from 'bitbox-codemirror'
//import devtools from 'bitbox/devtools'

const app = bitbox.app({
	client: {
		width: window.innerWidth,
		height: window.innerHeight
	}
})

app.addServices({
	transpile(v) { return v }
})

app.addSignals({
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

app.addModules({
	//devtools: devtools(),
	source: editor({
		value: localStorage.getItem('@source') || `const hi = (name) => <h1>name</h1>`
	}),
	output: editor({
		value: ``
	})
})

window.onresize = () => app.getSignals('resized')()

export default app;
