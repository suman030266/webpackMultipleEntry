<template>
    <div>
        <transition name="component-fade"> 
            <div v-if="showShareLayer" class="m-share-bottom">
                <ul class="share-list">
                    <li class="item" v-for="(item, index) in shareData"  :shareType="item.shareClass"  @click="toshare(item.shareClass)">
                        <a href="javascript:;" :class="item.shareClass">
                            <em class="share-icon"></em>
                            <p class="share-txt">{{item.shareText}}</p>
                        </a>
                    </li>
                </ul>
                <a href="javascript:;"  @click="close" class="share-close">取消</a>
            </div>
        </transition>
        <div class="m-mask-private" style="display: none" v-show="showShareLayer" @click.self="close"></div>
        <div class="m-share-top" style="display: none" v-show="isWxMsgShow" @click="wxMsgHide"></div> 
    </div>
</template>    
<script>
    import Toast from '../mods/toast.js';
    export default {
        props: ['showShareLayer'],
        data() {
            return {
                shareData: [{
                    shareClass: 'weibo',
                    shareText: '微博'
                }, {
                    shareClass: 'weixin',
                    shareText: '微信'
                }, {
                    shareClass: 'friends',
                    shareText: '朋友圈'
                }, {
                    shareClass: 'qq',
                    shareText: 'QQ'
                }, {
                    shareClass: 'qzone',
                    shareText: 'QQ空间'
                }],
                isWxMsgShow: false,
                isWeixin: false,
                isQQ: false,
                isWeiBo: false,
                isShowShare: true,
                qq_zone_titles: "",
                qq_zone_descs: "",
                qq_zone_links: "",
                qq_zone_imgs: "",
                sina_titles: "",
                sina_descs: "",
                sina_links: "",
                sina_imgs: "",
                isShare : false,
            }
        },
        created() {
            const ua = window.navigator.userAgent;
            if (ua.match(/Weibo/i)) {
                this.isWeiBo = true
            } else if (ua.match(/QQ\//i) == "QQ/") {
                this.isQQ = true
            } else if (ua.match(/MicroMessenger/i)) {
                this.isWeixin = true
            }
            if (this.isWeixin || this.isQQ) {
                if (!window.wx) {
                    var script = document.createElement("script");
                    script.type = "text/javascript";
                    script.src = 'http://res.wx.qq.com/open/js/jweixin-1.2.0.js';
                    document.body.appendChild(script);
                }
            }else{
                this.qq_zone_titles = qq_zone_title;
                this.qq_zone_descs = qq_zone_desc;
                this.qq_zone_links = qq_zone_link;
                this.qq_zone_imgs = qq_zone_img;
                this.sina_titles = sina_title;
                this.sina_descs = sina_desc;
                this.sina_links = sina_link;
                this.sina_imgs = sina_img;
            }
        },
        mounted() {
        },
        methods: {
            toshare(shareType) {
                if (shareType == 'qq' || shareType == 'friends') {
                    shareType = 'weixin'
                }
                this.sharetype(shareType)
            },
            sharetype(type) {
                switch (type) {
                    case 'weibo': //weibo
                        if (this.isWeixin || this.isQQ) {
                            this.close()
                            Toast({"content":"微信或QQ内暂不支持微博分享"});
                            return false;
                        } else {
                            this.sina_links = sina_link;
                            console.log(this.sina_links)
                            const bdurl = (this.sina_links.indexOf('?') > -1 ? (this.sina_links + '&source=w-xlwb') :
                                (this.sina_links + '?source=w-xlwb')) + '&version=' + (+new Date());

                            let search = '?url=' + encodeURIComponent(bdurl) + '&title=' + encodeURIComponent(this.sina_titles) +
                                '&pic=' + encodeURIComponent(this.sina_imgs) + '&desc=' + encodeURIComponent(this.sina_descs);
                            search += '&appkey=1343713053&searchPic=true';

                            location.assign('http://service.weibo.com/share/mobile.php' + search);
                        }
                        break;

                    case 'qzone': //QQ空间
                        if (this.isWeixin) {
                            if (window.wx) {
                                this.Wxinit()
                            }
                            this.close()
                            this.isWxMsgShow = true
                        } else {
                            this.qq_zone_links = qq_zone_link;
                            const bdurl = (this.qq_zone_links.indexOf('?') > -1 ? (this.qq_zone_links + '&source=w-Qqzone') : (this.qq_zone_links + '?source=w-Qqzone')) + '&version=' + (+new Date());

                            let search = '?url=' + encodeURIComponent(bdurl) + '&title=' + encodeURIComponent(this.qq_zone_titles) +
                                '&pic=' + encodeURIComponent(this.qq_zone_imgs) + '&desc=' + encodeURIComponent(this.qq_zone_descs);
                            search += '&appkey=1343713053&searchPic=true';
                            window.open('http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey' + search, "", "_blank");
                            break;
                        }
                        break;

                    case 'weixin': //微信
                        if (this.isWeixin || this.isQQ) {
                            if (window.wx) {
                                this.Wxinit()
                            }
                            this.close()
                            this.isWxMsgShow = true
                        } else {
                            Toast({content:'请用浏览器自带分享功能分享'});
                            // new Toast('请用浏览器自带分享功能分享')   
                        }
                        break;
                }
            },
            close() {
                this.$emit('change',"showShareLayer",false);
            },
            wxMsgHide() {
                this.isWxMsgShow = false
                this.close()
            },
            Wxinit() {
                const self = this;
                wx.ready(function() {
                    self.isShare = true
                    // if (typeof WeixinJSBridge == "undefined"){
                    //     if( document.addEventListener ){
                    //         document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                    //     }else if (document.attachEvent){
                    //         document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                    //         document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                    //     }
                    // }else{
                    //     onBridgeReady();
                    // }
                    self.oWXready()
                    // 执行分享方法
                    self.setShareData();
                });
            },
            oWXready() {
                if (typeof WeixinJSBridge == "undefined") {
                    if (document.addEventListener) {
                        document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady, false);
                    } else if (document.attachEvent) {
                        document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady);
                        document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady);
                    }
                } else {
                    this.onBridgeReady();
                }
            },
            onBridgeReady() {
                if (this.isShare) {
                    wx.showOptionMenu();
                } else {
                    wx.hideOptionMenu();
                }
            },
            setShareData() {
                const shareTitie = this.qq_zone_titles
                const shareDesc = this.qq_zone_descs
                const shareLink = this.qq_zone_links
                const shareImgUrl = this.qq_zone_imgs
                if (this.isShare) {
                    // 分享给朋友
                    wx.onMenuShareAppMessage({
                        title: shareTitie, // 分享标题
                        desc: shareDesc, // 分享描述
                        link: shareLink, // 分享链接
                        imgUrl: shareImgUrl, // 分享图标
                        type: '', // 分享类型,music、video或link，不填默认为link
                        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                        success: function() {

                        },
                        cancel: function() {
                            // 用户取消分享后执行的回调函数

                        }
                    })
                    // 分享到朋友圈
                    wx.onMenuShareTimeline({
                        title: shareTitie, // 分享标题
                        link: shareLink, //分享链接
                        imgUrl: shareImgUrl, // 分享图标
                        success: function() {
                            // 用户确认分享后执行的回调函数
                            // alert('分享朋友圈成功了')
                        },
                        cancel: function() {
                            // alert('分享朋友圈失败了')
                        }
                    })

                    //QQ
                    wx.onMenuShareQQ({
                        title: shareTitie, // 分享标题
                        desc: shareDesc, // 分享描述
                        link: shareLink, // 分享链接
                        imgUrl: shareImgUrl, // 分享图标
                        success: function() {

                        },
                        cancel: function() {
                            // 用户取消分享后执行的回调函数
                        }
                    })
                    // QQ空间
                    wx.onMenuShareQZone({
                        title: shareTitie, // 分享标题
                        desc: shareDesc, // 分享描述
                        link: shareLink, // 分享链接
                        imgUrl: shareImgUrl, // 分享图标
                        success: function() {

                        },
                        cancel: function() {
                            // 用户取消分享后执行的回调函数
                        }
                    })

                    wx.onMenuShareWeibo({
                        title: shareTitie, // 分享标题
                        desc: shareDesc, // 分享描述
                        link: shareLink, // 分享链接
                        imgUrl: shareImgUrl, // 分享图标
                        success: function() {

                        },
                        cancel: function() {
                            // 用户取消分享后执行的回调函数
                        }
                    })
                }
            },
        }
    }
</script>
<style lang="scss" scoped>
.component-fade-enter-active{
    animation-duration: .5s;
    animation-name: fadeInUp;
}
.component-fade-leave-active{
    animation-duration: .5s;
    animation-name: fadeOutDown;
}
.animated.infinite {
  animation-iteration-count: infinite;
}
@keyframes fadeOutDown {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }

  to {
    opacity: 1;
    transform: none;
  }
}
</style>
