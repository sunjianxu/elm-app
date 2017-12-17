<template>
	<div id="shopcart">
		<div class="content" @click="toggleList">
			<div class="content-left">
				<div class="logo-wrapper">
					<div class="logo" :class="{'highlight': totalCount > 0}">
						<i class="icon-shopping_cart" :class="{'highlight': totalCount > 0}"></i>
					</div>
					<div class="num" v-show="totalCount > 0">{{totalCount}}</div>
				</div>
				<div class="price" :class="{'highlight':totalPrice > 0}">&yen;{{totalPrice}}</div>
				<div class="descrition">另需配送费&yen;{{deliveryPrice}}元</div>
			</div>
		  <div class="content-right" :class="{'clearing':totalPrice >= minPrice}" @click.stop.prevent="clearing">{{playMoney}}</div> 
		</div>
		<!-- 购物车小球动画 -->
		<div class="ball-container">
			<div  v-for="(ball,index) in balls" :key="index">
	          <transition name="drop" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
	           <div class="ball" v-show="ball.show">
	             <div class="inner inner-hook"></div>
	           </div>
	         </transition>
	        </div>
        </div>
        <transition name="moveTop">
        	  <div class="shopcart-list" v-show="listShow">
        	<div class="header border-1px">
        		<span class="title">购物车</span>
        		<span class="empty" @click="empty">清空</span>
        	</div>
        	<div class="list-content" ref="contentList">
        		<ul>
        			<li class="food border-1px" v-for="(food,index) in selectFoods" :key="index">
        				<span class="name">{{food.name}}</span>
        				<div class="price">
        					<span>￥{{food.price * food.count}}</span>
        				</div>
        				<div class="cartcontrol-wrapper">
        					<v-cartcontrol :food="food"></v-cartcontrol>
        				</div>
        			</li>
        		</ul>
        	</div>
        </div>
        </transition>
        <transition name="bgFade">
        	<div class="list-mask" v-show="listShow" @click="closeBg"></div>
        </transition>
	</div>
	
</template>

<script>
	import BScroll from 'better-scroll'
	import Cartcontrol from '../Cartcontrol/Cartcontrol.vue'
	export default {
		name:"shopcart",
		data() {
		 return {
		 	balls:[
		 		{show:false},
		 		{show:false},
		 		{show:false},
		 		{show:false},
		 		{show:false}
		 	],
		 	dropBalls:[],
		 	fold: true
		 }


		},
		components:{
			'v-cartcontrol':Cartcontrol
		},
		methods: {
	      drop(el) { 
	      //触发一次事件就会将所有小球进行遍历
	        for (let i = 0; i < this.balls.length; i++) {
	          let ball = this.balls[i];
	          if (!ball.show) { //将false的小球放到dropBalls
	            ball.show = true;
	            ball.el = el; //设置小球的el属性为一个dom对象
	            this.dropBalls.push(ball); 
	            return;
	          }
	        }
	      },

	      beforeEnter(el){ //这个方法的执行是因为这是一个vue的监听事件
	        let count = this.balls.length;
	        while (count--) {
	          let ball = this.balls[count];
	          if (ball.show) {
	            let rect = ball.el.getBoundingClientRect(); //获取小球的相对于视口的位移(小球高度)
	            let x = rect.left - 32;
	            let y = -(window.innerHeight - rect.top - 22); //负数,因为是从左上角往下的的方向
	            el.style.display = ''; //清空display
	            el.style.webkitTransform = `translate3d(0,${y}px,0)`; 
	            el.style.transform = `translate3d(0,${y}px,0)`;
	            //处理内层动画
	            let inner = el.getElementsByClassName('inner-hook')[0]; //使用inner-hook类来单纯被js操作
	            inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
	            inner.style.transform = `translate3d(${x}px,0,0)`;
	          }
	        }
	      },

	      enter(el, done) { //这个方法的执行是因为这是一个vue的监听事件
	        /* eslint-disable no-unused-vars */
	        let rf = el.offsetHeight; //触发重绘html
	        this.$nextTick(() => { //让动画效果异步执行,提高性能
	          el.style.webkitTransform = 'translate3d(0,0,0)';
	          el.style.transform = 'translate3d(0,0,0)';
	          //处理内层动画
	          let inner = el.getElementsByClassName('inner-hook')[0]; //使用inner-hook类来单纯被js操作
	          inner.style.webkitTransform = 'translate3d(0,0,0)';
	          inner.style.transform = 'translate3d(0,0,0)';
	          el.addEventListener('transitionend', done); //Vue为了知道过渡的完成，必须设置相应的事件监听器。
	        });
	      },

	      afterEnter(el) { //这个方法的执行是因为这是一个vue的监听事件
	        let ball = this.dropBalls.shift(); //完成一次动画就删除一个dropBalls的小球
	        if (ball) {
	          ball.show = false;
	          el.style.display = 'none'; //隐藏小球
	        }
	      },
	      toggleList() {
	      	if (!this.totalCount) {
	      		return;
	      	}
	      	this.fold = !this.fold;
	      },

	      empty() {
	      	this.selectFoods.forEach( (food) => {
	      		food.count = 0;
	      	})
	      },
	      closeBg() {
	      	this.fold = true
	      },
	      clearing() {
	      	if (this.totalPrice < this.minPrice) {
	      		return;
	      	}
	      	window.alert(`需支付的总金额是${this.totalPrice + 4}元(带配送费)`);
	      }
   		 },
		props: {
			selectFoods: {
				type:Array,
				default() {
					return []
				}
			},
			deliveryPrice: {
				type:Number,
				default: 0
			},
			minPrice:{
				type:Number,
				default: 0
			}
		},
		computed: {
			totalPrice() {
				let total = 0;
				this.selectFoods.forEach( (food) => {
					total += food.price * food.count;
				} )
				return total;
			},
			totalCount() {
				let count = 0;
				this.selectFoods.forEach( (food) => {
					count += food.count;
				} )
				return count;
			},
			playMoney() {
				if (this.totalPrice === 0) {
					return '￥' + this.minPrice + '起送'
				}else if (this.totalPrice < this.minPrice) {
					let disff = this.minPrice - this.totalPrice
					return '还差￥' + disff + '起送'
				} else {
					return '去结算'
				}
			},
			listShow() {
				if (!this.totalCount) {
					this.fold = !this.fold;
					return false;
				}
				let show = !this.fold;
				if (show) {
					this.$nextTick( () => {
						if (!this.scroll) {
							this.scroll = new BScroll(this.$refs.contentList,{
							click:true
						});
						} else {
							this.scroll.refresh();
						}
					})
				}
				return show;
			}


		}

	}
</script>

<style lang="stylus">
	@import '../../common/stylus/mixin.styl'
	#shopcart
	  position fixed
	  left 0
	  bottom 0
	  width 100%
	  height 48px
	  z-index 99
	  .content
	  	display flex
	  	height 48px
	  	.content-left
	  	  flex 1
	  	  font-size 0
	  	  background #141d27
	  	  .logo-wrapper
	  	    position relative
	  	    left 12px
	  	    bottom 8px
	  	    display inline-block
	  	    width 44px
	  	    height 48px
	  	    background-color #141d27
	  	    border-radius 50%
	  	    padding 6px
	  	    .logo 
	  	      width 44px
	  	      height 44px
	  	      border-radius 50%
	  	      margin-bottom 8px
	  	      background-color #2b343c
	  	      text-align center
	  	      font-size 24px
	  	      line-height 44px
	  	      &.highlight
	  	      	background-color rgb(0,160,220)
	  	      .icon-shopping_cart
	  	      	color #80858a
	  	      	&.highlight
	  	          color #fff
	  	    .num
	  	      position absolute
	  	      top 0
	  	      right 0
	  	      width 24px
	  	      height 16px
	  	      line-height 16px 
	  	      text-align center
	  	      font-size 9px
	  	      font-weight 700
	  	      color rgb(255,255,255)
	  	      background-color rgb(240,20,20)
	  	      border-radius 16px
	  	      box-shadow 0 4px 8px 0px rgba(0,0,0,.4)     
	  	  .price 
	  	  	display inline-block
	  	  	vertical-align top
	  	  	padding 0 12px 0 18px
	  	  	font-size 16px
	  	  	color rgba(255,255,255,.4)
	  	  	font-weight 700
	  	  	line-height 24px
	  	  	margin-top 12px
	  	  	text-align center
	  	  	border-right 1px solid rgba(255, 255, 255, .1)
	  	  	&.highlight
	  	  	  color #fff
	  	  .descrition
	  	  	display inline-block
	  	  	vertical-align top
	  	  	margin 12px 12px 0 12px
	  	  	font-size 10px
	  	  	color rgba(255, 255, 255, .4)
	  	  	font-weight 700
	  	  	line-height 24px  		
	  	.content-right
	  	  flex 0 0 105px
	  	  width 105px
	  	  height 48px
	  	  font-size 12px
	  	  text-align center
	  	  color rgba(255, 255, 255, .4)
	  	  font-weight 700
	  	  line-height 48px
	  	  background-color #2b333b
	  	  &.clearing
	  	  	background-color #00b43c
	  	  	color #fff 
	  .ball-container
	  	.ball
	  	  position fixed
	  	  left 32px
	  	  bottom 22px
	  	  z-index 200
	  	  transition all .5s cubic-bezier(0.49,-0.29,0.75,0.41)
	  	  .inner
	  	  	width 16px
	  	  	height 16px
	  	  	border-radius 50%
	  	  	background-color rgb(0,160,220)
	  	  	transition all 0.5s linear	
	  .shopcart-list
	  	position absolute
	  	left 0
	  	bottom 48px 
	  	width 100%
	  	max-height 281.5px
	  	z-index -1
	  	.header
	      width 100%
	      height 40px
	      line-height 40px
	      background-color #f3f5f7 
	      border-1px(rgba(7, 17, 0, .1))
	      padding 0 18px
	      box-sizing border-box
	      .title
	      	float left
	      	font-size 14px
	      	font-weight 700
	      	color rgb(7,17,27)
	      .empty
	      	float right
	      	font-size 14px 
	      	color rgb(0,160,220)
	    .list-content
	      background-color #fff
	      padding 0 18px 
	      max-height 241.5px
	      overflow: hidden
	      .food
	      	width 100%
	      	height 48px
	      	line-height 48px
	      	border-1px(rgba(7, 17,27,.1))
	      	.name
	      	  font-size 14px
	      	  color rgb(7,17,27)
	      	.price
	      	  position absolute
	      	  top 12px
	      	  right 90px
	      	  font-size 10px
	      	  font-weight 700
	      	  line-height 24px
	      	  color rgb(240,20,20)
	      	.cartcontrol-wrapper
	      	  position absolute
	      	  right 0
	      	  bottom 12px
	      	  line-height 24px
	  .moveTop-enter-active,.moveTop-leave-active
	  	transform translate3d(0,0,0)
	  	transition all .6s
	  .moveTop-enter-active
	  	transform translate3d(0,0,0)
	  .moveTop-leave-active
	  	transform translate3d(0,200%,0)
	  .moveTop-enter,.moveTop-leave
	  	transform translate3d(0,200%,0)
	  .list-mask
	  	width 100%
	  	height 100%
	  	position fixed
	  	top 0
	  	left 0
	  	background-color rgba(7,17,27,.6)
	  	backdrop-filter blur(10px)  //针对ios系统的背景模糊效果
	  	z-index -50
	  .bgFade-enter-active,.bgFade-leave-active
	  	transition all .6s
	  .bgFade-enter-active
	  	opacity 1
	  .bgFade-leave-active
	  	opacity 0
	  .bgFade-enter,.bgFade-leave
	  	opacity 0
	  
	  
     		
</style>