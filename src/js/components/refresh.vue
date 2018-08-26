<template>
    <div class="ui-scroll" ref="scroll">
        <div ref="content" class="refresh-header" v-show="headerShow">
            <img v-show="!iconShow" class="load-png" src="../../images/public/load1.png">
            <img class="load-gif" v-show="iconShow" src="../../images/public/load1.gif">
          <!--   <span v-show="iconShow"
                  class="icon">
                <i class="fa fa-spinner fa-spin"></i>
            </span>
            <span>{{text}}</span> -->
        </div>
        <slot></slot>
    </div>
</template>
<script>
export default {
    name: 'pullToRefresh',
    props: {
        headerShow: {
            default: false,
            type: Boolean
        },
        scrollTop:{
            default: 0,
            type: Number
        },
        pullToRefreshText: {
            default: '下拉刷新',
            type: String
        },
        releaseRefreshText: {
            default: '释放刷新',
            type: String
        },
        refreshingText: {
            default: '正在刷新中...',
            type: String
        },
        refreshSuccess: {
            default: '刷新成功！',
            type: String
        },
        refreshError: {
            default: '刷新失败！',
            type: String
        },
        // 下拉系数、百分比
        threshold: {
            default: 0.39,
            type: Number
        },
        // 移动系数
        refreshMove: {
            default: 200,
            type: Number
        },
        // 动画延迟
        animationDelay: {
            default: 300,
            type: Number
        },
        // 刷新状态延迟时间
        refreshingDuration: {
            default: 800,
            type: Number
        },
        // 更新前函数
        beforeRefresh: {
            default: () => {
                console.log('更新前...');
            },
            type: Function
        },
        // 正在更新函数
        onRefresh: {
            default: () => {
                console.log('正在更新中...');
            },
            type: Function
        },
        // 更新后回调
        refreshCallback: {
            default: () => {
                console.log('更新后的回调...');
            },
            type: Function
        },
        pullToCondition:{
            default: () => {
                return  document.body.scrollTop === 0 &&
                    document.documentElement.scrollTop === 0
            },
            type:Function
        },
        isMaxMoveHeight:{
            default:false,
            type:Boolean
        }
    },
    data() {
        return {
            iconShow: true,
            text: '',
            opts:{}
        };
    },
    created() {
        this.opts = {
            percentage: 0, // 拖动量百分比
            startY: 0, // 手指触摸位置
            endY: 0, // 手指释放位置
            refreshStatus: false, // 刷新时控制页面假死
            refreshProgress: false, // 处于刷新整个过程中的标识
            elOffsetHeight: 0, // 下拉刷新内容区的高度
            changeOneTime: 0 // move中只执行第一次的标识
        };
    },
    mounted() {
        this.init();
        this.handler();
    },
    methods: {
        init() {
            this.dom = this.$refs.scroll;
            this.content = this.$refs.content;
            this.opts.elOffsetHeight = this.content.offsetHeight || parseFloat(document.documentElement.style.fontSize) * 5;
        },
        handler() {
            var dom = this.dom;
            dom.addEventListener('touchstart', event => {
                if (!this.pullToCondition()) return;
                if (this.opts.refreshStatus) {
                    event.preventDefault();
                    return false;
                }
                this.opts.startY = event.touches[0].clientY;
                dom.style['transition'] = 'none';
                this.iconShow = false;
                this.text = this.pullToRefreshText;
            });
            dom.addEventListener('touchmove', event => {
                // 快速移动可能导致startY取值为0，percentage计算错误
                if(this.opts.startY === 0) {
                    return false;
                }
                if (this.opts.refreshStatus) {
                    event.preventDefault();
                    return false;
                }
                this.opts.endY = event.touches[0].clientY;
                this.opts.percentage =
                    (this.opts.startY - this.opts.endY) / window.screen.height;
                let translateY = -this.refreshMove * this.opts.percentage;
                // 只有scrollTop为且往下滚动时才触发
                // 同时判断是考虑到浏览器兼容性
                if (this.pullToCondition()) {
                    if (this.opts.percentage < 0) {
                        /**
                         * event.preventDefault()是整个程序的精髓。
                         * 从这个位置开始，页面的滚动都是模拟的，并非真正的滚动，
                         * 而是通过touchmove计算出translateY的差值通过translate3d来模拟滚动。
                         * 可以避免奇葩用户下拉之后又上拉的骚操作。
                         **/
                        window.isCanBgScale = false;
                        event.preventDefault();
                        this.opts.refreshProgress = true;
                        if (!this.opts.changeOneTime) {
                            this.beforeRefresh();
                            this.opts.changeOneTime = 1;
                        }
                        // 两段判断避免无用的dom节点操作
                        if (Math.abs(this.opts.percentage) < this.threshold) {
                            if (this.text == this.pullToRefreshText) {
                                this.text = this.pullToRefreshText; // 下拉刷新
                            }
                        } else {
                            if (this.text !== this.releaseRefreshText) {
                                this.text = this.releaseRefreshText; // 释放刷新
                            }
                        }
                        if(this.isMaxMoveHeight){
                            translateY = translateY > 40 ? 40 : translateY;
                        }
                        dom.style[
                            'transform'
                        ] = `translate3d(0, ${translateY}px, 0)`;

                    }else{
                        if(this.isMaxMoveHeight){
                            // this.refreshCallback();
                        }
                        // event.preventDefault();
                    }
                }
            });
            dom.addEventListener('touchend', event => {
                window.isCanBgScale = true;
                let that = this,
                    moveH = -this.refreshMove *  (this.opts.startY - this.opts.endY) / window.screen.height;
                if (this.opts.refreshStatus) {
                    event.preventDefault();
                    return false;
                }
                if (
                    Math.abs(this.opts.percentage) > this.threshold &&
                    this.opts.refreshProgress
                ) {
                    dom.style['transition'] = `transform ${
                        this.animationDelay
                    }ms`;
                    this.text = this.refreshingText;
                    this.iconShow = true;
                    if(this.isMaxMoveHeight){
                        this.opts.elOffsetHeight = this.opts.elOffsetHeight > 40 ? 40 : this.opts.elOffsetHeight;
                    }
                    dom.style['transform'] = `translate3d(0, ${
                        this.opts.elOffsetHeight
                    }px, 0)`;
                    // 进入刷新的状态
                    this.opts.refreshStatus = true;
                    this.onRefresh();
                    setTimeout(() => {
                        that.iconShow = false;
                        that.text = that.refreshSuccess;
                        dom.style['transform'] = 'translate3d(0,0,0)';
                        setTimeout(() => {
                            that.opts.refreshStatus = false;
                            if(moveH>=that.opts.elOffsetHeight){
                                that.refreshCallback();
                            }
                        }, that.animationDelay);
                    }, that.refreshingDuration);
                } else if (this.opts.refreshProgress) {
                    this.opts.refreshStatus = true;
                    dom.style['transition'] = `${this.animationDelay}ms`;
                    dom.style['transform'] = 'translate3d(0,0,0)';
                    if(this.isMaxMoveHeight){
                        this.refreshCallback();
                        // this.onRefresh();
                        // setTimeout(() => {
                        //     that.iconShow = false;
                        //     that.text = that.refreshSuccess;
                        //     dom.style['transform'] = 'translate3d(0,0,0)';
                        //     setTimeout(() => {
                        //         that.opts.refreshStatus = false;
                        //         if(moveH>=that.opts.elOffsetHeight){
                        //             that.refreshCallback();
                        //         }
                        //     }, that.animationDelay);
                        // }, that.refreshingDuration);
                    }
                    setTimeout(() => {
                        that.opts.refreshStatus = false;
                    }, that.animationDelay);
                }else{
                    if(this.isMaxMoveHeight){
                        // this.refreshCallback();
                    }
                }
                this.opts.refreshProgress = false; // 重置 “处于刷新整个过程中的标识”
                this.opts.changeOneTime = 0; // 重置 “move中只执行第一次的标识”
                this.opts.startY = 0; // 重置 “手指触摸位置”
                this.opts.endY = 0; // 重置 “手指释放位置”
                this.opts.percentage = 0; // 重置 “拖动量百分比”
            });
        }
    }
};
</script>
<style scoped lang="scss">
    /*@import 'https://cdn.bootcss.com/font-awesome/4.7.0/css/font-awesome.css';*/
    /*.ui-scroll .refresh-header {
        height: 80px;
        line-height: 80px;
        font-size: 18px;
        color: #000;
        margin-top: -80px;
        vertical-align: middle;
        text-align: center;
    }
    .ui-scroll .icon {
        display: inline-block;
    }*/
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