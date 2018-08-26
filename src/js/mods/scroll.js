import '../lib/classList.js';
class Scroll{
  constructor(container,selectorScrollable){
    if(!container){
       return;
    }
    this.data = {
       posY: 0,
       maxscroll: 0
    };
   this.el = document.querySelector(container);
   this.selectorScrollable = document.querySelector(selectorScrollable);
  }
  init(el){
    // this.prevY = 0;
    // this.scoll = this.el.children[0];
    // this.h = this.el.offsetHeight;//滑动范围高度
    // this.ch = this.el.scrollHeight;
    // this.initevent();
  }
  
  /**绑定事件*/
  addEvent (){
    this.el.addEventListener('touchstart', this.touchstart.bind(this), false);
    this.el.addEventListener('touchmove', this.touchmove.bind(this), false);
    this.el.addEventListener('touchend', this.touchend.bind(this), false);
    // window.onresize = function() {
    //     self.h = self.el.offsetHeight;//滑动范围高度
    //     self.ch = self.el.scrollHeight;
    // };
  }
  rmEvent(){
    this.el.removeEventListener('touchstart', this.touchstart.bind(this), false);
    this.el.removeEventListener('touchmove', this.touchmove.bind(this), false);
    this.el.removeEventListener('touchend', this.touchend.bind(this), false);
  }
  /**记录滑动初始位置*/
  touchstart(e){
    var events = event.touches[0] || event;
      
      // 先求得是不是滚动元素或者滚动元素的子元素
      var elTarget = event.target;
      
      // if (!elTarget.length) {
      //   return; 
      // }
      
      var elScroll;
      // 获取标记的滚动元素，自身或子元素皆可
      if (this.selectorScrollable.contains(event.target)) {
        elScroll = this.selectorScrollable;
      } else{
        elScroll = null;
      }
      
      if (!elScroll) {
        return;
      }
      
      // 当前滚动元素标记
      this.data.elScroll = elScroll;
      
      // 垂直位置标记
      this.data.posY = events.pageY;
      this.data.scrollY = elScroll.scrollTop;
      // 是否可以滚动
      this.data.maxscroll = elScroll.scrollHeight - elScroll.clientHeight;
  }

  /**手指移动时，滚动条滚动*/
  touchmove(e){
   // 如果不足于滚动，则禁止触发整个窗体元素的滚动
      if (this.data.maxscroll <= 0) {
        // 禁止滚动
        event.preventDefault();
      }
      // 滚动元素
      var elScroll = this.data.elScroll;
      // 当前的滚动高度
      var scrollTop = elScroll.scrollTop;
  
      // 现在移动的垂直位置，用来判断是往上移动还是往下
      var events = event.touches[0] || event;
      // 移动距离
      var distanceY = events.pageY - this.data.posY;
  
      // if (isSBBrowser) {
        // elScroll.scrollTop = this.data.scrollY - distanceY;
        // elScroll.trigger('scroll');
        // return;
      // }
  
      // 上下边缘检测
      if (distanceY > 0 && scrollTop == 0) {
        // 往上滑，并且到头
        // 禁止滚动的默认行为
        event.preventDefault();
        return;
      }
  
      // 下边缘检测
      if (distanceY < 0 && (scrollTop + 1 >= this.data.maxscroll)) {
        // 往下滑，并且到头
        // 禁止滚动的默认行为
        event.preventDefault();
        return;
      }
  }
  
  /**手指离开时，判断位置*/
  touchend(e){
    this.data.maxscroll = 0;
  }
}
/*let scroll = (el) => {
    return new Scroll().init(el);
}*/
export default Scroll 