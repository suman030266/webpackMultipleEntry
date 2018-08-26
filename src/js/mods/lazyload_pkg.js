/*
*@author:dongyukuan
*@desc:未执行的懒加载包，用于异步拉取的图片在首屏时，懒加载初始化
*@difference：复制的lazyload包，区别是在export时没有初始化
*/
import Assign from '../lib/assign.js';
import '../lib/array.js';
class LazyLoad {
	/*懒加载*/
	constructor() {
		let self = this;
		this.defaults = {
			winHeight: document.documentElement.clientHeight || document.body.clientHeight
		}
		this._lazyload();
		this._ListenerScroll();
		window.onload=function(){
			self._lazyload();
		}
	}
	init(options) {
		this.defaults = Assign(this.defaults, options);
	}
	lazyload() {
		var self = this;
		setTimeout(function() {
			self._lazyload();
		}, 300);
	}
	_ListenerScroll() {
		window.addEventListener('scroll', this._lazyload.bind(this), false);
	}
	_lazyload() {
		let elements = this._lazyLoadElement(),
			self = this;
		if (!elements && elements.length === 0) {
			return;
		}
		Array.from(elements, element => {
			self._beginLoad(element);
		});
	}
	_lazyLoadElement(element = 'img') {
		return document.querySelectorAll(element + '[social-src]') || false;
	}
	_getOffsetTop(element){
		var offTop = element.offsetTop,
		offsetP = element.offsetParent;
		while(offsetP){
			offTop+=offsetP.offsetTop;
			offsetP = offsetP.offsetParent;
		}
		return offTop;
	}
	_beginLoad(element) {
		let bodyTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop,
			currentTop = this._getOffsetTop(element);
		if (currentTop - bodyTop <= this.defaults.winHeight) {
			this._changeImgPath(element);
		}
	}
	_changeImgPath(element) {
		let img = new Image(),
			path = element.getAttribute('social-src'); 
		element.removeAttribute('social-src');
		img.onload = function() {
			if(path){
				element.setAttribute('src', path);
			}
		};
		img.src = path;
	}
}
export default LazyLoad;