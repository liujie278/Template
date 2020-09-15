<template>
	<view class="l-swiper-wrap" :style="{
		borderRadius: `${borderRadius}rpx`
	}">
		<swiper :current="elCurrent" @change="change" @animationfinish="animationfinish" :interval="interval" :circular="circular" :duration="duration" :autoplay="autoplay"
		 :previous-margin="effect3d ? effect3dPreviousMargin + 'rpx' : '0'" :next-margin="effect3d ? effect3dPreviousMargin + 'rpx' : '0'"
		 :style="{
				height: height + 'rpx'
			}">
			<swiper-item class="l-swiper-item" v-for="(item, index) in list" :key="index">
				<view class="l-list-image-wrap" @tap.stop.prevent="listClick(index)" :class="[uCurrent != index ? 'l-list-scale' : '']" :style="{
						borderRadius: `${borderRadius}rpx`,
						transform: effect3d && uCurrent != index ? 'scaleY(0.9)' : 'scaleY(1)',
						margin: effect3d && uCurrent != index ? '0 20rpx' : 0,
						backgroundColor: bgColor
					}">
					<image class="l-swiper-image" :src="item[name]" :mode="imgMode"></image>
					<view v-if="title" class="l-swiper-title l-line-1" :style="[{
							'padding-bottom': titlePaddingBottom
						}, titleStyle]">
						{{ item.title }}
					</view>
				</view>
			</swiper-item>
		</swiper>
		<view class="l-swiper-indicator" :style="{
				top: indicatorPos == 'topLeft' || indicatorPos == 'topCenter' || indicatorPos == 'topRight' ? '12rpx' : 'auto',
				bottom: indicatorPos == 'bottomLeft' || indicatorPos == 'bottomCenter' || indicatorPos == 'bottomRight' ? '12rpx' : 'auto',
				justifyContent: justifyContent,
				padding: `0 ${effect3d ? '74rpx' : '24rpx'}`
			}">
			<block v-if="mode == 'rect'">
				<view class="l-indicator-item-rect" :class="{ 'l-indicator-item-rect-active': index == uCurrent }" v-for="(item, index) in list"
				 :key="index"></view>
			</block>
			<block v-if="mode == 'dot'">
				<view class="l-indicator-item-dot" :class="{ 'l-indicator-item-dot-active': index == uCurrent }" v-for="(item, index) in list"
				 :key="index"></view>
			</block>
			<block v-if="mode == 'round'">
				<view class="l-indicator-item-round" :class="{ 'l-indicator-item-round-active': index == uCurrent }" v-for="(item, index) in list"
				 :key="index"></view>
			</block>
			<block v-if="mode == 'number'">
				<view class="l-indicator-item-number">{{ uCurrent + 1 }}/{{ list.length }}</view>
			</block>
		</view>
	</view>
</template>

<script>
	
	export default {
		name: "l-swiper",
		props: {
			list: {
				type: Array,
				default () {
					return [];
				}
			},
			// 是否显示title标题
			title: {
				type: Boolean,
				default: false
			},
			// 用户自定义的指示器的样式
			indicator: {
				type: Object,
				default () {
					return {};
				}
			},
			// 圆角值
			borderRadius: {
				type: [Number, String],
				default: 8
			},
			// 隔多久自动切换
			interval: {
				type: [String, Number],
				default: 3000
			},
			mode: {
				type: String,
				default: 'round'
			},
			// list的高度，单位rpx
			height: {
				type: [Number, String],
				default: 250
			},
			indicatorPos: {
				type: String,
				default: 'bottomCenter'
			},
			// 是否开启缩放效果
			effect3d: {
				type: Boolean,
				default: false
			},
			effect3dPreviousMargin: {
				type: [Number, String],
				default: 50
			},
			// 是否自动播放
			autoplay: {
				type: Boolean,
				default: true
			},
			duration: {
				type: [Number, String],
				default: 500
			},
			circular: {
				type: Boolean,
				default: true
			},
			// 图片的裁剪模式 
			imgMode: {
				type: String,
				default: 'aspectFill'
			},
			name: {
				type: String,
				default: 'image'
			},
			// 背景颜色
			bgColor: {
				type: String,
				default: '#f3f4f6'
			},
			// 初始化时，默认显示第几项
			current: {
				type: [Number, String],
				default: 0
			},
			// 标题的样式，对象形式
			titleStyle: {
				type: Object,
				default() {
					return {}
				}
			}
		},
		watch: {
			list(nVal, oVal) {
				if(nVal.length !== oVal.length) this.uCurrent = 0;
			},
			current(n) {
				this.uCurrent = n;
			}
		},
		data() {
			return {
				uCurrent: this.current 
			};
		},
		computed: {
			justifyContent() {
				if (this.indicatorPos == 'topLeft' || this.indicatorPos == 'bottomLeft') return 'flex-start';
				if (this.indicatorPos == 'topCenter' || this.indicatorPos == 'bottomCenter') return 'center';
				if (this.indicatorPos == 'topRight' || this.indicatorPos == 'bottomRight') return 'flex-end';
			},
			titlePaddingBottom() {
				let tmp = 0;
				if (this.mode == 'none') return '12rpx';
				if (['bottomLeft', 'bottomCenter', 'bottomRight'].indexOf(this.indicatorPos) >= 0 && this.mode == 'number') {
					tmp = '60rpx';
				} else if (['bottomLeft', 'bottomCenter', 'bottomRight'].indexOf(this.indicatorPos) >= 0 && this.mode != 'number') {
					tmp = '40rpx';
				} else {
					tmp = '12rpx';
				}
				return tmp;
			},
			elCurrent() {
				return Number(this.current);
			}
		},
		methods: {
			listClick(index) {
				this.$emit('click', index);
			},
			change(e) {
				let current = e.detail.current;
				this.uCurrent = current;
				this.$emit('change', current);
			},
			animationfinish(e) {
				// #ifndef MP-TOUTIAO
				// #endif
			}
		}
	};
</script>

<style lang="scss" scoped>
	@import "../../static/styles/css/style.components.scss";
	
	.l-swiper-wrap {
		position: relative;
		overflow: hidden;
		transform: translateY(0);
	}

	.l-swiper-image {
		width: 100%;
		will-change: transform;
		height: 100%;
		display: block;
		/* #ifdef H5 */
		pointer-events: none;
		/* #endif */
	}

	.l-swiper-indicator {
		padding: 0 24rpx;
		position: absolute;
		display: flex;
		width: 100%;
		z-index: 1;
	}

	.l-indicator-item-rect {
		width: 26rpx;
		height: 8rpx;
		margin: 0 6rpx;
		transition: all 0.5s;
		background-color: rgba(0, 0, 0, 0.3);
	}

	.l-indicator-item-rect-active {
		background-color: rgba(255, 255, 255, 0.8);
	}

	.l-indicator-item-dot {
		width: 14rpx;
		height: 14rpx;
		margin: 0 6rpx;
		border-radius: 20rpx;
		transition: all 0.5s;
		background-color: rgba(0, 0, 0, 0.3);
	}

	.l-indicator-item-dot-active {
		background-color: rgba(255, 255, 255, 0.8);
	}

	.l-indicator-item-round {
		width: 14rpx;
		height: 14rpx;
		margin: 0 6rpx;
		border-radius: 20rpx;
		transition: all 0.5s;
		background-color: rgba(0, 0, 0, 0.3);
	}

	.l-indicator-item-round-active {
		width: 34rpx;
		background-color: rgba(255, 255, 255, 0.8);
	}

	.l-indicator-item-number {
		padding: 6rpx 16rpx;
		line-height: 1;
		background-color: rgba(0, 0, 0, 0.3);
		border-radius: 100rpx;
		font-size: 26rpx;
		color: rgba(255, 255, 255, 0.8);
	}

	.l-list-scale {
		transform-origin: center center;
	}

	.l-list-image-wrap {
		width: 100%;
		height: 100%;
		flex: 1;
		transition: all 0.5s;
		overflow: hidden;
		box-sizing: content-box;
		position: relative;
	}

	.l-swiper-title {
		position: absolute;
		background-color: rgba(0, 0, 0, 0.3);
		bottom: 0;
		left: 0;
		width: 100%;
		font-size: 28rpx;
		padding: 12rpx 24rpx;
		color: rgba(255, 255, 255, 0.9);
	}

	.l-swiper-item {
		display: flex;
		overflow: hidden;
		align-items: center;
	}
</style>
