webpackJsonp([1],{"0DqJ":function(t,e){},"0Y+k":function(t,e){},Chq7:function(t,e){},E51W:function(t,e){},JjDs:function(t,e){},NHnr:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=i("7+uW"),n=i("aFc6"),o=(i("E51W"),i("lf9d"),i("0Y+k"),i("1kwf")),a=(i("Chq7"),i("w7Ps")),r={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{attrs:{id:"app"}},[e("router-view")],1)},staticRenderFns:[]};var l=i("VU/8")({name:"App"},r,!1,function(t){i("0DqJ")},null,null).exports,c=i("/ocq"),d=i("mvHQ"),u=i.n(d),p=i("woOf"),h=i.n(p),f=i("mtWM"),m=i.n(f),v="http://tellstorys.cn:8081",y=function(t,e,i){var s=h()({ac:"list"},e),n=t+"?ac="+s.ac;void 0!=s.t&&(n+="&t="+s.t),void 0!=s.pg&&(n+="&pg="+s.pg),void 0!=s.wd&&(n+="&wd="+s.wd),m.a.get(v+"/api?url="+encodeURIComponent(n)).then(function(t){i(t)})},g=function(t,e,i){var s=h()({ac:"videolist"},e),n=t+"?ac="+s.ac;void 0!=s.ids&&(n+="&ids="+s.ids),m.a.get(v+"/api?url="+encodeURIComponent(n)).then(function(t){i(t)})},w=function(t,e,i){var s=v+"/"+t;m.a.get(s,{query:e}).then(function(t){i(t)})},x=function(t,e,i){var s=v+"/"+t;m.a.post(s,e).then(function(t){i(t)})},S=i("+W+M"),k=i.n(S),_=i("YT+p"),b=i.n(_),L=i("y/Wg"),C=i.n(L),T=(i("R0UR"),{name:"HlsPlayer",props:{source:{type:String,required:!0},emit:{type:Array,required:!1,default:function(){return[]}},options:{type:Object,required:!1,default:function(){return{}}}},data:function(){return{hls:{},player:{}}},mounted:function(){var t=this;console.log("HLSPlayer:mounted"),this.player=new C.a(this.video,this.options),this.$emit("player",this.player),this.player.on("ended",function(e){t.$emit("hls-end",e)}),this.$once("hook:beforeDestroy",function(){t.player.destroy(),t.hls.stopLoad&&t.hls.destroy&&(console.log("HLSPlayer:clear"),t.hls.stopLoad(),t.hls.destroy()),console.log("HLSPlayer:beforeDestroy")})},computed:{video:function(){return this.$refs.video}},watch:{source:function(){console.log("HLSPlayer:watch:source"),this.initPlayer()}},methods:{initPlayer:function(){var t=this;if(console.log("HLSPlayer:initPlayer"),b.a.isSupported()){this.hls.stopLoad&&this.hls.destroy&&(console.log("HLSPlayer:clear"),this.hls.stopLoad(),this.hls.destroy());var e=new b.a;this.hls=e,e.on(b.a.Events.ERROR,function(e,i){t.$emit("hls-error",e,i)}),e.loadSource(this.source),e.attachMedia(this.video)}else this.video.src=this.source;this.player.play()}}}),$={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"hls-plyr-player"},[e("video",{ref:"video",attrs:{preload:"none"}})])},staticRenderFns:[]};var z={components:{HlsPlayer:i("VU/8")(T,$,!1,function(t){i("JjDs")},null,null).exports},props:{source:{type:Object,required:!0}},data:function(){return{playEpisode:{name:"",url:"",type:""},playEpisodeIdx:0,options:{controls:["play-large","play","rewind","fast-forward","progress","current-time","mute","volume","captions","settings","airplay","fullscreen"],settings:["captions","quality","speed","loop"]},styleObj:{height:"300px"}}},methods:{normalizeUrl:function(t){return k()(t)?t:""},changeEpisode:function(t){this.playEpisode=this.source.detail.dd[t],this.playEpisodeIdx=t},errorHandler:function(t,e){e.details&&"manifestLoadError"===e.details&&this.$alert("出错了:"+e,"Alert")},endHandler:function(t){var e=this;if(console.log("play end"),this.playEpisodeIdx>=this.source.detail.dd.length)return 0;this.$nextTick(function(){e.playEpisodeIdx++,e.playEpisode=e.source.detail.dd[e.playEpisodeIdx]})},onWindowResize:function(){var t=this,e=9*window.innerWidth/21;e<300&&(e=300),this.$nextTick(function(){t.styleObj.height=e+"px"})}},mounted:function(){this.playEpisode=this.source.detail.dd[0],this.playEpisodeIdx=0,this.onWindowResize(),window.addEventListener("resize",this.onWindowResize,!1)}},E={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("mu-row",[i("mu-col",{style:t.styleObj,attrs:{span:"12"}},[i("hls-player",{ref:"player",attrs:{source:t.normalizeUrl(t.playEpisode.url),options:t.options},on:{"hls-error":t.errorHandler,"hls-end":t.endHandler}})],1)],1),t._v(" "),i("mu-row",[i("mu-col",{attrs:{span:"12"}},[i("h3",[t._v(t._s(t.source.name))])])],1),t._v(" "),i("mu-divider"),t._v(" "),i("mu-row",[i("mu-col",{attrs:{span:"12"}},[i("mu-list",t._l(t.source.detail.dd,function(e,s){return i("mu-row",{key:s},[i("div",{staticStyle:{width:"calc(100% - 100px)",overflow:"hidden"}},[i("p",[t._v("\n                                "+t._s(e.name)+"["+t._s(e.type)+"]\n                            ")])]),t._v(" "),i("div",{directives:[{name:"show",rawName:"v-show",value:e.url!=t.playEpisode.url,expression:"item.url != playEpisode.url"}],staticStyle:{width:"90px","text-align":"right"}},[i("div",[i("i",{staticClass:"material-icons icon-play-circle ",on:{click:function(e){return t.changeEpisode(s)}}})])]),t._v(" "),i("div",{directives:[{name:"show",rawName:"v-show",value:e.url==t.playEpisode.url,expression:"item.url == playEpisode.url"}],staticStyle:{width:"90px","text-align":"right"}},[i("div",[i("p",{staticStyle:{color:"deeppink"}},[t._v("播放中")])])]),t._v(" "),i("mu-divider")],1)}),1)],1)],1)],1)},staticRenderFns:[]};var P={components:{videoComp:i("VU/8")(z,E,!1,function(t){i("z2tH")},null,null).exports},data:function(){return{siteList:[{id:1,name:"ok资源网",uri:"http://www.jisudhw.com",httpApi:"http://cj.okzy.tv/inc/ldg_seackm3u8.php",httpsApi:"https://cj.okzy.tv/inc/ldg_seackm3u8s.php",type:"影视",__index:0}],https:!0,currentSiteIdx:0,currentSite:null,currentClass:"all",classList:[],videoList:[],isPlay:!1,scrollT:0,playVideo:null,keyWord:"",showSearch:!1,page:1,pageCnt:0,recordCnt:0,pageSize:30,leftBar:{docked:!1,open:!1,position:"left"},loading:!0,timer:"",msg:"这个是Home模板页"}},methods:{getSiteList:function(){var t=this;this.loading=!0,w("sit/sit.json",null,function(e){t.siteList=[],"string"==typeof e.data?t.siteList=JSON.parse(e.data):t.siteList=e.data,t.currentSite=t.siteList[0],t.getList()})},getList:function(){var t=this,e={pg:this.page};this.pageSize=30,""!=this.keyWord&&(e.wd=this.keyWord),"all"!=this.currentClass&&(e.t=this.currentClass),this.loading=!0;try{y(this.currentUri,e,function(e){if(0==e.data.code)try{t.parseSiteJson(e.data.data)}catch(e){t.$nextTick(function(){t.loading=!1}),t.$alert("解析出错","Alert")}else t.$nextTick(function(){t.loading=!1}),t.$alert(e.data.msg,"Alert");t.scrollToTop()})}catch(e){this.$nextTick(function(){t.loading=!1}),this.$alert("获取失败","Alert")}},parseSiteJson:function(t){var e=this;this.classList=[];for(var i=0;i<t.rss.class[0].ty.length;i++){var s={id:t.rss.class[0].ty[i].$.id,name:t.rss.class[0].ty[i]._};this.classList.push(s)}this.pageCnt=t.rss.list[0].$.pagecount-0,this.recordCnt=t.rss.list[0].$.recordcount-0;var n=[];if(this.videoList=[],void 0!=t.rss.list[0].video)for(i=0;i<t.rss.list[0].video.length;i++){var o={id:t.rss.list[0].video[i].id[0],name:t.rss.list[0].video[i].name[0],tid:t.rss.list[0].video[i].tid[0],type:t.rss.list[0].video[i].type[0],last:t.rss.list[0].video[i].last[0],dt:t.rss.list[0].video[i].dt[0],note:t.rss.list[0].video[i].note[0],detail:{pic:"",dd:[],flag:""}};this.videoList.push(o),n.push(o.id)}n.length>0?g(this.currentUri,{ids:n.join(",")},function(t){if(0==t.data.code){for(var i=t.data.data.rss.list[0].video,s=0;s<i.length;s++)for(var n=0;n<e.videoList.length;n++)if(i[s].id[0]==e.videoList[n].id){var o=0;if(i[s].dl[0].dd.length>1)for(var a=/m3u8/gi,r=0;r<i[s].dl[0].dd.length;r++)if(a.test(i[s].dl[0].dd[r].$.flag)){o=r;break}var l={pic:void 0==i[s].pic[0]?"":i[s].pic[0],dd:e.getDD(i[s].dl[0].dd[o]._),flag:i[s].dl[0].dd[o].$.flag};e.videoList[n].detail=l;break}}else e.$nextTick(function(){e.loading=!1}),e.$alert(t.data.msg,"Alert");e.$nextTick(function(){e.loading=!1})}):this.$nextTick(function(){e.loading=!1})},getMyList:function(){var t=this;this.classList=[],this.loading=!0;var e={pg:this.page};this.pageSize=1e4,""!=this.keyWord&&(e.wd=this.keyWord);try{w("getMyList",e,function(e){0==e.data.code?(t.videoList=[],"string"==typeof e.data.data?t.videoList=JSON.parse(e.data.data):t.videoList=e.data.data,t.recordCnt=t.videoList.length):(t.$nextTick(function(){t.loading=!1}),t.$alert(e.data.msg,"Alert")),t.scrollToTop(),t.$nextTick(function(){t.loading=!1})})}catch(e){this.$nextTick(function(){t.loading=!1}),this.$alert("获取失败","Alert")}},keepAlive:function(){w("ping",null,function(t){})},getDD:function(t){for(var e=[],i=t.split("#"),s=0;s<i.length;s++){var n=i[s].split("$");if(3==n.length)var o={name:n[0],url:n[1],type:n[2]};else{for(var a="",r=0;r<n.length;r++)k()(n[r])&&(a=n[r]);o={name:n[0],url:a,type:"无"}}e.push(o)}return e},scrollToTop:function(){document.body.scrollTop||document.documentElement.scrollTop;document.body.scrollTop=document.documentElement.scrollTop=0},filterSubTitle:function(t,e){return"["+e+"]"+t.substr(0,10)},changeSite:function(t){this.page=1,this.keyWord="",this.currentClass="all",this.currentSite=this.siteList[t],"my-list"==this.currentSite.id?this.getMyList():this.getList()},changeClass:function(t){this.page=1,this.keyWord="",this.currentClass=t,this.getList(),this.leftBar.open=!1},changePage:function(){var t=this;this.$nextTick(function(){t.getList()})},searchClick:function(){this.page=1,this.getList()},playVideoClick:function(t){this.playVideo=this.videoList[t];var e=document.body.scrollTop||document.documentElement.scrollTop;this.scrollT=e,this.isPlay=!0},playVideoBack:function(){var t=this;this.isPlay=!1,this.$nextTick(function(){document.body.scrollTop=document.documentElement.scrollTop=t.scrollT})},addToMyList:function(){var t=this,e={sitId:this.currentSite.id,detail:this.playVideo.detail},i=h()(e,this.playVideo);x("addMyList",{newVideo:u()(i)},function(e){0==e.data.code?t.$alert("收藏成功","Alert"):t.$alert("收藏失败","Alert")})}},computed:{currentUri:function(){return this.https?this.currentSite.httpsApi:this.currentSite.httpApi}},mounted:function(){this.getSiteList(),this.timer=setInterval(this.keepAlive,6e4)},beforeDestroy:function(){clearInterval(this.timer)}},W={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"web-site"},[i("mu-row",{directives:[{name:"show",rawName:"v-show",value:!t.isPlay,expression:"!isPlay"}],staticStyle:{position:"fixed","z-index":"666",top:"0",width:"100%","line-height":"100%"}},[i("mu-col",{attrs:{span:"12"}},[i("mu-appbar",{staticStyle:{width:"100%"},attrs:{color:"primary"}},[i("mu-button",{attrs:{slot:"left",icon:""},on:{click:function(e){t.leftBar.open=!t.leftBar.open}},slot:"left"},[i("i",{staticClass:"material-icons",staticStyle:{"user-select":"none","font-size":"20px"}},[t._v("")])]),t._v(" "),i("mu-select",{directives:[{name:"show",rawName:"v-show",value:!t.showSearch,expression:"!showSearch"}],staticStyle:{width:"200px",height:"48px","font-size":"14px"},attrs:{flat:"",label:" "},on:{change:t.changeSite},model:{value:t.currentSiteIdx,callback:function(e){t.currentSiteIdx=e},expression:"currentSiteIdx"}},t._l(t.siteList,function(t,e){return i("mu-option",{key:e,attrs:{label:t.name,value:e}})}),1),t._v(" "),i("div",{directives:[{name:"show",rawName:"v-show",value:t.showSearch,expression:"showSearch"}],staticStyle:{"font-size":"14px"}},[i("input",{directives:[{name:"model",rawName:"v-model",value:t.keyWord,expression:"keyWord"}],staticStyle:{height:"35px",width:"200px","background-color":"hsla(0,0%,100%,.15)",border:"none",color:"#fff"},domProps:{value:t.keyWord},on:{keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.searchClick(e)},input:function(e){e.target.composing||(t.keyWord=e.target.value)}}}),t._v(" "),i("mu-button",{staticStyle:{height:"56px"},attrs:{icon:""},on:{click:function(e){return t.searchClick()}}},[i("i",{staticClass:"material-icons icon-search",staticStyle:{"user-select":"none","font-size":"20px !important"}})])],1),t._v(" "),i("mu-button",{directives:[{name:"show",rawName:"v-show",value:!t.showSearch,expression:"!showSearch"}],attrs:{slot:"right",icon:""},on:{click:function(e){t.showSearch=!t.showSearch}},slot:"right"},[i("i",{staticClass:"material-icons icon-search",staticStyle:{"user-select":"none","font-size":"20px"}})]),t._v(" "),i("mu-button",{directives:[{name:"show",rawName:"v-show",value:t.showSearch,expression:"showSearch"}],attrs:{slot:"right",icon:""},on:{click:function(e){t.showSearch=!t.showSearch}},slot:"right"},[i("i",{staticClass:"material-icons icon-close",staticStyle:{"user-select":"none","font-size":"20px"}})])],1)],1)],1),t._v(" "),i("mu-drawer",{attrs:{open:t.leftBar.open,docked:t.leftBar.docked,right:"right"===t.leftBar.position,width:"150"},on:{"update:open":function(e){return t.$set(t.leftBar,"open",e)}}},[i("mu-list",[i("mu-list-item",{attrs:{button:""},on:{click:function(e){return t.changeClass("all")}}},[i("mu-list-item-title",[i("span",{directives:[{name:"show",rawName:"v-show",value:"all"==t.currentClass,expression:"'all' == currentClass"}],staticStyle:{color:"deeppink","font-size":"14px"}},[t._v("全部")]),i("span",{directives:[{name:"show",rawName:"v-show",value:"all"!=t.currentClass,expression:"'all' != currentClass"}],staticStyle:{"font-size":"14px"}},[t._v("全部")])])],1),t._v(" "),t._l(t.classList,function(e,s){return i("mu-list-item",{key:s,attrs:{button:""},on:{click:function(i){return t.changeClass(e.id)}}},[i("mu-list-item-title",[i("span",{directives:[{name:"show",rawName:"v-show",value:e.id==t.currentClass,expression:"item.id == currentClass"}],staticStyle:{color:"deeppink","font-size":"14px"}},[t._v(t._s(e.name))]),i("span",{directives:[{name:"show",rawName:"v-show",value:e.id!=t.currentClass,expression:"item.id != currentClass"}],staticStyle:{"font-size":"14px"}},[t._v(t._s(e.name))])])],1)})],2)],1),t._v(" "),i("mu-row",{directives:[{name:"show",rawName:"v-show",value:!t.isPlay,expression:"!isPlay"}],staticStyle:{"margin-top":"60px","background-color":"#2e2e2e"}},[i("mu-col",{staticStyle:{margin:"0 auto"},attrs:{span:"11"}},[i("mu-grid-list",{attrs:{"cell-height.number":"100"}},t._l(t.videoList,function(e,s){return i("mu-grid-tile",{key:s,staticStyle:{border:"solid 1px #eee","background-color":"#fff","margin-bottom":"5px"},attrs:{"title-position":"bottom","action-position":"right",rows:1,cols:1}},[i("img",{attrs:{src:e.detail.pic}}),t._v(" "),i("span",{staticStyle:{"font-size":"14px"},attrs:{slot:"title"},slot:"title"},[t._v(t._s(e.name))]),t._v(" "),i("span",{staticStyle:{"font-size":"8px"},attrs:{slot:"subTitle"},slot:"subTitle"},[t._v(t._s(t.filterSubTitle(e.last,e.type)))]),t._v(" "),i("mu-button",{attrs:{slot:"action",icon:""},on:{click:function(e){return t.playVideoClick(s)}},slot:"action"},[i("i",{staticClass:"material-icons icon-play-circle",staticStyle:{"user-select":"none","font-size":"24px",color:"#2196f3"}})])],1)}),1)],1)],1),t._v(" "),i("mu-row",{directives:[{name:"show",rawName:"v-show",value:!t.isPlay,expression:"!isPlay"}],staticStyle:{"margin-top":"10px","margin-bottom":"10px"}},[i("mu-col",{attrs:{span:"12"}},[i("mu-flex",{attrs:{"justify-content":"center"}},[i("mu-pagination",{attrs:{total:t.recordCnt,current:t.page,"page-size":t.pageSize,"page-count.number":"5"},on:{"update:current":function(e){t.page=e},change:function(e){return t.changePage()}}})],1)],1)],1),t._v(" "),t.isPlay?i("mu-row",{staticStyle:{"z-index":"999",width:"100%",height:"100%","background-color":"#fff"}},[i("mu-col",{attrs:{span:"12"}},[i("mu-row",[i("mu-col",{staticStyle:{"text-align":"left"},attrs:{span:"6"}},[i("mu-button",{attrs:{slot:"action",icon:""},on:{click:function(e){return t.addToMyList()}},slot:"action"},[i("i",{staticClass:"material-icons icon-plus",staticStyle:{"user-select":"none","font-size":"24px"}})])],1),t._v(" "),i("mu-col",{staticStyle:{"text-align":"right"},attrs:{span:"6"}},[i("mu-button",{attrs:{slot:"action",icon:""},on:{click:function(e){return t.playVideoBack()}},slot:"action"},[i("i",{staticClass:"material-icons icon-rollback",staticStyle:{"user-select":"none","font-size":"24px"}})])],1)],1),t._v(" "),i("mu-row",[i("mu-col",{staticStyle:{"padding-bottom":"10px"},attrs:{span:"12"}},[i("videoComp",{attrs:{source:t.playVideo}})],1)],1)],1)],1):t._e(),t._v(" "),i("div",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"},{name:"show",rawName:"v-show",value:t.loading,expression:"loading"}],staticStyle:{position:"absolute",width:"100%",height:"100%",top:"60px"},attrs:{"data-mu-loading-overlay-color":"rgba(0, 0, 0, .6)"}})],1)},staticRenderFns:[]};var N=i("VU/8")(P,W,!1,function(t){i("sB1D")},null,null).exports;s.a.use(c.a);var A=new c.a({routes:[{path:"/",name:"WebSite",component:N}]}),H=i("Rf8U"),R=i.n(H);s.a.use(n.a),s.a.use(o.a),s.a.use(a.a),s.a.use(R.a,m.a),s.a.config.productionTip=!1,new s.a({el:"#app",router:A,components:{App:l},template:"<App/>"})},R0UR:function(t,e){},lf9d:function(t,e){},sB1D:function(t,e){},z2tH:function(t,e){}},["NHnr"]);
//# sourceMappingURL=app.0bb4d57fb2030b4c52f9.js.map