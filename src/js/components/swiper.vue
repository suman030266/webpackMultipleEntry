<template>
    <div class="swiper-container" id="swiperContainer">
        <ul class="swiper-wrapper" v-if="itemInfo.topPics">
            <li @click="click_href(itemInfo.scheme,index,itemInfo.topVideo)" class="swiper-slide" v-for="(itemSrc,index) in itemInfo.topPics" :id="index===0&&itemInfo.topVideo&&itemInfo.topVideo.newVideoVU?'video_'+itemInfo.topVideo.newVideoVU:''">
               <!--  <div v-if="itemInfo.topVideo&&itemInfo.topVideo.newVideoVU&&showVideoImg" class="play-btn" @click.stop="playVideo(itemInfo.topVideo.newVideoVU)">
                </div> -->
                <img style="display: none" v-show="!itemInfo.topVideo||index!==0" :src="cssPath+'/images/error/fail-750.png'" :social-src="itemSrc|imgbed('_c700_700')" alt="">
                <div class="slide-mask"></div>
            </li>
        </ul>
        <ul id="swiperPage" class="swiper-pagination" v-if="itemInfo.topPics&&itemInfo.topPics.length>1">
            <li class="" v-for="itemSrc in itemInfo.topPics"></li>
        </ul>
    </div>
</template>

<script>
    import Slider from 'mods/slider.js';
    import replace from 'mods/replace.js';
    import check from 'mods/checkUa.js';
    export default {
        props: ['itemInfo'],
        data(){
            return{
                cssPath : window.domain_json['PLUS_GOMEUI_CDN_IP'],
                showVideoImg:true,
                videoObj:null
            }
        },
        filters:{
            imgbed(img,size){
                return replace.replaceImg(img,size)
            },
        },
        mounted() {
            let  self = this;
            if(this.itemInfo.topPics&&this.itemInfo.topPics.length>1){//老数据兼容
                let time = 0;
                new Slider({
                    wrap:document.getElementById('swiperContainer'),
                    fullScreen:true,
                    page:'#swiperPage',
                    endCallback:function(idx){
                        if(self.videoObj){
                          if(self.videoObj.playing()&&idx!==0){
                            self.videoObj.pause();
                          }else{
                            if(idx===0){
                              self.videoObj.resume();
                            }
                          }
                        }
                    }
                }); 
            }
            this.$nextTick(function(){
                let id = "",
                    dev = {
                        "DEVELOPMENT": "pre",
                        "STAGING": "pre",
                        "PRODUCTION": "dist"
                    };
                if(self.itemInfo.topVideo&&self.itemInfo.topVideo.newVideoVU){
                    self.videoObj = new MeixinPlayer();
                    id =  self.itemInfo.topVideo.newVideoVU;
                    self.videoObj.init(id, "video_" + id, {
                       env: dev[window.environment],
                       height:'auto'
                    });
                }   
            })
        },
        methods:{
            click_href(url,index,video){
                if(index===0&&video){return}
                // SBP.send('buy');
                if(this.$parent.twoKid){
                    if(url.indexOf('kid')>0){
                        url = url.replace(/kid=[^&]*/,'kid='+this.$parent.twoKid);
                    }else{
                        url += (url.indexOf('?')>0?'&':'?')+'kid='+ this.$parent.twoKid; 
                    }
                }    
                location.href = url;
            },
            pauseVideo(){
               this.videoObj&&this.videoObj.pause();
            }
        }
    }
</script>
<style lang="scss" scoped>
</style>