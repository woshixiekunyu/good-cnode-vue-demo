//引入vue模块
import Vue from 'vue';

//引入jquery
import $ from 'jquery';
//把jq设为全局
window.$ = $;

//引入vuex
import Vuex from 'vuex';
//Vue使用vuex
Vue.use(Vuex);

//引入路由
import VueRouter from 'vue-router';
Vue.use(VueRouter);


//引入muse-ui文件
import MuseUi from 'muse-ui';
Vue.use(MuseUi)
import 'muse-ui/dist/muse-ui.css'


//引入scss文件
//require('./dist/mainList.scss')
//引入vue模板
var indexnav = require('./component/indexnav.vue');
var mainList = require('./component/main-list.vue');
var askList = require('./component/ask-list.vue');
var goodList = require('./component/good-list.vue');
var shareList = require('./component/share-list.vue');
var jobList = require('./component/job-list.vue');

var router = new VueRouter({
	routes:[{
		path:'/index',
		component:indexnav,
		children:[{
			path:'mainList',
			component:mainList
		},{
			path:'askList',
			component:askList
		},{
			path:'goodList',
			component:goodList
		},{
			path:'shareList',
			component:shareList
		},{
			path:'jobList',
			component:jobList
		}]
	},{
		path:'/',
		redirect:'/index/mainList'
	}]
})
var store = new Vuex.Store({
	
})

//创建Vue
new Vue({
	el:'#demo',
	template:'<router-view></router-view>',
	router,
	store,
})
