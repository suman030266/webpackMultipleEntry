<!-- 附近门店 好货和话题详情用 -->
<template>
	<div class="store" v-if="storeMessage">
		<div class="store-img fl">
			<img src="../../images/public/gome_icon.png" alt="">
		</div>
		<div class="store-mes fl">
			<p class="store-name overflow-one" v-text="storeMessage.storeName"></p>
			<p class="store-address overflow-one" v-text="storeMessage.storeAddress"></p>
		</div>
		<!-- <div class="store-btn fr">
			换店
		</div> -->
	</div>
</template>
<script>
	import fetch from 'io/fetch.js';
	const getAppVer = function(){
		var r = /gome(?:plus|backup)?\/(?:iphone\/)?(\d*)/;
		var ret = navigator.userAgent.match(r);
		return ret ? parseInt(ret[1], 10) : -1;
	}
	export default {
		props:['id'],
		data(){
			return{
				storeMessage:null,
				appVersion:getAppVer()
			}
		},
		created(){
			if(data_code===200){
				if(this.$parent.getQueryName('shareId')){
					this.getStore(this.$parent.getQueryName('shareId'));
				}else{
					islogin===1&&this.getStore();
				}
			}
		},
		methods:{
			getStore(id,topicId){//获取门店信息
				let self = this,
					params = {};
				if(id){
					params.shareUserId = id;
					params.topicId = self.id;
				}	
				fetch.get('topic/topicstore',{
					params:params
				})
				.then(function(res){
					let data = res.data;
					if (data.code === 0&&data.data.storeId) {
						let is = location.search.indexOf('?')>-1;
						self.storeMessage = data.data;
						if(islogin === 1){//门店分享加Userid
							qq_zone_link = self.addShareId(qq_zone_link,uid);
							sina_link = self.addShareId(sina_link,uid);
							if(self.appVersion<0){
								let search = location.search.replace(/shareId=[^&]*/,'shareId='+uid);
								if(search.indexOf("shareId")>0){
									history.replaceState(null, null,search);
								}else{
									history.replaceState(null, null,(is?location.search+"&":'?')+'shareId='+uid);
								}
							}	
						}
					}
				})
				.catch(function(err){

				})
			},
			addShareId(url,id){
				return url+(url.indexOf('?')>0?'&':'?')+'shareId='+id;
			}
		}
	}
</script>
<style lang="scss" scoped>
	.store{
		background: #fff;
		&:after,&:before{
			content: "";
			display: block;
			height: .16rem;
			width: 100%;
			background: #F7F7F7;
		}
		&:after{
			height: .04rem;
			clear: both;
		}
		&>div{
			margin: .32rem 0;
		}
		.store-img{
			margin-left: .24rem;
			img{
				width: .96rem;
				height: .96rem;
				border-radius: 50%;
			}
		}
		.store-mes{
			padding-top: .08rem;
			margin-left: .24rem;
			.store-name{
				font-size: .32rem;
				color: #252C33;
				line-height: .32rem;
				font-weight: bold;
				margin-bottom: .14rem;
				max-width: 4.66rem;
			}
			.store-address{
				background: url(../../images/goods/address.png) no-repeat left center;
				background-size:.32rem .4rem; 
				-webkit-background-size:.32rem .4rem;
				padding-left: .48rem;
				font-size: .28rem;
				color: #909599;
				line-height: .4rem;
				max-width: 4.18rem;
			}
		}
		.store-btn{
			margin:.52rem .24rem 0 0 ;
			width: 1.12rem;
			line-height: .52rem;
			font-size: .28rem;
			color: #F20C59;
			text-align: center;
			border: .02rem solid #F5417D;
			border-radius: 68px;
		}
	}
</style>