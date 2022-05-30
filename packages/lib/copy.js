const libs = [
    'react-component',
    'constant',
    'react-context',
    'react-hook',
    'service',
    'util',
]
const fs = require('fs')
const path = require('path')
const mkdir = (str) => {
    let diver = '/'
    if (str.includes('\\')) {
        diver = '\\'
    }
    const _str = str.replace(__dirname, '')
    const arr = _str.split(diver)
    if (arr[arr.length - 1].includes('.')) {
        arr.pop()
    }
    const list = []
    for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        if (element) {
            const last = list.length == 0 ? '' : `${list[list.length-1]}/`
            list.push(`${last}${element}`)
        }

    }
    for (const iterator of list) {
        try {
            fs.mkdirSync(iterator)
        } catch (error) {

        }

    }
}
const getChildrenDir = (url) => {
    return fs.readdirSync(url)
}
const copy = (url) => {
    const stat = fs.statSync(url)
    if (stat.isDirectory()) {
        const children = getChildrenDir(url)
        for (const child of children) {
            copy(path.join(url, child))
        }
    } else {
        if (url.endsWith('.scss') || url.endsWith('.d.ts')) {

            mkdir(url.replace('\\src\\', '\\es\\').replace('/src/', '/es/'))
            mkdir(url.replace('\\src\\', '\\lib\\').replace('/src/', '/lib/'))
            fs.copyFileSync(url, url.replace('\\src\\', '\\es\\').replace('/src/', '/es/'))
            fs.copyFileSync(url, url.replace('\\src\\', '\\lib\\').replace('/src/', '/lib/'))

        }

    }
}
for (const lib of libs) {
    const dirs = getChildrenDir(path.join(lib, 'src'));
    for (const dir of dirs) {
        const dirUrl = path.join(lib, 'src', dir)
        copy(dirUrl)

    }
}
