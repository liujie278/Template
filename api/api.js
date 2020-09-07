import request from '../common/Core/myRequest.js'
/* 登录 */
export function login(data) {
	return request.request({
		url: '/auth/authentication',
		method: 'POST',
		data: data,
		authType: 'None'
	})
}

/* 获取用户信息 */
export function getInfo() {
    return request.request({
		header:{
			'Content-Type': 'application/x-www-form-urlencoded'
		},
        url: '/customer/user/selectUserInfo',
        method: 'GET',
		loading:'None'
    })
}


/* --------------------------首页-------------------------- */
// 潮品列表
export function getTrendList(data) {
    return request.request({
		header:{
			'Content-Type': 'application/x-www-form-urlencoded'
		},
        url: '/customer/home/selectTrendList',
        method: 'POST',
        data: data,
		authType: 'None'
    })
}