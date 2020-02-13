var express = require('express');
var router = express.Router();

var fs = require('fs'),
    path = require('path');

var httpUtil = require('../utils/httpUtil.js')
var xmlParse = require('../utils/xmlParse.js')

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.userName){
    res.render('index', { title: 'Express' });
  }else{
    res.redirect('/login');
  }
});
router.get('/login', function(req, res, next) {
  res.render('login',null);
});

router.get('/api', function(req, res, next) {
  var url = '';
  if(req.query.url){
    url = req.query.url;
  }
  if(url == ''){
    res.json({code:-1,msg:'参数异常'})
  }

  try{
    httpUtil.httpGet(decodeURIComponent(url), function (ret) {
      if(ret.code == 0){
        xmlParse.xmlParse(ret.data,{}, function (result) {
          res.json(result);
        })
      }else{
        res.json(ret)
      }

    })
  }catch(err){
    console.log(err)
    res.json({code:-1,msg:err})
  }


});

router.get('/ping', function(req, res, next) {
  res.json({code:0,msg:"success"})
});

router.get('/getMyList', function(req, res, next) {
  var data = fs.readFileSync(path.join(path.resolve(__dirname,'..'), 'public/sit/myList.json'),'utf-8')
  if(data==""){
    data = [];
  }
  res.json({code:0,data:data,msg:"success"})
});

router.post('/addMyList', function(req, res, next) {
  var newVideo = null;
  if(req.body.newVideo){
    newVideo = JSON.parse(req.body.newVideo);
  }
  try {
    var data = fs.readFileSync(path.join(path.resolve(__dirname, '..'), 'public/sit/myList.json'), 'utf-8')
    if (data == "") {
      data = [];
    }

    if(typeof data == 'string'){
      data = JSON.parse(data);
    }

    var ifExist = false;
    for (var i = 0; i < data.length; i++) {
      if (newVideo.id == data[i].id && newVideo.sitId == data[i].sitId) {
        ifExist = true;
        break;
      }
    }
    if (ifExist) {
      res.json({code: 0, data: null, msg: "success"})
    } else {
      data.push(newVideo);
      var _dst = path.join(path.resolve(__dirname, '..'), 'public/sit/myList.json');
      //创建文件
      fs.writeFile(_dst, JSON.stringify(data), 'utf8', function (err) {
        if (err) {
          res.json({code: -1, data: null, msg: "增加失败"})
        } else {
          res.json({code: 0, data: null, msg: "success"})
        }
      })
    }

  }catch(err){
    console.log(err)
    res.json({code: -1, data: null, msg: "增加失败"})
  }



})


module.exports = router;
