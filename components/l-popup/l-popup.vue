<template>
	<view v-if="visibleSync" :style="[customStyle, {
		zIndex: uZindex - 1
	}]" :class="{ 'l-drawer-visible': showDrawer }" class="l-drawer" hover-stop-propagation>
		<l-mask :custom-style="maskCustomStyle" :maskClickAble="maskCloseAble" :z-index="uZindex - 2" :show="showDrawer && mask" @click="maskClick"></l-mask>
		<view
			class="l-drawer-content"
			@tap="modeCenterClose(mode)"
			:class="[
				safeAreaInsetBottom ? 'safe-area-inset-bottom' : '',
				'l-drawer-' + mode,
				showDrawer ? 'l-drawer-content-visible' : '',
				zoom && mode == 'center' ? 'l-animation-zoom' : ''
			]"
			@touchmove.stop.prevent
			@tap.stop.prevent
			:style="[style]"
		>
			<view class="l-mode-center-box" @tap.stop.prevent @touchmove.stop.prevent v-if="mode == 'center'" :style="[centerStyle]">
				<l-icon
					@click="close"
					v-if="closeable"
					class="l-close"
					:class="['l-close--' + closeIconPos]"
					:name="closeIcon"
					:color="closeIconColor"
					:size="closeIconSize"
				></l-icon>
				<scroll-view class="l-drawer__scroll-view" scroll-y="true">
					<slot />
				</scroll-view>
			</view>
			<scroll-view class="l-drawer__scroll-view" scroll-y="true" v-else>
				<slot />
			</scroll-view>
			<view @tap="close" class="l-close" :class="['l-close--' + closeIconPos]">
				<l-icon
					v-if="mode != 'center' && closeable"
					:name="closeIcon"
					:color="closeIconColor"
					:size="closeIconSize"
				></l-icon>
			</view>
		</view>
	</view>
</template>

<script>

export default {
	name: 'l-popup',
	props: {
		/**
		 * 显示状态
		 */
		show: {
			type: Boolean,
			default: false
		},
		/**
		 * 弹出方向，left|right|top|bottom|center
		 */
		mode: {
			type: String,
			default: 'left'
		},
		/**
		 * 是否显示遮罩
		 */
		mask: {
			type: Boolean,
			default: true
		},
		length: {
			type: [Number, String],
			default: 'auto'
		},
		// 是否开启缩放动画，只在mode=center时有效
		zoom: {
			type: Boolean,
			default: true
		},
		safeAreaInsetBottom: {
			type: Boolean,
			default: false
		},
		// 是否可以通过点击遮罩进行关闭
		maskCloseAble: {
			type: Boolean,
			default: true
		},
		// 用户自定义样式
		customStyle: {
			type: Object,
			default() {
				return {};
			}
		},
		value: {
			type: Boolean,
			default: false
		},
		
		popup: {
			type: Boolean,
			default: true
		},
		// 显示显示弹窗的圆角，单位rpx
		borderRadius: {
			type: [Number, String],
			default: 0
		},
		zIndex: {
			type: [Number, String],
			default: ''
		},
		// 是否显示关闭图标
		closeable: {
			type: Boolean,
			default: false
		},
		
		closeIcon: {
			type: String,
			default: 'close'
		},
		closeIconPos: {
			type: String,
			default: 'top-right'
		},
		// 关闭图标的颜色
		closeIconColor: {
			type: String,
			default: '#909399'
		},
		// 关闭图标的大小
		closeIconSize: {
			type: [String, Number],
			default: '30'
		},
		width: {
			type: String,
			default: ''
		},
		height: {
			type: String,
			default: ''
		},
		negativeTop: {
			type: [String, Number],
			default: 0
		},
		maskCustomStyle: {
			type: Object,
			default() {
				return {}
			}
		}
	},
	data() {
		return {
			visibleSync: false,
			showDrawer: false,
			timer: null,
			closeFromInner: false, 
		};
	},
	computed: {
		style() {
			let style = {};
			// 如果是左边或者上边弹出时，需要给translate设置为负值，用于隐藏
			if (this.mode == 'left' || this.mode == 'right') {
				style = {
					width: this.width ? this.getUnitValue(this.width) : this.getUnitValue(this.length),
					height: '100%',
					transform: `translate3D(${this.mode == 'left' ? '-100%' : '100%'},0px,0px)`
				};
			} else if (this.mode == 'top' || this.mode == 'bottom') {
				style = {
					width: '100%',
					height: this.height ? this.getUnitValue(this.height) : this.getUnitValue(this.length),
					transform: `translate3D(0px,${this.mode == 'top' ? '-100%' : '100%'},0px)`
				};
			}
			style.zIndex = this.uZindex;
			if (this.borderRadius) {
				switch (this.mode) {
					case 'left':
						style.borderRadius = `0 ${this.borderRadius}rpx ${this.borderRadius}rpx 0`;
						break;
					case 'top':
						style.borderRadius = `0 0 ${this.borderRadius}rpx ${this.borderRadius}rpx`;
						break;
					case 'right':
						style.borderRadius = `${this.borderRadius}rpx 0 0 ${this.borderRadius}rpx`;
						break;
					case 'bottom':
						style.borderRadius = `${this.borderRadius}rpx ${this.borderRadius}rpx 0 0`;
						break;
					default:
				}
				style.overflow = 'hidden';
			}
			return style;
		},
		// 中部弹窗的特有样式
		centerStyle() {
			let style = {};
			style.width = this.width ? this.getUnitValue(this.width) : this.getUnitValue(this.length);
			
			style.height = this.height ? this.getUnitValue(this.height) : 'auto';
			style.zIndex = this.uZindex;
			style.marginTop = `-${this.$Lau.addUnit(this.negativeTop)}`;
			if (this.borderRadius) {
				style.borderRadius = `${this.borderRadius}rpx`;
				
				style.overflow = 'hidden';
			}
			return style;
		},
		uZindex() {
			return this.zIndex ? this.zIndex : this.$Lau.zIndex.popup;
		}
	},
	watch: {
		value(val) {
			if (val) {
				this.open();
			} else if(!this.closeFromInner) {
				this.close();
			}
			this.closeFromInner = false;
		}
	},
	mounted() {
		this.value && this.open();
	},
    methods: {
		getUnitValue(val) {
			if(/(%|px|rpx|auto)$/.test(val)) return val;
			else return val + 'rpx'
		},
		maskClick() {
			this.close();
		},
		close() {
			this.closeFromInner = true;
			this.change('showDrawer', 'visibleSync', false);
		},
		modeCenterClose(mode) {
			if (mode != 'center' || !this.maskCloseAble) return;
			this.close();
		},
		open() {
			this.change('visibleSync', 'showDrawer', true);
		},
		change(param1, param2, status) {
			if (this.popup == true) {
				this.$emit('input', status);
			}
			this[param1] = status;
			if(status) {
				// #ifdef H5 || MP
				this.timer = setTimeout(() => {
					this[param2] = status;
					this.$emit(status ? 'open' : 'close');
				}, 50);
				// #endif
				// #ifndef H5 || MP
				this.$nextTick(() => {
					this[param2] = status;
					this.$emit(status ? 'open' : 'close');
				})
				// #endif
			} else {
				this.timer = setTimeout(() => {
					this[param2] = status;
					this.$emit(status ? 'open' : 'close');
				}, 300);
			}
		}
	}
};
</script>

<style scoped lang="scss">
@import "../../static/styles/css/style.components.scss";

.l-drawer {
	/* #ifndef APP-NVUE */
	display: block;
	/* #endif */
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	overflow: hidden;
}

.l-drawer-content {
	/* #ifndef APP-NVUE */
	display: block;
	/* #endif */
	position: absolute;
	z-index: 1003;
	transition: all 0.3s linear;
}

.l-drawer__scroll-view {
	width: 100%;
	height: 100%;
}

.l-drawer-left {
	top: 0;
	bottom: 0;
	left: 0;
	background-color: #ffffff;
}

.l-drawer-right {
	right: 0;
	top: 0;
	bottom: 0;
	background-color: #ffffff;
}

.l-drawer-top {
	top: 0;
	left: 0;
	right: 0;
	background-color: #ffffff;
}

.l-drawer-bottom {
	bottom: 0;
	left: 0;
	right: 0;
	background-color: #ffffff;
}

.l-drawer-center {
	/* #ifndef APP-NVUE */
	display: flex;
	flex-direction: column;
	/* #endif */
	bottom: 0;
	left: 0;
	right: 0;
	top: 0;
	justify-content: center;
	align-items: center;
	opacity: 0;
	z-index: 99999;
}

.l-mode-center-box {
	min-width: 100rpx;
	min-height: 100rpx;
	/* #ifndef APP-NVUE */
	display: block;
	/* #endif */
	position: relative;
	background-color: #ffffff;
}

.l-drawer-content-visible.l-drawer-center {
	transform: scale(1);
	opacity: 1;
}

.l-animation-zoom {
	transform: scale(1.15);
}

.l-drawer-content-visible {
	transform: translate3D(0px, 0px, 0px) !important;
}

.l-close {
	position: absolute;
	z-index: 3;
}

.l-close--top-left {
	top: 30rpx;
	left: 30rpx;
}

.l-close--top-right {
	top: 30rpx;
	right: 30rpx;
}

.l-close--bottom-left {
	bottom: 30rpx;
	left: 30rpx;
}

.l-close--bottom-right {
	right: 30rpx;
	bottom: 30rpx;
}
</style>
