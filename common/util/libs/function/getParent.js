export default function getParent(name, keys) {
	let parent = this.$parent;
	while (parent) {
		// 父组件
		if (parent.$options.name !== name) {
			// 如果组件的name不相等，继续上一级寻找
			parent = parent.$parent;
		} else {
			let data = {};
			// 判断keys是否数组，如果传过来的是一个数组，那么直接使用数组元素值当做键值去父组件寻找
			if(Array.isArray(keys)) {
				keys.map(val => {
					data[val] = parent[val] ? parent[val] : '';
				})
			} else {
				// 历遍传过来的对象参数
				for(let i in keys) {
					if(Array.isArray(keys[i])) {
						if(keys[i].length) {
							data[i] = keys[i];
						} else {
							data[i] = parent[i];
						}
					} else if(keys[i].constructor === Object) {
						// 判断是否对象，如果是对象，且有属性，那么使用子组件的值，否则使用父组件的值
						if(Object.keys(keys[i]).length) {
							data[i] = keys[i];
						} else {
							data[i] = parent[i];
						}
					} else {
						// 只要子组件有传值，即使是false值，也是“传值”了，也需要覆盖父组件的同名参数
						data[i] = (keys[i] || keys[i] === false) ? keys[i] : parent[i];
					}
				}
			}
			return data;
		}
	}

	return {};
}