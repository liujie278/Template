<template>
	<view class="l-mask" hover-stop-propagation :style="[maskStyle, zoomStyle]" @tap="click" @touchmove.stop.prevent :class="{
		'l-mask-zoom': zoom,
		'l-mask-show': show
	}">
		<slot />
	</view>
</template>

<script>
	
	export default {
		name: "l-mask",
		props: {
			// 是否显示遮罩
			show: {
				type: Boolean,
				default: false
			},
			// 层级z-index
			zIndex: {
				type: [Number, String],
				default: ''
			},
			// 用户自定义样式
			customStyle: {
				type: Object,
				default () {
					return {}
				}
			},
			zoom: {
				type: Boolean,
				default: true
			},
			// 遮罩的过渡时间，单位为ms
			duration: {
				type: [Number, String],
				default: 300
			},
			// 是否可以通过点击遮罩进行关闭
			maskClickAble: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				zoomStyle: {
					transform: ''
				},
				scale: 'scale(1.2, 1.2)'
			}
		},
		watch: {
			show(n) {
				if(n && this.zoom) {
					this.zoomStyle.transform = 'scale(1, 1)';
				} else if(!n && this.zoom) {
					this.zoomStyle.transform = this.scale;
				}
			}
		},
		computed: {
			maskStyle() {
				let style = {};
				style.backgroundColor = "rgba(0, 0, 0, 0.6)";
				if(this.show) style.zIndex = this.zIndex ? this.zIndex : this.$Lau.zIndex.mask;
				else style.zIndex = -1;
				style.transition = `all ${this.duration / 1000}s ease-in-out`;
				
				if (Object.keys(this.customStyle).length) style = { 
					...style,
					...this.customStyle
				};
				return style;
			}
		},
		methods: {
			click() {
				if (!this.maskClickAble) return;
				this.$emit('click');
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "../../static/styles/css/style.components.scss";
	
	.l-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		opacity: 0;
		transition: transform 0.3s;
	}

	.l-mask-show {
		opacity: 1;
	}
	
	.l-mask-zoom {
		transform: scale(1.2, 1.2);
	}
</style>
