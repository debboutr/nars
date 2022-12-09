<template>
  <div class="flex flex-wrap flex-col sm:flex-row gap-y-4 gap-x-12">
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
</template>

<script>

export default {
  props: ["siteInfo"],
}
</script>

<style>
	.break {
		flex-basis: 100%;
		height: 0;
	}
</style>
