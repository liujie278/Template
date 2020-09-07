import {
	isAccessExpired,
	isRefreshExpired,
	updateAccess,
	removeTokenInfo,
	updateTokenInfo
} from './Core/token.js'

const install = (Vue, vm) => {
	// 此为自定义配置参数，具体参数见上方说明
	Vue.prototype.$Lau.http.setConfig({
		baseUrl: 'http://47.99.46.57:9106',
		loadingText: '努力加载中~',
		loadingTime: 800,
		// 设置自定义头部content-type
		// header: {
		// 	'content-type': 'xxx'
		// }
		// ......
	});

	// 请求拦截部分，如配置，每次请求前都会执行
	Vue.prototype.$Lau.http.interceptor.request = (config) => {
		delete config.header.authType
		if (config.header.authType === 'None') {
			if (config.header.jwt_token || config.header.sub) {
				delete config.header.jwt_token
				delete config.header.sub
			}
			return config
		}

		const tokenInfo = uni.getStorageSync('tokenInfo') || ''

		if (accessExpired) {
			if (refreshExpired) {
				delete config.header.jwt_token
				delete config.header.sub
				removeTokenInfo()
				console.log(options, "ac/rf都已经过期，且不能匿名访问，需要重新登录")
				return {
					mypReqToCancel: true,
					text: '请求未通过验证,检查是否登录或者数据正确1',
					type: 'warning'
				}

			} else {
				try {
					// const acc = await _toRefreshAccess()
					// options.header = Object.assign({}, options.header, {
					// 	jwt_token: acc,
					// 	sub: accessSub
					// })
					_requestLog(options, "刷新rf成功")
				} catch (e) {
					// delete options.header.jwt_token
					// delete options.header.sub
					// removeTokenInfo()
					// // #ifdef APP-PLUS
					// plusToast('登录已过期,请重新登录')
					// // #endif
					// // #ifndef APP-PLUS
					// Toast('登录已过期,请重新登录')
					// // #endif
					// setTimeout(function() {
					// 	uni.reLaunch({
					// 		url: '/pages/login/login'
					// 	});
					// }, 500);
					// uni.$emit("logedOut")
					// _requestLog(options, "刷新rf失败，且不能匿名访问，需要重新登录")
					// return {
					// 	mypReqToCancel: true,
					// 	text: '请求未通过验证,检查是否登录或者数据正确2',
					// 	type: 'warning'
					// }
				}
			}
		} else {
			_requestLog(options, "成功通过")
			config.header = Object.assign({}, config.header, {
				jwt_token: tokenInfo.access_token,
				sub: tokenInfo.sub
			})
		}
		console.log(options, "成功通过")

		// 最后需要将config进行return
		return config;
		// 如果return一个false值，则会取消本次请求
		// if(config.url == '/user/rest') return false; // 取消某次请求
	}

}

export default {
	install
}
