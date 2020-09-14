/**
 * vue页面直接调用方法  
 * nvue页面需单独引入该文件
 */

import http from './libs/request/index.js'
import {isAccessExpired,isRefreshExpired,removeTokenInfo,updateTokenInfo,Delete} from './libs/request/token.js'
// 版本信息
import config from './libs/config/config.js'
// 层级相关
import zIndex from './libs/config/zIndex.js'
// 添加单位
import addUnit from './libs/function/addUnit.js' 
// 节流 (按钮在一定时间内，只能触发一次)
import throttle from './libs/function/throttle.js'
// 规则检验
import test from './libs/function/test.js'
// 弹出层和loading框
import {showWaiting,closeWaiting,toast,plusToast}from './libs/function/toast.js'
// 获取整个父组件
import $parent from './libs/function/$parent.js'
// 路由封装
import route from './libs/function/route.js'





module.exports = {
	showWaiting,
	closeWaiting,
	toast,
	plusToast,
	throttle,
	config,
	zIndex,
	addUnit,
	test,
	get: http.get,
	post: http.post,
	put: http.put,
	http,
	isAccessExpired,
	isRefreshExpired,
	removeTokenInfo,
	updateTokenInfo,
	Delete,
	$parent,
	route:route
}
