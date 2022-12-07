<template>
	<div class="
		bg-gray-800
		px-8 pt-8
		pb-12 rounded-md
    "
		>
    <div class="champ">
		<NLCD v-if="nlcdInfo" :nlcdInfo="nlcdInfo.categories" />
		<div class="break"></div>
		<NLCD v-if="nlcdInfo04" :nlcdInfo="nlcdInfo04.categories" />
    </div>
    <div class="
		flex
		flex-wrap
		flex-col
		sm:flex-row
		gap-y-4
		gap-x-12
      ">
      <div class="flex flex-col text-white">
        <h3 class="text-xs mb-2 uppercase">site id</h3>
        <span class="text-2xl">{{ siteInfo.SITE_ID }}</span>
      </div>
      <div class="flex flex-col text-white">
        <h3 class="text-xs mb-2 uppercase">wsareasqkm</h3>
        <span class="text-2xl">{{ siteInfo.WSAREASQKM }}</span>
      </div>
      <div class="flex flex-col text-white">
        <h3 class="text-xs mb-2 uppercase">comid</h3>
        <span class="text-2xl">{{ siteInfo.COMID }}</span>
      </div>
      <div class="flex flex-col text-white">
        <h3 class="text-xs mb-2 uppercase">date collected</h3>
        <span class="text-2xl">{{ siteInfo.DATE_COL.slice(0,10) }}</span>
      </div>
      <div class="flex flex-col text-white">
        <h3 class="text-xs mb-2 uppercase">visit number</h3>
        <span class="text-2xl">{{ siteInfo.VISIT_NO }}</span>
      </div>
      <div class="break"></div>
      <!--
      -->
    </div>
	</div>
</template>

<script>
import NLCD from "../components/NLCD.vue"
import axios from "axios"
import { ref } from "vue"

export default {
  props: ["siteInfo"],
  components: { NLCD },
	setup(props) {
		const nlcdInfo = ref(null);
		const nlcdInfo04 = ref(null);
    const one = axios.get(`${process.env.VUE_APP_API_URL}/nlcd/2001/${props.siteInfo.COMID}`)
		const two = axios.get(`${process.env.VUE_APP_API_URL}/nlcd/2019/${props.siteInfo.COMID}`)

    axios.all([one, two]).then(axios.spread((...responses) => {
      const dOne = responses[0].data
      const dTwo = responses[1].data
      nlcdInfo.value = dOne
      nlcdInfo04.value = dTwo
      const cOne = Object.keys(dOne.categories).filter((c) => dOne.categories[c] > 0)
      const cTwo = Object.keys(dTwo.categories).filter((c) => dTwo.categories[c] > 0)
      console.log(cOne)
      console.log(cTwo)
      console.log([...new Set(cOne.concat(cTwo))])
    }))

		return { nlcdInfo, nlcdInfo04 };
	}
}
</script>

<style>
  .champ {
    min-height: 100px;
  }
	.break {
		flex-basis: 100%;
		height: 0;
	}
</style>
