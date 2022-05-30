// const libs = [
//     'react-component',
//     // 'constant',
//     // 'react-context',
//     // 'react-hook',
//     // 'service',
//     // 'util',
//     // 'react-util',
// ]
// const fs = require('fs')
// const path = require('path')
// const sass = require('sass')
// const mkdir = (str) => {
//     let diver = '/'
//     if (str.includes('\\')) {
//         diver = '\\'
//     }
//     const _str = str.replace(__dirname, '')
//     const arr = _str.split(diver)
//     if (arr[arr.length - 1].includes('.')) {
//         arr.pop()
//     }
//     const list = []
//     for (let index = 0; index < arr.length; index++) {
//         const element = arr[index];
//         if (element) {
//             const last = list.length == 0 ? '' : `${list[list.length-1]}/`
//             list.push(`${last}${element}`)
//         }
//
//     }
//     for (const iterator of list) {
//         try {
//             fs.mkdirSync(iterator)
//         } catch (error) {
//
//         }
//
//     }
// }
// const getChildrenDir = (url) => {
//     return fs.readdirSync(url)
// }
// const copy = async (url) => {
//     if (url.endsWith('index.scss')) {
//         mkdir(url.replace('\\src\\', '\\es\\').replace('/src/', '/es/'))
//         mkdir(url.replace('\\src\\', '\\lib\\').replace('/src/', '/lib/'))
//         const cjsStyleUrl = url.replace('\\src\\', '\\lib\\').replace('/src/', '/lib/').replace('.scss', '.css')
//         const esStyleUrl = url.replace('\\src\\', '\\es\\').replace('/src/', '/es/').replace('.scss', '.css')
//         //         fs.writeFileSync(path.join(styleUrl,'css.js'),`import '../../style/index.css';
//         // import './index.css';`)
//         try {
//             const e = await sass.compileAsync(url)
//             fs.writeFileSync(cjsStyleUrl, e.css)
//             fs.writeFileSync(esStyleUrl, e.css)
//         } catch (error) {
//
//         }
//
//     }
// }
// for (const lib of libs) {
//     const dirs = getChildrenDir(path.join(lib, 'src'));
//
//     for (const dir of dirs) {
//         const dirUrl = path.join(lib, 'src', dir, 'style', 'index.scss')
//         copy(dirUrl)
//
//     }
// }
