/**
 * 简单正向代理服务器
 * 通过127.0.0.1:1234访问
 */
const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
    let options = {
        hostname: 'www.baidu.com',
        port: 80,
        path: req.url,
        method: 'GET'
    };

    let req2 = http.request(options, (res2) => {
        res2.pipe(res, {
            end: true
        });
    });

    req.pipe(req2, {
        end: true
    });

});

server.listen(1234);