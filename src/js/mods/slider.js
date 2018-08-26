 var scrollY;
 var distX = 0;
 var distY = 0;
class Slider{
    constructor(opts){
      var page = opts.page;
      this.wrap = opts.wrap;
      this.list = this.wrap.getElementsByTagName('ul')[0];
      this.lis = this.list.children;
      if(page){
        this.page = document.querySelector(page);
        this.pageList = this.page.getElementsByTagName('li');
        this.pageActive = opts.pageActive||'active';
      }
      
      this.w = this.lis[0].offsetWidth;
      this.fullScreen = opts.fullScreen||false;
      this.moveWidth = this.fullScreen?this.w:window.innerWidth;
      this.endCallback = opts.endCallback||function(){};
      this.allW = 0;
      this.update = this.updateIndex;
      // 初始化
      this.init();
      // 绑定事件
      this.bindEvent();
    }
    init(){
      var len = this.lis.length;
      // for (var i = 0; i < len; i++) {
      //   this.lis[i].style.webkitTransform = 'translate3d(' + i * this.w + 'px,0,0)';
      // }
      if(this.page){
        var cName= this.pageList[0].className;
        this.pageList[0].className = (cName?cName+' ':'')+this.pageActive;
      }
      this.idx = 0; // 当前显示的那个图片的索引
    }
    bindEvent(){
      var wrap = this.wrap,
        that = this,
        lis = this.lis,
        scale = this.moveWidth;
      window.onresize=function(){
         that.w = that.lis[0].offsetWidth;
         that.moveWidth = that.fullScreen?that.w:window.innerWidth;
      }  
      // 开始触摸
      var startFn = function(ev) {
        // ev.preventDefault();
        that.x = ev.touches[0].pageX;
        that.y = ev.touches[0].pageY;
        scrollY = undefined;
        that.offset = 0;
        that.startTime = new Date() * 1;
        wrap.addEventListener('touchmove', moveFn, false);
        wrap.addEventListener('touchend', endFn, false);
      }

      // 移动触摸
      var moveFn = function(ev) {
        ev.preventDefault();
        var pos = ev.touches[0];
        distX = pos.pageX-that.x;
        distY = pos.pageY-that.y;
        if ( typeof scrollY == 'undefined') { scrollY = !!( scrollY || Math.abs(distX) < Math.abs(distY) ); }
        // 移动的距离
        if(!scrollY ){
          that.offset =  distX;
          var move = that.allW+that.offset/2;
          that.list && (that.list.style.webkitTransform = 'translate3d(' + move + 'px,0,0)');
          that.list && (that.list.style.webkitTransition = 'none');
        }
       
        // 上一张
        // var p = that.idx - 1;
        // var t = p + 3;
        // for (p; p < t; p++) {
        //   lis[p] && (lis[p].style.webkitTransform = 'translate3d(' + ((p - that.idx) * scale + that.offset) + 'px,0,0)');
        //   lis[p] && (lis[p].style.webkitTransition = 'none');
        // }
      }

      // 触摸结束
      var endFn = function(ev) {
        var endTime = new Date() * 1;
        var touchTime = endTime - that.startTime;
        var offset = that.offset;
        var flag = (window.innerWidth) / 2;
        // 判断移动的距离和窗口的3分之一的关系，否则和 100 的关系
        if(distX==0) return;
        // e.preventDefault(); 
        if( !scrollY )
        {
          if (touchTime > 800) {
            if (offset >= flag) {
              that.go('-1'); // 上一张
            } else if (offset <= -flag) {
              that.go('+1'); // 下一张
            } else {
              that.go('0');
            }
          } else {
            if (offset >= 100) {
              that.go('-1'); // 上一张
            } else if (offset <= -100) {
              that.go('+1'); // 下一张
            } else {
              that.go('0');
            }
          }
        }
        wrap.removeEventListener('touchmove', moveFn, false);
        wrap.removeEventListener('touchend', endFn, false);
      }
      // 绑定事件
      wrap.addEventListener('touchstart', startFn, false);
    }
    updateIndex(index){
      this.idx = index;
      this.go(index);
    }
    changePage(n){
      for(var i = 0,len = this.pageList.length;i<len;i++){
        if(this.pageList[i].className!=""){
          this.pageList[i].className = this.pageList[i].className.replace(this.pageActive,"");
        }
      }
      var cName = this.pageList[n].className;
      this.pageList[n].className = (cName?cName+' ':'')+this.pageActive;
    }
    go(n){
      var oldIdx = this.idx, // 触摸前的索引
        nowIdx, // 触摸之后的索引
        lis = this.lis, // li数组
        len = lis.length, // 长度
        w = this.moveWidth;//移动宽度
      // 如果是点击索引跳转的
      if (typeof n == 'number') {
        nowIdx = n;
      } else if (typeof n == 'string') {
        nowIdx = oldIdx + n * 1;
      }

      if (nowIdx > len - 1) {
        nowIdx = len - 1
      } else if (nowIdx < 0) {
        nowIdx = 0;
      }
      this.list && (this.list.style.webkitTransition = '-webkit-transform 0.5s ease-out');
      this.list && (this.list.style.webkitTransform = 'translate3d(' + -(nowIdx*w) + 'px,0,0)');
      this.allW = -(nowIdx*w);
      this.page&&this.changePage(nowIdx);
      // lis[nowIdx - 1] && (lis[nowIdx - 1].style.webkitTransition = '-webkit-transform 0.5s ease-out');
      // lis[nowIdx] && (lis[nowIdx].style.webkitTransition = '-webkit-transform 0.5s ease-out');
      // lis[nowIdx + 1] && (lis[nowIdx + 1].style.webkitTransition = '-webkit-transform 0.5s ease-out');

      // lis[nowIdx - 1] && (lis[nowIdx - 1].style.webkitTransform = 'translate3d(-' + w + 'px,0,0)');
      // lis[nowIdx] && (lis[nowIdx].style.webkitTransform = 'translate3d(0,0,0)');
      // lis[nowIdx + 1] && (lis[nowIdx + 1].style.webkitTransform = 'translate3d(' + w + 'px,0,0)');
      if(n!='0'){
        this.endCallback(nowIdx);
      }
      this.idx = nowIdx;
    }
}
export default Slider