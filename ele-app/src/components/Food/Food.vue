<template>
	<transition name="moveFood">
	  <div id="food" v-show="foodFlag" ref="foodDom">
	      <div class="food-content">
			<div class="image-header">
				<img :src="food.image">
				<div class="back" @click="hide">
					<i class="icon-arrow_lift"></i>
				</div>
			</div>
			<div class="content border-1px" >
				<h1 class="name">{{food.name}}</h1>
				<div class="detail">
					<span class="sellCount">月售{{food.sellCount}}份</span>
					<span class="rating">好评率{{food.rating}}%</span>
				</div>
				<div class="price">
					<span class="nowPrice">&yen;{{food.price}}</span>
					<span v-show="food.oldPrice" class="oldPrice"> &yen;{{food.oldPrice}}</span>
				</div>
				<div class="cartcontrol-wrapper">
					<v-cartcontrol :food="food" @add="addFood"></v-cartcontrol>
				</div>
				<transition name="fade">
					<div @click.stop.prevent="addFirst($event)" class="buy" v-show="!food.count || food.count ===0">加入购物车</div>
				</transition>
			</div>
			<v-split v-show="food.info"></v-split>
			<div class="info" v-show="food.info">
				<h1 class="title">商品介绍</h1>
				<p class="text">{{food.info}}</p>
			</div>
			<v-split v-show="food.ratings"></v-split>
			<div class="rating">
				<h1 class="title">商品评价</h1>
				<v-ratingselect @select="selectRating" @toggle="toggleContent" :selectType="selectType"
                        :onlyContent="onlyContent" :desc="desc"
                        :ratings="food.ratings"></v-ratingselect>
				<div class="rating-wrapper">
					<ul v-show="food.ratings && food.ratings.length" class="rating-ul">
						<li v-show="needShow(rating.rateType,rating.text)" v-for="(rating,index) in food.ratings" :key="index" class="rating-item border-1px">
							 
							 <div class="time">{{rating.rateTime | formaDate}}</div>
							 <p class="text">
							 	<span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}" class="rating-icon"></span>
							 	<span class="rating-text">{{rating.text}}</span>
							 </p>
							 <div class="user">
							 	<span class="name">{{rating.username}}</span>
							 	<img class="avatar" width="12" height="12" :src="rating.avatar">
							 </div>
						</li>
					</ul>
					<div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评论</div>
				</div>
			</div>
		  </div>
		  <v-shopcart ref="shopcart" class="shopcart"></v-shopcart>
	  </div>
   </transition>
</template>

<script>
    import Vue from 'vue'
	import BScroll from 'better-scroll'
	import Cartcontrol from '../Cartcontrol/Cartcontrol.vue'
	import Split from '../Split/Split.vue'
	import Shopcart from '../Shopcart/Shopcart.vue'
	import RatingSelect from '../RatingSelect/RatingSelect.vue'
	import {formaDate} from "../../common/js/date.js"
	// const POSITIVE = 0;
	// const NEGATIVE = 1;
	const ALL = 2;
	export default {
		name:"food",
		props: {
			food: {
				type: Object
			}
		},
		data() {
			return {
				foodFlag: false,
				selectType:ALL,
				onlyContent:true,
				desc: {
					all: '全部',
					positive: '推荐',
					negative: '吐槽'
				}
			}
		},
		methods: {
			show() {
				this.foodFlag = true;
				this.selectType = ALL;
				this.onlyContent = true;
				this.$nextTick( () => {
					if (!this.scroll) {
					this.scroll = new BScroll(this.$refs.foodDom,{
						click:true
					});
				} else {
					this.scroll.refresh(); //重新计算高度
				}
				})
			},
			hide() {
				this.foodFlag= false
			},
			addFirst(event) {
				if (!event._constructed) {
					return;
				}
				this.$emit('add',event.target);
				Vue.set(this.food,'count',1);
			},
			needShow(type,text) {
				if (this.onlyContent && !text) {
					return false;
				}
				if (this.selectType === ALL) {
					return true;
				}else {
					return type === this.selectType;
				}
			},
			addFood(target) {
				this._drop(target);
			},
			selectRating(thisType) {
				this.selectType = thisType;
				this.$nextTick( () => {
					this.scroll.refresh(); //重新计算高度
				})
			},
			toggleContent() {
				this.onlyContent = !this.onlyContent;
				this.$nextTick( () => {
					this.scroll.refresh(); //重新计算高度
				})
			},
			_drop(target) {
				// 异步执行下落动画
				this.$nextTick( () => {
					this.$refs.shopcart.drop(target);
				})
			},
		},
		components: {
			'v-cartcontrol' :Cartcontrol,
			'v-split': Split,
			'v-shopcart':Shopcart,
			'v-ratingselect':RatingSelect
		},
		created() {
			// 时间过滤器
			Vue.filter('formaDate',function (time) {
			let date = new Date(time);
			return formaDate(date,'yyyy-MM-dd hh:mm');
		})
		}
		
	}
</script>

<style lang="stylus">
  	@import "../../common/stylus/mixin.styl"
	#food
	  position fixed
	  left 0
	  top 0
	  bottom 48px
	  width 100%
	  background-color: #fff
	  z-index 30
	  &.moveFood-enter-active,&.moveFood-leave-active
  	    transition all .2s linear
  	  &.moveFood-enter-active
  	    transform translate3d(0,0,0)
  	  &.moveFood-leave-active
  	    transform translate3d(100%,0,0)
      &.moveFood-enter
        transform translate3d(100%,0,0)
      &.moveFood-leave
  	    transform translate3d(0,0,0)
	  .image-header
	  	position relative
	  	width 100%
	  	height 0
	  	padding-top 100%
	  	img
	  	  position absolute
	  	  top 0
	  	  left 0
	  	  width 100%
	  	  height 100%
	  .back
	  	position absolute
	  	top 10px
	  	left 0
	  	.icon-arrow_lift
	  	  display block
	  	  font-size 20px
	  	  padding 10px
	  	  color #fff
	  .content
	  	position relative
	  	padding 18px
	  	.name
	  	  font-size 14px
	  	  font-weight 700
	  	  color rgb(7,17,27)
	  	  line-height 14px
	  	.detail
	  	  margin 8px 0 18px 0
	  	  font-size 10px
	  	  color rgb(147,153,159)
	  	  line-height 10px
	  	  .sellCount
	  	  	margin-right 12px
	  	.price
	  	  .nowPrice
	  	  	font-size 14px
	  	  	font-weight 700
	  	  	color rgb(240,20,20)
	  	  	line-height 24px
	  	  .oldPrice	
	  	  	font-size 10px
	  	  	font-weight 700
	  	  	color #93999f
	  	  	line-height 24px
	  	  	text-decoration line-through 	
	    .cartcontrol-wrapper
	  	  position absolute
	  	  right 18px
	  	  bottom 18px  	  
	    .buy
	      position absolute
	      right 18px
	      bottom 18px
	      width 74px
	      height 24px
	      line-height 24px
	      border-radius 12px
	      font-size 10px
	      color #fff
	      text-align center
	      background-color: rgb(0,160,220)
	      z-index 30
	      &.fade-enter-active,&.fade-leave-active
	        transition all .2s
	      &.fade-enter-active
	        opacity 1
	      &.fade-leave-active
	        opacity 0
	      &.fade-enter,&.fade-leave
	        opacity 0
	  .info
	  	padding 18px
	  	.title
	  	  margin-bottom 12px
	  	  font-size 14px
	  	  color rgb(7,17,27) 
	  	  line-height 14px
	  	.text
	  	  padding 0 8px
	  	  font-size 10px
	  	  font-weight 200
	  	  color rgb(77,85,93) 	
	  	  line-height 24px  	
	  .rating
	  	padding-top 18px
	  	.title
	  	  margin-left 18px
	  	  font-size 14px
	  	  color rgb(7,17,27) 
	  	  line-height 14px 
	  .rating-wrapper
	    .no-rating
	      padding 16px
	      font-size 12px
	      color rgb(143,153,159)
	  	.rating-ul
	      .rating-item
	      	position relative
	      	padding 16px 0 16px 0
	      	margin 0 18px 0 18px
	      	border-1px(rgba(7,17,27,.1))
	      	.time
	      	  font-size 10px
	      	  color rgb(147,153,159)
	      	  line-height 12px
	      	.text
	      	  margin-top 6px
	      	  font-size 0
	      	  .rating-icon
	      	  	margin-right 4px
	      	  	line-height 24px
	      	  	vertical-align top
	      	  	font-size 12px
	      	  	&.icon-thumb_down
	      	  	  color rgb(147,153,159)
	      	  	&.icon-thumb_up
	      	  	  color rgb(0,160,220)
	      	  .rating-text
	      	  	font-size 12px
	      	  	color rgb(7,17,27)
	      	  	line-height 16px
	      	.user
	      	  position absolute
	      	  top 16px
	      	  right 18px
	      	  font-size 0
	      	  .name
	      	  	margin-right 6px
	      	  	vertical-align top
	      	  	line-height 12px
	      	  	font-size 10px
	      	  	color rgb(147,153,159)  
	      	  	.avatar
	      	  	  vertical-align top	
         
         
         
	  	 	  
</style>