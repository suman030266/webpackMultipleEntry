import Assign from '../lib/assign.js';
class Dialog {
	constructor(){
		this.defaults={
			content:"",
			btnId:"dialogBtn",
			btnContent:"确定",
			callback:null
		}
	}
	init(options){
		this.defaults = Assign(this.defaults,options);
		this.create();
	}
	create(){
		const content = this.defaults.content,
			  btnId = this.defaults.btnId,
			  btnContent = this.defaults.btnContent;
		const dialogLayer = document.createElement("div"),
			  conTem =`<div class="dialog-tit">${content}</div><div class="dialog-txt hidden"></div><div class="dialog-btn"><div class="" id="${btnId}">${btnContent}</div></div>`;
			  dialogLayer.className = "m-dialog";
			  dialogLayer.id = "dialogLayer";
			  dialogLayer.innerHTML = conTem;
			this.dialog = dialogLayer; 
			if(!document.querySelector("#dialogLayer")){
				document.body.appendChild(dialogLayer);
				dialogLayer.style.display = "block";
				document.documentElement.style.overflow = "hidden";  
				this.bindEvents();
			}
	}
	bindEvents(){
		let btn = document.querySelector("#"+this.defaults.btnId),
			self = this;
			if(btn){
				btn.onclick = function(){
					self.close();
					if(self.defaults.callback&&typeof self.defaults.callback === "function"){
						self.defaults.callback();
					}
				}
			}		
	}
	close(){
		document.body.removeChild(this.dialog);
		document.documentElement.style.overflow = "scroll";
	}
}
let dialog = (options) => {
    return new Dialog().init(options);
}
export default dialog;