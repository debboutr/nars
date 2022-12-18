<template>
  <h1 class="text-center">NLCD Categories</h1>
  <category-squares :comid="comid" :squareList="squareList" :catNames="categories" />
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
import CategorySquares from "@/components/CategorySquares"

const categories = {
  "PctOwWs": {color: "#5475A8", name: "Open water"},
  "PctIceWs": {color: "#ffffff", name: "Perennial Ice/Snow"},
  "PctUrbOpWs": {color: "#E8D1D1", name: "Developed, Open space"},
  "PctUrbLoWs": {color: "#E29E8C", name: "Developed, Low intensity"},
  "PctUrbMdWs": {color: "#ff0000", name: "Developed, Medium intensity"},
  "PctUrbHiWs": {color: "#B50000", name: "Developed, High intensity"},
  "PctBlWs": {color: "#D2CDC0", name: "Barren Land"},
  "PctDecidWs": {color: "#85C77E", name: "Deciduous Forest"},
  "PctConifWs": {color: "#38814E", name: "Evergreen Forest"},
  "PctMxFstWs": {color: "#D4E7B0", name: "Mixed Forest"},
  "PctShrbWs": {color: "#DCCA8F", name: "Shrub/Scrub"},
  "PctGrsWs": {color: "#FDE9AA", name: "Grassland/Herbaceous"},
  "PctHayWs": {color: "#FBF65D", name: "Pasture/Hay"},
  "PctCropWs": {color: "#CA9146", name: "Cultivated Crops"},
  "PctWdWetWs": {color: "#C8E6F8", name: "Woody Wetlands"},
  "PctHbWetWs": {color: "#64B3D5", name: "Emergent Herbaceous Wetlands"}
}

// eslint-disable-next-line no-undef
defineProps({
  comid: String,
  comparableYears: Array,
  squareList: Object
})

function makeRectAttrs(c) {
    //console.log(categories)
    //console.log(c.category)
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
