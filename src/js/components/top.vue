<!--顶部返回、分享 -->
<template>
	<div class="position" :class="{'in-app':appVersion>0}" v-if="!checkUa">
		<div class="top-header" :class="{'in-app':appVersion>0}">
			<div class="header-con">
				<div class="header-back" @click="headerBack">
					<em class="icon-new-back"></em>
				</div>
				<div class="header-title">
					<p class="overflow-one" v-text="title"></p>

				</div>
				<div class="header-share" @click="headerShare">
					<em class="icon-new-share"></em>
				</div>
			</div>
			<shareLayer @change="changeName" :showShareLayer="showShareLayer"></shareLayer>
		</div>
	</div>
</template>
<script>
	import shareLayer from 'components/share.vue';
	import replace from 'mods/replace.js';
	import bridge from 'util/GomeBridge-new.js';
	import checkUa from 'mods/checkUa.js';
	const version = function(){
		var r = /gome(?:plus|backup)?\/(?:iphone\/)?(\d*)/;
		var ret = navigator.userAgent.match(r);
		return ret ? parseInt(ret[1], 10) : -1;
	}
	export default {
		props:['title'],
		data(){
			return {
				showShareLayer:false,
				appVersion: version(),
				checkUa: checkUa.wechat
			}
		},
		methods:{
			headerBack(e) {
				e.stopPropagation();
				if (this.appVersion < 0) {
					history.go(-1);
				} else {
					bridge.popWindow();
				}
			},
			//分享
			changeName(key, val) {
				this[key] = val;
			},
			showShare() {
				this.showShareLayer = true;
				this.$emit("change", "showShareLayer", true);
			},
			headerShare() {
				let param;
				if (this.appVersion > 0) {
					let sapp_title = '',
						sapp_desc = '';
					if (app_title.length > 20) {
						sapp_title = app_title.substring(0, 17) + "...";
					} else {
						sapp_title = app_title + ' ';
					}
					if (app_desc.length > 30) {
						sapp_desc = app_desc.substring(0, 27) + "...";
					} else {
						sapp_desc = app_desc + ' ';
					}

					if (islogin == '0' && (uid >= 0)) {
						param = {
							title: sapp_title,
							shareDesc: sapp_desc,
							shareImageUrl: app_img,
							shareUrl: app_link,
							channel: 'mshop',
							platform: ['WeiBo', 'Wechat', 'WechatMoments', 'QQ', 'QZone', 'GomeMyFriends', 'GomeMoments', 'MShop', 'CopyLink'],
							insidePlatformInfo: {
								sourceContent: "链接"
							}
						}
					} else {
						param = {
							title: sapp_title,
							shareDesc: sapp_desc,
							shareImageUrl: app_img,
							shareUrl: app_link,
							channel: 'link',
							platform: ['WeiBo', 'Wechat', 'WechatMoments', 'QQ', 'QZone', 'GomeMyFriends', 'GomeMoments', 'CopyLink'],
						}
					}
					bridge.callShareComp(function(data){
		        		// SBP&&SBP.send('share');
				    }, function(err){

				    },param);
				} else {
					this.showShare();
				}
			},
		},
		components:{
			shareLayer
		}
	}
</script>