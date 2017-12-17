<template>
	<div id="ratingSelect">
		<div class="rating-type border-1px">
			<span @click="select(2,$event)" class="block positive" :class="{'active':selectType===2}">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
			<span @click="select(0,$event)" class="block positive" :class="{'active':selectType===0}">{{desc.positive}}<span class="count">{{positives.length}}</span></span>
			<span @click="select(1,$event)" class="block negative" :class="{'active':selectType===1}">{{desc.negative}}<span class="count">{{negatives.length}}</span></span>
		</div>
		<div @click="toggleContent" class="switch border-1px" :class="{'on':onlyContent}">
			<span class="icon-check_circle"></span>
			<span class="text">只看有内容的评价</span>
		</div>
	</div>
</template>

<script>
	const POSITIVE = 0;
	const NEGATIVE = 1;
	const ALL = 2;
	export default {
		name:'ratingSelect',
		props: {
			ratings: {
				type: Array,
				default() {
					return []
				}
			},
			selectType: {
				type: Number,
				default :ALL
			},
			onlyContent: {
				type: Boolean,
				default: false
			},
			desc: {
				type: Object,
				default() {
					return {
						all: '全部',
						positive: '满意',
						negative: '不满意'
					};
				}
			}
		},
		computed: {
			positives() {
				return this.ratings.filter( (rating) => {
					return rating.rateType === POSITIVE;
				})
			},
			negatives() {
				return this.ratings.filter( (rating) => {
					return rating.rateType === NEGATIVE;
				})
			}
		},
		methods: {
		  select(type,event) {
	        if (!event._constructed) {
	          return;
	        }
	        var type = type;
	        this.$emit('select',type);
	        
          },
	      toggleContent(event) {
	        if (!event._constructed) {
	          return;
	        }
	        this.$emit('toggle');
	       
	      }
			},
		

	}
</script>

<style lang="stylus">
	@import '../../common/stylus/mixin.styl'
	#ratingSelect
	  .rating-type
	  	margin 18px
	  	padding-bottom 18px
	  	border-1px(rgba(7,17,27,.1))
	  	font-size 0
	  	.block
	  	  display inline-block
	  	  font-size 12px
	  	  color rgb(255,255,255)
	  	  line-height 16px
	  	  border-radius 1px
	  	  padding 8px 12px
	  	  &.positive
	  	  	margin-right 8px
	  	  	color rgb(77,85,93)
	  	  	background-color: rgba(0,160,220,.2)
	  	  	&.active
	  	  	  background-color: rgb(0,160,220)
	  	  	  color #fff
	  	  	.count
	  	      font-size 8px
	  	      margin-left 2px
	  	  &.negative
	  	  	background-color rgba(77, 85, 93, .2)
	  	  	color rgb(77,85,93)
	  	  	&.active
	  	  	  background-color rgb(77, 85, 93)
	  	  	  color #fff
	  .switch
	  	font-size 0
	  	padding 0 0 12px 18px
	  	border-1px(rgba(7,17,27,.1)) 
	  	&.on
	      .icon-check_circle
	      	color #00c850
	  	.icon-check_circle
	  	  display inline-block
	  	  vertival-align top
	  	  font-size 24px
	  	  color rgb(147,153,159) 
	  	  line-height 24px
	  	  margin-right 4px
	  	.text
	  	  display inline-block
	  	  vertical-align top
	  	  font-size 12px
	  	  color rgb(147,153,159)
	  	  line-height 24px
	  	  	  	  
	  	      


	  	  	  
</style>