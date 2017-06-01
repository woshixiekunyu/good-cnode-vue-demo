<template>
	<div class="shareList">
		<ul>
			<li v-for="(a,idx) in Alltopic">
				<div class="topicUser">
					<img :src="a.author.avatar_url" alt="" />
					<p>{{a.author.loginname}}</p>
					<span>分享</span>
				</div>
				<div class="topicContent" @click="toDetail(a.id)">
					<h4>{{a.title}}</h4>
					<p>{{a.content}}</p>
					
				    <div class="times_disc">
				    	<span>时间:<i v-times>{{a.create_at}}</i></span>
				    	<span style="color:red">|</span>
				    	<span>{{a.reply_count}}/{{a.visit_count}}</span>
				    </div>
				</div>
				<mu-icon-menu slot="right" icon="more_vert" tooltip="操作" class="operate"">
			        <mu-menu-item title="标记" v-getCollect @click="toCollect(a.id)"/>
			        <mu-menu-item title="取消" v-removeCollect/>
			        <mu-menu-item title="离开"/>
			        <mu-menu-item :title="''+idx" style="text-indent: -999999px;position: absolute;top:0" />
			    </mu-icon-menu>
			</li>
		</ul>
		<div class="loadMore" @click="loadMore()">加载更多</div>
		<mu-circular-progress :size="40" class="startLoad" v-show="isstartLoad"/>
		<mu-circular-progress :size="40" class="footLoad" v-show="isfootLoad"/>
	</div>
</template>
<script>

	export default {
		data(){
			return {
				Alltopic:[],
				isstartLoad:true,
				isfootLoad:false,
				page:1
			}
		},
		methods:{
			loadMore(){
				var self = this;
				this.isfootLoad = true;
				$.ajax({
					url:'https://cnodejs.org/api/v1/topics',
					type:'GET',
					data:{
						limit : 10,
						mdrender : false,
						tab:'share',
						page:self.page
					},
					success(data){
						console.log(data)
						self.isstartLoad = false;
						self.isfootLoad = false;
						self.Alltopic = self.Alltopic.concat(data.data);
					}
				})
			},
			toCollect(id){

			},
			toDetail(id){
				window.location.href = "#/detail/"+id
			}
		},
		mounted(){
			var self = this;
			$.ajax({
				url:'https://cnodejs.org/api/v1/topics',
				type:'GET',
				data:{
					limit : 10,
					tab:'share',
					mdrender : false
				},
				success(data){
					console.log(data)
					self.isstartLoad = false;
					self.isfootLoad = false;
					self.Alltopic = data.data;
					self.page++
				}
			})
		},
		directives:{
			times(el){
				$(el).html($(el).html().slice(0,10))
			},
			noneTopic(el){
				$(el).on('click',function(){
					console.log($(this).parent().parent().parent())
				})
			},
			getCollect(el){
				$(el).on('click',function(){
					var idxNum = $(this).parent().children().eq(3).text().trim();

					$(this).parent().parent().parent().prev().prev()
					.children('.shareList').children('ul').children('li').eq(idxNum).css('backgroundColor','yellow')
				})

			},
			removeCollect(el){
				$(el).on('click',function(){
					var idxNum = $(this).parent().children().eq(3).text().trim();

					$(this).parent().parent().parent().prev().prev()
					.children('.shareList').children('ul').children('li').eq(idxNum).css('backgroundColor','#fff')
				})

			},
		}
	}
</script>
<style scoped lang="scss">
	.shareList{
			padding: 1rem;

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
		.loadMore{
			margin-top: 1rem;
			width: 100%;
			height: 3rem;
			border-radius: 1rem;
			line-height: 3rem;
			text-align: center;
			border: 1px solid #ccc;
		}
		.loadMore:active{
			background-color: #7e57c2;
			color:#fff
		}
		.startLoad{
			position: absolute;
			top: 50%;
			left: 50%;
			margin-left: -24px;
			margin-top: -24px;
		}
		.footLoad{
			position: fixed;
			bottom: 0;
			left: 50%;
			margin-left: -24px;
			margin-top: 40px;
		}
	}
</style>