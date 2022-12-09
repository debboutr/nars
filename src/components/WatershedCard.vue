<template>
	<div class="bg-gray-800 mt-2 p-2 rounded-md">
    <div class="flex justify-between pb-2 content-center">
      <div class="text-2xl text-gray-200">
        SITE ID: {{ siteInfo.info.SITE_ID }}
      </div>
      <button class="bg-gray-200 rounded-full p-2 mx-2" @click="showInfo = !showInfo">i</button>
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
