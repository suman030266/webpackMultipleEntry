<template>
    <div class="ui-scroll" ref="scroll">
        <div class="ptr layer" v-html="refreshEl"></div>
        <slot></slot>
    </div>
</template>
<script>
const STATE_PENDING = 'pending',
      STATE_PULLING = 'pulling',
      STATE_RELEAING = 'releasing',
      STATE_REFRESHING = 'refreshing',
      EVENT_REFRESHING = 'refreshing';
export default {
    name: 'pullToRefresh',
    props: {
         refreshCallback: {
            default: () => {//下拉回调
            },
            type: Function
        },
        offset:{
            default:90,
            type:Number
        },
        _text_:{
            default:()=>{
                return {
                    pending: '下拉加载更多',
                    pulling: '放开刷新',
                    releasing: '放开刷新',
                    refreshing: '正在加载...'
                }
            },
            type:Object
        },
        scrollContainer:{
            default:()=>{return document.body},
            type:HTMLBodyElement
        }
    },
    data() {
        return {
           state:STATE_PENDING,
           refreshEl:'<em class="pending"></em>',
           container:'',
           pullStartY:0,
           pullMoveY:0,
           diff:0, // y轴滚动的距离
           noMore:false, // 没有更多数据
           state:STATE_PENDING // pending, pulling, releasing, refreshing
        };
    },
    created() {
       
    },
    mounted() {
        this._eventName = this.whichTransitionEvent();
        this.container = this.$refs.scroll;
        this.init();
    },
    methods: {
        init(){
            var container =  this.container;
            // container.prepend(this.refreshLayer);
            // container.addClass('ptr');

            this.addEvent(container,'touchstart',this._onTouchStart.bind(this));
            this.addEvent(container,'touchmove',this._onTouchMove.bind(this));
            this.addEvent(container,'touchend',this._onTouchEnd.bind(this));
        },
        whichTransitionEvent(){
            var t;
            var el = document.createElement('fakeelement');
            var transitions = {
                'WebkitTransition':'webkitTransitionEnd',
                'transition':'transitionEnd'
            };
            var name = transitions['transition'];

            for(t in transitions){
                if( el.style[t] !== undefined ){
                    name = transitions[t];
                    break;
                }
            }
            return name;
        },
        addEvent(dom,event,fn){
            dom.addEventListener(event,fn,false)
        }, 
        removeEvent(dom,event,fn){
            dom.removeEventListener(event,fn,false)
        }, 
        _onTouchStart: function(e) {
            // 如果是刷新状态
            if(this.state === STATE_REFRESHING){
                return;
            }
            var touch = e.targetTouches[0];
            this.pullStartY = touch.screenY;
            // 不用pageY是因为该值包含滚动条
            this.state = STATE_PENDING;
        },
        _onTouchMove: function(e) {
            if(this.state === STATE_REFRESHING){
                // e.preventDefault();
                return;
            }
            var touch = e.targetTouches[0];
            var pullMoveY = this.pullMoveY = touch.screenY;

            if(this.state === STATE_PENDING){
                this._refreshUpdate(STATE_PULLING);
            }
            var diff = pullMoveY - this.pullStartY;
            var scrollTop = this.scrollContainer.scrollTop;

            if(diff > 0 && scrollTop <= 0){
                e.preventDefault(); // 必须阻止move的默认事件
                var translate = Math.pow(diff, 0.85);
                var offset = this.offset;
                this.transform('translate3d(0,' + translate + 'px,0)');
                if(this.state === STATE_PULLING && translate > offset){
                    this._refreshUpdate(STATE_RELEAING);
                }
                if(this.state === STATE_RELEAING && translate < offset){
                    this._refreshUpdate(STATE_PULLING);
                }
            } else {
                // 正常滚动状态
                this._refreshUpdate(STATE_PENDING);
            }
        },
        _onTouchEnd: function(e) {
            if(this.state === STATE_REFRESHING || this.state === STATE_PENDING){
                return;
            }
            this.addClass(this.container,'transitioning');
            if(this.state === STATE_RELEAING){
                this._refreshUpdate(STATE_REFRESHING);
                this.addClass(this.container,'refreshing');
                this.refreshCallback();
                // this.container.trigger(EVENT_REFRESHING);
                this.transform('');
            } else {
                this._reset();
            }
            this.pullStartY = this.pullMoveY = 0;
            this.diff = 0;
        },
        hasClass(ele,cls) {
            return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
        },
        addClass(ele,cls) {
            if (!this.hasClass(ele,cls)) ele.className += " "+cls;
        },
        removeClass(ele,cls) {
            if (this.hasClass(ele,cls)) {
                var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
                ele.className=ele.className.replace(reg,' ');
            }
        },
        _refreshUpdate: function(state) {
            // var refreshLayer = this.refreshLayer;
            var text = this._text_;

            this.state = state;
            if(this.noMore){
                this.refreshEl = '没有更多了';
            } else {
                if(STATE_PULLING === state){
                     this.refreshEl = '<em class="pending"></em>';
                } else if(STATE_RELEAING === state){
                     this.refreshEl = '<em class="pending"></em>';
                } else if(STATE_REFRESHING === state){
                     this.refreshEl = '<em class="refreshing"></em>';
                }
            }
        },
        _reset: function(){
            var that = this;
            
            this.transform('translate3d(0,' + 0 + ',0)');
            this.pullStartY = this.pullMoveY = 0;
            this.diff = 0;

            var container = this.container;
            var onTransitionEnd = function(){
                that.removeClass(container,'transitioning refreshing');
                that._refreshUpdate(STATE_PENDING);
                that.removeEvent(container,this._eventName,onTransitionEnd);
            };
            this.addEvent(container,this._eventName,onTransitionEnd);
            // container.one(this._eventName, onTransitionEnd);
        },
        transform: function(transform) {
            var style = this.container.style;
            style.webkitTransform = style.transform = transform;
        },
        loadDone: function() {
            this._reset();
        },
        on: function(event, fn) {
            this.addEvent(this.$refs.scroll,event,fn)
        },
        noMoreData: function(){
            this.noMore = true;
            this.refreshEl = '没有更多了'
        }
    }
};
</script>
<style scoped lang="scss">
    .ui-scroll{
        .refresh-header{
            margin-top: -1.6rem;
            text-align: center;
            img{
                width: 1.6rem;
                height: 1.6rem;
            }
        }
    }
</style>