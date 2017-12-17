<template>
	<div id="cartcontrol">
		<transition name="move">
			<div class="cart-decrease icon-remove_circle_outline" v-show="food.count > 0" @click.stop.prevent="decreaseGoods($event)"></div>
		</transition>
		<div class="cart-count" v-show="food.count > 0">{{food.count}}</div>
		<div class="cart-add icon-add_circle" @click.stop.prevent="addGoods($event)"></div>
	</div>
</template>

<script>
    import Vue from 'vue'
	export default {
		name:"cartcontrol",
		props: {
			food: {
				type: Object
			}
		},
		methods:{
			addGoods(event) {
				if (!event._constructed) {
					return;
				}
				if (!this.food.count) {
					// 动态设置属性
					Vue.set(this.food,'count',1);
				}else {
					this.food.count++;
					
				}
				
				// 通过单一事件中心实现组件之间的通信add是事件名称,event.target是数据
				this.$emit('add',event.target);
			},
			decreaseGoods(event) {
				if (!event._constructed) {
					return;
				}
				if (this.food.count) {
					this.food.count--;
				}
					

			}
		}
	}
</script>

<style lang="stylus">
	#cartcontrol
	  font-size 0
	  .move-enter-active,.move-leave-active
	  	transition all 0.4s linear
	  .move-enter-active
	  	transform translate3d(0,0,0) rotate(180deg)
	  	opacticy 1
	  .move-leave-active
	  	transform translate3d(24px,0,0) rotate(180deg)
	  	opacticy 0
	  .move-enter
	  	opacticy 0
	  	transform translate3d(24px,0,0) rotate(0)
	  .move-leave
	  	opacticy 1
	  	transform translate3d(0,0,0) rotate(0)
	  .cart-decrease,.cart-add
	  	display inline-block
	  	line-height 24px
	  	font-size 24px
	  	color #00a0dc
	  	vertical-align top
	  .cart-count
	  	display inline-block
	  	font-size 10px
	  	color rgb(147,153,159)
	  	line-height 24px
	  	width 24px
	  	text-align center
	  	vertical-align top
	  .cart-add
	  	display inline-block
	  	
	  	
	  	
		
</style>