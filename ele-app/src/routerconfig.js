import Seller from './components/Seller/Seller.vue'
import Goods from './components/Goods/Goods.vue'
import Ratings from './components/Ratings/Ratings.vue'

export default {
	mode:'history',
	routes:[
		{path:'/seller',component:Seller,meta:{keepAlive:true}},
		{path:'/goods',component:Goods,meta:{keepAlive:true}},
		{path:'/ratings',component:Ratings,meta:{keepAlive:true}},
		{path:'/',redirect:'goods'}
	]
}