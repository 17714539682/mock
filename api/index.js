var express = require('express');
var router = express.Router();
let Mock = require('mockjs');            
let Random = Mock.Random
let arr = Mock.mock({
      'records|100':[
          {
              'id': 99,                       //属性值自动加 1，初始值为2
              'phone|1':['13531544999'],        //在数组中随机找一个
              'picUrl':Mock.mock("@IMAGE('200x100', '#ffcc33', '#FFF', 'png', '!')"),
              'name|+1': ['刘德','李男'],               //从属性值 array 中顺序选取 1 个元素
               email:Mock.mock('@EMAIL()'),      //随机生成一个邮箱
              'num1|1-100':1,                   //1-100 中随机生成一个整数
              'name|2-2': true,                 //随机生成一个布尔值,值为 boolean 的概率是 min / (min + max)
              'regexp1': /[a-z][A-Z][0-9]/,     //根据正则规则随机生成
              'regexp3': /\d{5,10}/    
          }
      ],
})  

var svgCaptcha=require('svg-captcha');

router.get('/captcha',function(req,res) {

    var captcha = svgCaptcha.create();
    console.log(captcha);
    // req.session.captcha = captcha.text;
    // res.type('svg');//使用ejs等模板时如果报错
    res.type('html');
    res.status(200).send(captcha.data);
});

router.get('/', function(req, res) {
  console.log(req.query);
  
  res.send('Birds home page');
});

router.get('/userInfo', function(req, res) {
  res.json({
    code:'0',
    msg:'success',
    resultData:{
      id:111,
      name:'管理员',
      picUrl:Random.image('200x100', '#ffcc33', '#FFF', 'png', '9')
    }
  })
});

router.post('/about', function(req, res) {
    let start = req.body.pageNum*req.body.pageSize - req.body.pageSize;
    let end = req.body.pageNum*req.body.pageSize
    let result = arr.records;
    if(req.body.phone || req.body.email){
       result = arr.records.filter(item=>{
        return item.phone == req.body.phone || item.email == req.body.email
      })
    }
    res.json({
      code:'0',
      msg:'success',
      resultData:{
        records:result.slice(start,end),
        totalRecords:result.length,
        page:req.body.pageNum,
        pageSize:req.body.pageSize
      }
    })
});

router.post('/update', function(req, res) {
  if(req.body.id){
    arr.records.some((item,index)=>{
      if(item.id === req.body.id){
        Object.assign( arr.records[index],req.body)
      }
    })
  }else if(req.body.phone){
    arr.records.unshift(
      {
        'id|+1': 2,                       //属性值自动加 1，初始值为2
        'phone':req.body.phone,        //在数组中随机找一个
        'name|+1': [1,2,3],               //从属性值 array 中顺序选取 1 个元素
        email:req.body.email,      //随机生成一个邮箱
        'num1|1-100':1,                   //1-100 中随机生成一个整数
        'name|2-2': true,                 //随机生成一个布尔值,值为 boolean 的概率是 min / (min + max)
        'regexp1': /[a-z][A-Z][0-9]/,     //根据正则规则随机生成
        'regexp3': /\d{5,10}/    
      }
    )
  }
  res.json({
    code:'0',
    msg:'success',
  })
  
});

var mongoose = require('mongoose'); //引入对象
var TodoModel = mongoose.model('news');//引入模型

router.post('/create', function(req, res) {
  console.log('req.body', req.body);
  new TodoModel({ //实例化对象，新建数据
    id: 2,                       //属性值自动加 1，初始值为2
    phone:'13531544954',        //在数组中随机找一个
    picUrl:Mock.mock("@IMAGE('200x100', '#ffcc33', '#FFF', 'png', '!')"),
    name: '刘德',               //从属性值 array 中顺序选取 1 个元素
     email:Mock.mock('@EMAIL()'),      //随机生成一个邮箱
     updated: Date.now()
  }).save(function(err, todo, count) { //保存数据
      // console.log('内容', todo, '数量', count); //打印保存的数据
      res.json({
        code:'0',
        msg:'success'
      })
  });
});

router.get('/search', function(req, res, next) {
  TodoModel.
  find().
  sort('updated_at').
  exec(function(err, aa, count) {
    res.send(aa);
  });
});


module.exports = router;