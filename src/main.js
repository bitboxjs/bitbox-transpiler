import parser from './parser'

function transform(source, options) {
    let result = new parser().transform(source, options)
    return result.code.trim()
}

export function translate(load) {
    return transform(load.source)
}

export default transform
