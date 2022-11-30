<template>
	<div class="
		flex
		flex-col
		sm:flex-row
		bg-amber-100
		gap-y-4
		gap-x-12
		px-8 pt-8
		pb-12 rounded-md"
		>
		<div class="flex flex-col">
			<h3 class="text-xs mb-2 uppercase">site id</h3>
      <span class="text-2xl">{{ siteInfo.SITE_ID }}</span>
		</div>
		<div class="flex flex-col">
			<h3 class="text-xs mb-2 uppercase">comid</h3>
			<span class="text-2xl">{{ siteInfo.COMID }}</span>
		</div>
		<div class="flex flex-col">
			<h3 class="text-xs mb-2 uppercase">date collected</h3>
			<span class="text-2xl">{{ siteInfo.DATE_COL.slice(0,10) }}</span>
		</div>
		<div class="flex flex-col">
			<h3 class="text-xs mb-2 uppercase">visit number</h3>
			<span class="text-2xl">{{ siteInfo.VISIT_NO }}</span>
		</div>
	</div>
</template>

<script>

export default {
  props: ["siteInfo"],
}
</script>
