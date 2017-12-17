<template>
	<div id="goods">
		<div class="menu-wrapper" ref="menuWrapper">
			<ul>
				<li v-for="(item,index) in goods" :key="index" class="menu-item" :class="{'current':currentIndex===index}" @click = "selevtMenu(index,$event)">
					<span class="text border-1px">
						<span v-show="item.type > 0" class="icon" :class="classMap[item.type]"></span>
						{{item.name}}
					</span>
				</li>
			</ul>
		</div>
		<div class="foods-wrapper" ref="foodsWrapper">
			<ul>
				<li v-for="(item,index) in goods" class="foods-list food-list-hook" :key="index">
					<h1 class="title">{{item.name}}</h1>
					<ul>
						<li v-for="(food,index) in item.foods" class="foods-item border-1px" :key="index" @click="selectFood(food,$event)">
							<div class="icon">
								<img :src="food.icon" width="57" height="57">
							</div>
							<div class="content">
								<h2 class="name">{{food.name}}</h2>
								<p class="desc">{{food.descrition}}</p>
								<div class="extra">
									<span class="sellCount">月售{{food.sellCount}}份</span>
									<span class="rating">好评率{{food.rating}}%</span>
								</div>
								<div class="price">
									<span class="nowPrice">&yen;{{food.price}}</span>
									<span v-show="food.oldPrice" class="oldPrice"> &yen;{{food.oldPrice}}</span>
								</div>
								<div class="cartcontrol-wrapper">
									<!-- @add是子组件传过来的数据的事件名-->
									<v-cartcontrol :food="food" @add="addFood"></v-cartcontrol>
								</div>
							</div>
						</li>
					</ul>
				</li>
			</ul>
		</div>
		<v-shopcart :selectFoods= "selectFoods" :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice" ref="shopcart" class="shopcart"></v-shopcart>
		<v-food :food="selectedFood" ref="Vfood" @add="addFood"></v-food>
	</div>
</template>

<script>
	import BScroll from 'better-scroll'
	import Shopcart from '../Shopcart/Shopcart.vue'
	import Cartcontrol from '../Cartcontrol/Cartcontrol.vue'
	import Food from '../Food/Food.vue'
    const ERR_OK = 0;
	export default {
		name:'goods',
		props: {
			seller: {
				type: Object
			}
		},
		data () {
			return {
				classMap:[],
				goods:[],
				listHeight:[],
				scrollY:0,
				selectedFood:{}
			}
		},
		components:{
			'v-shopcart':Shopcart,
			'v-cartcontrol':Cartcontrol,
			'v-food':Food
		},
		computed: {
			currentIndex() {
				for (let i = 0; i < this.listHeight.length; i++) {
					let height1 = this.listHeight[i];
					let height2 = this.listHeight[i+1];
					if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
						return i;
					}
					
					
				}
				return 0;
			},
			selectFoods() {
				let foods = [];
				this.goods.forEach( (good) => {
					good.foods.forEach( (food) => {
						if (food.count) {
							foods.push(food);
						}
					})
				})

				return foods;
			}
		},
		created() {
			this.classMap = ['decrease','discount','special','invoice','guarantee'];
			this.$axios.get('/api/goods').then( (response) => {
				response = response.data;
				if (response.errno === ERR_OK) {
					this.goods = response.data;
					this.$nextTick(() => { //延迟执行
						this._initScroll();
						this._calculateHeight();
					})
					
				}
			}).catch((error) => {
				console.log(error);
			})
		},

		methods: {
			_initScroll() {
				this.menuScroll = new BScroll(this.$refs.menuWrapper,{ 
					click: true //恢复点击事件
				});

				this.foodsScroll = new BScroll(this.$refs.foodsWrapper,{
					click: true, //恢复点击事件
					probeType:3
				});
				this.foodsScroll.on('scroll',(position) => {
					this.scrollY = Math.abs(Math.round(position.y));
					

				});
			},
			_calculateHeight() {
				let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook'); 
				
				let height = 0;
				this.listHeight.push(height);
				for (let i =0; i< foodList.length;i++) {
					let item = foodList[i];
					height += item.clientHeight;
					this.listHeight.push(height);

				}
				
			},
			selevtMenu(index,event) {
				if (!event._constructed) { //pc端为FALSE ==》event._constructed 移动端为true
					return;
				}
				let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook'); 
				let el = foodList[index];
				// better-scroll内置函数scrollToElement====>跳到某个元素
				this.foodsScroll.scrollToElement(el,400);
			},
			addFood(target) {
				this._drop(target);
			},
			_drop(target) {
				// 异步执行下落动画
				this.$nextTick( () => {
					this.$refs.shopcart.drop(target);
				})
			},

			selectFood(food,event) {
				if (!event._constructed) { //pc端为FALSE ==》event._constructed 移动端为true
					return;
				}
				this.selectedFood = food;
				//父组件调用子组件的方法
				this.$refs.Vfood.show();
			}
		}
	}
</script>

<style lang="stylus">
	@import "../../common/stylus/mixin.styl"
	#goods
	  display flex
	  position absolute
	  top 174px
	  bottom 48px
	  width 100%
	  overflow hidden
	  .menu-wrapper
	  	flex 0 0 80px
	  	width 80px
	  	background-color #f3f5f7
	  	.menu-item
	  	  display table
	  	  height 54px
	  	  padding 0 12px 0 12px
	  	  line-height 14px
	  	  &.current
	  	  	position relative
	  	  	top -1px
	  	  	background-color #fff
	  	  	.text
	  	  	  font-size 12px
	  	  	  color #07111b
	  	  	  line-height 14px
	  	  	  font-weight 700
	  	  	  border-none()
	  	  .icon
	  	  	display inline-block
	  	  	width 12px
	  	  	height 12px
	  	  	margin-right 2px
	  	  	background-size 12px 12px
	  	  	background-repeat no-repeat
	  	  	&.decrease
	  	  	  bg-image('decrease_3')
	  	  	&.discount
	  	  	  bg-image('discount_3')
	  	  	&.special
	  	      bg-image('special_3')
	  	    &.invoice
	  	      bg-image('invoice_3')
	  	  	&.guarantee
	  	  	  bg-image('guarantee_3')
	  	  .text
	  	  	display table-cell
	  	  	width 80px
	  	  	height 54px
	  	  	font-size 12px
	  	  	vertical-align middle
	  	  	color #07111b
	  	  	font-weight 200
	  	  	border-1px(rgba(7,17,27,0.1))
	  .foods-wrapper
	  	flex 1
	  	.title
	  	  height 26px
	  	  line-height 26px
	  	  padding-left 14px
	  	  font-size 12px
	  	  color rgb(147, 153,159)
	  	  background-color #f3f5f7
	  	  border-left 2px solid #d9dde1
	  	ul 
	  	  .foods-item
	  	  	display flex
	  	  	margin 18px
	  	  	padding-bottom 18px
	  	  	border-1px(rgba(7,17,27,0.1))
	  	  	&:last-child
	  	  	  padding-bottom 0
	  	  	  margin-bottom 0
	  	  	  border-none()
	  	  	.icon
	  	  	  flex 0 0 57px
	  	  	  margin-right 10px
	  	  	.content
	  	  	  flex 1
	  	  	  position relative
	  	  	  .name
	  	  	    font-size 14px
	  	  	    color rgb(7,17,27)
	  	  	    line-height 14px
	  	  	    font-weight bold
	  	  	    margin 2px 0 8px 0
	  	  	  .desc
	  	  	  	font-size 10px
	  	  	  	color rgb(147, 153, 159)
	  	  	  	line-height 10px
	  	  	  .extra
	  	  	  	 font-size 10px
	  	  	  	 color rgb(147,153,159)
	  	  	  	 line-height 10px
	  	  	  	 margin-top 8px
	  	  	  	 font-size 0
	  	  	  	.sellCount
	  	  	  	  margin-right 12px
	  	  	  	  font-size 10px
	  	  	  	.rating
	  	  	  	  font-size 10px
	  	  	  .price
	  	  	  	.nowPrice
	  	  	  	  font-size 14px
	  	  	  	  color #f01414
	  	  	  	  font-weight 700
	  	  	  	  line-height 24px
	  	  	  	.oldPrice
	  	  	  	  font-size 10px
	  	  	  	  color rgb(147, 153, 159)
	  	  	  	  font-weight 700
	  	  	  	  line-height 24px
	  	  	  	  text-decoration line-through
	  	  	  .cartcontrol-wrapper
	  	  	  	position absolute
	  	  	  	bottom 0
	  	  	  	right 0  	  	  	  	 
	  	  	  	
	  	  	  	
</style>
