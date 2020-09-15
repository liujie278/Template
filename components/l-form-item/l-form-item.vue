<template>
	<view class="l-form-item" :class="{'l-border-bottom': elBorderBottom, 'l-form-item__border-bottom--error': validateState === 'error' && showError('border-bottom')}">
		<view class="l-form-item__body" :style="{
			flexDirection: elLabelPosition == 'left' ? 'row' : 'column'
		}">
			<view class="l-form-item--left" :style="{
				width: elLabelPosition == 'left' ? $Lau.addUnit(elLabelWidth) : '100%',
				flex: `0 0 ${elLabelPosition == 'left' ? $Lau.addUnit(elLabelWidth) : '100%'}`,
				marginBottom: elLabelPosition == 'left' ? 0 : '10rpx',

			}">
				<!-- 为了块对齐 -->
				<view class="l-form-item--left__content">
					<!-- nvue不支持伪元素before -->
					<text v-if="required" class="l-form-item--left__content--required">*</text>
					<view class="l-form-item--left__content__icon" v-if="leftIcon">
						<l-icon :name="leftIcon" :custom-style="leftIconStyle"></l-icon>
					</view>
					<view class="l-form-item--left__content__label" :style="[elLabelStyle, {
						'justify-content': elLabelAlign == 'left' ? 'flex-start' : elLabelAlign == 'center' ? 'center' : 'flex-end'
					}]">
						{{label}}
					</view>
				</view>
			</view>
			<view class="l-form-item--right l-flex">
				<view class="l-form-item--right__content">
					<view class="l-form-item--right__content__slot ">
						<slot />
					</view>
					<view class="l-form-item--right__content__icon l-flex" v-if="$slots.right || rightIcon">
						<l-icon :custom-style="rightIconStyle" v-if="rightIcon" :name="rightIcon"></l-icon>
						<slot name="right" />
					</view>
				</view>
			</view>
		</view>
		<view class="l-form-item__message" v-if="validateState === 'error' && showError('message')" :style="{
			paddingLeft: elLabelPosition == 'left' ? $Lau.addUnit(elLabelWidth) : '0',
		}">{{validateMessage}}</view>
	</view>
</template>

<script>
import Emitter from '../../common/util/libs/util/emitter.js'
import schema from '../../common/util/libs/util/async-validator.js';
// 去除警告信息
schema.warning = function(){};


export default {
	name: 'l-form-item',
	mixins: [Emitter],
	inject: {
		lForm: {
			default() {
				return null
			}
		}
	},
	props: {
		// input的label提示语
		label: {
			type: String,
			default: ''
		},
		// 绑定的值
		prop: {
			type: String,
			default: ''
		},
		// 是否显示表单域的下划线边框
		borderBottom: {
			type: [String, Boolean],
			default: ''
		},
		// label的位置，left-左边，top-上边
		labelPosition: {
			type: String,
			default: ''
		},
		// label的宽度，单位rpx
		labelWidth: {
			type: [String, Number],
			default: ''
		},
		// lable的样式，对象形式
		labelStyle: {
			type: Object,
			default() {
				return {}
			}
		},
		// lable字体的对齐方式
		labelAlign: {
			type: String,
			default: ''
		},
		// 右侧图标
		rightIcon: {
			type: String,
			default: ''
		},
		// 左侧图标
		leftIcon: {
			type: String,
			default: ''
		},
		// 左侧图标的样式
		leftIconStyle: {
			type: Object,
			default() {
				return {}
			}
		},
		// 左侧图标的样式
		rightIconStyle: {
			type: Object,
			default() {
				return {}
			}
		},
		
		required: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			initialValue: '', // 存储的默认值
			validateState: '', // 是否校验成功
			validateMessage: '' ,// 校验失败的提示语
			errorType: ['message'],
		};
	},
	created() {
		this.parent = this.$Lau.$parent.call(this, 'l-form');
	},
	watch: {
		validateState(val) {
			this.broadcastInputError();
		},
		"lForm.errorType"(val) {
			this.errorType = val;
			this.broadcastInputError();
		},
	},
	computed: {
		fieldValue() {
			return this.lForm.model[this.prop];
		},
		showError() {
			return type => {
				if(this.errorType.indexOf('none') >= 0) return false;
				else if(this.errorType.indexOf(type) >= 0) return true;
				else return false;
			}
		},
		// label的宽度
		elLabelWidth() {
			return this.labelWidth ? this.labelWidth : (this.parent ? this.parent.labelWidth : 90);
		},
		// label的样式
		elLabelStyle() {
			return Object.keys(this.labelStyle).length ? this.labelStyle : (this.parent ? this.parent.labelStyle : {});
		},
		// label的位置，左侧或者上方
		elLabelPosition() {
			return this.labelPosition ? this.labelPosition : (this.parent ? this.parent.labelPosition : 'left');
		}, 
		// label的对齐方式
		elLabelAlign() {
			return this.labelAlign ? this.labelAlign : (this.parent ? this.parent.labelAlign : 'left');
		},
		// label的下划线
		elBorderBottom() {
			return this.borderBottom !== '' ? this.borderBottom : this.parent ? this.parent.borderBottom : true;
		}
	},
	methods: {
		broadcastInputError() {
			this.broadcast('l-input', 'on-form-item-error', this.validateState === 'error' && this.showError('border'));
		},
		// 判断是否需要required校验
		setRules() {
			let that = this;
		

			// blur事件
			this.$on('on-form-blur', that.onFieldBlur);
			// change事件
			this.$on('on-form-change', that.onFieldChange);
		},

		getRules() {
			let rules = this.lForm.rules;
			rules = rules ? rules[this.prop] : [];
			return [].concat(rules || []);
		},

		// blur事件时进行表单校验
		onFieldBlur() {
			this.validation('blur');
		},

		// change事件进行表单校验
		onFieldChange() {
			this.validation('change');
		},

		// 过滤出符合要求的rule规则
		getFilteredRule(triggerType = '') {
			let rules = this.getRules();
			if(!triggerType) return rules;
			return rules.filter(res => res.trigger && res.trigger.indexOf(triggerType) !== -1);
		},

		// 校验数据
		validation(trigger, callback = () => {}) {
			let rules = this.getFilteredRule(trigger);
			if (!rules || rules.length === 0) {
				return callback('');
			}
			this.validateState = 'validating';
			let validator = new schema({ [this.prop]: rules });
			validator.validate({ [this.prop]: this.fieldValue }, { firstFields: true }, (errors, fields) => {
				// 记录状态和报错信息
				this.validateState = !errors ? 'success' : 'error';
				this.validateMessage = errors ? errors[0].message : '';
				// 调用回调方法
				callback(this.validateMessage);
			});
		},
		resetField() {
			this.lForm.model[this.prop] = this.initialValue;
			this.validateState = 'success';
		}
	},

	mounted() {
		if (!this.prop || this.lForm === null) return;
		this.dispatch('l-form', 'on-form-item-add', this);
		this.errorType = this.lForm.errorType;
		// 设置初始值
		this.initialValue = this.fieldValue;
		this.$nextTick(() =>{
			this.setRules();
		})
	},

	// 组件销毁前，将实例从 Form 的缓存中移除
	beforeDestroy() {
		this.dispatch('l-form', 'on-form-item-remove', this);
	},
};
</script>

<style lang="scss" scoped>
	@import '../../static/styles/css/style.components.scss';

	.l-form-item {
		display: flex;
		// align-items: flex-start;
		padding: 20rpx 0;
		font-size: 28rpx;
		color: $l-main-color;
		box-sizing: border-box;
		line-height: $l-form-item-height;
		flex-direction: column;

		&__border-bottom--error:after {
			border-color: $l-type-error;
		}

		&__body {
			display: flex;
		}

		&--left {
			display: flex;
			align-items: center;

			&__content {
				position: relative;
				display: flex;
				align-items: center;
				padding-right: 10rpx;
				flex: 1;

				&__icon {
					margin-right: 8rpx;
				}

				&--required {
					position: absolute;
					left: -16rpx;
					vertical-align: middle;
					color: $l-type-error;
					padding-top: 6rpx;
				}

				&__label {
					display: flex;
					align-items: center;
					flex: 1;
				}
			}
		}

		&--right {
			flex: 1;

			&__content {
				display: flex;
				align-items: center;
				flex: 1;

				&__slot {
					flex: 1;
					/* #ifndef MP */
					display: flex;
					align-items: center;
					/* #endif */
				}

				&__icon {
					margin-left: 10rpx;
					color: $l-light-color;
					font-size: 30rpx;
				}
			}
		}

		&__message {
			font-size: 24rpx;
			line-height: 24rpx;
			color: $l-type-error;
			margin-top: 12rpx;
		}
	}
</style>
