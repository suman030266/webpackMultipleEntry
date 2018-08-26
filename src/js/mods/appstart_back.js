import env from './checkUa.js';
const cookie = {
	parse() {
		try {
			var co = document.cookie.split(";"),
				obj = {};
			return co.forEach(function(co) {
					obj[co.split("=")[0].trim()] = co.split("=")[1].trim()
				}),
				n
		} catch (e) {
			return {}
		}
	},
	set(key, val, time, root) {
		var o = null == time ? "" : ";expires=" + new Date((new Date).getTime() + Number(time)).toGMTString();
		root = root ? ";domain=" + root : "",
			document.cookie = key + "=" + escape(val) + root + o + ";path=/"
	}
}

function getSearch (url) {
    const cookies = cookie.parse()
    let result = ''
    let cmpid = 'wap_m'
    if (location.host.match(/^\w*?\.m/)) {
        cmpid = 'wap_' + location.host.match(/^(\w*?)\.m/)[1]
    }
    try {
        if (cookie.getCookie("__gmz") && cookie.getCookie("__gmz").split('|')[1] != '-') {
            cmpid = cookie.getCookie("__gmz").split('|')[1]
        }
        if (location.search) {
            if (url.match(/\?/)) {
                if (!location.search.match(/cmpid/)) {
                    result = `&cmpid=${cmpid}`
                }
            } else {
                if (!location.search.match(/cmpid/)) {
                    result = `?cmpid=${cmpid}`
                }
            }
        } else {
            result = `?cmpid=${cmpid}`
        }
    } catch (e) {
        result = ''
    }
    return result
}
const dUrl = 'http://shouji.gome.com.cn/kd/WAP.html';    
function extend(target,source){
    for(const p in target){
        if(target.hasOwnProperty(p)){
            source[p] = target[p];
        }
    }
    return source;
}
//下载的url
class appstart {
    constructor(options){
        this.settings = extend(options,{});
        this.openState = false;
        this.init();
    }

    init () {
        if (this.settings && this.settings.type == 'default') {
             this.autoAppStart();
        } else if(this.settings && this.settings.type == 'download'){
            this.appStart()
        }
    }

    //普通唤醒，之后又下载的
    appStart () {
        //定义唤醒scheme url
        var href = location.href;
        var ios_native_url = "gomeplusapp://" + href.split(/http[s]?:\/\//)[1];
        var andriod_native_url = "gomeplusapp://" + href.split(/http[s]?:\/\//)[1];
        
        //微信唤醒url就是下载url
        var weinxin_native_url = 'https://awake.m.gome.com.cn' + location.pathname + location.search;
        //只下载模式
        const andriod_download_url = dUrl;     
        const ios_download_url = dUrl;
        if (this.settings && this.settings.url) {
        //自定义url模式
            var ios_native_url = this.settings.url;
            var andriod_native_url = this.settings.url;
        }
        if( location.host == 'm.gome.com.cn' && location.pathname == '/' ){
            var ios_native_url = "gomeplusapp://" + location.host + '/index.html';
            var andriod_native_url = "gomeplusapp://" + location.host + '/index.html'
            var weinxin_native_url = 'https://awake.m.gome.com.cn' + '/index.html'
        }
        else if( location.host == 'm.gomeplus.com' && location.pathname == '/' ){
            var ios_native_url = "gomeplusapp://" + location.host + '/index.html'
            var andriod_native_url = "gomeplusapp://" + location.host + '/index.html'
            var weinxin_native_url = 'https://awake.m.gome.com.cn' + '/index.html'
        }else if( location.host == 'm.uatplus.com' && location.pathname == '/' ){
            var ios_native_url = "gomeplusapp://" + location.host + '/index.html' 
            var andriod_native_url = "gomeplusapp://" + location.host + '/index.html' 
            var weinxin_native_url = 'https://awake.m.gome.com.cn' + '/index.html'
        }else if (location.pathname == '/category.html') {
            var ios_native_url = "gomeplusapp://" + location.host + '/index.html' 
            var andriod_native_url = "gomeplusapp://" + location.host + '/index.html'
            var weinxin_native_url = 'https://awake.m.gome.com.cn' + '/index.html'
        }else if(location.host.indexOf('prom.m') > -1){
            var weinxin_native_url = 'https://awake.m.gome.com.cn' + '/index.html'
        }
        const config_obj = {
            iosInstallUrl: ios_download_url,
            androidInstallUrl: andriod_download_url,
            iosNativeUrl: ios_native_url,
            andriodNativeUrl: andriod_native_url,
            packages: 'com.gome.eshopnew',
            weixinNativeUrl: weinxin_native_url
        };
        this.redirectToNative(config_obj);
    }

    //唤醒不下载
    autoAppStart () {
        const ua = navigator.userAgent.toLowerCase();
        const andriod_download_url = '';
        const ios_download_url = '';
        var href = location.href;
        var ios_native_url = "gomeplusapp://" + href.split(/http[s]?:\/\//)[1];
        var andriod_native_url = "gomeplusapp://" + href.split(/http[s]?:\/\//)[1];
        //cookie.set('__gmz','ffb8de7|sem_baidu_pinpai_yx_bt|-|sem|-|-|-|1445054736107.1503567810960|dc-1|1503567855121');
        if(document.cookie.indexOf('__gmz') != -1){
            const gmz = cookie.parse().__gmz;
            const gmzArry = gmz.split("|");
            const newGmz = gmzArry[1];
            if(ios_native_url.indexOf('?') != -1 || andriod_native_url.indexOf('?') != -1){
                ios_native_url += '&cmpid=' + newGmz;
                andriod_native_url += '&cmpid=' + newGmz;
            }else{
                ios_native_url += '?cmpid=' + newGmz;
                andriod_native_url += '?cmpid=' + newGmz;
            }
        }
        if(ua && ua.match(/gome/i)) return;
        // ？？？安卓的无法唤醒吗？ 
        if(ua.indexOf('ucbrowser')>-1
            ||ua.indexOf('mqqbrowser')>-1
            ||ua.indexOf('iphone')>-1
            ||ua.indexOf('sogoumobilebrowser')>-1){
                if( ua.indexOf('micromessenger')>-1
                    || ua.indexOf('mqqbrowser qq')>-1){                            
                    return;
                }
            if(this.settings && this.settings.url){
            //自定义url模式
                var ios_native_url = this.settings.url;
                var andriod_native_url = this.settings.url;
            }
            if( location.href.indexOf('q.m') > 1 && location.pathname == '/' ){
                var ios_native_url = "gomeplusapp://" + location.host + '/rushbuy.html';
                var andriod_native_url = "gomeplusapp://" + location.host + '/rushbuy.html';
            }else if( location.href.indexOf('jr.m') > 1 && location.pathname == '/' ){
                var ios_native_url = "gomeplusapp://" + location.host + '/finance-index.html';
                var andriod_native_url = "gomeplusapp://" + location.host + '/finance-index.html';
            }else if( location.host == 'm.gome.com.cn' && location.pathname == '/' ){
                var ios_native_url = "gomeplusapp://" + location.host + '/index.html';
                var andriod_native_url = "gomeplusapp://" + location.host + '/index.html';
            }
            else if( location.host == 'm.gomeplus.com' && location.pathname == '/' ){
                var ios_native_url = "gomeplusapp://" + location.host + '/index.html';
                var andriod_native_url = "gomeplusapp://" + location.host + '/index.html';
            }
            const config_obj = {
                iosInstallUrl: ios_download_url,
                androidInstallUrl: andriod_download_url,
                iosNativeUrl: ios_native_url,
                andriodNativeUrl: andriod_native_url,
                packages: "com.gome.eshopnew"
            };
            this.redirectToNative(config_obj);
        }else{
            console.log('不在唤醒范围内')
            return;
        }         
    }

    //调起唤醒
    redirectToNative (config) {
        const userAgent = this._UA();
        if (!userAgent || userAgent === 'bili' || window.location.href.indexOf('cmpid=ad_') > -1) {
            return;
        }
        if (userAgent == 'ios') {
            this.installUrl = config.iosInstallUrl;
            this.nativeUrl = config.iosNativeUrl;
            this.openTime = config.iosOpenTime || 3000;
            console.log(this.nativeUrl);
        } else if (userAgent == 'weixin') {
            location.href = dUrl;
            this.nativeUrl = config.weixinNativeUrl;
        } else {
            this.installUrl = config.androidInstallUrl;
            this.nativeUrl = config.andriodNativeUrl;
            this.openTime = config.androidOpenTime || 3000;
            this.packages = config.packages || 'com.gome.eshopnew';
        }
        this._gotoNative();
 
    }

    _UA () {
        const ua = navigator.userAgent;
        const ua_low = navigator.userAgent.toLowerCase();
        //针对哔哩哔哩屏蔽唤醒
        if(ua_low.indexOf('bili-universal')>-1){
            return 'bili'
        }
        if (env.wechat) {
            return 'weixin';
        } else {
            if (env.ios) {
                return 'ios';
            } else if (env.android) {
                return 'android';
            } else {
                return '';
            }
        }

    }

    //唤醒
    _gotoNative () {
        const everyTime = getSearch() ;
        if(this.settings && this.settings.type == "default" && everyTime.indexOf("everyTime=y") == -1){
            const Days = 3;
            const time = Days*24*60*60*1000;
            const awaken = cookie.parse().awaken;
            if(!!awaken){
                console.log(this.nativeUrl)
                //7天打开的不能再唤醒？
                // location.href = this.nativeUrl;
                return;
            }
            if(location.hostname.indexOf('.gome.com.cn') != -1){
                cookie.set('awaken','true','time','.gome.com.cn');
            }else if(location.hostname.indexOf('.gomeplus.com') != -1){
                cookie.set('awaken','true','time','.gomeplus.com');
            }else if(location.hostname.indexOf('.uatplus.com') != -1){
                cookie.set('awaken','true','time','.uatplus.com');
            }else if(location.hostname.indexOf('.atguat.com.cn') != -1){
                cookie.set('awaken','true','time','.atguat.com.cn');
            }else if(location.hostname.indexOf('.plus.com.cn') != -1){
                cookie.set('awaken','true','time','.plus.com.cn');
            }else if(location.hostname.indexOf('.tslive.com.cn') != -1){
                cookie.set('awaken','true','time','.tslive.com.cn');
            }else if(location.hostname.indexOf('.tsliveplus.com') != -1){
                cookie.set('awaken','true','time','.tsliveplus.com');
            }else if(location.hostname.indexOf('gome.cn') != -1){
                cookie.set('awaken','true','time','gome.cn');
            }
        }

        let startTime = Date.now()
        let iframe = document.createElement('iframe')
        this.nativeUrl = this.nativeUrl + getSearch(this.nativeUrl)
        iframe.id = 'J_redirectNativeFrame'
        iframe.style.display = 'none'
        iframe.src = this.nativeUrl
        if(env.android){
            document.body.appendChild(iframe)
        }else if(env.ios && env.wechat && this.settings.type == "download"){
            location.href = this.nativeUrl
        }else{
            console.log(this.nativeUrl);
            location.href = this.nativeUrl
        }
        setTimeout( () =>  {
            if(env.android)
                document.body.removeChild(iframe);
            if(env.ios && env.wechat && this.settings.type == "download"){
                location.href = dUrl;
            }
            //唤醒模式也会进来这个方法
            //屏蔽下
            if(this.settings && this.settings.type == "default"){
                //do nothing
            }
            else if(this.settings && this.settings.type == "download"){
                this._gotoDownload(startTime);
            }
        }, this.openTime);
    }

    _gotoDownload (startTime) {
        const endTime = Date.now();
        if (endTime - startTime < this.openTime + 500) {
            console.log(endTime - startTime)
            console.log(this.openTime + 500)
            //安卓渠道包跳转url
            //var ua = navigator.userAgent;
            if(env.android){
                if(location.host == 'm.gome.com.cn' && location.pathname == '/' || location.host == 'm.gomeplus.com' && location.pathname == '/' || location.host == 'm.uatplus.com' && location.pathname == '/'){
                    window.location.href = 'http://shouji.gome.com.cn/kd/W0003.html';
                }else if( location.href.indexOf('prom.m') > 1 ){
                    window.location.href = 'http://shouji.gome.com.cn/kd/W0005.html';
                }else if( location.pathname == '/goods_class.html'){
                    window.location.href = 'http://shouji.gome.com.cn/kd/W0006.html';
                   // alert(window.location.href);
                }else if( location.href.indexOf('item.m') > 1 ){
                    window.location.href = 'http://shouji.gome.com.cn/kd/W0007.html';
                }else if( location.pathname == '/category.html' ){
                    window.location.href = 'http://shouji.gome.com.cn/kd/W0008.html';
                }
            } else if(env.ios){
                window.location.href = dUrl;
            } else {
                window.location.href = dUrl;
            }
            
        }
    }

}
if(location.host == 'm.gome.com.cn'){  
    if(location.pathname == '/category.html' ){}else{}  
} 

export default function (options) {
    new appstart(options);
};

