export function getScTop(){
	return Math.max(document.body.scrollTop,document.documentElement.scrollTop);
};
let scrollTop;
export function afterOpen(callback,className='modal-open'){
	scrollTop = getScTop();
	document.body.classList.add(className);
    document.body.style.top = -scrollTop + 'px';
    //兼容话题详情商品弹层
 //    if(scrollTop>document.querySelector('.topic-top').clientHeight){
	// 	callback && callback(scrollTop);
	// }
};
export function beforeClose(callback,className='modal-open'){
	document.body.style.top = '0px'
    document.body.classList.remove(className);
	callback && callback();
    window.scrollTo(0,scrollTop);
};
// export default {afterOpen,beforeClose}