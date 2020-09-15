<template>
	<button
		id="l-wave-btn"
		class="l-btn l-line-1 l-fix-ios-appearance"
		:class="[
			'l-size-' + size,
			plain ? 'l-btn--' + type + '--plain' : '',
			loading ? 'l-loading' : '',
			shape == 'circle' ? 'l-round-circle' : '',
			hairLine ? showHairLineBorder : 'l-btn--bold-border',
			'l-btn--' + type,
			disabled ? `l-btn--${type}--disabled` : '',
		]"
		:disabled="disabled"
		:form-type="formType"
		:open-type="openType"
		:app-parameter="appParameter"
		:hover-stop-propagation="hoverStopPropagation"
		:send-message-title="sendMessageTitle"
		send-message-path="sendMessagePath"
		:lang="lang"
		:data-name="dataName"
		:session-from="sessionFrom"
		:send-message-img="sendMessageImg"
		:show-message-card="showMessageCard"
		@getphonenumber="getphonenumber"
		@getuserinfo="getuserinfo"
		@error="error"
		@opensetting="opensetting"
		@launchapp="launchapp"
		:style="[customStyle, {
			overflow: ripple ? 'hidden' : 'visible'
		}]"
		@tap.stop="click($event)"
		:hover-class="getHoverClass"
		:loading="loading"
	> 
		<slot></slot>
		<view
			v-if="ripple"
			class="l-wave-ripple"
			:class="[waveActive ? 'l-wave-active' : '']"
			:style="{
				top: rippleTop + 'px',
				left: rippleLeft + 'px',
				width: fields.targetWidth + 'px',
				height: fields.targetWidth + 'px',
				'background-color': rippleBgColor || 'rgba(0, 0, 0, 0.15)'
			}"
		></view>
	</button>
</template>

<script>

export default {
	name: 'l-button',
	props: {
		// 是否细边框
		hairLine: {
			type: Boolean,
			default: true
		},
		// 按钮的预置样式，default，primary，error，warning，success
		type: {
			type: String,
			default: 'default'
		},
		// 按钮尺寸，default，medium，mini
		size: {
			type: String,
			default: 'default'
		},
		// 按钮形状，circle（两边为半圆），square（带圆角）
		shape: {
			type: String,
			default: 'square'
		},
		// 按钮是否镂空
		plain: {
			type: Boolean,
			default: false
		},
		// 是否禁止状态
		disabled: {
			type: Boolean,
			default: false
		},
		// 是否加载中
		loading: {
			type: Boolean,
			default: false
		},
		
		openType: {
			type: String,
			default: ''
		},
		
		formType: {
			type: String,
			default: ''
		},
		
		appParameter: {
			type: String,
			default: ''
		},
		hoverStopPropagation: {
			type: Boolean,
			default: false
		},
		lang: {
			type: String,
			default: 'en'
		},
		sessionFrom: {
			type: String,
			default: ''
		},
		sendMessageTitle: {
			type: String,
			default: ''
		},
		sendMessagePath: {
			type: String,
			default: ''
		},
		sendMessageImg: {
			type: String,
			default: ''
		},
		showMessageCard: {
			type: Boolean,
			default: false
		},
		// 手指按（触摸）按钮时按钮时的背景颜色
		hoverBgColor: {
			type: String,
			default: ''
		},
		// 水波纹的背景颜色
		rippleBgColor: {
			type: String,
			default: ''
		},
		// 是否开启水波纹效果
		ripple: {
			type: Boolean,
			default: false
		},
		// 按下的类名
		hoverClass: {
			type: String,
			default: ''
		},
		// 自定义样式，对象形式
		customStyle: {
			type: Object,
			default() {
				return {};
			}
		},
		dataName: {
			type: String,
			default: ''
		},
		// 节流，一定时间内只能触发一次
		throttleTime: {
			type: [String, Number],
			default: 1000
		}
	},
	computed: {
		// 当没有传bgColor变量时，按钮按下去的颜色类名
		getHoverClass() {
			// 如果开启水波纹效果，则不启用hover-class效果
			if (this.loading || this.disabled || this.ripple || this.hoverClass) return '';
			let hoverClass = '';
			hoverClass = this.plain ? 'l-' + this.type + '-plain-hover' : 'l-' + this.type + '-hover';
			return hoverClass;
		},
		showHairLineBorder() {
			if (['primary', 'success', 'error', 'warning'].indexOf(this.type) >= 0 && !this.plain) {
				return '';
			} else {
				return 'l-hairline-border';
			}
		}
	},
	data() {
		return {
			rippleTop: 0, 
			rippleLeft: 0, 
			fields: {}, 
			waveActive: false 
		};
	},
	methods: {
		// 按钮点击
		click(e) {
			// 进行节流控制，每this.throttle毫秒内，只在开始处执行
			this.$Lau.throttle(() => {
				if (this.loading === true || this.disabled === true) return;
				// 是否开启水波纹效果
				if (this.ripple) {
					this.waveActive = false;
					this.$nextTick(function() {
						this.getWaveQuery(e);
					});
				}
				this.$emit('click', e);
			}, this.throttleTime);
		},
		// 查询按钮的节点信息
		getWaveQuery(e) {
			this.getElQuery().then(res => {
				
				let data = res[0];
			
				if (!data.width || !data.width) return;
				
				data.targetWidth = data.height > data.width ? data.height : data.width;
				if (!data.targetWidth) return;
				this.fields = data;
				let touchesX = '',
					touchesY = '';
				// #ifdef MP-BAIDU
				touchesX = e.changedTouches[0].clientX;
				touchesY = e.changedTouches[0].clientY;
				// #endif
				// #ifdef MP-ALIPAY
				touchesX = e.detail.clientX;
				touchesY = e.detail.clientY;
				// #endif
				// #ifndef MP-BAIDU || MP-ALIPAY
				touchesX = e.touches[0].clientX;
				touchesY = e.touches[0].clientY;
				// #endif
				this.rippleTop = touchesY - data.top - data.targetWidth / 2;
				this.rippleLeft = touchesX - data.left - data.targetWidth / 2;
				this.$nextTick(() => {
					this.waveActive = true;
				});
			});
		},
		// 获取节点信息
		getElQuery() {
			return new Promise(resolve => {
				let queryInfo = '';
				queryInfo = uni.createSelectorQuery().in(this);
				//#ifdef MP-ALIPAY
				queryInfo = uni.createSelectorQuery();
				//#endif
				queryInfo.select('.l-btn').boundingClientRect();
				queryInfo.exec(data => {
					resolve(data);
				});
			});
		},
		
		getphonenumber(res) {
			this.$emit('getphonenumber', res);
		},
		getuserinfo(res) {
			this.$emit('getuserinfo', res);
		},
		error(res) {
			this.$emit('error', res);
		},
		opensetting(res) {
			this.$emit('opensetting', res);
		},
		launchapp(res) {
			this.$emit('launchapp', res);
		}
	}
};
</script>

<style scoped lang="scss">
@import '../../static/styles/css/style.components.scss';
.l-btn::after {
	border: none;
}

.l-btn {
	position: relative;
	border: 0;
	display: inline-block;
	overflow: visible;
	line-height: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	padding: 0 40rpx;
	z-index: 1;
	box-sizing: border-box;
	transition: all 0.15s;
	
	&--bold-border {
		border: 1px solid #ffffff;
	}
	
	&--default {
		color: $l-content-color;
		border-color: #c0c4cc;
		background-color: #ffffff;
	}
	
	&--primary {
		color: #ffffff;
		border-color: $l-type-primary;
		background-color: $l-type-primary;
	}
	
	&--success {
		color: #ffffff;
		border-color: $l-type-success;
		background-color: $l-type-success;
	}
	
	&--error {
		color: #ffffff;
		border-color: $l-type-error;
		background-color: $l-type-error;
	}
	
	&--warning {
		color: #ffffff;
		border-color: $l-type-warning;
		background-color: $l-type-warning;
	}
	
	&--default--disabled {
		color: #ffffff;
		border-color: #e4e7ed;
		background-color: #ffffff;
	}
	
	&--primary--disabled {
		color: #ffffff!important;
		border-color: $l-type-primary-disabled!important;
		background-color: $l-type-primary-disabled!important;
	}
	
	&--success--disabled {
		color: #ffffff!important;
		border-color: $l-type-success-disabled!important;
		background-color: $l-type-success-disabled!important;
	}
	
	&--error--disabled {
		color: #ffffff!important;
		border-color: $l-type-error-disabled!important;
		background-color: $l-type-error-disabled!important;
	}
	
	&--warning--disabled {
		color: #ffffff!important;
		border-color: $l-type-warning-disabled!important;
		background-color: $l-type-warning-disabled!important;
	}
	
	&--primary--plain {
		color: $l-type-primary!important;
		border-color: $l-type-primary-disabled!important;
		background-color: $l-type-primary-light!important;
	}
	
	&--success--plain {
		color: $l-type-success!important;
		border-color: $l-type-success-disabled!important;
		background-color: $l-type-success-light!important;
	}
	
	&--error--plain {
		color: $l-type-error!important;
		border-color: $l-type-error-disabled!important;
		background-color: $l-type-error-light!important;
	}
	
	&--warning--plain {
		color: $l-type-warning!important;
		border-color: $l-type-warning-disabled!important;
		background-color: $l-type-warning-light!important;
	}
}

.l-hairline-border:after {
	content: ' ';
	position: absolute;
	pointer-events: none;
	box-sizing: border-box;
	-webkit-transform-origin: 0 0;
	transform-origin: 0 0;
	left: 0;
	top: 0;
	width: 199.8%;
	height: 199.7%;
	-webkit-transform: scale(0.5, 0.5);
	transform: scale(0.5, 0.5);
	border: 1px solid currentColor;
	z-index: 1;
}

.l-wave-ripple {
	z-index: 0;
	position: absolute;
	border-radius: 100%;
	background-clip: padding-box;
	pointer-events: none;
	user-select: none;
	transform: scale(0);
	opacity: 1;
	transform-origin: center;
}

.l-wave-ripple.l-wave-active {
	opacity: 0;
	transform: scale(2);
	transition: opacity 1s linear, transform 0.4s linear;
}

.l-round-circle {
	border-radius: 100rpx;
}

.l-round-circle::after {
	border-radius: 100rpx;
}

.l-loading::after {
	background-color: hsla(0, 0%, 100%, 0.35);
}

.l-size-default {
	font-size: 30rpx;
	height: 80rpx;
	line-height: 80rpx;
}

.l-size-medium {
	display: inline-flex;
	width: auto;
	font-size: 26rpx;
	height: 70rpx;
	line-height: 70rpx;
	padding: 0 80rpx;
}

.l-size-mini {
	display: inline-flex;
	width: auto;
	font-size: 22rpx;
	padding-top: 1px;
	height: 50rpx;
	line-height: 50rpx;
	padding: 0 20rpx;
}

.l-primary-plain-hover {
	color: #ffffff !important;
	background: $l-type-primary-dark !important;
}

.l-default-plain-hover {
	color: $l-type-primary-dark !important;
	background: $l-type-primary-light !important;
}

.l-success-plain-hover {
	color: #ffffff !important;
	background: $l-type-success-dark !important;
}

.l-warning-plain-hover {
	color: #ffffff !important;
	background: $l-type-warning-dark !important;
}

.l-error-plain-hover {
	color: #ffffff !important;
	background: $l-type-error-dark !important;
}

.l-info-plain-hover {
	color: #ffffff !important;
	background: $l-type-info-dark !important;
}

.l-default-hover {
	color: $l-type-primary-dark !important;
	border-color: $l-type-primary-dark !important;
	background-color: $l-type-primary-light !important;
}

.l-primary-hover {
	background: $l-type-primary-dark !important;
	color: #fff;
}

.l-success-hover {
	background: $l-type-success-dark !important;
	color: #fff;
}

.l-info-hover {
	background: $l-type-info-dark !important;
	color: #fff;
}

.l-warning-hover {
	background: $l-type-warning-dark !important;
	color: #fff;
}

.l-error-hover {
	background: $l-type-error-dark !important;
	color: #fff;
}
</style>
