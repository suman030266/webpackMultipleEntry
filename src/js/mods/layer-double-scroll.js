/*滚定条双滚动问题*/
/**
 * params:{
 * 	  layer:string 滚动弹层的 #id或者.class 
 * 	  class:string body添加的类名
 * 	  callback：fun 点击非layer处关闭弹层的回调弹层的   
 * }
 */
import '../lib/classList.js';
export default function(params){
	let dom = params.layer || "",
		className = params.class || 'modal-open',
		callback = params.callback || function(){};
	if(!dom){return}
	var dialog = document.querySelector(params.layer);
	var touchX, touchY;
	window.ontouchstart = function(e) {
	  if (!document.body.classList.contains(className))
	    return;

	  var touch = e.changedTouches[0];

	  touchX = touch.screenX;
	  touchY = touch.screenY;
	  // alert(!dialog.contains(e.target))
	  if (!dialog.contains(e.target))
	    e.preventDefault();

	  if (dialog.scrollTop === 0)
	    e.preventDefault();
	  else if (dialog.scrollTop === dialog.scrollHeight - dialog.clientHeight)
	    e.preventDefault();
	};

	window.ontouchend = function(e) {
	  var touch = e.changedTouches[0];

	  if (Math.abs(touch.screenY - touchY) > 10 || Math.abs(touch.screenX - touchX) > 10)
	    return;

	  if (!dialog.contains(e.target)){
	     // document.body.classList.remove();
	     callback(e.target,className);
	  }


	  touchX = void 0;
	  touchY = void 0;
	};

	window.ontouchcancel = function(e) {
	  touchX = void 0;
	  touchY = void 0;
	};

	var padding = 1;

	requestAnimationFrame(function frame() {
	  var min = 0,
	    max = dialog.scrollHeight - dialog.clientHeight;

	  var val = dialog.scrollTop;

	  if (val === min) {
	    dialog.scrollTop += padding;
	  } else if (val === max) {
	    dialog.scrollTop -= padding;
	  }

	  requestAnimationFrame(frame);
	});
}
