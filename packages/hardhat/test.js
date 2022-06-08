

const test = async function () {
    const {request} = require("undici");
    const method = "POST";
    const requestDetails = {
        method,
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        bodyTimeout: 300000,
        headersTimeout: 300000
    };
    let response;
    try {
        requestDetails.body = '';
        let url = 'https://api-rinkeby.etherscan.io/api';
        console.log('=====================', url, requestDetails, new Date())

        response = await request(url, requestDetails);

        console.log(response);

    } catch (e) {
        console.log(new Date(), e);

    }
}

test();


// let utils = depInj('utils');
let options ={
    url : 'https://api-rinkeby.etherscan.io',
    method:'POST',
    timeout:60000
};
console.log(new Date(), options);
let request = require('request');
request(options, function(err, res, data){
    console.log(new Date(), err, data);
});