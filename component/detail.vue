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
				<mu-avatar :src="authorimg" slot="avatar"/>
			</mu-card-header>

			<mu-card-title :title="articleTitle" subTitle="Content Title" class="underLine" />
			<mu-card-text v-html="articleCon">

			</mu-card-text>
			<mu-card-actions style="border-top: 1px solid #ccc;">
				<mu-flat-button :label="'visit：'+visit" />
				<mu-flat-button :label="'评论共'+pinlun+'条'" />
			</mu-card-actions>
		</mu-card>
		<div class="sidcArea">
			<ul>
				<li v-for="(i,idx) in discInfor">
					<div class="discUser">
						<img :src="i.author.avatar_url" alt="" />
						<span>{{i.author.loginname}}</span>
						<i>{{idx+1}}楼</i>
					</div>
					<div class="discContent">
						<div v-html="i.content"></div>
						<div class="zanOrdis">
							<i class="icon icon-zan"></i>
							<i class="icon icon-disc"></i>
						</div>
					</div>
				</li>
			</ul>
		</div>
		
		<div class="backInput">
			<input type="text" v-model="backInputVal"/>
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
				backInputVal:''
			}
		},
		methods: {
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
				var params = this._self.$route.params.id;
				
				//获取accesstoken
				var key;
				var cookie = document.cookie.split(' ;')
				cookie.forEach(function(item){
					var arr = item.split('=');
					if(arr[0] == 'isUser'){
						key = arr[1]
					}
				})
				if(key){
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
					self.discInfor = data.data.replies
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
		}
	}
</script>