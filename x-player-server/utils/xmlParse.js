/**
 * Created by lenovo on 2020/2/7.
 */
var xml2js = require('xml2js');

var xmlParse = function (xmlString, options,callBack) {
    const defaultOptions = {
        explicitArray: true,
    };
    const mergedOptions = Object.assign(defaultOptions, options);
    var parser = new xml2js.Parser(defaultOptions);

    var reg = /<script.*>([\s\S]*?)<\/script>/gi;
    xmlString = xmlString.replace(reg,'');

    parser.parseStringPromise(xmlString).then(function (result) {
            callBack({code:0,data:result,msg:'success'})
        })
        .catch(function (err) {
            callBack({code:-1,data:null,msg:'xml parse fail'})
        });
}

module.exports = {
    xmlParse:xmlParse
}