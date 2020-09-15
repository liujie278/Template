<template>
	<view class="content">
		<l-button type="primary" style="margin: 20rpx 0;" @click="login">登录</l-button>
		<l-button type="error" style="margin: 20rpx 0;" @click="shopList">shopList</l-button>
		<l-button type="warning" style="margin: 20rpx 0;" @click="getInfo">getInfo</l-button>
		<l-form :model="form" ref="lForm" :border-bottom='false' :error-type="errorType">
			<l-form-item :leftIconStyle="{color: '#888', fontSize: '32rpx'}" left-icon="account" label-width="120" label="姓名"
			 prop="name">
				<l-input v-model="form.name" />
			</l-form-item>
			<l-form-item required label="简介" prop="intro">
				<l-input v-model="form.intro" />
			</l-form-item>
			<l-form-item label="电话" prop="phone">
				<l-input v-model="form.phone" />
			</l-form-item>
		</l-form>
		<l-button style="margin-top: 20rpx;" @click="submit">提交</l-button>
		<view class="">你好</view>
	</view>
</template>

<script>
	import md5Libs from "../../common/util/libs/function/md5.js";
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
					password: '123456',
					type: 3
				},
				list: {
					limit: 10,
					page: 1
				},
				form: {
					name: '',
					intro: '',
					phone: ''
				},
				rules: {
					name: [{
						required: true,
						message: '请输入名字',
						trigger: ['change', 'blur']
					}],
					intro: [{
						min: 5,
						message: '简介不能少于5个字',
						trigger: 'change'
					}],
					phone: [{
						required: true,
						message: '请输入手机号',
						trigger: ['change', 'blur']
					}, {
						validator: (rule, value, callback) => {
							return this.$Lau.test.mobile(value)
						},
						message: '手机号码不正确',
						trigger: ['blur']
					}]
				},
				errorType: ['toast'],
			}
		},
		methods: {
			...mapMutations({
				SET_TOKENINFO: 'user/SET_TOKENINFO'
			}),
			submit() {
				this.$refs.lForm.validate(valid => {
					if (valid) {
						console.log('验证通过');
					} else {
						console.log('验证失败');
					}
				});
			},


			login() {
				var loginForm = JSON.parse(JSON.stringify(this.par))
				this.par.password = md5Libs.md5(encodeURIComponent(JSON.stringify(loginForm.password)));

				this.$store.dispatch('user/login', this.par)
					.then((res) => {

					})
					.catch((err) => {
						uni.showToast({
							icon: 'none',
							title: err
						})
					})
			},
			shopList() {
				let arr = 1
				const actions = new Map([
					[1,['one']],
					['2',['two']]
				])
				let action = actions.get('1')
					console.log(action)
				// this.$Lau.route('pages/homeSon/homeSon',{
				// 	age:'22'
				// })

			},

			getInfo() {
				getInfo().then(res => {
					console.log('getInfo', res)
				}).catch(err => {})
			}
		},
		onLoad() {

		},
		onReady() {
			this.$refs.lForm.setRules(this.rules)
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
