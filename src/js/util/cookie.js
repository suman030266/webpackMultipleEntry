export function set(name, value,time,path) {
	try {
		let Days = 7,
			times = time || Days * 24 * 60 * 60 * 1000,
			paths = path || '/';
		let exp = new Date();
		exp.setTime(exp.getTime() + times);
		document.cookie = name + '=' + value + ';expires=' + exp.toString()+';path='+path;
	} catch (e) {
		alert(e.message);
	}
}

export function del(name) {
	name = name;
	let expires = new Date(0);
	document.cookie = name + '=' + ';expires=' + expires.toUTCString();
}

export function get(code) {
	let name = code;
	let allcookies = document.cookie;
	name += '=';
	let pos = allcookies.indexOf(name);
	if (pos !== -1) {
		let start = pos + name.length;
		let end = allcookies.indexOf(';', start);
		if (end === -1) end = allcookies.length;
		let value = allcookies.substring(start, end);
		return (value);
	} else return '';
}
// export default {get,del,set}