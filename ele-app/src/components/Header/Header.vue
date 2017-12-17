<template>
	<div id="Header">
		<div class="content-wrapper">
			<div class="avatar">
				<img :src="seller.avatar" width="64" height="64">
			</div>
			<div class="content">
				<div class="title">
					<span class="brand"></span>
					<span class="name">{{seller.name}}</span>
				</div>
				<div class="description">
					{{seller.description}}/{{seller.deliveryTime}}分钟送达
				</div>
				<div v-if="seller.supports" class="support">
					<span class="icon" :class="classMap[seller.supports[0].type]"></span>
					<span class="text">{{seller.supports[0].description}}</span>
				</div>
			</div>
			<div v-if="seller.supports" class="support-count" @click="showDetail">
				<span class="count">{{seller.supports.length}}个</span>
				<i class="icon-keyboard_arrow_right"></i>
			</div>
		</div>
		<div class="bulletin-wrapper"  @click="showDetail">
			<span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
			<i class="icon-keyboard_arrow_right"></i>
		</div>
		<div class="background">
			<img :src="seller.avatar" width="100%" height="100%">
		</div>
		<transition name="fade">
			<div class="detail" v-show='detail'>
				<div class="detail-wrapper clearfix">
					<div class='detail-main'>
						<h1 class="name">{{seller.name}}</h1>
						<div class="star-wrapper">
							<v-star :size="48" :score="seller.score" ></v-star>
						</div>
						<div class="title">
							<div class="line"></div>
							<div class="text">优惠信息</div>
							<div class="line"></div>
						</div>
						<ul v-if="seller.supports" class="support">
							<li class="support-item" v-for="(item,index) in seller.supports">
								<span :class="classMap[seller.supports[index].type]" class="icon"></span>
								<span class="text">{{seller.supports[index].description}}</span>
							</li>
						</ul>

						<div class="title">
							<div class="line"></div>
							<div class="text">商家公告</div>
							<div class="line"></div>
						</div> 

						<div class="bulletin">
							<p class="content">{{seller.bulletin}}</p>
						</div>
					</div>
				</div>
				<div class="detail-close" @click="closeDetail">
					<i class="icon-close"></i>
				</div>
		    </div> 
		</transition>

	</div>
</template>

<script type="text/javascript">
	import Star from '../Star/Star.vue'
	export default {
		props: {
			seller: {
				type: Object
			}
		},
		data() {
			return {
				classMap:[],
				detail:false
			}
		},
		components:{
			'v-star' :Star
		},

		methods: {
			showDetail() {
				this.detail = true
			},
			closeDetail() {
				this.detail = false
			}
		},
		created() {
			this.classMap = ['decrease','discount','special','invoice','guarantee'];
		}
		
	}
</script>

<style lang="stylus" >
	@import '../../common/stylus/mixin.styl'
	#Header
	  position relative
	  background-color rgba(7, 17, 27, .5)
	  overflow hidden
	  color #fff
	  .content-wrapper
	  	position relative
	  	padding 24px 12px 18px 24px
	  	font-size 0
	  	.avatar
	      display inline-block
	      vertical-align top
	      img
	        border-radius 2px
	    .content
	      vertical-align top
	      display inline-block
	      margin-left 16px
	      font-size 14px
	      .title
	      	margin 2px 0 8px 0
	      	font-size 0
	      	.brand
	      	  display inline-block
	      	  width 30px
	      	  height 18px
	      	  bg-image('brand')
	      	  background-size 30px 18px
	      	  background-repeat no-repeat
	      	  vertical-align top
	  	    .name
	  	      display inline-block
	  	      margin-left 6px
	  	      font-size 16px
	  	      line-height 18px
	  	      font-weight bold
	  	      vertical-align top
	  	.description
	  	  margin-bottom 10px
	  	  line-height 12px
	  	  font-size 12px
	  	.support
	  	  font-size 0
	  	  .icon
	  	  	display inline-block
	  	  	width 12px
	  	  	height 12px
	  	  	margin-right 4px
	  	  	background-size 12px 12px
	  	  	background-repeat no-repeat
	  	  	&.decrease
	  	  	  bg-image('decrease_1')
	  	  	&.discount
	  	  	  bg-image('discount_1')
	  	  	&.special
	  	      bg-image('special_1')
	  	    &.invoice
	  	      bg-image('invoice_1')
	  	  	&.guarantee
	  	  	  bg-image('guarantee_1')
	  	  .text
	  	  	display inline-block
	  	  	line-height 12px
	  	  	font-size 10px
	  	  	vertical-align top
	  	.support-count
	      position absolute
	      right 12px
	      bottom 14px
	      padding 0 8px
	      height 24px
	      line-height 24px
	      border-radius 14px
	      background rgba(0, 0, 0, .2) 
	      text-align center 
	      .count
	      	font-size 10px
	      	vertical-align top
	      .icon-keyboard_arrow_right
	      	margin-top 2px
	      	font-size 10px
	      	line-height 24px
	      	
	  .bulletin-wrapper
	  	position relative
	  	height 28px
	  	line-height 28px
	  	padding 0 22px 0 12px
	  	white-space nowrap 
	  	overflow hidden  	
	  	text-overflow ellipsis
	  	background rgba(7, 17, 27, .2)
	  	.bulletin-title
	  	  display inline-block
	  	  vertical-align top
	  	  margin-top 8px
	  	  width 22px
	  	  height 12px
	  	  bg-image('bulletin')
	  	  background-size 22px 12px
	  	  background-repeat no-repeat
	  	.bulletin-text
	  	  margin 0 4px 
	  	  font-size 10px
	  	  vertical-align top
	  	.icon-keyboard_arrow_right
	  	  position absolute
	  	  font-size 10px
	  	  right 12px
	  	  top 9px
	  .background
	  	position absolute
	  	top 0
	  	left 0
	  	width 100%
	  	height 100%
	  	z-index -1
	  	filter blur(10px)
	  .fade-enter-active,.fade-leave-active
	  	transition:all .4s
	  .fade-enter-active
	  	opacity 1
	  .fade-leave-active
	  	opacity 0
	  .fade-enter,.fade-leave
	  	opacity 0
	  .detail
	  	position fixed
	  	top 0
	  	left 0
	  	z-index 100
	  	width 100%
	  	height 100%
	  	overflow auto
	  	background rgba(7, 17, 27, .8)
	  	backdrop-filter blur(10px)  //针对ios系统的背景模糊效果
	  	.detail-wrapper
	  	  min-height 100%
	  	  width 100%
	  	  .detail-main
	  	  	margin-top 64px
	  	  	padding-bottom 64px
	  	  	.name
	  	  	  font-size 16px
	  	  	  text-align center
	  	  	  line-height 16px
	  	  	  font-weight 700
	  	  	.star-wrapper 
	  	  	  height 24px
	  	  	  line-height 24px
	  	  	  text-align center
	  	  	  margin-top 16px
	  	    .title
	  	      display flex 
	  	      margin-top 28px
	  	      padding 0 36px 0 36px 
	  	      .line
	  	      	flex 1
	  	      	position relative
	  	      	top 6.5px
	  	      	border-top 1px solid rgba(255, 255, 255, .2)
	  	      .text
	  	      	padding 0 12px
	  	      	font-size 14px
	  	      	font-weight 700
	  	    .support
	  	      margin-top 24px
	  	      padding-left 48px
	  	      font-weight 0
	  	      .support-item
	  	      	margin-bottom 12px
	  	      	font-size 0
	  	      	&:last-child
	  	      	  margin-bottom 0
	  	        .icon
	  	      	  display inline-block
	  	      	  height 16px
	  	      	  width 16px
	  	      	  background-size 16px 16px
	  	      	  background-repeat no-repeat
	  	      	  &.decrease
	  	      	  	bg-image('decrease_2')
	  	      	  &.discount
	  	      	  	bg-image('discount_2')
	  	      	  &.special
	  	      	  	bg-image('special_2')
	  	      	  &.invoice
	  	      	  	bg-image('invoice_2')
	  	      	  &.guarantee
	  	      	  	bg-image('guarantee_2')
	  	      	.text
	  	      	  margin-left 6px
	  	      	  font-size 12px
	  	      	  font-weight 700
	  	      	  line-height 16px
	  	      	  vertical-align top
	  	    .bulletin
	  	      padding 24px 48px 0 48px    	
		      .content
		      	font-size 12px
		      	font-weight 200
		      	line-height 24px
	  	.detail-close
	      position relative
	      width 32px
	      height 32px
	      margin -64px auto 0 auto
	      clear both
	      font-size 32px
	  	   	

	  
	  			




	  	      
	  	  
	  	  	
	  	  	
	  	  	
	  	   
	  	  	
	  	  
	  	     
	  	  	
	  	
</style>