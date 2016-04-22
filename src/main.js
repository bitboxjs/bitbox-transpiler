import parser from './parser'

export default function unbox(source, options) {
    /** hacks */
    source = source.replace(/(\()(<([a-z0-9-]+)(.*)=>([^\n</]+))(\))$/gm, "(<$3$4=>$5</$3>)")
    source = source.replace(/<([a-z0-9-]+)(.*)=>([^\n</]+)$/gm, "<$1$2=>$3</$1>")
    let result = new parser().transform(source, options)

    result.code = result.code
        .replace(/export(\w)/g, "export $1")
        .replace(/export\sdefault(\w)/g, "export default $1")
        .replace(/return(\w)/g, "return $1")
    //result.code = result.code.replace(/\;\)/g, '\)')
    // if (result.code.indexOf('$tree.push') === 0)
    //     result.code = result.code.substr(11, result.code.length - 13)
    return result.code;
}

export function translate(load) {
    return unbox(load.source)
}
