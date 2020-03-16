import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import {Message} from "element-ui";
import moment from "moment";
import axios from 'axios'
// 全局挂载样式
import './assets/index.css'


Vue.filter('changNum',(number)=>{
  let min = parseInt(number / 1000 / 60)
  let sec = parseInt(number / 1000 % 60)
  if(min < 10){
    min = '0' + min;
  }
  if(sec < 10){
    sec = '0' + sec;
  }
  return (min + ':' + sec)
});

Vue.filter('changeCount',(value)=>{
  let val;
  if (value > 100000){
    val = parseInt(value / 10000) + '万'
  }else {
    val = value
  }
  return val
});

Vue.filter('changeTime',(time)=>{
  return moment(time).utc().format('YYYY-MM-DD');
});

Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.prototype.$message = Message

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
