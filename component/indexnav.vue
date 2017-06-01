<template>
	<div>
		<mu-appbar :title="activeTab" class="headers">
			<mu-icon-button icon="menu" slot="left" @click="toggle(true)"/>
			<mu-icon-button icon="more_vert" slot="right" @click="Nav()" />
		</mu-appbar>
		<mu-tabs :value="activeTab" @change="handleTabChange" class="nameVal">
			<mu-tab value="全部" title="全部" v-show="notext" />
			<mu-tab value="问答" title="问答" v-show="notext" />
			<mu-tab value="精华" title="精华" v-show="notext" />
			<mu-tab value="分享" title="分享" v-show="notext" />
			<mu-tab value="招聘" title="招聘" v-show="notext" />

		</mu-tabs>
		<mu-drawer :open="open" :docked="docked" @close="toggle()">
			

			<mu-list @itemClick="docked ? '' : toggle()">
				<div class="container">
					<mu-raised-button @click="openBottomSheet" :label="isLogin" class="demo-raised-button" primary/>
					<br/>
					<mu-raised-button label="cNode 社区" fullWidth class="tips"/>
				</div>
				<div class="userInfor">
					<img :src="userSrc" alt="" />
					<span>{{userName}}</span>
				</div>
				<div class="list">
					<mu-list-item title="Menu Item 1" class="lists"/>
					<mu-list-item title="Menu Item 2" class="lists"/>
					<mu-list-item title="Menu Item 3" class="lists"/>
				</div>
				<!--<mu-list-item v-if="docked" @click.native="open = false" title="Close" />-->
			</mu-list>
		</mu-drawer>
		<mu-bottom-sheet :open="bottomSheet" @close="closeBottomSheet">
		    <mu-list @itemClick="closeBottomSheet">
		    	<mu-sub-header>请登录</mu-sub-header>
		    	<div class="inputUserName">
		    		<input type="text" v-model="userVal"/>
					<i v-show="loginTips">accesstoken有误</i>
		    		<span @click="toLogin()">登录</span>
		    	</div>
		    </mu-list>
		  </mu-bottom-sheet>
		<router-view></router-view>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				activeTab: '全部',
				isNav: false,
				notext: false,
				open: false,
  				docked: true,
  				isLogin:'未登录',
  				userName:'游客',
  				bottomSheet: false,
  				userVal:'',
  				userSrc:'',
  				loginTips:false,
  				cookie:''

			}
		},
		methods: {
			//登录
			toLogin(){
				var self = this;
				$.ajax({
					url:'https://cnodejs.org/api/v1/accesstoken',
					type:'post',
					data:{
						accesstoken:self.userVal
					},
					success(data){
//						console.log(data)
						if(data){
							var now = new Date();
							now.setDate(now.getDate()+7);
							document.cookie = "isUser="+self.userVal+";expires="+now;
							self.loginTips = false;
							location.reload();
						}
					},
					error:function(err){
						self.loginTips = true;
					}
				})
			},
			closeBottomSheet () {
		    	this.bottomSheet = false
		    },
		    openBottomSheet () {
	    		
	    		if(this.isLogin == '退出登录'){
	    			var now = new Date();
					now.setDate(now.getDate()-30);
					this.bottomSheet = false;
					document.cookie = "isUser="+self.userVal+";expires="+now;
					location.reload()
	    		}else{
	    			this.bottomSheet = true;
	    		}
		    },
			handleTabChange(val) {
				this.activeTab = val
				this.name = val
				this.isNav = false
				$('.nameVal').animate({
					'left': '-100%'
				}, 1000, function() {
					this.notext = false
				}.bind(this))
				if(this.activeTab == '全部') {
					window.location.href = "#/index/mainList"
				} else if(this.activeTab == '问答') {
					window.location.href = "#/index/askList"
				} else if(this.activeTab == '精华') {
					window.location.href = "#/index/goodList"
				} else if(this.activeTab == '分享') {
					window.location.href = "#/index/shareList"
				} else if(this.activeTab == '招聘') {
					window.location.href = "#/index/jobList"
				}
			},
			Nav() {
				this.isNav = !this.isNav;
				if(this.isNav) {
					//					this.name = '';
					var self = this;
					$('.nameVal').animate({
						'left': '0',
					}, 1000, function() {
						self.notext = true
					})
				} else {

					$('.nameVal').animate({
						'left': '-100%'
					}, 1000, function() {
						this.notext = false
					})
				}
			},
			toggle (flag) {
				this.open = !this.open
				this.docked = !flag
		    }

		},
		mounted() {
			var self = this;
			//			$('<span/>').html('111').appendTo($('.mu-appbar .mu-appbar-title'))
			//			console.log(parseInt($('.mu-appbar-title').css('width')))
			$('.nameVal').css('width', parseInt($('.mu-appbar-title').css('width')) + parseInt($('.mu-ripple-wrapper').css('width'))).css('borderBottom', '1px solid #fff').appendTo($('.mu-appbar-title'))
			if(this.$route.path == '/index/mainList') {
				window.location.href = "#/index/mainList";
				this.activeTab = '全部';
			} else if(this.$route.path == '/index/askList') {
				window.location.href = "#/index/askList"
				this.activeTab = '问答';
			} else if(this.$route.path == '/index/goodList') {
				window.location.href = "#/index/goodList"
				this.activeTab = '精华';
			} else if(this.$route.path == '/index/shareList') {
				window.location.href = "#/index/shareList"
				this.activeTab = '分享';
			} else if(this.$route.path == '/index/jobList') {
				window.location.href = "#/index/jobList"
				this.activeTab = '招聘';
			}
			
			//页面一开始判断是否有cookie
			var cookie = document.cookie.split(' ;');
			cookie.forEach(function(item){
				var arr = item.split('=');
				if(arr[0] = 'isUser'){
					self.cookie = arr[1] 
				}
			})	
//			console.log(self.cookie)
			if(self.cookie){
				$.ajax({
					url:'https://cnodejs.org/api/v1/accesstoken',
					type:'POST',
					data:{
						accesstoken : self.cookie
					},
					success(data){
						console.log(data)
						self.userSrc = data.avatar_url;
						self.userName = data.loginname;
						self.isLogin = '退出登录'
					}
				})
			}
		},
	}
</script>
<style scoped lang="scss">
	.inputUserName{
		position: relative;
		padding-top: 2rem;
		input{
			display: block;
			width: 70%;
			margin: 0 auto;
			height: 4rem;
			border-radius: 1rem;
			border: 1px solid #ccc;
			outline: none;
			box-shadow: 0 0 0.5rem #7E57C2;
		}
		span{
			display: block;
			width: 10rem;
			height: 4rem;
			border-radius: 1rem;
			text-align: center;
			line-height: 4rem;
			font-size: 2rem;
			border: 1px solid #ccc;
			background-color: #7E57C2;
			color: #fff;
			margin: 0 auto;
			margin-top: 1rem;
		}
		i{
			position: absolute;
			left: 50%;
			top: 0;
			color: red;
		}
	}
	.tips{
		margin-top: 1rem;
	}
	.headers {
		position: fixed;
	}
	
	.nameVal {
		height: 90%;
		position: absolute;
		top: 50%;
		left: -100%;
		margin-top: -24px;
	}
	.userInfor{
		width: 100%;
		text-align: center;
		height: 16rem;
		padding-top: 4rem;
		img{
			width: 4rem;
			height: 4rem;
			margin: 0 auto;
			display: block;
			border-radius: 50%;
		}
		span{
			
		}
	}
	.list{
		padding-left:1rem;
		.lists{
			border: 1px solid #ccc;
			margin-top: 1rem;
			background-color: yellow;
			
		}
	}
</style>