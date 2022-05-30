const zlib = require('zlib');
const fs = require('fs');
const path = require('path');
const filelist = []

const start = (url) => {
    const list = fs.readdirSync(url);
    for (const iterator of list) {
        if (iterator.startsWith('.') || iterator.endsWith('.gz')) {
            continue
        }
        if (iterator.includes('.js') || iterator.includes('.css')|| iterator.includes('.woff2')|| iterator.includes('.less')|| iterator.includes('.svg')) {
            filelist.push([path.resolve(url, iterator), `${path.resolve(url,iterator)}.gz`])
        } else {
            start(path.resolve(url, iterator))
        }
    }

}
start('./.next/static')

const gz = (config) => {
    console.log(config)
    const gzip = zlib.createGzip({

    });
    let inp = fs.createReadStream(config[0]);
    let out = fs.createWriteStream(config[1]);
    inp.pipe(gzip)
        .on('error', (e) => {
            // 处理错误
            console.log(e)
        })
        .pipe(out)
        .on('error', (e) => {
            // 处理错误
            console.log(e)
        });
}
let index = 0
const timmer = setInterval(() => {
    gz(filelist[index]);
    index++
    if (index >= filelist.length) {
        clearInterval(timmer)
    }
}, 500);
// const inp = fs.createReadStream('./static/icon/4.0.0/umd/icon.min.js');
// const out = fs.createWriteStream('./static/icon/4.0.0/umd/icon.min.js.gz');
// filelist.forEach((item,index)=>{
//     const inp = fs.createReadStream(item[0]);
//     const out = fs.createWriteStream(item[1]);
//     inp.pipe(gzip)
//         .on('error', () => {
//             // 处理错误
//         })
//         .pipe(out)
//         .on('error', () => {
//             // 处理错误
//         });

// })