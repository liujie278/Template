<template>
	<view
		class="l-input"
		:class="{
			'l-input--border': border,
			'l-input--error': validateState
		}"
		:style="{
			padding: `0 ${border ? 20 : 0}rpx`,
			borderColor: borderColor,
			textAlign: inputAlign
		}"
		@tap.stop="inputClick"
	>
		<textarea
			v-if="type == 'textarea'"
			class="l-input__input l-input__textarea"
			:style="[getStyle]"
			:value="value"
			:placeholder="placeholder"
			:placeholderStyle="placeholderStyle"
			:disabled="disabled"
			:maxlength="inputMaxlength"
			:fixed="fixed"
			:focus="focus"
			:autoHeight="autoHeight"
			:selection-end="uSelectionEnd"
			:selection-start="uSelectionStart"
			@input="handleInput"
			@blur="handleBlur"
			@focus="onFocus"
			@confirm="onConfirm"
		/>
		<input
			v-else
			class="l-input__input"
			:type="type == 'password' ? 'text' : type"
			:style="[getStyle]"
			:value="defaultValue"
			:password="type == 'password' && !showPassword"
			:placeholder="placeholder"
			:placeholderStyle="placeholderStyle"
			:disabled="disabled || type === 'select'"
			:maxlength="inputMaxlength"
			:focus="focus"
			:confirmType="confirmType"
			:cursor-spacing="getCursorSpacing"
			:selection-end="uSelectionEnd"
			:selection-start="uSelectionStart"
			@focus="onFocus"
			@blur="handleBlur"
			@input="handleInput"
			@confirm="onConfirm"
		/>
		<view class="l-input__right-icon l-flex">
			<view class="l-input__right-icon__clear l-input__right-icon__item" v-if="clearable && value != '' && focused">
				<l-icon size="32" name="close-circle-fill" color="#c0c4cc" @touchstart="onClear"/>
			</view>
			<view class="l-input__right-icon__clear l-input__right-icon__item" v-if="passwordIcon && type == 'password'">
				<l-icon size="32" :name="!showPassword ? 'eye' : 'eye-fill'" color="#c0c4cc" @click="showPassword = !showPassword"/>
			</view>
			<view class="l-input__right-icon--select l-input__right-icon__item" v-if="type == 'select'" :class="{
				'l-input__right-icon--select--reverse': selectOpen
			}">
				<l-icon name="arrow-down-fill" size="26" color="#c0c4cc"></l-icon>
			</view>
		</view>
	</view>
</template>

<script>
import Emitter from '../../common/util/libs/util/emitter.js'

export default {
	name: 'l-input',
	mixins: [Emitter],
	props: {
		value: {
			type: [String, Number],
			default: ''
		},
		// 输入框的类型，textarea，text，number
		type: {
			type: String,
			default: 'text'
		},
		inputAlign: {
			type: String,
			default: 'left'
		},
		placeholder: {
			type: String,
			default: '请输入内容'
		},
		disabled: {
			type: Boolean,
			default: false
		},
		maxlength: {
			type: [Number, String],
			default: 140
		},
		placeholderStyle: {
			type: String,
			default: 'color: #c0c4cc;'
		},
		confirmType: {
			type: String,
			default: 'done'
		},
		// 输入框的自定义样式
		customStyle: {
			type: Object,
			default() {
				return {};
			}
		},
		fixed: {
			type: Boolean,
			default: false
		},
		// 是否自动获得焦点
		focus: {
			type: Boolean,
			default: false
		},
		// 密码类型时，是否显示右侧的密码图标
		passwordIcon: {
			type: Boolean,
			default: true
		},
		// input|textarea是否显示边框
		border: {
			type: Boolean,
			default: false
		},
		// 输入框的边框颜色
		borderColor: {
			type: String,
			default: '#dcdfe6'
		},
		autoHeight: {
			type: Boolean,
			default: true
		},
		selectOpen: {
			type: Boolean,
			default: false
		},
		// 高度，单位rpx
		height: {
			type: [Number, String],
			default: ''
		},
		// 是否可清空
		clearable: {
			type: Boolean,
			default: true
		},
		cursorSpacing: {
			type: [Number, String],
			default: 0
		},
		selectionStart: {
			type: [Number, String],
			default: -1
		},
		selectionEnd: {
			type: [Number, String],
			default: -1
		}
	},
	data() {
		return {
			defaultValue: this.value,
			inputHeight: 70, 
			textareaHeight: 100, 
			validateState: false, 
			focused: false, 
			showPassword: false,
		};
	},
	watch: {
		value(nVal, oVal) {
			this.defaultValue = nVal;
			if(nVal != oVal && this.type == 'select') this.handleInput({
				detail: {
					value: nVal
				}
			})
		},
	},
	computed: {
		inputMaxlength() {
			return Number(this.maxlength);
		},
		getStyle() {
			let style = {};
			style.minHeight = this.height ? this.height + 'rpx' : this.type == 'textarea' ?
				this.textareaHeight + 'rpx' : this.inputHeight + 'rpx';
			style = Object.assign(style, this.customStyle);
			return style;
		},
		
		getCursorSpacing() {
			return Number(this.cursorSpacing);
		},
		// 光标起始位置
		uSelectionStart() {
			return String(this.selectionStart);
		},
		// 光标结束位置
		uSelectionEnd() {
			return String(this.selectionEnd);
		}
	},
	created() {
		this.$on('on-form-item-error', this.onFormItemError);
	},
	methods: {
		/**
		 * change 事件
		 * @param event
		 */
		handleInput(event) {
			this.defaultValue = event.detail.value;
			this.$emit('input', event.detail.value);
			this.$nextTick(() => {
				this.dispatch('l-form-item', 'on-form-change', event.detail.value);
			});
		},
		/**
		 * blur 事件
		 * @param event
		 */
		handleBlur(event) {
			this.focused = false;
			this.$emit('blur', event.detail.value);
			this.$nextTick(() => {
				this.dispatch('l-form-item', 'on-form-blur', event.detail.value);
			});
		},
		onFormItemError(status) {
			this.validateState = status;
		},
		onFocus(event) {
			this.focused = true;
			this.$emit('focus');
		},
		onConfirm(e) {
			this.$emit('confirm', e.detail.value);
		},
		onClear(event) {
			this.$emit('input', '');
		},
		inputClick() {
			this.$emit('click');
		}
	}
};
</script>

<style lang="scss" scoped>
.l-input {
	position: relative;
	flex: 1;
	display: flex;

	&__input {
		font-size: 28rpx;
		color: $l-main-color;
		flex: 1;
	}

	&__textarea {
		width: auto;
		font-size: 28rpx;
		color: $l-main-color;
		padding: 10rpx 0;
		line-height: normal;
		flex: 1;
	}

	&--border {
		border-radius: 6rpx;
		border-radius: 4px;
		border: 1px solid $l-form-item-border-color;
	}

	&--error {
		border-color: $l-type-error!important;
	}

	&__right-icon {

		&__item {
			margin-left: 10rpx;
		}

		&--select {
			transition: transform .4s;

			&--reverse {
				transform: rotate(-180deg);
			}
		}
	}
}
</style>
