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
import './publicGood/muse-ui.css'


//引入scss文件
require('./dist/detail.scss')
//引入vue模板
var indexnav = require('./component/indexnav.vue');
var mainList = require('./component/main-list.vue');
var askList = require('./component/ask-list.vue');
var goodList = require('./component/good-list.vue');
var shareList = require('./component/share-list.vue');
var jobList = require('./component/job-list.vue');
var collect = require('./component/collect.vue');
var detail = require('./component/detail.vue');

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
		path:'/detail/:id',
		component:detail
	},{
		path:'/collect',
		component:collect
	},{
		path:'/',
		redirect:'/index/mainList'
	}]
})
var store = new Vuex.Store({
	state:{
		discId:'',
		zanLength:'',
		IsNoImg:''
	},
	mutations:{
		getDiscId(state,a){
			state.discId = a;
		},
		getZanLength(state,a){
			state.zanLength = a
		},
		getIsNoImg(state,a){
			state.IsNoImg = a
		}
	},
	getters:{
		discId(state){
			return state.getDiscId;
		},
		zanLength(state){
			return state.getZanLength;
		},
		IsNoImg(state){
			return state.getIsNoImg;
		}
	}
})

//创建Vue
new Vue({
	el:'#demo',
	template:'<router-view></router-view>',
	router,
	store,
})
