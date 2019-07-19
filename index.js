let express = require('express');  
let app = express();                                     
var bodyParser = require('body-parser');    //post参数接收  
var morgan = require('morgan');             //日志模块
var fs = require('fs');                     //文件操作模块
require('./db');

morgan.token('requestParameters', function(req, res){
    if(req.method == 'GET'){
        return JSON.stringify(req.query) || ''
    }else if(req.method == 'POST'){
        return JSON.stringify(req.body) || ''
    }
});
morgan.format('live-api', ':date[iso] :method :url :status :requestParameters :response-time ms');

var FileStreamRotator = require('file-stream-rotator');
//设置日志文件目录
var logDirectory=__dirname+'/logs';
//确保日志文件目录存在 没有则创建
fs.existsSync(logDirectory)||fs.mkdirSync(logDirectory);
//创建一个写路由
var accessLogStream=FileStreamRotator.getStream({
    filename:logDirectory+'/accss-%DATE%.log',
    frequency:"custom",     //自定义日志周期
    verbose: false, 
    date_format: "YYYY-ww", //周
    size:'5m',              //最大文件大小
    max_logs:'30d'          //日志保留天数
})

app.use(morgan('live-api',{stream:accessLogStream}));

var apiRouter = require('./api/index.js');
app.use(bodyParser.urlencoded({ extended: false })); //post参数传递中间件
app.use('/mock', apiRouter);

app.listen('8090', () => {
    console.log('监听端口 8090')
})
