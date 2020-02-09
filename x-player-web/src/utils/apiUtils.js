/**
 * Created by lenovo on 2020/2/6.
 */
import axios from 'axios';
var serverPath = "http://localhost:8081";
//var serverPath = "http://tellstorys.cn:8081";

var getList = function (api, query,callBack) {
    const defaultParams = {
        ac: 'list',
    };
    const params = Object.assign(defaultParams, query);

    var tmpUrl = api + "?ac="+params.ac;
    if(params.t != undefined){
        tmpUrl += '&t='+params.t;
    }
    if(params.pg != undefined) {
        tmpUrl += '&pg='+params.pg;
    }

    if(params.wd != undefined) {
        tmpUrl += '&wd='+params.wd;
    }

    axios.get(serverPath+"/api?url="+encodeURIComponent(tmpUrl)).then((res)=>{
        callBack(res);
    })

}

var getDetail = function(api,query,callBack){
    const defaultParams = {
        ac: 'videolist',
    };
    const params = Object.assign(defaultParams, query);
    var tmpUrl = api + "?ac="+params.ac;
    if(params.ids != undefined){
        tmpUrl += '&ids='+params.ids;
    }
    axios.get(serverPath+"/api?url="+encodeURIComponent(tmpUrl)).then((res)=>{
        callBack(res);
    })
}

var getReq = function (api, query, callBack) {
    var tmpUrl = serverPath + "/"+api;
    axios.get(tmpUrl, {query,}).then((res)=>{
        callBack(res);
    })
}

export default {
    getList:getList,
    getDetail:getDetail,
    getReq
}
