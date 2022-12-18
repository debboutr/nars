<template>
	<div class="bg-gray-800 mt-2 p-2 rounded-md">
    <div class="flex justify-between pb-2 items-center content-center">
      <div class="text-xl text-gray-200 mx-4">
        SITE ID: {{ siteInfo.info.SITE_ID }}
      </div>
      <div>
        <button class="bg-gray-200 rounded p-2 mx-2" @click="$emit('zoomBounds', siteInfo.bounds)">zoom</button>
        <button class="bg-gray-200 rounded p-2 mx-2" @click="$emit('removeWatershed', siteInfo.comid, siteInfo.polygon)">remove</button>
        <button class="bg-gray-200 rounded p-2 mx-2" @click="showInfo = !showInfo">i</button>
      </div>
    </div>
    <Transition name="show">
      <div class="bg-gray-600 rounded pb-4" v-show="showInfo">
        <nlcd-data :comid="siteInfo.info.COMID" :comparableYears="siteInfo.comparable" :squareList="siteInfo.squareList" />
        <site-info :siteInfo="siteInfo.info" />
      </div>
    </Transition>
      <!--
    -->
	</div>
</template>

<script setup>
import { ref } from "vue"
import NlcdData from "@/components/NlcdData.vue"
import SiteInfo from "@/components/SiteInfo.vue"
// eslint-disable-next-line no-undef
defineProps({
  siteInfo: Object,
})
const showInfo = ref(true)
</script>

<style>
.show-enter-active {
  transition: all 0.8s ease-out;
}
.show-leave-active {
  transition: all 0.2s ease-in;
}
.show-enter-from,
.show-leave-to {
  opacity: 0;
}
</style>
