import app from 'app'
import demo from './test.box'

console.log('demo', demo)

export const __reload = (m) => console.log('reload', m)
export const __unload = () => console.clear()

window.unbox = app



// var source = document.querySelector('script[type="bitbox"]').textContent;
// var code = unbox(source)
//
// var s = document.createElement('script')
// s.textContent = code
//
// document.body.appendChild(s)
//
// console.log(s)
