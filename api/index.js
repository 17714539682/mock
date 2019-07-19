var express = require('express');
var router = express.Router();
let Mock = require('mockjs');            
let Random = Mock.Random

//mock数据
let arr = Mock.mock({
      'records|100':[
          {
              'id': 99,                          //属性值自动加 1，初始值为2
              'phone|1':['13531544999'],         //在数组中随机找一个
              'picUrl':Random.image('200x100', '#ffcc33', '#FFF', 'png', '!'),
              'regexp1': /[a-z][A-Z][0-9]/,      //根据正则规则随机生成
              'name|+1': ['刘德','李男'],         //从属性值 array 中顺序选取 1 个元素
              'email':Mock.mock('@EMAIL()'),     //随机生成一个邮箱
              'num1|1-100':1,                    //1-100 中随机生成一个整数
              'name|2-2': true,                  //随机生成一个布尔值,值为 boolean 的概率是 min / (min + max)
          }
      ],
})  

//验证码接口
var svgCaptcha=require('svg-captcha');
router.get('/captcha',function(req,res) {
    var captcha = svgCaptcha.create();
    // req.session.captcha = captcha.text;
    // res.type('svg');//使用ejs等模板时如果报错
    res.type('html');
    res.status(200).send(captcha.data);
});

//get请求
router.get('/', function(req, res) {
  console.log(req.query);
  res.send('Birds home page');
});

//post请求
router.post('/about', function(req, res) {
    console.log(req.body);
    res.json({
      code:'0',
      msg:'success',
      resultData:arr
    })
});

module.exports = router