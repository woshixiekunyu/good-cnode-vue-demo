<template>
	<div class="detail">
		<mu-appbar :title="activeTab" class="headers">
			<mu-avatar :src="backsrc" slot="left" style="background-color: #7e57c2;" @click="back()" />
			<mu-icon-button icon="more_vert" slot="right" @click="Nav()" />
		</mu-appbar>
		<mu-tabs :value="activeTab" @change="handleTabChange" class="nameVal">
			<mu-tab value="全部" title="全部" v-show="notext" />
			<mu-tab value="问答" title="问答" v-show="notext" />
			<mu-tab value="精华" title="精华" v-show="notext" />
			<mu-tab value="分享" title="分享" v-show="notext" />
			<mu-tab value="招聘" title="招聘" v-show="notext" />

		</mu-tabs>
		<mu-card class="content">
			<mu-card-header :title="authorname" :subTitle="sendTime">
				<mu-avatar :src="authorimg" slot="avatar" v-abc/>
			</mu-card-header>

			<mu-card-title :title="articleTitle" class="underLine" />
			
			<mu-card-text v-html="articleCon"></mu-card-text>
			<mu-flat-button class="collect" label="collect" @click="collect(topicId)"/>
			<mu-card-actions style="border-top: 1px solid #ccc;">
				<mu-flat-button :label="'visit：'+visit" />
				<mu-flat-button :label="'评论共'+pinlun+'条'" />
				
			</mu-card-actions>
		</mu-card>
		<div class="sidcArea">
			<ul>
				<li v-for="(i,idx) in discInfor">
					<div class="discUser">
						<img :src="i.author.avatar_url" alt="" v-show="!isHasImg"/>
						<span>{{i.author.loginname}}</span>
						<i>{{idx+1}}楼</i>
					</div>
					<div class="discContent">
						<div v-html="i.content"></div>
						<div class="zanOrdis">
							<div class="zan">
								<i class="icon icon-zan" @click="discZan(i.id,i.ups.length)"></i><span>{{i.ups.length}}</span>
							</div>
							<i class="icon icon-disc" @click="toDisor(i.id,i.author.loginname)"></i>
						</div>
					</div>
				</li>
			</ul>
		</div>
		
		<div class="backInput">
			<input type="text" v-model="backInputVal" placeholder="请输入评论内容"/>
			<span @click="sendBackInput()">评论</span>
		</div>
		
	</div>
</template>
<script>
	export default {
		data() {
			return {
				authorname: '',
				authorimg: '',
				sendTime: '',
				articleTitle: '',
				topic: '',
				articleCon: '',
				visit: '',
				pinlun: '',
				activeTab: '',
				isNav: false,
				notext: false,
				backsrc: './image/back.png',
				discName: '',
				discSrc: '',
				discInfor: '',
				backInputVal:'',
				istoDisor:false,
				topicId:'',
				topicCollect:false
			}
		},
		computed:{
			zanNum(){
				return 0
			},
			discId(){
				return this.$store.state.discId;
			},
			isHasImg(){
				return this.$store.state.IsNoImg;
			}
		},
		methods: {
			collect(topicId){
				var self = this;
				var key;
				var collect;
				var cookie = document.cookie.split('; ')
				cookie.forEach(function(item){
					var arr = item.split('=');
					if(arr[0] == 'isUser'){
						key = arr[1]
					}else if(arr[0] == 'collect'){
						collect = arr[1]
					}
				})
				if(key){
					if(collect == 'true'){
						$.ajax({
							url:'https://cnodejs.org/api/v1/topic_collect/de_collect',
							type:'POST',
							data:{
								accesstoken : key,
								topic_id : topicId
							},
							success(data){
								console.log(data,'取消')
								self.topicCollect = false;
								console.log(self.topicCollect)
								$('.collect').css('backgroundColor','')
								var now = new Date();
								now.setDate(now.getDate()-370)
								document.cookie = 'collect='+self.topicCollect+';expires='+now;
							}
						})
						
					}else{
						$.ajax({
							url:'https://cnodejs.org/api/v1/topic_collect/collect',
							type:'POST',
							data:{
								accesstoken : key,
								topic_id : topicId
							},
							success(data){
								console.log(data,'收藏')
								self.topicCollect = true;
								console.log(self.topicCollect)
								$('.collect').css('backgroundColor','yellow')
								var now = new Date();
								now.setDate(now.getDate()+365)
								document.cookie = 'collect='+self.topicCollect+';expires='+now;
								console.log(key)
							}
						})
					}
				}else{
					alert('请登录')
				}
				
			},
			discZan(id,zanLength){
				var self = this;
				var key;
				console.log(id)
				var cookie = document.cookie.split('; ')
				cookie.forEach(function(item){
					var arr = item.split('=');
					if(arr[0] == 'isUser'){
						key = arr[1]
					}
				})
				$.ajax({
					url:"https://cnodejs.org/api/v1/reply/"+id+"/ups",
					type:'POST',
					data:{
						accesstoken : key
					},
					success(data){
						console.log(data)
						self.zanNum = zanLength+1
					}
				})
				
			},
			toDisor(id,loginname){
				console.log(id)
				this.istoDisor = true;
				$('.backInput input').val('@'+loginname+' ');
				this.$store.commit('getDiscId',id)
				$('.backInput input').focus()
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
			back() {
				window.history.back()
			},
			sendBackInput(){
				var self = this;
				var params = this.$route.params.id;
//				console.log(self.discId)
				//获取accesstoken
				var key;
				var cookie = document.cookie.split('; ')
				cookie.forEach(function(item){
					var arr = item.split('=');
					if(arr[0] == 'isUser'){
						key = arr[1]
					}
				})
				if(key){
					if(self.istoDisor){
						console.log(self.discId)
						$.ajax({
							url:'https://cnodejs.org/api/v1/topic/'+params+'/replies',
							type:'post',
							data:{
								accesstoken : key,
								content : self.backInputVal,
								reply_id : self.discId
							},
							success(data){
								self.backInputVal = '';
								self.istoDisor = false;
								location.reload();
							}
						})
					}else{
						$.ajax({
							url:'https://cnodejs.org/api/v1/topic/'+params+'/replies',
							type:'POST',
							data:{
								accesstoken : key,
								content : self.backInputVal
							},
							success(data){
								
								self.backInputVal = '';
								location.reload();
							}
						})
					}
					
				}else{
					alert('请登陆后在回复')
				}
//				
			}
		},
		mounted() {

			var self = this
			var params = this.$route.params.id;
			$.ajax({
				url: 'https://cnodejs.org/api/v1/topic/' + params,
				type: 'GET',
				success(data) {
					console.log(data)
					self.authorname = data.data.author.loginname;
					self.authorimg = data.data.author.avatar_url;
					self.sendTime = data.data.create_at.slice(0, 10);
					self.articleTitle = data.data.title;
					self.articleCon = data.data.content
					self.topic = data.data.tab;
					self.visit = data.data.visit_count;
					self.pinlun = data.data.reply_count;
					self.discInfor = data.data.replies;
					self.topicId = data.data.id
				}
			})
			if(this.topic == 'ask') {
				this.topic = '问答'
			} else if(this.topic == 'share') {
				this.topic = '分享'
			} else if(this.topic == 'job') {
				this.topic = '招聘'
			} else if(this.topic == 'good') {
				this.topic = '精华'
			}

			$('.nameVal').css('width', parseInt($('.mu-appbar-title').css('width')) + parseInt($('.mu-ripple-wrapper')
				.css('width'))).css('borderBottom', '1px solid #fff').appendTo($('.mu-appbar-title'))

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
			
			var cookie = document.cookie.split('; ');

			cookie.forEach(function (item) {
				var arr = item.split('=');
				if (arr[0] == 'isUser') {
					self.cookie = arr[1];
				}
			});
//			console.log(self.cookie);
			if (self.cookie) {
				$.ajax({
					url: 'https://cnodejs.org/api/v1/accesstoken',
					type: 'POST',
					data: {
						accesstoken: self.cookie
					},
					success: function success(data) {
						console.log(data,1);
						self.userName = data.loginname;
						$.ajax({
							url:'https://cnodejs.org/api/v1/topic_collect/'+data.loginname,
							type:'get',
							success(dataId){
								console.log(dataId,2)
								console.log(self)
								for(var i=0;i<dataId.data.length;i++){
									if(dataId.data[i].id == self.$route.params.id){

										$('.collect').css('backgroundColor','yellow')
										var now = new Date();
										now.setDate(now.getDate()+365)
										document.cookie = 'collect='+self.topicCollect+';expires='+now;
										break;
									}else if(dataId.data[i].id != self.$route.params.id){
										
										var now = new Date();
										now.setDate(now.getDate()-370)
										document.cookie = 'collect='+self.topicCollect+';expires='+now;
										$('.collect').css('backgroundColor','')
									}
								}
							}
						})
					}
				});
			}else{
				$.ajax({
					url: 'https://cnodejs.org/api/v1/accesstoken',
					type: 'POST',
					data: {
						accesstoken: self.cookie
					},
					success: function success(data) {
//						console.log(data);
						self.userName = data.loginname;
					}
				});
			}
			
			
		},
		directives:{
			abc:{
				bind(el){
					$(el).bind('touchstart',function(){
						console.log(777)
						$(el).css('backgroundColor','red')
					})
					$(el).bind('touchend',function(){
						console.log(777)
						$(el).css('backgroundColor','#fff')
						return;
					})
				}
			}
		}
	}
</script>