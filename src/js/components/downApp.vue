<template>
	<div class="m-downapp clearfix" v-show="showApp" style="display: none">
		<div @click="click_close" class="app-close fl">
			<em class="icon-close"></em>
		</div>
		<div class="open-content fl clearfix">
			<div class="app-logo fl">
				<img :src="cssPath+'/images/public/gome_icon.png'"/>
			</div>
			<div class="app-tit fl">
				<p class="registered">注册送好礼</p>
	            <p class="desc">首单再送158元</p>
			</div>
			
		</div>
		<div class="app-btn fr" @click="click_open_app">
			<a href="javascript:;">戳我打开</a>
		</div>
	</div>
</template>
<script>
	import appstart from 'mods/appstart.js';
	export default {
		data(){
			return {
				showApp:true,
				cssPath:window.domain_json['PLUS_GOMEUI_CDN_IP']
			}	
		},
		created(){
			
		},
		methods:{
			click_close(){
				const Days = 2
		        const time = Days * 24 * 60 * 60 * 1000
				this.showApp = false;
				this.$emit("change","showApp",false);
		        this.setCookie('circleAdvertisingN','true',time,location.host);
			},
			click_open_app(){
				new appstart({
	                type: "download",
	            })
			},
			setCookie(key, val, time, root){
				var o = null == time ? "" : ";expires=" + new Date((new Date).getTime() + Number(time)).toGMTString();
				root = root ? ";domain=" + root : "",
					document.cookie = key + "=" + escape(val) + root + o + ";path=/"
			}
		}
	}
</script>