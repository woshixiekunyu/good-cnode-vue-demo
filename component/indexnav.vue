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
					<!--省流量-->
					<div class="slideTips">
						<div class="sildeArea" @click="slide()">
							<span></span>
						</div>
						<i>省流量模式</i>
					</div>
					<mu-raised-button label="cNode 社区" fullWidth class="tips"/>
				</div>
				<div class="userInfor">
					<img :src="userSrc" alt="" />
					<span>{{userName}}</span>
				</div>
				<div class="list">
					<mu-list-item title="我的收藏" class="lists" @click="toCollect()"/>
					<mu-list-item title="新建主题" class="lists" @click="toBuildTopic()"/>
					<mu-list-item title="Menu Item 3" class="lists"/>
				</div>
				<!--<mu-list-item v-if="docked" @click.native="open = false" title="Close" />-->
			</mu-list>
		</mu-drawer>
		<mu-bottom-sheet :open="bottomSheet" @close="closeBottomSheet">
		    <mu-list>
		    	<!-- @itemClick="closeBottomSheet"-->
		    	<mu-sub-header>请登录</mu-sub-header>
		    	<div class="inputUserName">
		    		<input type="text" v-model="userVal"/>
					<i v-show="loginTips">accesstoken有误</i>
		    		<span @click="toLogin()">登录</span>
		    	</div>
		    </mu-list>
		</mu-bottom-sheet>
		<div class="setTopic">
			<input type="text" placeholder="请输入标题" v-model="topicTitleVal"/>
			<textarea name="topicContent" v-model="topicContentVal" placeholder="请输入主题内容"></textarea>
  			<select name="topicType" id="topicType" v-model="topicType">
  				<option value="全部">全部</option>
  				<option value="问答">问答</option>
  				<option value="分享">分享</option>
  				<option value="精华">精华</option>
  				<option value="招聘">招聘</option>
  			</select>
  			<span @click="sendTopic()" v-shanshuo>发表主题</span>
  			<span @click="notSendTopic()" v-shanshuo>取消</span>
		</div>
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
  				cookie:'',
				isBuildTopic:false,
				topicType:'全部',
				topicTitleVal:'',
				topicContentVal:'',
				isNoImg:false,
			}
		},
		methods: {
			//省流量
			slide(){
				this.isNoImg = !this.isNoImg;
				var cookie = document.cookie.split('; ');
				var isHasImg;
				cookie.forEach(function(item){
					var arr = item.split('=');
					if(arr[0] == 'isNoImg'){
						isHasImg = arr[1] 
					}
				})
				if(isHasImg){
					
					if(isHasImg == 'true'){
						$('.sildeArea span').css('left',0).parent().css('backgroundColor','')
						this.$store.commit('getIsNoImg',false);
						//将无图通知存进cookie
						var now = new Date();
						now.setDate(now.getDate()+365)
						document.cookie = "isNoImg="+false+";expires="+now;
						
					}else{
						$('.sildeArea span').css('left',parseInt($('.sildeArea').css('width'))-parseInt($('.sildeArea span')
						.css('width'))).parent().css('backgroundColor','#00f000')
						this.$store.commit('getIsNoImg',true);
						//将无图通知存进cookie
						var now = new Date();
						now.setDate(now.getDate()+365)
						document.cookie = "isNoImg="+true+";expires="+now;
					}
					
				}else{
					$('.sildeArea span').css('left',parseInt($('.sildeArea').css('width'))-parseInt($('.sildeArea span')
					.css('width'))).parent().css('backgroundColor','#00f000')
					this.$store.commit('getIsNoImg',this.isNoImg);
					//将无图通知存进cookie
					var now = new Date();
					now.setDate(now.getDate()+365)
					document.cookie = "isNoImg="+this.isNoImg+";expires="+now;
				}
				
					
			},
			//打开收藏页
			toCollect(){
				var cookie = document.cookie.split('; ');
			
				cookie.forEach(function(item){
					var arr = item.split('=');
					if(arr[0] == 'isUser'){
						self.cookie = arr[1] 
					}
				})	
				if(self.cookie){
					window.location.href="#/collect/";
				}else{
					alert('请先登录')
				}
				
				
			},
			//发送主题
			sendTopic(){
				var self = this;
				var cookie = document.cookie.split('; ');
			
				cookie.forEach(function(item){
					var arr = item.split('=');
					if(arr[0] == 'isUser'){
						self.cookie = arr[1] 
					}
				})	
				$.ajax({
					url:'https://cnodejs.org/api/v1/topics',
					type:'POST',
					data:{
						accesstoken : self.cookie,
						title : self.topicTitleVal,
						content : self.topicContentVal,
						tab : self.topicType
					},
					success(data){
						console.log(data)
						self.topicTitleVal = '';
						self.topicContentVal = '';
					}
				})
			},
			//取消发送
			notSendTopic(){
				$('.setTopic').animate({"top":'-100%'},200)
			},
			//新建主题
			toBuildTopic(){
				var cookie = document.cookie.split('; ');
			
				cookie.forEach(function(item){
					var arr = item.split('=');
					if(arr[0] == 'isUser'){
						self.cookie = arr[1] 
					}
				})	
				if(self.cookie){
					this.isBuildTopic = true;
					$('.setTopic').animate({"top":0},1000)
				}else{
					alert('请先登录')
				}
				
			},
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
			var cookie = document.cookie.split('; ');
			//省流量key
			var isHasImg;
			cookie.forEach(function(item){
				var arr = item.split('=');
				if(arr[0] == 'isUser'){
					self.cookie = arr[1] 
				}else if(arr[0] == 'isNoImg'){
					isHasImg = arr[1];
				}
			})	
			console.log(self.cookie)
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
//						self.userId = data.id;
						self.isLogin = '退出登录'
					}
				})
			}
			//页面刷新判断是否为省流量模式
			if(isHasImg == 'true'){
				$('.sildeArea span').css('left',parseInt($('.sildeArea').css('width'))-parseInt($('.sildeArea span')
				.css('width'))).parent().css('backgroundColor','#00f000')
				//提交到vuex
				this.$store.commit('getIsNoImg',true);
			}else if(isHasImg == 'false'){
				$('.sildeArea span').css('left',0).parent().css('backgroundColor','')
				this.$store.commit('getIsNoImg',false);
			}
		},
		directives:{
			shanshuo:{
				bind(el){
					$(el).bind('touchstart',function(){
						$(el).css('backgroundColor','yellow')
					})
					$(el).bind('touchend',function(){
						setTimeout(function(){
							$(el).css('backgroundColor','')
						},50)
					})
				}
			}
		}
	}
</script>
<style scoped lang="scss">
	.setTopic{
		z-index: 100000;
		width: 100%;
		height: 100%;
		position: fixed;
		top: -100%;
		left: 0;
		background-color: rgba(0,0,0,0.7);

		padding: 10rem 1rem 0;
		input{
			width: 80%;
			height: 3rem;
			padding: 0;
			border: 2px solid #7E57C2;
			border-radius: 1rem;
			outline: none;
		}
		textarea{
			min-width: 100%;
			max-width: 100%;
			min-height: 10rem;
			max-height: 10rem;
			border-right: 1rem;
			border: 2px solid #7E57C2;
			margin-top: 0.5rem;
			outline: none;
		}
		#topicType{
			margin-top: 1rem;
			width: 100%;
			height: 3rem;
			
		}
		&>span{
			display: block;
			width: 100%;
			height: 4rem;
			border: 2px solid #7E57C2;
			background-color: skyblue;
			border-radius: 1rem;
			line-height: 4rem;
			text-align: center;
			font-size: 1.6rem;
			margin-top: 0.5rem;
		}
	}
	.slideTips{
		position: fixed;
		top: 1rem;
		right: 1rem;
		.sildeArea{
			margin: 0 auto;
			width: 3rem;
			height: 1.2rem;
			border: 1px solid #ccc;
			border-radius: 0.5rem;
			position: relative;
			span{
				display: block;
				background: #00f000;
				height: 1.1rem;
				border-radius: 50%;
				border: 1px solid #0000FF;
				width: 1.1rem;
				position: absolute;
				left: 0;
				top: 0;
			}
		}
		i{
			
			font-size: 1.2rem;
		}
	}
	
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