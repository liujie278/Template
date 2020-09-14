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

export function Delete(opt) {
	delete opt.header.jwt_token
	delete opt.header.sub
}


