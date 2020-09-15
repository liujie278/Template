<template>
	<view class="l-image" @tap="onClick" :style="[wrapStyle, backgroundStyle]">
		<image
			v-if="!isError"
			:src="src"
			:mode="mode"
			@error="onErrorHandler"
			@load="onLoadHandler"
			:lazy-load="lazyLoad"
			class="l-image__image"
			:style="{
				borderRadius: shape == 'circle' ? '50%' : $Lau.addUnit(borderRadius)
			}"
		></image>
		<view
			v-if="showLoading && loading"
			class="l-image__loading"
			:style="{
				borderRadius: shape == 'circle' ? '50%' : $Lau.addUnit(borderRadius),
				backgroundColor: this.bgColor
			}"
		>
			<slot v-if="$slots.loading" name="loading" />
			<l-icon v-else :name="loadingIcon" :width="width" :height="height"></l-icon>
		</view>
		<view
			v-if="showError && isError && !loading"
			class="l-image__error"
			:style="{
				borderRadius: shape == 'circle' ? '50%' : $Lau.addUnit(borderRadius)
			}"
		>
			<slot v-if="$slots.error" name="error" />
			<l-icon v-else :name="errorIcon" :width="width" :height="height"></l-icon>
		</view>
	</view>
</template>

<script>

export default {
	name: 'l-image',
	props: {
		// 图片地址
		src: {
			type: String,
			default: ''
		},
		// 裁剪模式
		mode: {
			type: String,
			default: 'aspectFill'
		},
		// 宽度，单位任意
		width: {
			type: [String, Number],
			default: '100%'
		},
		// 高度，单位任意
		height: {
			type: [String, Number],
			default: 'auto'
		},
		// 图片形状，circle-圆形，square-方形
		shape: {
			type: String,
			default: 'square'
		},
		// 圆角，单位任意
		borderRadius: {
			type: [String, Number],
			default: 0
		},
		lazyLoad: {
			type: Boolean,
			default: true
		},
		showMenuByLongpress: {
			type: Boolean,
			default: true
		},
		// 加载中的图标，或者小图片
		loadingIcon: {
			type: String,
			default: 'photo'
		},
		// 加载失败的图标，或者小图片
		errorIcon: {
			type: String,
			default: 'error-circle'
		},
		showLoading: {
			type: Boolean,
			default: true
		},
		showError: {
			type: Boolean,
			default: true
		},
		// 是否需要淡入效果
		fade: {
			type: Boolean,
			default: true
		},
		webp: {
			type: Boolean,
			default: false
		},
		// 过渡时间，单位ms
		duration: {
			type: [String, Number],
			default: 500
		},
		// 背景颜色，用于深色页面加载图片时，为了和背景色融合
		bgColor: {
			type: String,
			default: '#f3f4f6'
		}
	},
	data() {
		return {
			isError: false,
			loading: true,
			opacity: 1,
			durationTime: this.duration,
			backgroundStyle: {}
		};
	},
	watch: {
		src(n) {
			if(!n) {
				this.isError = true;
			} else {
				this.isError = false;
			}
		}
	},
	computed: {
		wrapStyle() {
			let style = {};
			style.width = this.$Lau.addUnit(this.width);
			style.height = this.$Lau.addUnit(this.height);
			style.borderRadius = this.shape == 'circle' ? '50%' : this.$Lau.addUnit(this.borderRadius);
			style.overflow = this.borderRadius > 0 ? 'hidden' : 'visible';
			if (this.fade) {
				style.opacity = this.opacity;
				style.transition = `opacity ${Number(this.durationTime) / 1000}s ease-in-out`;
			}
			return style;
		}
	},
	methods: {
		// 点击图片
		onClick() {
			this.$emit('click');
		},
		// 图片加载失败
		onErrorHandler() {
			this.loading = false;
			this.isError = true;
			this.$emit('error');
		},
		// 图片加载完成，标记loading结束
		onLoadHandler() {
			this.loading = false;
			this.isError = false;
			this.$emit('load');
			if (!this.fade) return this.removeBgColor();
			this.opacity = 0;
			this.durationTime = 0;
			setTimeout(() => {
				this.durationTime = this.duration;
				this.opacity = 1;
				setTimeout(() => {
					this.removeBgColor();
				}, this.durationTime);
			}, 50);
		},
		// 移除图片的背景色
		removeBgColor() {
			this.backgroundStyle = {
				backgroundColor: 'transparent'
			};
		}
	}
};
</script>

<style scoped lang="scss">
@import "../../static/styles/css/style.components.scss";

.l-image {
	position: relative;
	transition: opacity 0.5s ease-in-out;

	&__image {
		width: 100%;
		height: 100%;
	}

	&__loading,
	&__error {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: $l-bg-color;
		color: $l-tips-color;
		font-size: 46rpx;
	}
}
</style>
