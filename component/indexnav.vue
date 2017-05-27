<template>
	<div>
		<mu-appbar :title="activeTab" class="headers">
			<mu-icon-button icon="menu" slot="left"/>
			<mu-icon-button icon="more_vert" slot="right" @click="Nav()"/>
		</mu-appbar>
		<mu-tabs :value="activeTab" @change="handleTabChange" class="nameVal">
			<mu-tab value="全部" title="全部" v-show="notext"/>
			<mu-tab value="问答" title="问答" v-show="notext"/>
			<mu-tab value="精华" title="精华" v-show="notext"/>
			<mu-tab value="分享" title="分享" v-show="notext"/>
			<mu-tab value="招聘" title="招聘" v-show="notext"/>
			
		</mu-tabs>
		<router-view></router-view>
		
	</div>
</template>
<script>
	export default {
		data() {
			return {
				activeTab: '全部',
				isNav:false,
				notext:false
			}
		},
		methods: {
			//			test(){
			//				this.isnav = 'expand_more';
			//				console.log(this.isnav)
			//			}
			handleTabChange(val) {
				this.activeTab = val
				this.name = val
				this.isNav = false
				$('.nameVal').animate({'left':'-100%'},1000,function(){
					this.notext = false
				}.bind(this))
				if(this.activeTab == '全部'){
					window.location.href="#/index/mainList"
				}else if(this.activeTab == '问答'){
					window.location.href="#/index/askList"
				}else if(this.activeTab == '精华'){
					window.location.href="#/index/goodList"
				}else if(this.activeTab == '分享'){
					window.location.href="#/index/shareList"
				}else if(this.activeTab == '招聘'){
					window.location.href="#/index/jobList"
				}
			},
			Nav(){
				this.isNav = !this.isNav;
				if(this.isNav){
//					this.name = '';
					var self = this;
					$('.nameVal').animate({'left':'0',},1000,function(){
						self.notext = true
					})
				}else{
					
					$('.nameVal').animate({'left':'-100%'},1000,function(){
						this.notext = false
					})
				}
			}
			
		},
		mounted() {
//			$('<span/>').html('111').appendTo($('.mu-appbar .mu-appbar-title'))
//			console.log(parseInt($('.mu-appbar-title').css('width')))
			$('.nameVal').css('width',parseInt($('.mu-appbar-title').css('width'))+parseInt($('.mu-ripple-wrapper').css('width'))).css('borderBottom','1px solid #fff').appendTo($('.mu-appbar-title'))
			
		},

	}
</script>
<style>
	.headers{
		position: relative;
	}
	.nameVal{
		height: 90%;
		position: absolute;
		top:50%;
		left: -100%;
		margin-top: -24px;
	}
</style>