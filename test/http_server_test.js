const http = require('http');
const proxy = require('../proxy');

// 测试服务器
function startExampleServer(port) {
	return new Promise((resolve, reject) => {
		const server = http.createServer(function (req, res) {

			let contents = '';
			req.setEncoding('utf-8');
			req.on("data", chunk => contents += chunk);
			req.on("end", () => {
				let jsonObj = JSON.parse(contents);
				console.log(jsonObj);
				console.log(`status: ${jsonObj.status} message: ${jsonObj.message}`);
				res.end(`${port}: ${req.method} ${req.url} ${contents}`.trim());
			});
		});
		server.listen(port, () => {
			console.log("服务器已启动: %s", port);
			resolve(server);
		});
		server.on("error", reject);
	});
}

// 代理服务器
function startProxyServer(port) {
	return new Promise((resolve, reject) => {
		const server = http.createServer(
			proxy({
				servers: ["127.0.0.1:3001", "127.0.0.1:3002", "127.0.0.1:3003"]
			})
		);
		server.listen(port, () => {
			console.log("反向代理服务器已启动: %s", port);
			resolve(server);
		});
		server.on("error", reject);
	});
}


(async function () {
	await startExampleServer(3001);
	await startExampleServer(3002);
	await startExampleServer(3003);
	await startProxyServer(3000);
})();