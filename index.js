let express = require('express');                 //引入express
var bodyParser = require('body-parser');
let app = express();                              //实例化express
var morgan = require('morgan');
var fs = require('fs');//文件模块
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
frequency:'daily',
verbose:false
})

app.use(morgan('live-api',{stream:accessLogStream}));

// app.use(logger('hcsy',{stream:accessLogStream}));//将日志写入文件
// app.use(logger('dev'));
var birds = require('./api/index.js');
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/mock', birds);

app.listen('8090', () => {
    console.log('监听端口 8090')
})
