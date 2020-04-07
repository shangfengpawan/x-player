var express = require('express');
var router = express.Router();
var userConf = require('../base/userConf.js')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('');
});

router.post('/login', function(req, res, next) {
  var userName = '';
  var userPass = ''
  if(req.body.userName){
    userName = req.body.userName
  }
  if(req.body.userPass){
    userPass = req.body.userPass
  }
//console.log(userName,userPass,userConf.user,userConf.password)
  var isSuccess = false;
  for(var i=0;i<userConf.length;i++){
    if(userName === userConf[i].user && userPass === userConf[i].password){
      isSuccess = true;
      break;
    }
  }
  if(isSuccess){
    req.session.userName = userName;
    res.json({code:0,msg:'success'})
  }else{
    res.json({code:-1,msg:'fail'})
  }

});

module.exports = router;
