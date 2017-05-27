<template>
	<div class="mainList">
		<ul>
			<li v-for="a in Alltopic">
				<div class="topicUser">
					<img :src="a.author.avatar_url" alt="" />
					<p>{{a.author.loginname}}</p>
					<span>置顶</span>
				</div>
				<div class="topicContent">
					<h4>{{a.title}}</h4>
					<p>{{a.content}}</p>
					<mu-icon-menu slot="right" icon="more_vert" tooltip="操作" class="operate">
				        <mu-menu-item title="回复" v-noneTopic/>
				        <mu-menu-item title="标记" />
				        <mu-menu-item title="删除" />
				    </mu-icon-menu>
				    <div class="times_disc">
				    	<span>{{a.reply_count}}/{{a.visit_count}}</span>
				    	<span>时间:<i v-times>{{a.create_at}}</i></span>
				    </div>
				</div>
				
			</li>
		</ul>
		<mu-circular-progress :size="40"/>	

	</div>
</template>
<script>

	export default {
		data(){
			return {
				Alltopic:[],
				
			}
		},
		mounted(){
			var self = this;
			$.ajax({
				url:'https://cnodejs.org/api/v1/topics',
				type:'GET',
				data:{
					limit : 10,
					mdrender : false
				},
				success(data){
					console.log(data)
					self.Alltopic = self.Alltopic.concat(data.data);
					
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
			}
		}
	}
</script>
<style scoped lang="scss">
	.mainList{
			padding: 1rem;

		ul{
			
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
	}
</style>