<template>
    <div class="hls-plyr-player">
        <video
            preload="none"
            ref="video"
        ></video>
    </div>
</template>

<script type="text/ecmascript-6">
    import Hls from 'hls.js';
    import Plyr from 'plyr';
//    import 'plyr/dist/plyr.css';
    import '@/assets/plyr.css';
    export default {
        name: 'HlsPlayer',
        props: {
            source: {
                type: String,
                required: true,
            },
            emit: {
                type: Array,
                required: false,
                default() {
                    return [];
                },
            },
            options: {
                type: Object,
                required: false,
                default() {
                    return {};
                },
            },
        },
        data() {
            return {
                hls: {},
                player: {},
            };
        },
        mounted() {
            console.log('HLSPlayer:mounted');
            this.player = new Plyr(this.video, this.options);
            this.$emit('player', this.player);
//            this.emit.forEach((element) => {
//                this.player.on(element, this.emitPlayerEvent);
//            });
            this.player.on('ended',event =>{
                this.$emit('hls-end', event);
            })
            this.$once('hook:beforeDestroy', () => {
                this.player.destroy();
            if (this.hls.stopLoad && this.hls.destroy) {
                console.log('HLSPlayer:clear');
                this.hls.stopLoad();
                this.hls.destroy();
            }
            console.log('HLSPlayer:beforeDestroy');
        });
        },
        computed: {
            video() {
                return this.$refs.video;
            },
        },
        watch: {
            source() {
                console.log('HLSPlayer:watch:source');
                this.initPlayer();
            },
        },
        methods: {
            initPlayer() {
                console.log('HLSPlayer:initPlayer');
                if (!Hls.isSupported()) {
                    this.video.src = this.source;
                } else {
                    if (this.hls.stopLoad && this.hls.destroy) {
                        console.log('HLSPlayer:clear');
                        this.hls.stopLoad();
                        this.hls.destroy();
                    }
                    const hls = new Hls();
                    this.hls = hls;
                    hls.on(Hls.Events.ERROR, (event, data) => {
                        this.$emit('hls-error', event, data);
                });
                    hls.loadSource(this.source);
                    hls.attachMedia(this.video);
                }
                this.player.play();
            }
        },
    };
</script>

<style >
    .hls-plyr-player {
        width: 100%;
        height: 100%;

    }

    .hls-plyr-player .plyr {
        width: 100%;
        height: 100%;
    }

    .hls-plyr-player .plyr__video-wrapper {
        width: 100%;
        height: 100%;
    }

    .hls-plyr-player .plyr__video-wrapper video {
        width: 100% !important;
        height: 100% !important;
    }


</style>
