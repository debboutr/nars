<template>
  <h1 class="text-center">NLCD Categories</h1>
  <category-squares :comid="comid" :squareList="squareList" />
  <!--
  BELOW WILL BE A COMPONENT OF IT'S OWN -- comparableYears data to be put in store
  reportedCategories will bee -> reported and then -> reported.categories | reported.year
-->
	<svg class="chart" width="100%" height="50" v-for="(reported, index) in comparableYears" :key="index">
		<rect width="1px" x="25%" fill="white" height="32"></rect>
		<rect width="1px" x="50%" fill="white" height="32"></rect>
		<rect width="1px" x="75%" fill="white" height="32"></rect>
		<template v-for="rc in reported.categories" :key="rc.category" >
			<rect
				v-bind="makeRectAttrs(rc)"
				height="40"
				y="5"
				>
					<title>
						{{ categories[rc.category]['name'] }} ({{ rc.width }}%)
					</title>
			</rect>
		</template>
	</svg>
</template>

<script setup>
// import { ref } from "vue"
import { categories } from "@/utils/categories"
import CategorySquares from "@/components/CategorySquares"

// eslint-disable-next-line no-undef
defineProps({
  comid: String,
  comparableYears: Array,
  squareList: Object
})

function makeRectAttrs(c) {
    return {
        "width": `${c.width}%`,
        "x": `${c.start}%`,
        "fill": categories[c.category].color
    }
}
</script>

<style>
	@keyframes slide {
		from {width: 0%;}
		to {width: 100%;}
	}
	.chart {
		animation-name: slide;
		animation-duration: 3s;
	}
</style>
