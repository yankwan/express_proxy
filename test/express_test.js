const proxy = require('../proxy');
const bodyParser = require('body-parser');
const express = require('express');

// 代理服务器
const app = express();

app.use(proxy({
    servers: ["127.0.0.1:3001", "127.0.0.1:3002"]
}));

app.set('port', "3000");
app.listen(app.get('port'), () => {
    console.log(`start test server on 127.0.0.1:${app.get('port')}`)
});


// 测试服务器
const app1 = express();
const app2 = express();

// server 1
app1.use(bodyParser.json())

app1.get("/hello", (req, res) => {
    res.end("this is get method");
})

app1.post("/hello", (req, res) => {
    console.log('request body is %j', req.body);
    res.end("this is post method");
})

app1.listen("3001", () => {
    console.log(`start server on 127.0.0.1:3001`)
});

// server 2
app2.use(bodyParser.json())

app2.get("/hello", (req, res) => {
    res.end("this is get method");
})

app2.post("/hello", (req, res) => {
    console.log('request body is %j', req.body);
    res.end("this is post method");
})

app2.listen("3002", () => {
    console.log(`start server on 127.0.0.1:3002`)
});

