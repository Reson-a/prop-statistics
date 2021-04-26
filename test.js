const ccc = 'c'

const A = {
    a() { },
    bb() { },
    [ccc]: 3,

}

A['a']()
A.hasOwnProperty('bb')
