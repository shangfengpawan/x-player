<template>
    <div>
        <mu-row >
            <mu-col span="12" :style="styleObj">
                <hls-player
                    :source="normalizeUrl(playEpisode.url)"
                    :options="options"
                    @hls-error="errorHandler"
                    @hls-end="endHandler"
                    ref="player"
                ></hls-player>
            </mu-col>
        </mu-row>
        <mu-row>
            <mu-col span="12">
                <h3>{{source.name}}</h3>
            </mu-col>
        </mu-row>
        <mu-divider></mu-divider>
        <mu-row v-show="siteId == 'my-list'">
            <mu-col span="12">
                播放源:
                <mu-select  flat  label=" " v-model="sourceType" style="width:calc(100% - 150px);height:48px;font-size:14px;">
                    <mu-option v-for="item,index in [{name:'在线',value:'online'},{name:'缓存',value:'cache'}]" :key="index" :label="item.name" :value="item.value"></mu-option>
                </mu-select>
                <mu-button flat size="small" color="primary" @click="cacheClick()" style="height:48px;line-height:48px;">缓存</mu-button>
            </mu-col>
            <!--<mu-col span="2">-->
                <!--<mu-button flat size="small" style="height:48px;line-height:48px;">缓存</mu-button>-->
            <!--</mu-col>-->
        </mu-row>
        <mu-row v-show="sourceType == 'online'">
            <mu-col span="12">
                <mu-list>
                    <mu-row :key=index v-for="item,index in source.detail.dd">
                            <div style="width:calc(100% - 100px);overflow:hidden">
                                <p>
                                    {{item.name}}[{{item.type}}]
                                </p>

                            </div>

                            <div v-show="item.url != playEpisode.url" style="width:90px;text-align:right;">
                                <div>
                                    <i class="material-icons icon-play-circle " @click="changeEpisode(index)"></i>
                                </div>
                            </div>
                            <div v-show="item.url == playEpisode.url" style="width:90px;text-align:right;">
                                <div>
                                    <p style="color:deeppink">播放中</p>
                                </div>

                            </div>

                        <mu-divider></mu-divider>
                    </mu-row>

                </mu-list>
            </mu-col>
        </mu-row>
        <mu-row v-show="sourceType == 'cache'">
            <mu-col span="12">
                <mu-list>
                    <mu-row :key=index v-for="item,index in source.detail.cache">
                        <div style="width:calc(100% - 100px);overflow:hidden">
                            <p>
                                {{item.name}}[{{item.type}}][{{parseInt(item.downLoaded/item.total*100)}}%]
                            </p>

                        </div>
                        <div v-show="item.url != playEpisode.url" style="width:90px;text-align:right;">
                            <div>
                                <i class="material-icons icon-play-circle " @click="changeCacheEpisode(index)"></i>
                            </div>
                        </div>
                        <div v-show="item.url == playEpisode.url" style="width:90px;text-align:right;">
                            <div>
                                <p style="color:deeppink">播放中</p>
                            </div>

                        </div>
                        <mu-divider></mu-divider>
                    </mu-row>

                </mu-list>
            </mu-col>
        </mu-row>
    </div>
</template>


<script type="text/ecmascript-6">
//    import normalizeUrl from 'normalize-url';
    import isAbsoluteUrl from 'is-absolute-url';
    import HlsPlayer from './HlsPlayer';
    import apiUtils from "../utils/apiUtils";
    export default{
        components:{
            HlsPlayer
        },
        props:{
            source:{
                type:Object,
                required: true,
            },
            siteId:{
                type:String,
                required:false
            }
        },
        data () {
            return {
                playEpisode:{name:'',url:'',type:''},
                playEpisodeIdx:0,
                sourceType:'online',
                autoPlaySourceType:'online',
                options: {
                    controls: [
                        'play-large',
                        'play',
                        'rewind',
                        'fast-forward',
                        'progress',
                        'current-time',
                        'mute',
                        'volume',
                        'captions',
                        'settings',
                        'airplay',
                        'fullscreen',
                    ],
                    settings:[
                        'captions',
                        'quality',
                        'speed',
                        'loop'
                    ]
                },
                styleObj:{
                    height:'300px'
                }
            }
        },
        methods:{
            normalizeUrl(url) {
                if (isAbsoluteUrl(url)) {
//                    return normalizeUrl(url, { stripWWW: false });
                    return url
                }else if(this.autoPlaySourceType == 'cache'){
                    return apiUtils.getServerPath()+'/cache/'+url
                }



                return '';
            },
            changeEpisode(idx){
                this.playEpisode = this.source.detail.dd[idx];
                this.playEpisodeIdx = idx;
                this.autoPlaySourceType = 'online';
            },
            changeCacheEpisode(idx){
                this.playEpisode = this.source.detail.cache[idx];
                this.playEpisodeIdx = idx;
                this.autoPlaySourceType = 'cache';
            },
            cacheClick(){
                var tmpVideo ={
                    sitId:this.source.sitId,
                    id:this.source.id,
                    ddIdx:this.playEpisodeIdx
                }

                apiUtils.postReq("cacheReq",{cacheInfo:JSON.stringify(tmpVideo)}, (res)=> {
                    if(res.data.code == 0){
                        this.$alert("正在缓存", 'Alert')
                    }else{
                        this.$alert("缓存失败", 'Alert')
                    }
                })
            },
            errorHandler(event, data) {
                if (data.details && data.details === 'manifestLoadError') {
                    this.$alert("出错了:"+data, 'Alert')
                }
            },
            endHandler(event){
                console.log('play end');
                if(this.autoPlaySourceType == 'online'){
                    if(this.playEpisodeIdx >= this.source.detail.dd.length){
                        return 0;
                    }
                    this.$nextTick(() => {
                        this.playEpisodeIdx++;
                        this.playEpisode = this.source.detail.dd[this.playEpisodeIdx];
                    })
                }else{
                    if(this.playEpisodeIdx >= this.source.detail.cache.length){
                        return 0;
                    }
                    this.$nextTick(() => {
                        this.playEpisodeIdx++;
                        this.playEpisode = this.source.detail.cache[this.playEpisodeIdx];
                    })
                }


            },
            onWindowResize(){

                var newHeight = window.innerWidth * 9 / 21;
                if(newHeight<300){
                    newHeight = 300;
                }
                this.$nextTick(() =>{
                    this.styleObj.height = newHeight + 'px';
                })

            }
        },
        mounted() {
            this.playEpisode = this.source.detail.dd[0];
            this.playEpisodeIdx = 0;
            if(this.source.detail.cache == undefined){
                this.source.detail.cache =[];
            }
            this.onWindowResize();
            window.addEventListener( 'resize', this.onWindowResize, false );
        },
    }
</script>
<style>

</style>
