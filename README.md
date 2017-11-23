# express_proxy

基于express的简单反向代理服务器

## 使用

修改CONFIG对象

```javascript
const CONFIG = { 
    DEST_HOST :'http://10.142.97.66:8080', // ------>>> 需要代理的url 
    LOCAL_PORT : '8033' // ------->>> express 服务端口
};
```

启动

```
$ node server.js

```