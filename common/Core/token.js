const AccessKey = "access"
const AccessTimeKey = "access_time"
const RefreshKey = "refresh"
const RefreshTimeKey = "refresh_time"
const TokenInfo = "tokenInfo"
const Address = "address"
const UserMsg = "userMsg"

export function isAccessExpired(myUserInfo) {
	const nowTime = Date.parse(new Date()) / 1000
	if (!myUserInfo.access_token || !myUserInfo.expires_in) {
		return true
	}
	if (nowTime - myUserInfo.expires_in < 0) { 
		return false
	}
	return true
}

export function isRefreshExpired(myUserInfo) {
	const app = getApp({
		allowDefault: true
	})
	const nowTime = Date.parse(new Date()) / 1000
	if (!myUserInfo.refresh_token || !myUserInfo.refTokenMsg.expires_in) {
		return true
	}
	if (nowTime - myUserInfo.refTokenMsg.expires_in < 0) { 
		return false
	}
	return true
}


export function retrieveTokenInfo() {
	const app = getApp({
		allowDefault: true
	})
	try {
		const _access = uni.getStorageSync(AccessKey)
		if (_access) {
			app.globalData.access = _access
		}
		const _accessTime = uni.getStorageSync(AccessTimeKey)
		if (_accessTime) {
			app.globalData.accessTime = _accessTime * 1
		}
		const _refresh = uni.getStorageSync(RefreshKey)
		if (_refresh) {
			app.globalData.refresh = _refresh
		}
		const _refreshTime = uni.getStorageSync(RefreshTimeKey)
		if (_refreshTime) {
			app.globalData.refreshTime = _refreshTime * 1
		}
	} catch (e) {
		// TODO: error
	}
}

export function updateAccess(access) {
	const app = getApp({
		allowDefault: true
	})
	if (access) {
		const time = Date.now()
		app.globalData.access = access
		app.globalData.accessTime = time
		uni.setStorage({
			key: AccessKey,
			data: access,
			fail: (e) => {
				// TODO
			}
		})
		uni.setStorage({
			key: AccessTimeKey,
			data: time,
			fail: (e) => {
				// TODO
			}
		})
	} else {
		app.globalData.access = null
		app.globalData.accessTime = null
		uni.removeStorage({
			key: AccessKey,
			fail: (e) => {
				// TODO
			}
		})
		uni.removeStorage({
			key: AccessTimeKey,
			fail: (e) => {
				// TODO
			}
		})
	}
}

// 存储tokkin信息
export function updateTokenInfo(data){
	uni.setStorage({
		key: TokenInfo,
		data: data,
		fail: (e) => {
			// TODO
		}
	})
}
// 删除tokkin信息
export function removeTokenInfo(){
	uni.removeStorage({
		key: TokenInfo,
		fail: (e) => {
			// TODO
		}
	})
}

// 存储地址信息
export function updateAddress(data){
	uni.setStorage({
		key: Address,
		data: data,
		fail: (e) => {
			// TODO
		}
	})
}
// 删除地址信息
export function removeAddress(){
	uni.removeStorage({
		key: Address,
		fail: (e) => {
			// TODO
		}
	})
}


// 存储用户基本信息
export function updateUserMsg(data){
	uni.setStorage({
		key: UserMsg,
		data: data,
		fail: (e) => {
		}
	})
}
// 删除用户基本信息
export function removeUserMsg(){
	uni.removeStorage({
		key: UserMsg,
		fail: (e) => {
			// TODO
		}
	})
}

