<template>
	<div class="
		flex
		flex-wrap
		flex-col
		sm:flex-row
		bg-gray-800
		gap-y-4
		gap-x-12
		px-8 pt-8
		pb-12 rounded-md"
		>
		<div class="flex flex-col text-white">
			<h3 class="text-xs mb-2 uppercase">site id</h3>
      <span class="text-2xl">{{ siteInfo.SITE_ID }}</span>
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
		<NLCD v-if="nlcdInfo" :comid="siteInfo.COMID" :nlcdInfo="nlcdInfo.categories" />
		<div class="break"></div>
		<NLCD v-if="nlcdInfo04" :comid="siteInfo.COMID" :nlcdInfo="nlcdInfo04.categories" />
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
		axios.get(`http://narsapi.debbout.info/nlcd/2001/${props.siteInfo.COMID}`)
			.then((response) => {
				nlcdInfo.value = response.data
			})
		axios.get(`http://narsapi.debbout.info/nlcd/2019/${props.siteInfo.COMID}`)
			.then((response) => {
				nlcdInfo04.value = response.data
			})
		return { nlcdInfo, nlcdInfo04 };
	}
}
</script>

<style>
	.break {
		flex-basis: 100%;
		height: 0;
	}
</style>
