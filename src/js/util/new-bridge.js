/**
 * GomeJSBridge.appVersion 获取app版本号
 * 版本号>=90 使用
 */
import GomeJSBridge from './GomeBridge-new.js';

const _export = function(){

	var platform = ['WeiBo', 'Wechat', 'WechatMoments', 'QQ', 'QZone', 'GomeMyFriends', 'GomeMoments', 'CopyLink'];

	const setHeadBar = function(params){
		var param = {
			menus: {
	            isShowCloseMenu: 'Y',
	            rightMenus: [{
	                type:'share',
	                title:'分享',
	                icon:'file://share',
	                //action:'http://u.m.atguat.com.cn/my_evaluate-0.html',
	                shareInfo: {
	                    title: params.title,
	                    shareDesc: params.shareDesc,
	                    shareImageUrl: params.imageUrl,
	                    shareUrl: params.link,
	                    platform: params.platform||platform,
	                    insidePlatformInfo:{
				        	sourceContent:params.comeFrom||''
				        }
	                }
	            }]
	        }
		};
		GomeJSBridge.setHeadBar(function(data){

	    }, function(err){
	        
	    }, param);
	}

	const getAppVer = function(){
		var r = /gome(?:plus|backup)?\/(?:iphone\/)?(\d*)/;
		var ret = navigator.userAgent.match(r);
		return ret ? parseInt(ret[1], 10) : -1;
	}

	return {
		ready: function(callback){
			GomeJSBridge.ready(function(){
				callback();
			});
		},
		hideHeadBar:function(){
			GomeJSBridge.hideHeadBar(function(data){
			    if(data.isSuccessed == 'Y'){
			        //GomeJSBridge.toast(null,null,'headBar隐藏成功')
			    }
			},function(err){
			    //GomeJSBridge.toast(null,null,'headBar隐藏失败')
			    //console.log(err)
			})
		},
		showHeadBar:function(){
			GomeJSBridge.showHeadBar(function(data){
			    if(data.isSuccessed == 'Y'){
			        //GomeJSBridge.toast(null,null,'headBar隐藏成功')
			    }
			},function(err){
			    //GomeJSBridge.toast(null,null,'headBar隐藏失败')
			    //console.log(err)
			})
		},
		popWindow:function(callback){
			GomeJSBridge.popWindow(function(){
				callback();
			});
		},
		pushWindow:function(secess,err,url){
			GomeJSBridge.pushWindow(secess,err,url);
		},
	    onActive:function(callback){
	    	//当一个webview界面重新回到栈顶时(从后台被唤起、锁屏界面恢复、从下个页面回退)，会触发此事件。
	    	GomeJSBridge.onActive(function(data){
	    		callback();
			    // console.log('页面回退时带过来的内容： ' + JSON.stringify(data))
			})
	    },
	    onPause:function(callback){
	    	GomeJSBridge.onPause(function(data){
    	        callback&&callback();
    	    })
	    },
		login: function(callback){
			GomeJSBridge.isLogin(function(data){
				// alert(JSON.stringify(data))
				if('Y' === data.isLogined){
					// 一般情况下,页面会输出是否登录的标识
					// 如果页面标识是未登录,但app返回的是登录,则刷新页面
					// 出现场景：分享之前,用户未登录,分享控件呼起登录
					// 登录之后,登录状态并未同步到h5页
					window.location.reload();
				} else {
				}
			});
		},
		share: function(params){
			GomeJSBridge.callShareComp(function(data){
        		SBP&&SBP.send('share');
		    }, function(err){
		    },params);
		},
		toast:function(){
			GomeJSBridge.toast(
		        function(){
		            console.log('请求成功')
		        },function(error){
		            console.log(error.message)
		        },
		        '您当前版本过低，不支持此功能，请更新！'
		    );
		},
		getNetworkType: function (sucess){
			GomeJSBridge.getNetworkType( data => {
				// console.log('当前的网络类型为：'  + data.status);
				sucess && sucess(data);
			}, err =>{
				console.log('错误信息为：',err.message);
			})
		},
		setHead:function(params){
			GomeJSBridge.setHeadBar(function(data){
				// alert(JSON.stringify(data))
		    }, function(err){	
		        
		    }, params);
		},
		getDeviceId:function(callback){
			GomeJSBridge.getDeviceId(function(data){
				callback(data);
		    });
		},
		setHeadBar: setHeadBar,
		getAppVer:getAppVer
	}
}

export default _export();