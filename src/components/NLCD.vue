<template>
  <category-squares :squareList="squareList" :catNames="categories" />
  <!--
  BELOW WILL BE A COMPONENT OF IT'S OWN -- comparableYears data to be put in store
  reportedCategories will bee -> reported and then -> reported.categories | reported.year
--> 
	<svg class="chart" width="100%" height="50" v-for="(reportedCategories, index) in comparableYears" :key="index">
		<rect width="1px" x="25%" fill="white" height="32"></rect>
		<rect width="1px" x="50%" fill="white" height="32"></rect>
		<rect width="1px" x="75%" fill="white" height="32"></rect>
		<template v-for="cc in reportedCategories" :key="cc.category" >
			<rect 
				v-bind="makeRectAttrs(cc)"
				height="40"
				y="5"
				>
					<title>
						{{ categories[cc.category]['name'] }} ({{ cc.width }}%)
					</title>
			</rect>
		</template>
	</svg>
</template>

<script>
import axios from "axios"
import { ref } from "vue"

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

export default {
  props: [ "comid" ],
  components: { CategorySquares },
  setup (props) {
    const comparableYears = ref([])
    const squareList = ref(null)

    function remakeData (obj) {
      let start = 0
      let hold = []
      let cat = obj.data.categories
      for (const el in cat) {
        let width = cat[el]
        hold.push({
          "category": el,
          "start": start.toFixed(2),
          "width": width
        })
        start += width
      }
      return hold
    }

    function isolateSquares (yearOne, yearTwo) {
      //console.log(yearOne)
      const cOne = Object.keys(yearOne)
        .filter((c) => yearOne[c] > 0)
      const cTwo = Object.keys(yearTwo)
        .filter((c) => yearTwo[c] > 0)
      return [...new Set(cOne.concat(cTwo))]
    }

    // if props.comid in Object.keys(store.watersheds)
    // YES -> squareList && comparableYears
    // NO -> make the call and mutate the store.watersheds[comid] object
    //console.log("in SEUPT: ", props.comid)
    const one = axios.get(`${process.env.VUE_APP_API_URL}/nlcd/2001/${props.comid}/`)
		const two = axios.get(`${process.env.VUE_APP_API_URL}/nlcd/2019/${props.comid}/`)

    axios.all([one, two]).then(axios.spread((...responses) => {
      //console.log("b4 CHECk: ", responses[0].data.categories)
      squareList.value = isolateSquares(responses[0].data.categories, responses[1].data.categories)
      //console.log("b5 CHECk: ", responses[1].categories)
      comparableYears.value = responses.map((o) => {
        return remakeData(o)
      })
      //console.log("in CHECk: ", squareList.value)
    }))

		return { categories, comparableYears, squareList };
  },
	methods: {
    speak() {
      alert("this is a comis")
    },
		makeRectAttrs(c) {
			return { 
			"width": `${c.width}%`,
			"x": `${c.start}%`,
			"fill": this.categories[c.category]["color"]
			}
		}
	},
	computed: {
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
