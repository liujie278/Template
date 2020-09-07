import Request from './myp-request/index.js'
import {
	isAccessExpired,
	isRefreshExpired,
	updateAccess,
	removeTokenInfo,
	updateTokenInfo
} from './token.js'
import {
	showWaiting,
	closeWaiting,
	plusToast,
	Toast
} from '../util/util.js'

const config = {
	baseUrl: 'http://47.99.46.57:9106',
	header: {
		"Content-Type": "application/json"
	}
}

const reqInterceptor = async (options) => {
	const authType = options.authType || 'Bearer'
	const loading = options.loading || 'Bearer'
	delete options.authType
	delete options.loading
	options.header = Object.assign({}, config.header, options.header || {})
	const app = getApp({
		allowDefault: true
	})

	let tokenInfo = uni.getStorageSync('tokenInfo') || '';
	const access = tokenInfo.access_token
	const refresh = tokenInfo.refresh_token
	const accessSub = tokenInfo.sub

	const accessExpired = isAccessExpired(tokenInfo)
	const refreshExpired = isRefreshExpired(tokenInfo)
	const lang = uni.getStorageSync('select');

	if (authType === 'None') {
		if (options.header.jwt_token || options.header.sub) {
			delete options.header.jwt_token
			delete options.header.sub
		}
		_requestLog(options, "None Auth Type")
		return options
	}
	if (loading !== 'None') {
		// #ifdef APP-PLUS
		showWaiting()
		// #endif
		// #ifndef APP-PLUS
		uni.showLoading()
		// #endif
	}

	if (accessExpired) {
		if (refreshExpired) {
			delete options.header.jwt_token
			delete options.header.sub
			removeTokenInfo()
			// #ifdef APP-PLUS
			plusToast('请先登录')
			// #endif
			// #ifndef APP-PLUS
			Toast('请先登录')
			// #endif
			setTimeout(function() {
				uni.reLaunch({
					url: '/pages/login/login'
				});
				// #ifdef APP-PLUS
				closeWaiting()
				// #endif
				// #ifndef APP-PLUS
				uni.hideLoading()
				// #endif
			}, 500);

			uni.$emit("logedOut")
			_requestLog(options, "ac/rf都已经过期，且不能匿名访问，需要重新登录")
			return {
				mypReqToCancel: true,
				text: '请求未通过验证,检查是否登录或者数据正确1',
				type: 'warning'
			}

		} else {
			try {
				const acc = await _toRefreshAccess()
				options.header = Object.assign({}, options.header, {
					jwt_token: acc,
					sub: accessSub
				})
				_requestLog(options, "刷新rf成功")
			} catch (e) {
				delete options.header.jwt_token
				delete options.header.sub
				removeTokenInfo()
				// #ifdef APP-PLUS
				plusToast('登录已过期,请重新登录')
				// #endif
				// #ifndef APP-PLUS
				Toast('登录已过期,请重新登录')
				// #endif
				setTimeout(function() {
					uni.reLaunch({
						url: '/pages/login/login'
					});
				}, 500);
				uni.$emit("logedOut")
				_requestLog(options, "刷新rf失败，且不能匿名访问，需要重新登录")
				return {
					mypReqToCancel: true,
					text: '请求未通过验证,检查是否登录或者数据正确2',
					type: 'warning'
				}
			}
		}
	} else {
		_requestLog(options, "成功通过")
		options.header = Object.assign({}, options.header, {
			jwt_token: access,
			sub: accessSub
		})
	}
	_requestLog(options, "成功通过")
	return options
}

const resInterceptor = (response, conf = {}) => {
	const lang = uni.getStorageSync('select') || 'zh-CN';
	const statusCode = response.statusCode
	if (statusCode >= 200 && statusCode < 300) {
		if (typeof response.data === 'string') {
			const parsed = JSON.parse(response.data)
			response.data = parsed
		}
		setTimeout(() => {
			// #ifdef APP-PLUS
			closeWaiting()
			// #endif
			// #ifndef APP-PLUS
			uni.hideLoading()
			// #endif
		}, 500)
		if (process.env.NODE_ENV === 'development') {
			if (response.data.code === 0) {
				return response.data || {}
			} else if (response.data.code === 406 || response.data.code === 401 || response.data.code === 408) {
				removeTokenInfo()
				setTimeout(() => {
					uni.reLaunch({
						url: '/pages/login/login'
					});
				}, 500)
			} else {
				if (lang == 'en-US') {
					// #ifdef APP-PLUS
					plusToast(response.data.english)
					// #endif
					// #ifndef APP-PLUS
					Toast(response.data.english)
					// #endif
				} else {
					// #ifdef APP-PLUS
					plusToast(response.data.msg)
					// #endif
					// #ifndef APP-PLUS
					Toast(response.data.msg)
					// #endif
				}
				return response.data || {}
			}
		} else {
			if (response.data.code === 0) {
				return response.data || {}
			} else if (response.data.code === 406 || response.data.code === 401 || response.data.code === 408) {
				removeTokenInfo()
				setTimeout(() => {
					uni.reLaunch({
						url: '/pages/login/login'
					});
				}, 500)
			} else {
				if (lang == 'en-US') {
					// #ifdef APP-PLUS
					plusToast(response.data.english)
					// #endif
					// #ifndef APP-PLUS
					Toast(response.data.english)
					// #endif
				} else {
					// #ifdef APP-PLUS
					plusToast(response.data.msg)
					// #endif
					// #ifndef APP-PLUS
					Toast(response.data.msg)
					// #endif
				}
				return response.data || {}
			}
		}
	} else if (statusCode === 500) {
		_responseLog(response, conf, "response 500")
		// #ifdef APP-PLUS
		closeWaiting()
		// #endif
		// #ifndef APP-PLUS
		uni.hideLoading()
		// #endif
		if (lang == 'en-US') {
			// #ifdef APP-PLUS
			plusToast(response.data.english)
			// #endif
			// #ifndef APP-PLUS
			Toast(response.data.english)
			// #endif
		} else {
			// #ifdef APP-PLUS
			plusToast(response.data.msg)
			// #endif
			// #ifndef APP-PLUS
			Toast(response.data.msg)
			// #endif
		}
		return {
			mypReqToReject: true,
			text: "服务异常，请稍后再试或反馈问题",
			type: 'error'
		}
	} else {
		_responseLog(response, conf, "response 300-499")
		if (lang == 'en-US') {
			// #ifdef APP-PLUS
			plusToast(response.data.english)
			// #endif
			// #ifndef APP-PLUS
			Toast(response.data.english)
			// #endif
		} else {
			// #ifdef APP-PLUS
			plusToast(response.data.msg)
			// #endif
			// #ifndef APP-PLUS
			Toast(response.data.msg)
			// #endif
		}
		return {
			mypReqToReject: true,
			text: "请求失败，请稍后再试或反馈问题",
			type: 'error'
		}
	}
}

const req = new Request(config, reqInterceptor, resInterceptor)

function _requestLog(req, describe = null) {
	if (process.env.NODE_ENV === 'development') {
		console.log("地址：" + req.url)
		if (describe) {
			console.log("描述：" + describe)
		}
		console.log("详细：" + JSON.stringify(req))
	}
}

function _responseLog(res, conf = {}, describe = null) {
	let _statusCode = res.statusCode;
	if (process.env.NODE_ENV === 'development') {
		console.log("地址: " + conf.url)
		if (describe) {
			console.log("描述：" + describe)
		}
		console.log("结果: " + JSON.stringify(res))
	}
}

function _toRefreshAccess() {
	let tokenInfo = uni.getStorageSync('tokenInfo') || '';
	const refresh = tokenInfo.refresh_token
	const accessSub = tokenInfo.sub
	return new Promise((resolve, reject) => {
		uni.request({
			url: config.baseUrl + '/auth/refreshtoken',
			method: 'POST',
			header: {
				jwt_ref_token: refresh,
				sub: accessSub
			},
			success: res => {
				if (res.statusCode >= 200 && res.statusCode < 300) {
					updateTokenInfo(res.data.data)
					resolve(res.data.data.access_token)
				} else {
					reject("get error")
				}
			},
			fail: (e) => {
				reject('no_network')
			}
		})
	})
}

export default req
