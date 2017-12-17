<template>
	<div id="ratings" ref="ratings">
		<div class="ratings-content">
			<div class="overview">
				<div class="overview-left">
					<h1 class="scoring">{{seller.score}}</h1>
					<p class="synthesise-synthesise">综合评分</p>
					<p class="percent">高于周边商家{{seller.rankRate}}%</p>
				</div>
			    <div class="overview-right">
			    	<div class="score-wrapper">
			    		<span class="title">服务态度</span>
			    		<v-star :size="36" :score="seller.serviceScore" class="star"></v-star>
			    		<span class="score">{{seller.serviceScore}}</span>
			    	</div>
			    	<div class="score-wrapper">
			    		<span class="title">商品评分</span>
			    		<v-star :size="36" :score="seller.foodScore" class="star"></v-star>
			    		<span class="score">{{seller.foodScore}}</span>
			    	</div>

			    	<div class="delivery-time">
			    		<span class="title">送达时间</span>
			    		<span class="time">{{seller.deliveryTime}}</span>
			    	</div>
			    </div>
			</div>
			<v-split></v-split>
			<v-ratingselect @select="selectRating" @toggle="toggleContent" :selectType="selectType" :onlyContent="onlyContent"
                    :ratings="ratings"></v-ratingselect>
			<div class="rating-wrapper">
				<ul>
					<li v-show="needShow(rating.rateType,rating.text)" v-for="(rating,index) in ratings" :key="index" class="rating-item border-1px">
						<div class="avatar">
							<img :src="rating.avatar" width="28" height="28">
						</div>
						<div class="content">
							<h1 class="name">{{rating.username}}</h1>
							<div class="star-wrapper">
								<v-star :size="24" :score="rating.score"></v-star>
								<span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}</span>
							</div>
							<p class="text">{{rating.text}}</p>
							<div class="recommend" v-show="rating.recommend&&rating.recommend.length">
								<span class="icon-thumb_up"></span>
								<span v-for="(item,index) in rating.recommend" :key="index" class="item">{{item}}</span>
							</div>
							<div class="time">
								{{rating.rateTime | formaDate}}
							</div>
						</div> 
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
	import Vue from 'vue'
	import BScroll from 'better-scroll'
	import Split from '../Split/Split.vue'
	import RatingSelect from '../RatingSelect/RatingSelect.vue'
	import Star from '../Star/Star.vue'
	import {formaDate} from "../../common/js/date.js"
	const POSITIVE = 0;
	const NEGATIVE = 1;
	const ALL = 2;
	const ERR_OK = 0;
	export default {
		name: 'ratings',
		props: {
			seller: {
				type: Object
			}
		},
		data() {
			return {
				ratings:[],
				foodFlag: false,
				selectType:ALL,
				onlyContent:true,
				desc: {
					all: '全部',
					positive: '满意',
					negative: '不满意'
				}
			}
		},
		methods:{
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
			selectRating(type) {
		        this.selectType = type;
		        this.$nextTick(() => {
		             this.scroll.refresh();
		        });
      		},
		    toggleContent() {
		        this.onlyContent = !this.onlyContent;
		        this.$nextTick(() => {
		             this.scroll.refresh();
		        });
		      }
			
		},
		created() {
			this.$axios.get('/api/ratings').then( (response) => {
				response = response.data;
				if (response.errno === ERR_OK) {
					this.ratings= response.data;
					this.$nextTick( () => {
						this.scroll = new BScroll(this.$refs.ratings,{
						click:true
					});
					})
				}
			}).catch((error) => {
				console.log(error);
			});
				// 时间过滤器
			Vue.filter('formaDate',function (time) {
			let date = new Date(time);
			return formaDate(date,'yyyy-MM-dd hh:mm');
		})
		},
		components: {
			'v-split': Split,
			'v-star': Star,
			'v-ratingselect':RatingSelect
		}
	}
</script>

<style lang="stylus" >
	@import "../../common/stylus/mixin.styl"
	#ratings
	  position absolute
	  bottom 0
	  left 0
	  top 174px
	  width 100%
	  overflow hidden
	  .ratings-content
	    .overview
	  	  display flex
	  	  padding 18px 0
	  	  .overview-left
	  	    flex 0 0 137.5px
	  	    padding 6px 0
	  	    width 137.5px
	  	    text-align center
	  	    border-right 1px solid #e6e7e8
	  	    @media only screen and (max-width: 320px)
	  	      flex 0 0 120px
	  	      width 120px
	  	    .scoring
	  	  	  line-height 28px
	  	  	  font-size 24px
	  	  	  color rgb(255,153,0)
	  	    .synthesise-synthesise
	  	      margin 6px 0 8px 0
	  	      font-size 12px
	  	      color #07111b
	  	      line-height 12px
	  	    .percent
	  	      font-size 10px
	  	      color #a4a9ae
	  	  .overview-right 
	   	  	flex 1
	   	  	padding 6px 0 6px 24px
	   	  	@media only screen and (max-width: 320px)
	   	  	  padding-left 6px
	   	  	.score-wrapper
	   	  	  font-size 0
	   	  	  margin-bottom 8px
	   	  	  .title
	   	  	  	display inline-block
	   	  	  	vertical-align top
	   	  	  	font-size 12px
	   	  	  	color rgb(7,17,27)
	   	  	  	line-height 18px
	   	  	  .star
	   	  	  	display inline-block
	   	  	  	line-height 18px
	   	  	  	margin: 0 12px;
	   	  	  	vertical-align top
	   	  	  .score
	   	  	  	display inline-block
	   	  	  	font-size 12px
	   	  	  	vertical-align top
	   	  	  	line-height 18px
	   	  	  	color rgb(255,153,0)
	        .delivery-time
	          font-size 0
	          .title
	          	display inline-block
	          	margin-right 12px
	          	font-size 12px
	          	color rgb(7,17,27)
	          	line-height 18px
	          .time
	          	display inline-block
	          	font-size 12px
	          	color rgb(147,153,159)
	          	line-height 18px
	    .rating-wrapper
	      padding 0 18px
	      .rating-item
	      	display flex
	      	padding 18px 0
	      	border-1px(rgba(7,17,27,.1))
	      	.avatar
	      	  flex 0 028px
	      	  width 28px
	      	  margin-right 12px
	      	  img
	      	  	border-radius 50%
	      	.content
	      	  position relative
	      	  flex 1
	      	  .name
	      	  	line-height 12px
	      	  	font-size 10px
	      	  	color rgb(7,17,27)
	      	  	margin-bottom 4px
	      	  .star-wrapper
	      	  	margin-bottom 6px
	      	  	font-size 0
	      	  	.star
	      	  	  display inline-block
	      	  	  vertical-align top
	      	  	  margin-right 6px
	      	  	.delivery
	      	      display inline-block
	      	      color rgb(147,153,159)
	      	  .text
	      	  	line-height 18px
	      	  	color rgb(147,153,159)
	      	  	font-size 12px
	      	  	margin-bottom 8px
	      	  .recommend
	      	  	line-height 16px
	      	  	font-size 0
	      	  	.icon-thumb_up,.item
	      	      display inline-block
	      	      margin 0 8px 4px 0
	      	      font-size 12px
	      	    .icon-thumb_up
	      	      color rgb(0,160,220)
	      	    .item
	      	      padding 0 6px
	      	      border 1px solid rgba(7, 17, 27, .1)  
	      	      border-radius 1px
	      	      color rgb(147,153,159)
	      	      background-color: #FFF
	      	  .time
	      	  	position absolute
	      	  	top 0
	      	  	right 0
	      	  	line-height 12px
	      	  	font-size 10px
	      	  	color rgb(147,153,159)
	      	  	
	      	  	
	      	  	
	      	      
	      	  
	    
	    
	      	
</style>