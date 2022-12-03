<template>
	<svg class="chart" width="100%" height="40">
		<rect width="1px" x="25%" fill="white" height="32"></rect>
		<rect width="1px" x="50%" fill="white" height="32"></rect>
		<rect width="1px" x="75%" fill="white" height="32"></rect>
		<template v-for="cc in formatData" :key="cc.category" >
			<rect 
				v-bind="getAttrs(cc)"
				height="22"
				y="5"
				>
					<title>
						{{ cc.category }} ({{ cc.width }}%)
					</title>
			</rect>
		</template>
	</svg>
</template>

<script>

export default {
  props: ["comid", "nlcdInfo"],
	data: function () {
		return {
			categories: {
			"PctOwWs": "#5475A8", // Open water
			"PctIceWs": "#ffffff", // Perennial Ice/Snow,
			"PctUrbOpWs": "#E8D1D1", // Developed, Open space
			"PctUrbLoWs": "#E29E8C", // Developed, Low intensity
			"PctUrbMdWs": "#ff0000", // Developed, Medium intensity
			"PctUrbHiWs": "#B50000", // Developed, High intensity
			"PctBlWs": "#D2CDC0", // Barren Land
			"PctDecidWs": "#85C77E", // Deciduous Forest
			"PctConifWs": "#38814E", // Evergreen Forest
			"PctMxFstWs": "#D4E7B0", // Mixed Forest
			"PctShrbWs": "#DCCA8F", // Shrub/Scrub
			"PctGrsWs": "#FDE9AA", // Grassland/Herbaceous
			"PctHayWs": "#FBF65D", // Pasture/Hay
			"PctCropWs": "#CA9146", // Cultivated Crops
			"PctWdWetWs": "#C8E6F8", // Woody Wetlands
			"PctHbWetWs": "#64B3D5" // Emergent Herbaceous Wetlands
			},
		}
	},
	methods: {
		getAttrs(c) {
			return { 
			"width": `${c.width}%`,
			"x": `${c.start}%`,
			"fill": this.categories[c.category]
			}
		}
	},
	computed: {
		formatData: function (props) {
			let start = 0
			let hold = []
			for (const el in props.nlcdInfo) {
				hold.push({
					"category": el,
					"start": start.toFixed(2),
					"width": props.nlcdInfo[el]
				})
				start += props.nlcdInfo[el]
			}
			return hold
		}
	},
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
