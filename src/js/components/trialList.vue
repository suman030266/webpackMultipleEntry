<template>
	<div class="box-topic" :class="{'in-app':appVersion>0}" v-if="listData.length>0">	
		<div class="topic-list">
			<ul>
				<li class="list" v-for="(item,index) in listData">
					<div class="list-user" v-if="isShowHead">
						<div class="user-face" @click="item.user.user_center_url && click_open(item.user.user_center_url)">
							<img :src="cssPath+'/images/error/fail-360.png'" :social-src="item.user.facePicUrl|imgbed('_360',cssPath+'/images/error/fail-360.png')">
						</div>
						<p class="user-name" @click="item.user.user_center_url && click_open(item.user.user_center_url)">
							<span>{{item.user.nickname}}</span>
							<span class="expert" v-if="item.user.expert"><em class="icon-expert"></em>{{item.user.category.name}}</span>
						</p>
					</div>
					<div @click="click_open(item.url)">
						<h3 v-text="item.name" class="overflow-one"></h3>
						<p class="list-title overflow-two" v-text="item.content" v-if="item.content && !hideTitle"></p>
						<div class="list-img clearfix">
							<div>
							<img :src="cssPath+'/images/error/fail-360.png'" :social-src="img.url|imgbed('_360',cssPath+'/images/error/fail-360.png')" v-for="(img,index) in item.pictures" v-if="index<3">
							</div>
						</div>
						<div class="list-time clearfix">
							<span v-if="type=='report'">{{item.user_nickname}}<em class="expert"><i class="icon-expert"></i>{{item.expert_name}}</em></span>
							<span v-else>{{item.createTime | updateDate}}</span>
							<span class="fr"><em class="icon-5"></em>{{item.praisenumText}}</span>
							<span class="fr"><em class="icon-4"></em>{{item.replynumText}}</span>
							<span class="fr"><em class="icon-flow"></em>{{item.pageviewText}}</span>
						</div>
					</div>
				</li>
			</ul>
		</div>
		<div class="hint" v-if="url">
			<div class="loading" v-if="loadingStatus == 1">
				<img :src="cssPath+'/images/businessCard/loading.gif'" height="32" alt="">加载中
			</div>
			<div class="no-more" v-if="loadingStatus == 2 ">没有更多内容了~</div>
			<div class="failure" v-if="loadingStatus == 3">数据请求失败</div>
		</div>
	</div>
</template>
<script>
	import replace from 'mods/replace.js';
	import Lazyload from 'mods/lazyload.js';
	import bridge from 'util/GomeBridge-new.js';
	import fetch from 'io/fetch.js';
	import toast from 'mods/toast.js';
	import PullToRefresh from 'mods/pullDownRefresh.js';
	const domain = window.domain_json;
	const version = function(){
		var r = /gome(?:plus|backup)?\/(?:iphone\/)?(\d*)/;
		var ret = navigator.userAgent.match(r);
		return ret ? parseInt(ret[1], 10) : -1;
	}
	export default {
		props:['data','type','url','isShowHead','name','hideTitle'],
		data(){
			return {
				loading: true,
				loadingStatus: 4,
				listData: this.data,
				appVersion: version(),
				cssPath: domain.PLUS_GOMEUI_CDN_IP
			}
		},
		created(){
			if(this.listData.length < 10){
				this.loadingStatus = 2
			}
		},
		filters:{
			updateDate(val){
				return replace.replaceData(val);
			},
			imgbed(img,size){
				return replace.replaceImg(img, size)
			}
		},
		updated(){
			this.$nextTick(function(){
				Lazyload._lazyload();
			})
		},
		mounted() {
		    const self = this;
		    window.addEventListener('scroll', () => {
		      	if (self.scrollTop() + self.windowHeight() >= self.documentHeight() - 50 && self.loading) {
		      		if(this.url){
		      			self.getData();		
		      		}
		        	
		      	}
	    	})   
  		},
		methods: {
			//跳转链接
			click_open(url){
				if(this.appVersion<0){
					location.href = url;
				}else{
					//新开app窗口
					bridge.pushWindow(null,null,url)
				}
			},
			getData() {
				let self = this;
				if(self.loadingStatus === 2 ){
					return;
				}
      			self.loading = false;
      			self.loadingStatus = 1;
				
	            fetch.get(this.url, {
	            	params: {
	            		preRecodeTime: self.listData[self.listData.length-1].createTime
	            	}						
				})
		        .then((res) => {
		        	if(res.data.code === 0) {
		        		if(res.data.data.length<10){
							self.loadingStatus = 2;
						}else{
							self.loadingStatus = 4;
						}
						self.listData = self.listData.concat(res.data.data);
		        	}else {
		        		self.loadingStatus = 3;
		        	}	          
		          	self.loading = true;
		        })
		        .catch(function(err){
					self.loadingStatus = 3;
					if (err.message === "Network Error") {
						toast({
							content: "亲，您的手机网络不太顺畅喔～"
						})
					} else {
						toast({content:'系统繁忙,请稍后重试'})
					}
				});
		    },
		    scrollTop() {
		    	return Math.max(document.body.scrollTop, document.documentElement.scrollTop, window.pageYOffset);
		    },
		    documentHeight() {
		    	return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
		    },
		    windowHeight() {
		    	return (document.compatMode == "CSS1Compat") ? document.documentElement.clientHeight : document.body.clientHeight;
		    },
		}
	}
</script>