let timeout = null;

/**
 * 防抖原理：一定时间内，只有最后一次操作，再过wait毫秒后才执行函数
 */
function debounce(func, wait = 500, immediate = false) {
	if (timeout !== null) clearTimeout(timeout);
	if (immediate) {
		var callNow = !timeout;
		timeout = setTimeout(function() {
			timeout = null;
		}, wait);
		if (callNow) typeof func === 'function' && func();
	} else {
		timeout = setTimeout(function() {
			typeof func === 'function' && func();
		}, wait);
	}
}

export default debounce
