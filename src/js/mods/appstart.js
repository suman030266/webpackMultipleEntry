/**
 * @Author :huangyihai
 * @time:2018-4-16
 */
import * as cookie from 'util/cookie.js';
const ua = navigator.userAgent,
	  isWechat = ua.match(/MicroMessenger/i) == 'micromessenger',
	  isIos = ua.indexOf('iPhone')>-1,
	  isAndroid = ua.indexOf('Android') > -1 || ua.indexOf('Linux') > -1,
	  host = location.host;
class Appstart{
	constructor(opt={},isNeedCorrectUrl=''){
	    this.type = opt.type ||'default';
	    this.url = opt.url || '';
	    this.channel = opt.channel || '';
	    this.isNeedCorrectUrl = isNeedCorrectUrl;
	    this.isEveryTime = false;
	    this.init();
    }
    init(){
    	const self = this;
    	if (ua.match(/gome/i)) return false
	    else if (ua.match(/58tongcheng/i)) return false
   		if(this.isNeedCorrectUrl){
   			let cmpid ='wap_m';
	        const __gmz = cookie.get('__gmz');
	        // __gmz用|分割，第二个元素是cmpid，若值为-，则代表无效cmpid
	        if (__gmz && __gmz.split('|')[1] != '-') {
	            cmpid = __gmz.split('|')[1]
	        } else {
	            if (host && host.match(/^\w*?\.m/)) {
	                cmpid = `wap_${host.match(/^(\w*?)\.m/)[1]}`
	            }
	        }
	        if (this.url.match(/cmpid/)){
	            return
	        }else{
	            if(this.url.match(/\?/)){
	                this.url += `&cmpid=${cmpid}`
	            }else{
	               this.url += `?cmpid=${cmpid}`
	            }
	        }
   		}else{
   			let pathname = location.pathname;
   			if (!this.url) {
   	// 			let hosts = '';
				// if(host === 'circle-m-dev.atguat.com.cn'){
			 //    	hosts = host.replace(/-/g,'.');
			 //    }
	            this.url = `gomeplusapp://${host + pathname + this.getSearch()}`
		    }
   		}
   		if (location.search.match(/everyTime\=y/i)) {
	        this.isEveryTime = true
	    }
	 	switch (self.type) {
	        // download是唤醒+下载的
	        case 'download':
	            if (isWechat) {
	                self.downLoad(self.channel)
	            }else{
	                self.wakeUpApp(self.url, true, () => {
	                    self.downLoad(self.channel)
	                })
	            }
	            break;
	        // onlyDownload是下载的
	        case 'onlyDownload':
	            self.downLoad(self.channel)
	            break;
	        // default是自动唤醒
	        case 'default':
	        default:
	            if (isWechat) {
	                return
	            }
	            self.wakeUpApp(self.url, self.isEveryTime)
	            break;
	    }
    }
    wakeUpApp(url,isEveryTime,cb){
    	// console.log(url)
    	if (this.isWakeUp(isEveryTime)) {
    	    //通过设置cookie，设定n天内不再唤醒
    	    this.setWakeUpTime();
    	    this.checkUserLeave(cb);
    	    if (isIos) {
    	        setTimeout(() => {
    	            location.href = url
    	        },1000)
    	    } else {
    	        // android
    	        const iframe = document.createElement('iframe')
    	        iframe.style.display = 'none'
    	        iframe.src = url
    	        document.body.appendChild(iframe)
    	    }
    	}
	}
	isWakeUp(isEveryTime){
		if (ua.match(/bili-universal/i)) return false
	    if (isEveryTime) {
	        return true
	    }
	    // 判断是否document.refferrer为空字符
	    const awaken = document.referrer
	    // 为空则唤醒
	    if (awaken == "" || !awaken.match(/\.gome\.com\.cn/)) {
	        return true
	    }
	    return false
	}
	getSearch(){
		let search = location.search;
		if (search && search.match(/cmpid/)) {
	        return search
	    }
	    const __gmz = cookie.get('__gmz');
	    let result = ''
	    let cmpid = 'wap_m'
	    try {
	        // __gmz用|分割，第二个元素是cmpid，若值为-，则代表无效cmpid
	        if (__gmz && __gmz.split('|')[1] != '-') {
	            cmpid = __gmz.split('|')[1]
	        } else {
	            if (host && host.match(/^\w*?\.m/)) {
	                cmpid = `wap_${host.match(/^(\w*?)\.m/)[1]}`
	            }
	        }
	        if (search) {
	            result = `${search}&cmpid=${cmpid}`
	        } else {
	            return `?cmpid=${cmpid}`
	        }
	    } catch (e) {
	        /* istanbul ignore next */
	        result = ''
	    }
	    return result
	}
	downLoad(channel){
		//社交 渠道号 W0009 
		const url = 'http://shouji.gome.com.cn/kd/W0009.html';
		location.href = url;
	}
	setWakeUpTime(){//唤醒之后多久之后不再唤醒
		const rootDomain = host.replace(/^(\w+\.)?m\./, '.'),
			  time = 3 * 24 * 60 * 60 * 1000;	  	
		cookie.set('awaken','true', time, rootDomain)
	}
	checkUserLeave(cb = function(){}) {
	    const timeTrigger = 3000;
	    const wakeTime = new Date()*1;
	    let leaveTime = wakeTime + timeTrigger;
	    // 用3s判断用户是否走了
	    setTimeout(() => {
	    // 用户3s内都没离开, 触发回调，回调中进行下载
	        if (leaveTime - wakeTime >= timeTrigger) {
	            cb()
	        }
	    }, timeTrigger)
	    document.addEventListener('visibilitychange', function onChange () {
	        document.removeEventListener('visibilitychange', onChange)
	        /* istanbul ignore next */
	        if (document.visibilityState) {
	            leaveTime = new Date().getTime()
	        }
	    })
	}
}
export default Appstart