
## Prop Statistics

统计代码中属性使用情况，按照占用字节多少排序，并尝试找出部分内部的副作用

## 使用方法

node index XXX.js
``` [
    {
        "name": "hasOwnProperty",
        "count": 1,
        "types": [
            "Identifier"
        ]
    },
    {
        "name": "bb",
        "count": 2, // 出现次数
        "types": [
            "Identifier", // 类型
            "StringLiteral"
        ],
        "sideEffects": true // 是否有副作用
    },
    {
        "name": "a",
        "count": 2,
        "types": [
            "Identifier",
            "StringLiteral"
        ],
        "sideEffects": true
    }
]

对于占用大量字节，并且确保无副作用的属性，可以自定义 [terser mangle prop] (https://github.com/terser/terser#mangle-properties-options) 策略，对属性名进行压缩混淆，进一步节省代码体积
