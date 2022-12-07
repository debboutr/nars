<template>
	<div v-if="siteInfo.COMID" class="
		bg-gray-800
		px-8 pt-8
		pb-12 rounded-md
    "
		>
    <div class="champ pb-4">
    <NLCD :comid="siteInfo.COMID" />
    </div>
    <site-info :siteInfo="siteInfo" />
	</div>
</template>

<script>
import NLCD from "@/components/NLCD.vue"
import SiteInfo from "@/components/SiteInfo.vue"

export default {
  props: ["siteInfo"],
  components: { 
    NLCD, 
    SiteInfo 
  },
  setup() {}
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
