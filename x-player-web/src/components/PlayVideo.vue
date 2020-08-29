<template>
    <mu-row  style="z-index:999;width:100%;height:100%;background-color: #fff;">
        <mu-col span="12">
            <mu-row>
                <mu-col span="6" style="text-align:left;" v-show="currentSite.id != 'my-list'">
                    <mu-button slot="action" icon @click="addToMyList()" >
                        <i class="material-icons icon-plus" style="user-select: none;font-size:24px;"></i>
                    </mu-button>
                </mu-col>
                <mu-col span="6" style="text-align:left;" v-show="currentSite.id == 'my-list'">
                    <a href="#" @click="delFromMyList()">取消收藏</a>
                </mu-col>
                <!--<mu-col span="6" style="text-align:right;">-->
                    <!--<mu-button slot="action" icon @click="playVideoBack()">-->
                        <!--<i class="material-icons icon-rollback" style="user-select: none;font-size:24px;"></i>-->
                    <!--</mu-button>-->
                <!--</mu-col>-->
            </mu-row>
            <mu-row>
                <mu-col span="12" style="padding-bottom:10px;">
                    <videoComp v-if="playVideo !=null" :source="playVideo" :site-id="currentSite.id" :cache="cache"></videoComp>
                </mu-col>
            </mu-row>
        </mu-col>
    </mu-row>
</template>


<script type="text/ecmascript-6">
    import apiUtils from "../utils/apiUtils";
    import videoComp from "./video";
    import isAbsoluteUrl from 'is-absolute-url';
    export default{
        name:'playVideo',
        components:{
            videoComp
        },
        data () {
            return {
                https:true,
                siteList:[],
                siteId:'',
                rsiteId:'',
                videoId:'',
                currentSite:{id:''},
                videoList:[],
                playVideo:null,
                cache:null
            }
        },
        methods:{
            getSiteList(){
                apiUtils.getReq('getSiteList',null,(res)=>{
                    if(res.data.code == 0){
                        this.siteList = [];
                        if(typeof res.data.data == 'string'){
                            this.siteList = JSON.parse(res.data.data);
                        }else{
                            this.siteList = res.data.data;
                        }
                        for(var i=0;i<this.siteList.length;i++){
                            if(this.siteList[i].id == this.siteId){
                                this.currentSite = this.siteList[i];
                            }
                        }
                        if(this.currentSite == null){
                            return 0;
                        }

                        //加载视频信息
                        if(this.currentSite.id == 'my-list'){
                            this.getMyList();
                        }else{
                            this.getVideoInfo();
                        }
                    }else{
                        this.$alert(res.data.msg, 'Alert')
                    }

                })

            },
            getVideoInfo(){
                this.videoList.push({id:this.videoId,name:'',detail:null,type:'',last:''});
                apiUtils.getDetail(this.currentUri,{ids:this.videoId},(res)=>{
                    if(res.data.code == 0){
                        var videos = res.data.data.rss.list[0].video;
                        for(var i=0;i<videos.length;i++){
                            for(var j=0;j<this.videoList.length;j++){
                                if(videos[i].id[0] == this.videoList[j].id){
                                    var ddIdx = 0;
                                    if(videos[i].dl[0].dd.length>1){
                                        var reg = /m3u8/gi;
                                        for(var k =0 ;k<videos[i].dl[0].dd.length;k++){
                                            if(reg.test(videos[i].dl[0].dd[k].$.flag) || reg.test(videos[i].dl[0].dd[k]._)){
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
                                    this.videoList[j].name = videos[i].name[0] == undefined ? '':videos[i].name[0];
                                    this.videoList[j].type = videos[i].type[0] == undefined ? '':videos[i].type[0];
                                    this.videoList[j].last = videos[i].last[0] == undefined ? '':videos[i].last[0];
                                    this.playVideo = this.videoList[0];
                                    break;
                                }
                            }
                        }
                    }else{
                        this.$alert(res.data.msg, 'Alert')
                    }

                })
            },
            getMyList(){
                var params = {pg:1};
                try{
                    apiUtils.getReq("getMyList",params,  (res) => {
                        if(res.data.code == 0){
                            this.videoList = [];
                            if(typeof res.data.data == 'string'){
                                this.videoList = JSON.parse(res.data.data);
                            }else{
                                this.videoList = res.data.data;
                            }
                            for(var i=0;i<this.videoList.length;i++){
                                if(this.videoList[i].sitId == this.rsiteId && this.videoList[i].id == this.videoId){
                                    this.playVideo = this.videoList[i];
                                    break;
                                }
                            }
                        }else{

                            this.$alert(res.data.msg, 'Alert')
                        }

                    })
                }catch(err){
                    this.$alert("获取失败", 'Alert')
                }
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
            addToMyList(){
                var tmpVideo ={
                    sitId:this.currentSite.id,
                    detail:this.playVideo.detail
                }
                var newVideo = Object.assign(tmpVideo, this.playVideo);

                apiUtils.postReq("addMyList",{newVideo:JSON.stringify(newVideo)}, (res)=> {
                    if(res.data.code == 0){
                        this.$alert("收藏成功", 'Alert');
                    }else{
                        this.$alert("收藏失败", 'Alert')
                    }
                })
            },
            delFromMyList(){
                this.$confirm('确定要取消收藏？', '提示', {
                    type: 'warning'
                }).then(({ result }) => {
                    if (result) {
                        //确定
                        var tmpVideo ={
                            sitId:this.currentSite.id,
                            detail:this.playVideo.detail
                        }
                        var newVideo = Object.assign(tmpVideo, this.playVideo);

                        apiUtils.postReq("delFromMyList",{newVideo:JSON.stringify(newVideo)}, (res)=> {
                            if(res.data.code == 0){
                                this.$alert("取消收藏成功", 'Alert')
                            }else{
                                this.$alert("取消收藏失败", 'Alert')
                            }
                        })
                    } else {
                        //取消
                    }
                });

            }

        },
        computed:{
            currentUri() {
                return this.https ? this.currentSite.httpsApi : this.currentSite.httpApi;
            },
        },
        mounted(){
            var siteId = this.$route.query.sitid;
            if(siteId == null || siteId == undefined){
                return 0;
            }
            this.siteId = siteId;
            var rsiteId = this.$route.query.rsitid;
            if(rsiteId != null && rsiteId != undefined){
                this.rsiteId = rsiteId;
            }
            var videoId = this.$route.query.vid;
            if(videoId == null || videoId == undefined){
                return 0;
            }
            this.videoId = videoId;

            this.getSiteList();


        }
    }
</script>
<style>

</style>
