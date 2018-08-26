<template>
	<div style="display: none" v-show="showBack" class="back-top" @click="click_back_top">
		<a href="javascript:;"></a>
	</div>
</template>
<script>
	export default {
		props:["showTop"],
		data(){
			return {
				showBack:false
			}
		},
		created(){
			var self = this;
			window.addEventListener("scroll",function(){
		    	let scTop = self.scrollTop();
		    	if(scTop>500&&self.showTop){
		    		self.showBack = true;
		    	}else{
		    		self.showBack = false;
		    	}
			},false)
		},
		methods:{
			click_back_top(){
				this.scrollTop(0);
				self.showBack = false;
			},
			scrollTop(val){
				if(val!==undefined){
					window.scrollTo(0,val)
					return;
				}
				return document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;	
			}
		}
	}	
</script>