<template>
	<view :style="[customStyle]" class="l-icon" @tap="click" :class="['l-icon--' + labelPos]">
		<image class="l-icon__img" v-if="isImg" :src="name" :mode="imgMode" :style="[imgStyle]"></image>
		<text v-else class="l-icon__icon" :class="customClass" :style="[iconStyle]" :hover-class="hoverClass" @touchstart="touchstart"></text>
		<!-- 这里进行空字符串判断，如果仅仅是v-if="label"，可能会出现传递0的时候，结果也无法显示 -->
		<text v-if="label !== ''" class="l-icon__label" :style="{
			color: labelColor,
			fontSize: $Lau.addUnit(labelSize),
			marginLeft: labelPos == 'right' ? $Lau.addUnit(marginLeft) : 0,
			marginTop: labelPos == 'bottom' ? $Lau.addUnit(marginTop) : 0,
			marginRight: labelPos == 'left' ? $Lau.addUnit(marginRight) : 0,
			marginBottom: labelPos == 'top' ? $Lau.addUnit(marginBottom) : 0,
		}">{{label}}</text>
	</view>
</template>

<script>
	
export default {
	name: 'l-icon',
	props: {
		// 图标类名
		name: {
			type: String,
			default: ''
		},
		// 图标颜色，可接受主题色
		color: {
			type: String,
			default: ''
		},
		// 字体大小，单位rpx
		size: {
			type: [Number, String],
			default: 'inherit'
		},
		// 是否显示粗体
		bold: {
			type: Boolean,
			default: false
		},
		// 点击图标的时候传递事件出去的index（用于区分点击了哪一个）
		index: {
			type: [Number, String],
			default: ''
		},
		// 触摸图标时的类名
		hoverClass: {
			type: String,
			default: ''
		},
		// 自定义扩展前缀，方便用户扩展自己的图标库
		customPrefix: {
			type: String,
			default: 'licon'
		},
		// 图标右边或者下面的文字
		label: {
			type: [String, Number],
			default: ''
		},
		// label的位置，只能右边或者下边
		labelPos: {
			type: String,
			default: 'right'
		},
		// label的大小
		labelSize: {
			type: [String, Number],
			default: '28'
		},
		// label的颜色
		labelColor: {
			type: String,
			default: '#606266'
		},
		// label与图标的距离(横向排列)
		marginLeft: {
			type: [String, Number],
			default: '6'
		},
		// label与图标的距离(竖向排列)
		marginTop: {
			type: [String, Number],
			default: '6'
		},
		// label与图标的距离(竖向排列)
		marginRight: {
			type: [String, Number],
			default: '6'
		},
		// label与图标的距离(竖向排列)
		marginBottom: {
			type: [String, Number],
			default: '6'
		},
		// 图片的mode
		imgMode: {
			type: String,
			default: 'widthFix'
		},
		// 自定义样式
		customStyle: {
			type: Object,
			default() {
				return {}
			}
		},
		// 用于显示图片小图标时，图片的宽度
		width: {
			type: [String, Number],
			default: ''
		},
		// 用于显示图片小图标时，图片的高度
		height: {
			type: [String, Number],
			default: ''
		},
		// 用于解决某些情况下，让图标垂直居中的用途
		top: {
			type: [String, Number],
			default: 0
		}
	},
	computed: {
		customClass() {
			let classes = [];
			classes.push(this.customPrefix + '-' + this.name);
			
			if (this.customPrefix == 'licon') classes.push('l-iconfont');
			else classes.push(this.customPrefix);
			// 主题色，通过类配置
			if (this.color && this.$Lau.config.type.includes(this.color)) classes.push('l-icon__icon--' + this.color);
			// 阿里，头条，百度小程序通过数组绑定类名时，无法直接使用[a, b, c]的形式，否则无法识别
			// 故需将其拆成一个字符串的形式，通过空格隔开各个类名
			//#ifdef MP-ALIPAY || MP-TOUTIAO || MP-BAIDU
			classes = classes.join(' ');
			//#endif
			return classes;
		},
		iconStyle() {
			let style = {};
			style = {
				fontSize: this.size == 'inherit' ? 'inherit' : this.$Lau.addUnit(this.size),
				fontWeight: this.bold ? 'bold' : 'normal',
				// 某些特殊情况需要设置一个到顶部的距离，才能更好的垂直居中
				top: this.$Lau.addUnit(this.top)
			};
			// 非主题色值时，才当作颜色值
			if (this.color && !this.$Lau.config.type.includes(this.color)) style.color = this.color;
			return style;
		},
		// 判断传入的name属性，是否图片路径，只要带有"/"均认为是图片形式
		isImg() {
			return this.name.indexOf('/') !== -1;
		},
		imgStyle() {
			let style = {};
			// 如果设置width和height属性，则优先使用，否则使用size属性
			style.width = this.width ? this.$Lau.addUnit(this.width) : this.$Lau.addUnit(this.size);
			style.height = this.height ? this.$Lau.addUnit(this.height) : this.$Lau.addUnit(this.size);
			return style;
		}
	},
	methods: {
		click() {
			this.$emit('click', this.index);
		},
		touchstart() {
			this.$emit('touchstart', this.index);
		}
	}
};
</script>

<style scoped lang="scss">
@import "../../static/styles/css/style.components.scss";
@import '../../static/styles/iconfont.css';

.l-icon {
	display: inline-flex;
	align-items: center;

	&--left {
		flex-direction: row-reverse;
		align-items: center;
	}

	&--right {
		flex-direction: row;
		align-items: center;
	}

	&--top {
		flex-direction: column-reverse;
		justify-content: center;
	}

	&--bottom {
		flex-direction: column;
		justify-content: center;
	}

	&__icon {
		position: relative;
		
		&--primary {
			color: $l-type-primary;
		}

		&--success {
			color: $l-type-success;
		}

		&--error {
			color: $l-type-error;
		}

		&--warning {
			color: $l-type-warning;
		}

		&--info {
			color: $l-type-info;
		}
	}

	&__img {
		height: auto;
		will-change: transform;
	}

	&__label {
		line-height: 1;
	}
}
</style>
