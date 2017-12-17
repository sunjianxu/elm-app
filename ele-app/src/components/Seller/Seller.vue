<template>
	<div id="seller" ref="seller">
		<div class="seller-content">
			<div class="overview">
				<h1 class="title">{{seller.name}}</h1>
				<div class="desc border-1px">
					<v-star :size="36" :score="seller.score" class="star"></v-star>
				    <span class="text">({{seller.ratingCount}})</span>
				    <span class="text">月售{{seller.sellCount}}单</span>
				</div>
				<ul class="remark">
					<li class="block">
						<h2>起送价</h2>
						<div class="content">
							<span class="stress">{{seller.minPrice}}</span>元
						</div>
					</li>

					<li class="block">
						<h2>商家配送</h2>
						<div class="content">
							<span class="stress">{{seller.deliveryPrice}}</span>元
						</div>
					</li>

					<li class="block">
						<h2>平均配送时间</h2>
						<div class="content">
							<span class="stress">{{seller.deliveryTime}}</span>分钟
						</div>
					</li>
				</ul>
				<div class="collect-wrapper" @click="toggleCollect($event)">
					<i class="icon-favorite" :class="{'active' :favorite}"></i>
					<p class="collect">{{collectText}}</p>
				</div>
			</div>
			<v-split></v-split>
			<div class="bulletin">
				<h1 class="title">公告与活动</h1>
				<div class="content-wrapper border-1px">
					<p class="content">{{seller.bulletin}}</p>
				</div>
				<ul v-if="seller.supports" class="support">
					<li class="support-item border-1px" v-for="(item,index) in seller.supports">
						<span :class="classMap[seller.supports[index].type]" class="icon"></span>
						<span class="text">{{seller.supports[index].description}}</span>
					</li>
				</ul>
			</div>
			<v-split></v-split>
			<div class="pics">
				<h1 class="title">商家实景</h1>
				<div class="pic-wrapper" ref="picWrapper">
					<ul class="pic-list" ref="picList"> 
						<li class="pic-item" v-for="(item,index) in seller.pics" :key="index">
							<img :src="item" width="120" height="90" >
						</li>
					</ul>
				</div>
			</div>
			<v-split></v-split>
			<div class="info">
				<h1 class="title">商家信息</h1>
				<ul> 
					<li class="info-item" v-for="(item,index) in seller.infos">{{item}}</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
    import BScroll from 'better-scroll'
	import Star from '../Star/Star.vue'
	import Split from '../Split/Split.vue'
	import {saveToLocal,loadFromLocal} from '../../common/js/store.js'
	export default {
		name: 'seller',
		data() {
			return {
				classMap:[],
				favorite: (() => {
                    return loadFromLocal(this.seller.id, 'favorite', false);
                })()
			}
		},
		computed:{
			collectText() {
				return this.favorite ? '已收藏':'收藏';
			}
		},
		props: {
			seller: {
				type: Object
			}
		},
		components: {
			'v-star':Star,
			'v-split':Split
		},
		created() {
			this.classMap = ['decrease','discount','special','invoice','guarantee'];
		},
		mounted() {
			this._initScroll();
			this._initPics();
		},
		wacth:{
			'seller'() {
				this._initScroll();
				this._initPics();
			}
		},
		methods:{
			_initScroll() {
				if (!this.scroll) {
					this.scroll = new BScroll(this.$refs.seller,{
				          click:true
			       });
				}else {
					this.scroll.refresh();
				}
			},
			_initPics() {
				if (this.seller.pics) {
				let picwidth = 120;
				let marginRight = 6;
				let width = (picwidth + marginRight) * this.seller.pics.length - marginRight;
				this.$refs.picList.style.width = width + 'px'; //设置ul的宽度
				if (!this.picScroll) {
					this.$nextTick( () => {
					this.picScroll = new BScroll(this.$refs.picWrapper,{
						scrollX: true, //横向滚动
						eventPassthrough: 'vertical'//允许外层垂直滚动
					})
				})
				} else {
					this.picScroll.refresh();
				}
			}
			},
			toggleCollect(event) {
				if (!event._constructed) {
					return;
				}
				this.favorite = !this.favorite;
				saveToLocal(this.seller.id,'favorite',this.favorite);
			}

		}
	}
</script>

<style lang="stylus">
	@import "../../common/stylus/mixin.styl"
	#seller
	  position absolute
	  bottom 0
	  left 0
	  top 174px
	  width 100%
	  overflow hidden
	  .overview
	  	position relative
	  	padding 18px
	  	.title
	      margin-bottom 8px
	      line-height 14px	
	      color rgb(7,17,27)
	      font-size 14px
	    .desc
	      padding-bottom 18px
	      font-size 0
	      border-1px(rgba(7,17,27,.1))
	      .star
	      	display inline-block
	      	line-height 18px
	      	margin-right 8px
	      	vertical-align top
	      .text
	      	display inline-block
	      	line-height 18px
	      	vertical-align top
	      	margin-right 12px
	      	color rgb(77,85,93)
	      	font-size 10px
	    .remark
	      display flex
	      padding-top 18px
	      .block
	      	flex 1
	      	text-align center
	      	border-right 1px solid rgba(7,17,27,.1)
	      	&:last-child
	      	  border none
	      	h2
	      	  margin-bottom 4px
	      	  line-height 10px
	      	  font-size 10px
	      	  color rgb(147,153,159)
	      	.content
	      	  line-height 24px
	      	  font-size 10px
	      	  font-weight 200
	      	  color rgb(7,17,27)
	      	  .stress
	      	  	font-size 24px
	    .collect-wrapper
	      position absolute
	      width 50px
	      top 18px
	      right 8px
	      text-align center
	      .icon-favorite
	      	color rgb(212,214,217)
	      	font-size 24px
	      	line-height 24px
	      	&.active
	      	  color rgb(240,20,20)
	      .collect
	      	font-size 10px
	      	line-height 10px
	      	margin-top 4px
	      	text-align center
	      	color rgb(77,85,93)
	  .bulletin
	  	padding 18px 18px 0 18px
	  	.title
	      margin-bottom 8px
	      line-height 14px
	      color rgb(7,17,27)
	      font-size 14px
	    .content-wrapper
	      padding 0 12px 16px 12px
	      border-1px(rgba(7,17,27,.1))  
	      .content
	      	line-height 24px
	      	font-size 12px
	      	color rgb(240,20,20)  
	    .support
	      .support-item
	        padding 16px 12px
	        border-1px(rgba(7,17,27,.1))
	        font-size 0
	        &:last-child
	          border-none();
	      	.icon
	          display inline-block
	          width 16px
	          height 16px
	          vertical-align top
	          margin-right 6px
	          background-size 16px 16px
	          background-repeat no-repeat
	          &.decrease
	          	bg-image('decrease_4')
	          &.discount
	          	bg-image('discount_4')
	          &.special
	          	bg-image('special_4')
	          &.invoice
	          	bg-image('invoice_4')
	          &.guarantee
	          	bg-image('guarantee_4')
	  	    .text
	  	  	  line-height 16px
	  	  	  font-size 12px
	  .pics
	  	padding 18px
	  	.title
	      margin-bottom 12px
	      line-height 14px
	      color rgb(7,17,27)
	      font-size 14px
	    .pic-wrapper
	      width 100%
	      overflow hidden
	      white-space nowrap
	      .pic-list
	      	font-size 0
	      	.pic-item
	      	  display inline-block
	      	  width 120px
	      	  height 90px
	      	  margin-right 6px
	      	  &:last-child
	      	  	margin-right 0
	  .info
	  	padding 18px 18px 0 18px
	  	.title
	  	  padding-bottom 12px
	  	  line-height 14px
	  	  font-size 14px
	  	  color rgb(7,17,27)
	  	  border-1px(rgba(7,17,27,.1))
	  	.info-item
	  	  padding 16px 12px 
	  	  border-1px(rgba(7,17,27,.1))
	  	  line-height 16px
	  	  font-size 12px
	  	  font-weight 200
	  	  color rgb(7,17,27)     	
	  	  &:last-child
	  	  	border-none();
	  	  	
	      
	  		
</style>