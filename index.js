const babel = require('@babel/core')
const t = require('@babel/types')
const idMap = Object.create(null)
const fs = require('fs')
let file = process.argv[2] || './bundle.js'

const ast = babel.transformFileSync(file, { ast: true }).ast
babel.traverse(ast, {
    StringLiteral(path) {
        let { key, node, computed } = path
        if (key == 'key' || key == 'property') {
            // a['b']
            mark(node)
        }
    },
    Identifier(path) {
        let { key, node, container } = path
        if (!container.computed && (key == 'key' || key == 'property')) {
            // a['b']
            mark(node)
        }
    },
    CallExpression(path) {
        let { key, node, computed } = path
        let { callee, arguments } = node
        if (t.isMemberExpression(callee)) {
            if (t.isIdentifier(callee.object, { name: 'Object' }) && t.isIdentifier(callee.property, { name: 'defineProperty' })) mark(arguments[1])
            if (t.isIdentifier(callee.property, { name: 'hasOwnProperty' })) mark(arguments[0])
        }
    }
})

let res = Object.values(idMap).sort((a, b) => {
    return b.count * b.name.length - a.count * a.name.length
})
fs.writeFileSync('./dist/result.json', JSON.stringify(res, null, 4))

function mark(node) {
    let name
    if (t.isStringLiteral(node)) name = node.value
    else if (t.isIdentifier(node)) name = node.name
    else return
    if (!name) return
    if (!idMap[name]) idMap[name] = { name, count: 0, types: [] }
    let data = idMap[name]
    data.count = data.count + 1
    let type = node.type
    if (!data.types.includes(type)) data.types.push(type)
    if (data.types.length > 1) data.sideEffects = true
}
