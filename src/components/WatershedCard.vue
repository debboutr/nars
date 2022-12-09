<template>
	<div class="bg-gray-800 mt-2 px-8 pt-8 rounded-md">
    <h1>{{ siteInfo.info.SITE_ID }}</h1>
    <h1>{{ siteInfo.info.COMID }}</h1>
    <Transition>
      <button v-if="siteInfo.info.YEAR === '2004'">Edit</button>
      <button v-else>Save</button>
    </Transition>
    <!--
    <div class="champ pb-4">
      <NLCD :comid="siteInfo.COMID" :comparableYears="checkRef" :squareList="checkRef2" />
    </div>
    <site-info :siteInfo="siteInfo" />
    -->
	</div>
</template>

<script setup>
// eslint-disable-next-line no-undef
defineProps({
  siteInfo: Object,
})

</script>

<style>
  .champ {
    min-height: 100px;
  }
</style>
