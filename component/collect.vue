<template>
<div class="collectList">
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
		<ul>
			<li v-for="(col,idx) in collectList">
				<div class="topicUser">
					<img :src="col.author.avatar_url" alt="" />
					<p>{{col.author.loginname}}</p>
					<span>{{col.tab}}</span>
				</div>
				<div class="topicContent" @click="toDetail(col.id)">
					<h4>{{col.title}}</h4>
					<p>{{col.content}}</p>
					
				    <div class="times_disc">
				    	<span>时间:<i v-times>{{col.create_at}}</i></span>
				    	<span style="color:red">|</span>
				    	<span>{{col.reply_count}}/{{col.visit_count}}</span>
				    </div>
				</div>
			</li>
		</ul>
	</div>
</template>

<script>
	export default {
		data(){
			return {
				Alltopic:'',
				collectList:'',
				activeTab:'我的收藏',
				backsrc: './image/back.png',
				notext:''
			}
		},
		methods:{
			toDetail(id){
				window.location.href="#/detail/"+id
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
		},
		mounted(){
			var self = this
			//nav
//			var params = this.$route.params.id;
//			$.ajax({
//				url: 'https://cnodejs.org/api/v1/topic/' + params,
//				type: 'GET',
//				success(data) {
//					console.log(data)
//					self.authorname = data.data.author.loginname;
//					self.authorimg = data.data.author.avatar_url;
//					self.sendTime = data.data.create_at.slice(0, 10);
//					self.articleTitle = data.data.title;
//					self.articleCon = data.data.content
//					self.topic = data.data.tab;
//					self.visit = data.data.visit_count;
//					self.pinlun = data.data.reply_count;
//					self.discInfor = data.data.replies;
//					self.topicId = data.data.id
//				}
//			})
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
			
			//获取collect列表
			var self = this;
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
//						self.userName = data.loginname;
						$.ajax({
							url:'https://cnodejs.org/api/v1/topic_collect/'+data.loginname,
							type:'get',
							success(dataId){
								console.log(dataId)
								self.collectList = dataId.data
							}
						})
					}
				});
			}else{
				alert('请先登录')
			}
		},
		directives:{
			times(el){
				$(el).html($(el).html().slice(0,10))
			},
		}
	}
</script>

<style scoped lang="scss">
	.collectList{
		padding: 1rem;
		img{
	        width: 100%;
	    }
	    li{
	        margin-left: 1rem;
	        list-style: circle;
	    }
	    h2,h3{
	        line-height: 4rem;
	    }
		.headers{
	        position: fixed;
	        top: 0;
        	left: 0;
	    }
	    .nameVal{
	        height: 90%;
	        position: absolute;
	        top:50%;
	        left: -100%;
	        margin-top: -24px;
	    }
		ul{
			margin-top: 56px;
			li{
				border: 1px solid #ccc;
				border-radius: 1rem;
				display: flex;
				margin-top: 0.5rem;
				box-shadow: 0 0.3rem 0 #ccc;
				padding: 1rem 1rem 2rem;
				max-height: 15rem;
				overflow: hidden;
				position: relative;
				.topicUser{
					width: 20%;
					text-align:center;
					img{
						width: 4rem;
						height: 4rem;
						border-radius: 50%;
						border: 1px solid #f00;
					}
					p{
						width: 100%;
						word-wrap: break-word;
					}
					span{
						display: block;
						width: 3rem;
						height: 1.6rem;
						line-height: 1.6rem;
						margin: 0 auto;
						border-radius: 1rem;
						background-color: #f00;
						font-size: 0.12rem;
						border: 1px solid #FF0000;
					}
					i{
						display: block;
						width: 5rem;
						height: 1.6rem;
						line-height: 1.6rem;
						margin: 0 auto;
						border-radius: 1rem;
						background-color: yellow;
						font-size: 0.12rem;
						border: 1px solid #FF0000;
						margin-top:0.5rem;
						color:#00f;
					}
				}
				.topicContent{
					width: 70%;
					margin-left: 0.5rem;
					h4{
						
					}
					p{
						height: 3rem;
						line-height: 1.5rem;
						word-wrap: break-word;
						padding: 0 1rem;
						overflow: hidden;
						text-overflow: ellipsis;
						margin-bottom: 1rem;
					}
					
					.times_disc{
						position: absolute;
						bottom: 0.5rem;
						right: 1rem;
						margin-top: 1rem;
						line-height: 2rem;
						span{
						}
					}
					
				}
				.operate{
					position: absolute;
					right: 0;
					top: 0;
				}
			}
		}
		
	}
</style>