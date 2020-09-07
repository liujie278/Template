<template>
	<view class="content">
		<l-button type="primary" style="margin: 20rpx 0;" @click="login">登录</l-button>
		<l-button type="error" style="margin: 20rpx 0;" @click="shopList">shopList</l-button>
		<l-button type="warning" style="margin: 20rpx 0;" @click="getInfo">getInfo</l-button>
	</view>
</template>

<script>
	import {
		login,
		getTrendList,
		getInfo
	} from '@/api/api.js'
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				par: {
					username: '269687489@qq.com',
					password: '2d524e2f870e5240b08b3b85b164f680',
					type: 3
				},
				list: {
					limit: 10,
					page: 1
				}
			}
		},
		methods: {
			...mapMutations({
				SET_TOKENINFO: 'user/SET_TOKENINFO'
			}),
			login() {
				this.$store.dispatch('user/login', this.par)
					.then((res) => {
						console.log('login', res)
						this.SET_TOKENINFO(res.data)
					})
					.catch((err) => {
						uni.showToast({
							icon: 'none',
							title: err
						})
					})
			},
			shopList() {
				this.$Lau.post('/customer/home/selectTrendList', {
					limit: 10,
					page: 1
				},{authType:'None'}).then(res => {
					console.log(res);
				});
			},
			
			getInfo() {
				this.$Lau.get('/customer/user/selectUserInfo').then(res => {
					console.log(res);
				});
				// getInfo().then(res=>{
				// 	console.log('getInfo',res)
				// }).catch(err=>{
				// 	console.log(err)
				// })
			}
		},
		onLoad() {

		}
	}
</script>

<style lang="scss" scoped>
	.box {
		width: 100%;
		height: 200rpx;
		background: #7ac4c4;
		// background-image: linear-gradient(to right, #7ac4c4 , #70bbbb);
	}

	.box1 {
		margin-top: 100rpx;
		width: 100%;
		height: 200rpx;
		background: $l-theme-titanium;
	}

	.box2 {
		margin-top: 100rpx;
		width: 100%;
		height: 200rpx;
		background: #82adb5;
	}
</style>
