/**
 * 弹出层提示信息
 */

// 5+ 显示加载框
function showWaiting() {
	plus.nativeUI.showWaiting('');
}

// 5+ 关闭加载框
function closeWaiting() {
	plus.nativeUI.closeWaiting();;
}

// 显示自动消失的提示消息
function toast(title, duration = 1500) {
	uni.showToast({
		icon: 'none',
		title: title,
		duration: duration
	})
}

// 显示自动消失的提示消息
function plusToast(text, verticalAlign) {
	plus.nativeUI.toast(text, {
		verticalAlign
	});
}
module.exports = {
	showWaiting,
	closeWaiting,
	toast,
	plusToast
}
