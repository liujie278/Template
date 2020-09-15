// polyfill的兼容处理
if (!String.prototype.padStart) {
	String.prototype.padStart = function(maxLength, fillString = ' ') {
		if (Object.prototype.toString.call(fillString) !== "[object String]") throw new TypeError(
			'fillString must be String')
		let str = this
		if (str.length >= maxLength) return String(str)

		let fillLength = maxLength - str.length,
			times = Math.ceil(fillLength / fillString.length)
		while (times >>= 1) {
			fillString += fillString
			if (times === 1) {
				fillString += fillString
			}
		}
		return fillString.slice(0, fillLength) + str;
	}
}

function timeFormat(timestamp = null, fmt = 'yyyy-mm-dd') {
	timestamp = parseInt(timestamp);
	if (!timestamp) timestamp = Number(new Date());
	if (timestamp.toString().length == 10) timestamp *= 1000;
	let date = new Date(timestamp);
	let ret;
	let opt = {
		"y+": date.getFullYear().toString(), // 年
		"m+": (date.getMonth() + 1).toString(), // 月
		"d+": date.getDate().toString(), // 日
		"h+": date.getHours().toString(), // 时
		"M+": date.getMinutes().toString(), // 分
		"s+": date.getSeconds().toString() // 秒
		// 有其他格式化字符需求可以继续添加，必须转化成字符串
	};
	for (let k in opt) {
		ret = new RegExp("(" + k + ")").exec(fmt);
		if (ret) {
			fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
		};
	};
	return fmt;
}

export default timeFormat
