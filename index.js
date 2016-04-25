import bitbox from 'bitbox'
import transpile from 'app'
import app from './app.js'

app.addServices({
	transpile
})

export const __unload = () => {
	console.clear()
}

export const __reload = () => {
	app.getSignals('transpile')({
		path: ['output'],
		value: app.get('source').value
	})
}

__reload()
