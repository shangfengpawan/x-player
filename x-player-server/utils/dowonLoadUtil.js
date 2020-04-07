/**
 * Created by lenovo on 2020/3/6.
 */
const http = require('http');
const https = require('https');
const fs = require('fs');

process.on('uncaughtException', (e) => {
    console.log('我能进来，说明可以处理异常');
    console.log(e);
});

function downloadFile(uri, dest, cb){
    // 确保dest路径存在
    var file = null;
    try{
         file = fs.createWriteStream(dest);
    }catch (err){
        console.log(err);
        cb(err);
        return ;
    }

    var httpUtil = http;
    if(uri.indexOf('https')!=-1){
        httpUtil = https;
    }


    var getReq = httpUtil.get(uri, (res)=> {
        try {
            if (res.statusCode !== 200) {
                cb(res.statusCode);
                return;
            }

            res.on('end', ()=> {
                console.log('download end');
            });


            // 进度、超时等

            file.on('finish', ()=> {
                console.log('finish write file')
                file.close();
                cb('success');
            }).on('error', (err)=> {
                console.log('err:' + err);
                fs.unlink(dest);
                if (cb) cb(err.message);
            })

            res.pipe(file);
        }catch (err){
            console.log('res err'+err);
            cb(err);
        }
    });

    getReq.on('error', function (err) {
        console.log('req err'+err)
        cb(err);
    })
    getReq.setTimeout(60000, function () {
        getReq.abort();
        console.log('req timeout');
        cb('timeOut');

    })

}

function main(){
    var url ='https://video.huishenghuo888888.com/putong/20200226/jc4kCkXW/index.m3u8';
    var dst = './download/index.m3u8';
    try{
        downloadFile(url,dst,function(param){
            console.log('cb:'+param)
        })
    }catch (err){
        console.log(err);
    }

}

main();