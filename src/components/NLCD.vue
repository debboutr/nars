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
  props: ["nlcdInfo"],
	data: function () {
		return {
			categories: {
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
			},
		}
	},
	methods: {
		getAttrs(c) {
			return { 
			"width": `${c.width}%`,
			"x": `${c.start}%`,
			"fill": this.categories[c.category]["color"]
			}
		}
	},
	computed: {
		formatData: function (props) {
			let start = 0
			let hold = []
			for (const el in props.nlcdInfo) {
        let width = props.nlcdInfo[el]
				hold.push({
					"category": el,
					"start": start.toFixed(2),
					"width": width
				})
        start += width
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
