/**
 * 简单正向代理服务器
 * 通过127.0.0.1:1234访问
 */
const http = require('http');
const url = require('url');

const server = http.createServer((sreq, sres) => {
    let options = {
        hostname: 'www.baidu.com',
        port: 80,
        path: sreq.url,
        method: 'GET'
    };

    let proxy = http.request(options, (cres) => {
        cres.pipe(sres, {
            end: true
        });
    });

    sreq.pipe(proxy, {
        end: true
    });

});

server.listen(1234);