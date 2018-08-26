import toast from 'mods/toast.js'
let bSet = function bSet() {
	try {
		localStorage.setItem("h5test", 'a');
		localStorage.removeItem("h5test");
	} catch (e) {
		toast({content:"当前浏览器不支持本地存储,请换用别的浏览器"});
		return false;
	}
	return true;
};
export function setItem(name, val) {
	if (bSet) {
		let value = val;
		if (val && val instanceof Object) {
			value = JSON.stringify(val);
		}
		window.localStorage.setItem(name, value);
	}
};

export function getItem(name) {
	if (!bSet) {
		return;
	}
	let item = localStorage.getItem(name);
	try {
		if (item.indexOf('{') === 0 || item.indexOf('[') === 0) {
			return JSON.parse(item);
		} else {
			return item;
		}
	} catch (e) {
		return item;
	}
};

export function removeItem(name) {
	let item = getItem(name);
	item ? window.localStorage.removeItem(name) : '';
};

export function clear() {
	window.localStorage.clear();
};