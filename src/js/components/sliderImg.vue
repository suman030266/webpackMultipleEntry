<template>
	<div @touchmove.prevent style="display:none" v-show="showImg" class="img-list" @click="click_close">
		<div class="pageStateCell">{{idx}} / {{imgList.length}}</div>
		<div class="lists" id="swiperContainer">
			<ul class="clearfix">
				<li v-for="img in imgList">
					<img :src="img" :onerror="errorImg">	
				</li>
			</ul>	
		</div>
	</div>
</template>
<script>
	import Slider from 'mods/slider.js'; 
	export default{
		props:['imgList','imgIndex'],
		data(){
			return {
				errorImg:'',
				cssPath:domain_json.PLUS_GOMEUI_CDN_IP,
				slider:null,
				idx:1,
				showImg:false
			}
		},
		watch:{
			imgIndex: function (val, oldVal) {
				if(val!==oldVal){
					this.idx = val+1;
					this.slider.update(val);
				}
		    }
		},
		created(){
			this.errorImg = 'this.src="'+this.cssPath+'/images/error/fail-750.png"';
		},
		mounted(){
			if(data_code===200){
				if(this.imgList.length>0){
					let self = this;
					this.slider = new Slider({
						 wrap:document.getElementById('swiperContainer'),
						 endCallback:function(idx){
						 	self.idx = idx+1;
						 }
					});
				}
			}
		},
		methods:{
			click_close(){
				this.showImg = false;
				document.body.style.overflow = "";		
			},
			click_show(){
				this.showImg = true;
				document.body.style.overflow = "hidden";
			}
		}
	}
</script>
<style lang="scss" scoped>
	.img-list{
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: -2px;
		width: 100%;
		height: 100%;
		width: 100%;
		overflow: hidden;
		background: #000;
		z-index: 102; 
		.pageStateCell{
			position: absolute;
			top: .4rem;
			left: 50%; 
			transform:translateX(-50%);
			text-align: center;
			color:#fff;
			font-size: .3rem;
			z-index: 2;
		}
		.lists{
			position: absolute;
			top: 50%; 
			left: 0%;
			transform:translateY(-50%);
			width: 100%;
			z-index: 1;
		}
		ul{
			position: relative;
			width: 100%;
			height: 100%;
		    display: -webkit-box;
		    display: -moz-box;
		    display: -ms-flexbox;
		    display: -webkit-flex;
		    display: flex;
		    -webkit-transition-property: -webkit-transform;
		    -moz-transition-property: -moz-transform;
		    -o-transition-property: -o-transform;
		    -ms-transition-property: -ms-transform;
		    transition-property: -webkit-transform;
		    transition-property: transform;
		    transition-property: transform, -webkit-transform;
		    -webkit-box-sizing: content-box;
		    -moz-box-sizing: content-box;
		    box-sizing: content-box;
			li{
				-webkit-flex-shrink: 0;
		    	-ms-flex: 0 0 auto;
		    	flex-shrink: 0;
		    	width: 100%;
		    	display: flex;
		    	align-items: center;
	            img{
	            	width: 100%;
	            	max-height: 100%;
	            }
			}
		}
	}
	@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
    	.img-list .pageStateCell{top: .9rem;}
    }
</style>