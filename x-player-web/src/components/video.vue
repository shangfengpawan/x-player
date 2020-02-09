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
        <mu-row>
            <mu-col span="12">
                <mu-list>
                    <div v-for="item,index in source.detail.dd">
                        <mu-list-item>
                            <mu-list-item-title>{{item.name}}[{{item.type}}]</mu-list-item-title>
                            <mu-list-item-action v-show="item.url != playEpisode.url">
                                <i class="material-icons icon-play-circle " @click="changeEpisode(index)"></i>
                            </mu-list-item-action>
                            <mu-list-item-action v-show="item.url == playEpisode.url">
                                <p style="color:deeppink">播放中</p>
                            </mu-list-item-action>
                        </mu-list-item>
                        <mu-divider></mu-divider>
                    </div>

                </mu-list>
            </mu-col>
        </mu-row>
    </div>
</template>


<script type="text/ecmascript-6">
//    import normalizeUrl from 'normalize-url';
    import isAbsoluteUrl from 'is-absolute-url';
    import HlsPlayer from './HlsPlayer';
    export default{
        components:{
            HlsPlayer
        },
        props:{
            source:{
                type:Object,
                required: true,
            }
        },
        data () {
            return {
                playEpisode:{name:'',url:'',type:''},
                playEpisodeIdx:0,
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
                }
                return '';
            },
            changeEpisode(idx){
                this.playEpisode = this.source.detail.dd[idx];
                this.playEpisodeIdx = idx;
            },
            errorHandler(event, data) {
                if (data.details && data.details === 'manifestLoadError') {
                    this.$alert("出错了", 'Alert')
                }
            },
            endHandler(event){
                console.log('play end');
                if(this.playEpisodeIdx >= this.source.detail.dd.length){
                    return 0;
                }
                this.$nextTick(() => {
                    this.playEpisodeIdx++;
                    this.playEpisode = this.source.detail.dd[this.playEpisodeIdx];
                })

            },
            onWindowResize(){

                var newHeight = window.innerWidth * 9 / 21;
                if(newHeight<200){
                    newHeight = 200;
                }
                this.$nextTick(() =>{
                    this.styleObj.height = newHeight + 'px';
                })

            }
        },
        mounted() {
            this.playEpisode = this.source.detail.dd[0];
            this.playEpisodeIdx = 0;
            this.onWindowResize();
            window.addEventListener( 'resize', this.onWindowResize, false );
        },
    }
</script>
<style>

</style>
