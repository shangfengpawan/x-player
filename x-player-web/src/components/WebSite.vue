<template>
    <div class="web-site">
        <mu-row v-show="!isPlay" style="position:fixed;z-index:666;top:0;width:100%;line-height:100%">
            <mu-col span="12">
                <mu-appbar style="width: 100%;" color="primary">
                    <mu-button icon slot="left" @click="leftBar.open = !leftBar.open">
                        <i class="material-icons" style="user-select: none;font-size:20px;">&#xe7f4;</i>
                    </mu-button>

                    <mu-select v-show="!showSearch" flat  label=" " v-model="currentSiteIdx" style="width:200px;height:48px;font-size:14px;" @change="changeSite">
                        <mu-option v-for="sit,index in siteList" :key="index" :label="sit.name" :value="index"></mu-option>
                    </mu-select>

                    <div  v-show="showSearch" style="font-size:14px;">
                        <input v-model="keyWord" @keyup.enter="searchClick" style="height:35px;width:200px;background-color: hsla(0,0%,100%,.15);border:none;color:#fff;"/>
                        <mu-button icon @click="searchClick()" style="height:56px;">
                            <i class="material-icons icon-search" style="user-select: none;font-size:20px !important;"></i>
                        </mu-button>
                    </div>

                    <mu-button v-show="!showSearch" icon slot="right" @click="showSearch = !showSearch">
                        <i class="material-icons icon-search" style="user-select: none;font-size:20px;"></i>
                    </mu-button>
                    <mu-button v-show="showSearch" icon slot="right" @click="showSearch = !showSearch">
                        <i class="material-icons icon-close" style="user-select: none;font-size:20px;"></i>
                    </mu-button>
                </mu-appbar>
            </mu-col>
        </mu-row>

        <mu-drawer :open.sync="leftBar.open" :docked="leftBar.docked" :right="leftBar.position === 'right'" width="150">
            <mu-list>
                <mu-list-item button  @click="changeClass('all')">
                    <mu-list-item-title><span v-show="'all' == currentClass" style="color:deeppink;font-size:14px;">全部</span><span v-show="'all' != currentClass" style="font-size:14px;">全部</span></mu-list-item-title>
                </mu-list-item>
                <mu-list-item button v-for="item,index in classList" :key="index" @click="changeClass(item.id)">
                    <mu-list-item-title><span v-show="item.id == currentClass" style="color:deeppink;font-size:14px;">{{item.name}}</span><span v-show="item.id != currentClass" style="font-size:14px;">{{item.name}}</span></mu-list-item-title>
                </mu-list-item>
            </mu-list>
        </mu-drawer>
        <mu-row v-show="!isPlay" style="margin-top:60px;background-color: #2e2e2e">
            <mu-col span="11" style="margin:0 auto;">
                <mu-grid-list cell-height.number="100">
                    <mu-grid-tile v-for="vd,index in videoList" :key="index" title-position="bottom" action-position="right" :rows="1" :cols="1" style="border:solid 1px #eee;background-color: #fff;margin-bottom:5px;">
                        <img :src="vd.detail.pic" />
                        <span slot="title" style="font-size:14px;">{{vd.name}}</span>
                        <span slot="subTitle" style="font-size:8px;">{{filterSubTitle(vd.last,vd.type)}}</b></span>
                        <mu-button slot="action" icon @click="playVideoClick(index)">
                            <i class="material-icons icon-play-circle" style="user-select: none;font-size:24px;color: #2196f3;"></i>
                        </mu-button>
                    </mu-grid-tile>
                </mu-grid-list>
            </mu-col>
        </mu-row>
        <mu-row v-show="!isPlay" style="margin-top:10px;margin-bottom:10px;">
            <mu-col span="12">
                <mu-flex justify-content="center">
                    <mu-pagination :total="recordCnt" :current.sync="page" :page-size.number="pageSize" page-count.number="5" @change="changePage()"></mu-pagination>
                </mu-flex>
            </mu-col>
        </mu-row>
        <mu-row v-if="isPlay" style="z-index:999;width:100%;height:100%;background-color: #fff;">
            <mu-col span="12">
                <mu-row>
                    <mu-col span="6" style="text-align:left;">
                        <mu-button slot="action" icon @click="addToMyList()">
                            <i class="material-icons icon-plus" style="user-select: none;font-size:24px;"></i>
                        </mu-button>
                    </mu-col>
                    <mu-col span="6" style="text-align:right;">
                        <mu-button slot="action" icon @click="playVideoBack()">
                            <i class="material-icons icon-rollback" style="user-select: none;font-size:24px;"></i>
                        </mu-button>
                    </mu-col>
                </mu-row>
                <mu-row>
                    <mu-col span="12" style="padding-bottom:10px;">
                        <videoComp :source="playVideo"></videoComp>
                    </mu-col>
                </mu-row>
            </mu-col>
        </mu-row>
        <div v-loading="loading" v-show="loading" data-mu-loading-overlay-color="rgba(0, 0, 0, .6)" style="position:absolute;width:100%;height:100%;top:60px;"></div>

    </div>
</template>


<script type="text/ecmascript-6">
    import apiUtils from "../utils/apiUtils";
    import videoComp from "./video";
    import isAbsoluteUrl from 'is-absolute-url';
    export default{
        components:{
            videoComp
        },
        data () {
            return {
                siteList:[
                    {
                      "id":1,
                      "name":"ok资源网",
                      "uri":"http://www.jisudhw.com",
                      "httpApi":"http://cj.okzy.tv/inc/ldg_seackm3u8.php",
                      "httpsApi":"https://cj.okzy.tv/inc/ldg_seackm3u8s.php",
                      "type":"影视",
                      "__index":0
                    }
                ],
                https:true,
                currentSiteIdx:0,
                currentSite:null,
                currentClass:'all',
                classList:[],
                videoList:[],
                isPlay:false,
                scrollT:0,
                playVideo:null,
                keyWord:'',
                showSearch:false,
                page:1,
                pageCnt:0,
                recordCnt:0,
                pageSize:30,
                leftBar:{
                    docked: false,
                    open: false,
                    position: 'left'
                },
                loading:true,
                timer: '',
                msg: '这个是Home模板页'
            }
        },
        methods:{
            getSiteList(){
                this.loading = true;
                apiUtils.getReq('sit/sit.json',null,(res)=>{
                    this.siteList = [];
                    if(typeof res.data == 'string'){
                        this.siteList = JSON.parse(res.data);
                    }else{
                        this.siteList = res.data;
                    }
                    this.currentSite = this.siteList[0];
                    //加载内容内容
                    this.getList();
//                    this.loading = false;
                })

            },
            getList(){
                var params = {pg:this.page};
                this.pageSize = 30;
                if(this.keyWord != ''){
                    params.wd = this.keyWord;
                }
                if(this.currentClass != 'all'){
                    params.t = this.currentClass;
                }


                this.loading = true;
                try{
                    apiUtils.getList(this.currentUri,params,  (res) => {
                        if(res.data.code == 0){
                            try{
                                this.parseSiteJson(res.data.data);
                            }
                            catch(err){
                                this.$nextTick(() => {
                                    this.loading = false;
                                })
                                this.$alert("解析出错", 'Alert')
                            }
                        }else{
                            this.$nextTick(() => {
                                this.loading = false;
                            })
                            this.$alert(res.data.msg, 'Alert')
                        }
                        this.scrollToTop();

                    })
                }catch(err){
                    this.$nextTick(() => {
                        this.loading = false;
                    })
                    this.$alert("获取失败", 'Alert')
                }

            },
            parseSiteJson(data){
                //分类
                this.classList = [];
                for(var i =0;i<data.rss.class[0].ty.length;i++){
                    var tmpClass = {
                        id:data.rss.class[0].ty[i].$.id,
                        name:data.rss.class[0].ty[i]._
                    }
                    this.classList.push(tmpClass)
                }

                //视频列表
                this.pageCnt = data.rss.list[0].$.pagecount - 0;
                this.recordCnt = data.rss.list[0].$.recordcount - 0;

                var idList = [];
                this.videoList = [];
                if(data.rss.list[0].video != undefined){
                    for(var i=0;i<data.rss.list[0].video.length;i++){
                        var tmpVideo = {
                            id:data.rss.list[0].video[i].id[0],
                            name:data.rss.list[0].video[i].name[0],
                            tid:data.rss.list[0].video[i].tid[0],
                            type:data.rss.list[0].video[i].type[0],
                            last:data.rss.list[0].video[i].last[0],
                            dt:data.rss.list[0].video[i].dt[0],
                            note:data.rss.list[0].video[i].note[0],
                            detail:{pic:'',dd:[],flag:''}
                        }
                        this.videoList.push(tmpVideo);
                        idList.push(tmpVideo.id);
                    }

                }
                if(idList.length >0){

                    apiUtils.getDetail(this.currentUri,{ids:idList.join(',')},(res)=>{
                        if(res.data.code == 0){
                            var videos = res.data.data.rss.list[0].video;
                            for(var i=0;i<videos.length;i++){
                                for(var j=0;j<this.videoList.length;j++){
                                    if(videos[i].id[0] == this.videoList[j].id){
                                        var ddIdx = 0;
                                        if(videos[i].dl[0].dd.length>1){
                                            var reg = /m3u8/gi;
                                            for(var k =0 ;k<videos[i].dl[0].dd.length;k++){
                                                if(reg.test(videos[i].dl[0].dd[k].$.flag)){
                                                    ddIdx = k;
                                                    break;
                                                }
                                            }
                                        }
//                                        console.log(ddIdx)
                                        var tmpDetail = {
                                            pic:videos[i].pic[0]==undefined?'':videos[i].pic[0],
                                            dd:this.getDD(videos[i].dl[0].dd[ddIdx]._),
                                            flag:videos[i].dl[0].dd[ddIdx].$.flag
                                        }
                                        this.videoList[j].detail = tmpDetail;
                                        break;
                                    }
                                }
                            }
                        }else{
                            this.$nextTick(() => {
                                this.loading = false;
                            })
                            this.$alert(res.data.msg, 'Alert')
                        }

                        this.$nextTick(() => {
                            this.loading = false;
                        })
                    })
                }else{
                    this.$nextTick(() => {
                        this.loading = false;
                    })
                }


            },
            getMyList(){
                this.classList = [];
                this.loading = true;
                var params = {pg:this.page};
                this.pageSize = 10000;
                if(this.keyWord != ''){
                    params.wd = this.keyWord;
                }
                try{
                    apiUtils.getReq("getMyList",params,  (res) => {
                        if(res.data.code == 0){
                            this.videoList = [];
                            if(typeof res.data.data == 'string'){
                                this.videoList = JSON.parse(res.data.data);
                            }else{
                                this.videoList = res.data.data;
                            }
                            this.recordCnt = this.videoList.length;
                        }else{
                            this.$nextTick(() => {
                                this.loading = false;
                            })
                            this.$alert(res.data.msg, 'Alert')
                        }
                        this.scrollToTop();
                        this.$nextTick(() => {
                            this.loading = false;
                        })

                    })
                }catch(err){
                    this.$nextTick(() => {
                        this.loading = false;
                    })
                    this.$alert("获取失败", 'Alert')
                }

            },
            keepAlive(){
                apiUtils.getReq('ping',null,(res)=>{

                })
            },
            getDD(ddStr){
                var ret = [];
                var tmpArr1 = ddStr.split('#');
                for(var i=0;i<tmpArr1.length;i++){
                    var tmpArr2 = tmpArr1[i].split('$');
                    if(tmpArr2.length == 3){
                        var tmpRet = {
                            name:tmpArr2[0],
                            url:tmpArr2[1],
                            type:tmpArr2[2]
                        }
                    }else{
                        var tmpUrl = '';
                        for(var j=0;j<tmpArr2.length;j++){
                            if(isAbsoluteUrl(tmpArr2[j])){
                                tmpUrl = tmpArr2[j];
                            }
                        }
                        var tmpRet = {
                            name:tmpArr2[0],
                            url:tmpUrl,
                            type:'无'
                        }
                    }

                    ret.push(tmpRet)
                }
                return ret;
            },
            scrollToTop(){
                var scrollT = document.body.scrollTop|| document.documentElement.scrollTop
                document.body.scrollTop = document.documentElement.scrollTop = 0;
            },
            filterSubTitle(last,type){
                return '['+type+']'+last.substr(0,10)
            },
            changeSite(id){
                this.page = 1;
                this.keyWord = '';
                this.currentClass = 'all'
                this.currentSite = this.siteList[id];
                if(this.currentSite.id == 'my-list'){
                    this.getMyList();
                }else{
                    this.getList();
                }

            },
            changeClass(id){
                this.page = 1;
                this.keyWord = '';
                this.currentClass = id;
                this.getList();
                this.leftBar.open = false;
            },
            changePage(){
                this.$nextTick(() => {
                    this.getList();
                })
            },
            searchClick(){
                this.page = 1;
                this.getList();
            },
            playVideoClick(idx){
                this.playVideo = this.videoList[idx];
                var scrollT = document.body.scrollTop|| document.documentElement.scrollTop;
                this.scrollT = scrollT;
                this.isPlay = true;
            },
            playVideoBack(){
                this.isPlay = false;
                this.$nextTick(() => {
                    document.body.scrollTop = document.documentElement.scrollTop = this.scrollT;
                })


            },
            addToMyList(){
                var tmpVideo ={
                    sitId:this.currentSite.id,
                    detail:this.playVideo.detail
                }
                var newVideo = Object.assign(tmpVideo, this.playVideo);

                apiUtils.postReq("addMyList",{newVideo:JSON.stringify(newVideo)}, (res)=> {
                    if(res.data.code == 0){
                        this.$alert("收藏成功", 'Alert')
                    }else{
                        this.$alert("收藏失败", 'Alert')
                    }
                })
            }
        },
        computed:{
            currentUri() {
                return this.https ? this.currentSite.httpsApi : this.currentSite.httpApi;
            },
        },
        mounted(){
            this.getSiteList();
            this.timer = setInterval(this.keepAlive, 60000);

        },
        beforeDestroy() {
            clearInterval(this.timer);
        }

    }
</script>
<style>
    .mu-pagination  .mu-pagination-item.mu-button{
        min-width:12px;
        padding:0 5px;
    }
</style>
