const http = require('http');
const assert = require('assert');

module.exports = function reveProxy(options) {
    console.log(options.servers);
    assert(Array.isArray(options.servers), 'servers must be a Array');
    assert(options.servers.length > 0, "servers must not be empty");

    const servers = options.servers.map(server => {
        const s = server.split(":");
        return { hostname: s[0], port: s[1] || "80" };
    });

    let index = 0;
    function getTarget() {
        const target = servers[index++];
        if (index >= servers.length) index = 0;

        return target;
    }

    return function proxy(req, res) {

        const target = getTarget();
        const info = {
            ...target,
            method: req.method,
            path: req.url,
            headers: req.headers
        };

        const msg = `${req.method} ${req.url} => ${target.hostname}:${target.port}`;
        console.log("[%s] 代理请求", msg);
        const req2 = http.request(info, res2 => {
            console.log("[%s] 响应: %s", msg, res2.statusCode);
            res.writeHead(res2.statusCode, res2.headers);
            res2.pipe(res);
        });

        req.pipe(req2);
    }


}

