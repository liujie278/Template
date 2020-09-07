import {
	login
} from '@/api/api.js'
import {
	updateTokenInfo,updateAddress,updateUserMsg
} from '../../common/Core/token.js'

const state = {
	hasLogin: false,
	tokenInfo: {}
}

const mutations = {
	SET_TOKENINFO: (state, tokenInfo) => {
		state.hasLogin = true;
		state.tokenInfo = tokenInfo;
		updateTokenInfo(tokenInfo)
	},
	SET_HASLOGIN: (state, hasLogin) => {
		state.hasLogin = hasLogin
	}
}

const actions = {
	// user login
	login({commit}, tokenInfo) {
		const {username,password,type} = tokenInfo
		return new Promise((resolve, reject) => {
			login({
				username: username.trim(),
				password: password,
				type: type
			}).then(response => {
				// const {data} = response
				// commit('SET_USERINFO', data) //用户信息。
				resolve(response)
			}).catch(error => {
				reject(error)
			})
		})
	}

}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}
