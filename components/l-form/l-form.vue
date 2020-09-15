<template>
	<view class="l-form"><slot /></view>
</template>

<script>


export default {
	name: 'l-form',
	props: {
		// 当前form的需要验证字段的集合
		model: {
			type: Object,
			default() {
				return {};
			}
		},
		
		errorType: {
			type: Array,
			default() {
				return ['message', 'toast']
			}
		},
		// 是否显示表单域的下划线边框
		borderBottom: {
			type: Boolean,
			default: true
		},
		// label的位置，left-左边，top-上边
		labelPosition: {
			type: String,
			default: 'left'
		},
		// label的宽度，单位rpx
		labelWidth: {
			type: [String, Number],
			default: 90
		},
		// lable字体的对齐方式
		labelAlign: {
			type: String,
			default: 'left'
		},
		// lable的样式，对象形式
		labelStyle: {
			type: Object,
			default() {
				return {}
			}
		},
	},
	provide() {
		return {
			lForm: this
		};
	},
	data() {
		return {
			rules: {}
		};
	},
	created() {
		this.fields = [];
		// 存当前实例
		let that = this;
		this.$on('on-form-item-add', item => {
			if (item) {
				that.fields.push(item);
			}
		});
		// 删除当前有的实例
		this.$on('on-form-item-remove', item => {
			if (item.prop) {
				that.fields.splice(that.fields.indexOf(item), 1);
			}
		});
	},
	methods: {
		setRules(rules) {
			this.rules = rules;
		},
		resetFields() {
			this.fields.map(field => {
				field.resetField();
			});
		},
		// 校验全部数据
		validate(callback) {
			return new Promise(resolve => {
				// 对所有的l-form-item进行校验
				let valid = true; 
				let count = 0;
				let errorArr = []; // 存放错误信息
				this.fields.map(field => {
					field.validation('', error => {
						if (error) {
							valid = false;
							errorArr.push(error);
						}
						if (++count === this.fields.length) {
							resolve(valid); 
							
							if(this.errorType.indexOf('none') === -1 && this.errorType.indexOf('toast') >= 0 && errorArr.length) {
								this.$Lau.toast(errorArr[0]);
							}
							// 调用回调方法
							if (typeof callback == 'function') callback(valid);
						}
					});
				});
			});
		}
	}
};
</script>

<style scoped lang="scss">
@import '../../static/styles/css/style.components.scss';
</style>
