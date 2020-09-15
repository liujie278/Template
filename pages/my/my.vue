<template>
	<view class=" l-flex l-col-center l-row-center">
		<l-button @tap="ceshi" >测试</l-button>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			ceshi(){
				let obj = {
				    value1: [1,2,3],
				    age: 14,
				    gender: '男'
				}
				
				let item = {...obj}
				item.age = 20;
				
				
				
				console.log(obj)
				console.log(item)
			}
		},
		onLoad() {
			
		}
	}
</script>

<style scoped lang="scss">
	
	
</style>
