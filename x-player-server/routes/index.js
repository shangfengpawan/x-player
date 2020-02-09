var express = require('express');
var router = express.Router();

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

module.exports = router;
