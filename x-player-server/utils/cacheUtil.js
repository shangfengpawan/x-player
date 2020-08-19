/**
 * Created by lenovo on 2020/2/28.
 */
var fs = require('fs'),
    path = require('path');
var stat = fs.stat;
var request = require("request");
const http = require('http');
const https = require('https');
var readline = require('readline');
var currUserName = '';
var myQueue = [];
var currDownLoad = null;
var downLoadTimes = 0;
var isRun = false;
var currVideoInfo = null;
var currCacheInfo = null;
var startCache = function (cacheInfo,userName) {
    currUserName = userName;
    myQueue = [];
    currDownLoad = null;
    downLoadTimes = 0;
    isRun = false;
    currVideoInfo = null;
    currCacheInfo = null;

    console.log('startCache')
    var videoInfo = getVideoInfo(cacheInfo,userName);
    console.log(videoInfo)
    if(videoInfo.detail.cache == undefined){
        videoInfo.detail.cache = []
    }

    var cacheVideo = {
        name:videoInfo.detail.dd[cacheInfo.ddIdx].name,
        url:videoInfo.sitId+"/"+videoInfo.id+"/"+cacheInfo.ddIdx+"/index.m3u8",
        oldUrl:videoInfo.detail.dd[cacheInfo.ddIdx].url,
        type:videoInfo.detail.dd[cacheInfo.ddIdx].type,
        downLoaded:0,  //已下载数量
        total:0        //总数量
    }
    var isCache = false;
    for(var i=0;i<videoInfo.detail.cache.length;i++){
        if(videoInfo.detail.dd[cacheInfo.ddIdx].name == videoInfo.detail.cache[i].name){
            isCache = true;
            cacheVideo = videoInfo.detail.cache[i];
            break;
        }
    }
    //if(isCache){
    //    console.log(JSON.stringify(videoInfo),cacheInfo.ddIdx,'is cache');
    //    return 0;
    //}

    cacheVideo.total = 0;
    cacheVideo.downLoaded = 0;
    if(!isCache){
        videoInfo.detail.cache.push(cacheVideo);
        saveVideoInfo(videoInfo,cacheVideo,userName);
    }

    currVideoInfo = videoInfo;
    currCacheInfo = cacheVideo;

    downloadVideo(videoInfo,cacheVideo,cacheInfo.ddIdx,userName)

}
var getVideoInfo = function (cacheInfo,userName) {
    var data = fs.readFileSync(path.join(path.resolve(__dirname, '..'), 'public/sit/myList_'+userName+'.json'), 'utf-8')
    if (data == "") {
        data = [];
    }

    if(typeof data == 'string'){
        data = JSON.parse(data);
    }

    var videoInfo = null;
    for (var i = 0; i < data.length; i++) {
        if (cacheInfo.id == data[i].id && cacheInfo.sitId == data[i].sitId) {
            videoInfo = data[i];
            break;
        }
    }
    return videoInfo;
}
var saveVideoInfo = function(videoInfo,cacheVideo,userName){
    var data = fs.readFileSync(path.join(path.resolve(__dirname, '..'), 'public/sit/myList_'+userName+'.json'), 'utf-8')
    if (data == "") {
        console.log('读取文件为空')
        return 0;
    }

    for(var i=0;i<videoInfo.detail.cache.length;i++){
        if(cacheVideo.name == videoInfo.detail.cache[i].name){
            videoInfo.detail.cache[i] = cacheVideo
        }
    }

    if(typeof data == 'string'){
        data = JSON.parse(data);
    }

    for (var i = 0; i < data.length; i++) {
        if (videoInfo.id == data[i].id && videoInfo.sitId == data[i].sitId) {
            data[i] = videoInfo;
            break;
        }
    }

    fs.writeFile(path.join(path.resolve(__dirname, '..'), 'public/sit/myList_'+userName+'.json'), JSON.stringify(data), 'utf8', function (err) {
        if (err) {
            console.log('写文件失败')
        } else {
            console.log('写文件成功')
        }
    })
}

var downloadVideo = function (videoInfo, cacheVideo,ddIdx,userName) {
    var dst = path.join(path.resolve(__dirname, '..'), 'public/cache/'+videoInfo.sitId+"/"+videoInfo.id+"/"+ddIdx)
    //创建目录
    fs.exists( dst, function( exists ){
        // 不存在
        if( !exists ){
            fs.mkdirSync( dst,{ recursive: true });
        }

        var offSet = cacheVideo.oldUrl.lastIndexOf('/');
        var baseUrl = cacheVideo.oldUrl.substr(0,offSet);
        var fileName = cacheVideo.oldUrl.substr(offSet+1,cacheVideo.oldUrl.length-1);
        try{
            downloadFile(baseUrl,fileName,videoInfo.sitId+"/"+videoInfo.id+"/"+ddIdx,cacheVideo.url, function (res) {
                if(res == -1 || res == -2){
                    console.log('下载失败')
                    delFile(path.join(path.resolve(__dirname,'..','public/cache/'+cacheVideo.url)))

                }else{
                    console.log("下载完毕");
                    parseM3u8(baseUrl,cacheVideo.url,videoInfo.sitId+"/"+videoInfo.id+"/"+ddIdx)
                }
            })
        }catch(err) {
            console.log(err);
            //for(var i=0;i<videoInfo.detail.cache.length;i++){
            //    if(cacheVideo.name == videoInfo.detail.cache[i].name){
            //        videoInfo.detail.cache[i].state = -1
            //    }
            //}
            //saveVideoInfo(videoInfo,userName);

        }


    });

}

var downloadFile = function (baseUrl, filePath, targetPath,targetFile,callBack) {
    console.log('开始下载:'+filePath)
    var dst = path.join(path.resolve(__dirname, '..'), 'public/cache/'+targetPath)
    fs.exists( dst, function( exists ) {
        // 不存在
        if (!exists) {
            fs.mkdirSync(dst, {recursive: true});
        }
        fs.exists(path.join(path.resolve(__dirname, '..', 'public/cache/' + targetFile)), function (isExists) {
            if(isExists){
                console.log(filePath+'已存在')
                callBack(0);
                return 0;
            }
            fs.writeFileSync(path.join(path.resolve(__dirname, '..', 'public/cache/' + targetFile)), '', 'utf8');
            var file = fs.createWriteStream(path.join(path.resolve(__dirname, '..', 'public/cache/' + targetFile)))

            console.log(baseUrl, filePath)
            //try{
            //    request(baseUrl + "/" + filePath).pipe(file).on("close", function (err) {
            //        file.close();
            //        if (err) {
            //            callBack(-1)
            //        } else {
            //            callBack(0)
            //
            //        }
            //    }).on('error', function (err) {
            //        console.log('下载失败',err);
            //    });
            //}catch (err){
            //    console.log('下载失败',err);
            //}

            var httpUtil = http;
            if(baseUrl.indexOf('https')!=-1){
                httpUtil = https;
            }

            var getReq = httpUtil.get(baseUrl + "/" + filePath, (res)=> {
                try {
                    if (res.statusCode !== 200) {
                        callBack(-1);
                        return;
                    }

                    res.on('end', ()=> {
                        console.log('download end');
                    });


                    // 进度、超时等

                    file.on('finish', ()=> {
                        console.log('finish write file')
                        file.close();
                        callBack(0);
                    }).on('error', (err)=> {
                        console.log('err:' + err);
                        fs.unlink(path.join(path.resolve(__dirname, '..', 'public/cache/' + targetFile)));
                        if (callBack) callBack(-1);
                    })

                    res.pipe(file);
                }catch (err){
                    console.log('res err'+err);
                    callBack(-1);
                }
            });

            getReq.on('error', function (err) {
                console.log('req err'+err)
                callBack(-1);
                return;
            })
            getReq.setTimeout(60000, function () {
                getReq.destroy();
                console.log('req timeout');
                callBack(-2);
                return;
            })
        })


    })
}

var delFile = function (url) {
    fs.unlinkSync(url)
};

var parseM3u8 = function (baseUrl,targetFile,targetPath) {
    var extname = path.extname(targetFile);
    if(extname == '.m3u8'){
        var fileList = [];
        var fileInput = fs.createReadStream(path.join(path.resolve(__dirname,'..','public/cache/'+targetFile)));
        var rl = readline.createInterface({
            input: fileInput
        });
        rl.on('line', (line) => {
            if(line.indexOf('.m3u8') != -1){
                fileList.push(line);
            }
            if(line.indexOf('.ts') != -1){
                fileList.push(line);
            }
            if(line.indexOf('EXT-X-KEY') != -1){
                var tmp = line.split('URI=');
                console.log('key',tmp);
                if(tmp.length == 2){
                    var keyFile = tmp[1].replace(/"/g,'');
                    fileList.push(keyFile);
                }
            }
        });

        rl.on('close', () => {
            console.log("读取完毕！",JSON.stringify(fileList));
            currCacheInfo.total += fileList.length;
            saveVideoInfo(currVideoInfo,currCacheInfo,currUserName);

            for(var i=0;i<fileList.length;i++){
                var tmpExt = path.extname(fileList[i]);
                var newPath ='';
                var fileName = ''
                if(tmpExt == '.m3u8'){
                    var offset = fileList[i].lastIndexOf('/');
                    if(offset != -1){
                        newPath = fileList[i].substr(0,offset);
                        fileName = fileList[i].substr(offset+1,fileList[i].length-1);
                    }else{
                        fileName = fileList[i];
                    }

                }else{
                    fileName = fileList[i];
                }

                var tmpDownLoadFile={
                    baseUrl:baseUrl+'/'+newPath,
                    fileName:fileName,
                    targetPath:targetPath+'/'+newPath,
                    targetFile:targetPath+'/'+newPath+'/'+fileName
                }
                myQueue.push(tmpDownLoadFile);
            }
            if(!isRun && myQueue.length>0){
                currDownLoad = myQueue.shift();
                isRun = true;
                downloadFile(currDownLoad.baseUrl,currDownLoad.fileName,currDownLoad.targetPath,currDownLoad.targetFile, downLoadFileCallBack)
            }

        });

    }
}

var downLoadFileCallBack = function (res) {
    isRun = false;
    if(res == 0){
        console.log(currDownLoad.fileName,'下载成功');
        currCacheInfo.downLoaded += 1;
        saveVideoInfo(currVideoInfo,currCacheInfo,currUserName);
        parseM3u8(currDownLoad.baseUrl,currDownLoad.targetFile,currDownLoad.targetPath)
        if(myQueue.length>0){
            downLoadTimes = 0;
            currDownLoad = myQueue.shift();
            downloadFile(currDownLoad.baseUrl,currDownLoad.fileName,currDownLoad.targetPath,currDownLoad.targetFile, downLoadFileCallBack)
        }

    }else if(res == -2){
        if(downLoadTimes >=3){
            console.log(currDownLoad.fileName,'下载超时')
            delFile(path.join(path.resolve(__dirname,'..','public/cache/'+currDownLoad.targetPath)))
        }else{
            downLoadTimes++;
            console.log('retry '+downLoadTimes)
            downloadFile(currDownLoad.baseUrl,currDownLoad.fileName,currDownLoad.targetPath,currDownLoad.targetFile, downLoadFileCallBack)
        }

    }else {
        if(downLoadTimes >=3){
            console.log(currDownLoad.fileName,'下载失败')
            delFile(path.join(path.resolve(__dirname,'..','public/cache/'+currDownLoad.targetPath)))
        }else{
            downLoadTimes++;
            console.log('retry '+downLoadTimes)
            downloadFile(currDownLoad.baseUrl,currDownLoad.fileName,currDownLoad.targetPath,currDownLoad.targetFile, downLoadFileCallBack)
        }
    }
}

module.exports ={
    startCache:startCache,
}
