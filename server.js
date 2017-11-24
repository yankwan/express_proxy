const express = require('express');
const request = require('superagent');
const timeout = require('connect-timeout');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

/**
 * DEST_HOST: 代理的目标地址
 * LOCAL_PORT: 本机启动端口
 */
const CONFIG = { 
    DEST_HOST :'http://orderportal.ctg.com:8011', 
    LOCAL_PORT : '8033' 
};

const TIME_OUT = 30 * 1000; // milliseconds

// post content type:"applictaion/json" with Postman
app.use(bodyParser.json());

// 超时处理
app.use(timeout(TIME_OUT));
app.use((req, res, next) => {
    if (!req.timedout) next();
})


// 反向代理
app.use('/*', (req, res) => {
    let content;
    console.log('-------->>> req.body', req.body);
    const method = req.method.toLowerCase();
    // request.post('xxxxx') or request.get('xxxxx')
    // 进行转发
    const originalReq = request[method](CONFIG.DEST_HOST + req.originalUrl);
    //如果为 post 或者 put 则需要发送时传递body
    if (method === 'post' || method === 'put') {
        originalReq.set('Accept', 'application/json')
                   .send(req.body)

    }

    originalReq.pipe(res);
    originalReq.on('end', (error, result) => {
        if (error) {
            console.log(error);
            return;
        }
    });
});

app.set('port', CONFIG.LOCAL_PORT);

app.listen(app.get('port'), () => {
    console.log(`start server on 127.0.0.1:${app.get('port')}`)
});