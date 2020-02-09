/**
 * Created by lenovo on 2020/2/7.
 */

var request = require('request');

var httpGet =function (url,callBack){

    request(encodeURI(url),{}, function (error, res, body) {
        if(!error && res.statusCode == 200){
            callBack({code:0,data:body,msg:"请求成功"});
        }else{
            console.log(error)
            callBack({code:-1,msg:"请求失败"})
        }

    })
}

module.exports={
    httpGet:httpGet
}