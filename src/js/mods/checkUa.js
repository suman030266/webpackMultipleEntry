function check(reg){
	let ua = window.navigator.userAgent;
	return ua.match(reg)?true:false;
}
let wechat = check(/MicroMessenger/i);
let ios = check(/iPhone|iPad/i);
let android = check(/android/i);
export default{wechat,ios,android}