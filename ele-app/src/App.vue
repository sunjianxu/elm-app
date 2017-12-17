<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
   <keep-alive>
    <!-- keep-alive用来缓存组件,避免多次加载相应的组件,减少性能消耗 -->
     <router-view v-if="$route.meta.keepAlive" :seller="seller"></router-view>
   </keep-alive>
   <router-view v-if="!$route.meta.keepAlive" :seller="seller"></router-view>
  </div>
</template>

<script>
import Header from './components/Header/Header.vue'
import {urlParse} from './common/js/util.js'
const ERR_OK = 0;
export default {
  name: 'app',
  data () {
    return {
      seller: {
        id: (() => {
          let queryParam = urlParse();
          return queryParam.id;
        })()
      }
    };
  },

  created() {
    this.$axios.get('/api/seller?id=' + this.seller.id).then( (response)  => {
      response = response.data;
      if (ERR_OK === response.errno) {
        this.seller = response.data;
        this.seller = Object.assign({}, this.seller,response.data);
        
      }
    }).catch((error) => {
      console.log(error)
    })
  },
  components: {
    'v-header': Header
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import './common/stylus/index.styl'
  #app
    .tab
      display flex
      width 100%
      height 40px
      line-height 40px
      border-1px(rgba(7,17,27,0.1))
      .tab-item
        flex 1
        height 40px
        line-height 40px
        text-align center
        & > a
          display block
          font-size 14px
          color rgb(77, 85, 93)
          &.router-link-active
            color rgb(240, 20, 20)
          
</style>
