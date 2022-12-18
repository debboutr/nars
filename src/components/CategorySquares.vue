<template>
  <div v-if="squareList" class="flex justify-between flex-wrap pb-2">
    <template v-for="(square, index) in squareList" :key="index">
      <button @click="showModal = square" class="nub w-10 h-10 mx-2 mb-4" :style="{ 'background-color': catNames[square]['color'] }">
        <span id="fade" class="w-full h-8 z-10">{{ catNames[square]['name'] }}</span>
      </button>
    </template>
  </div>
  <!-- use the modal component -->
  <Suspense>
  <transition name="modal">
    <nlcd-chart-modal v-if="showModal" @close="showModal = false" :comid="comid" :selected="showModal" />
  </transition>
  </Suspense>
<!--
--> 
</template>

<script setup>
import { ref } from "vue"
import NlcdChartModal from "@/components/NlcdChartModal.vue"
// eslint-disable-next-line no-undef
defineProps({
  squareList: Object,
  catNames:  Object,
  comid:  String,
})
const showModal = ref(false)
</script>

<style>
  .nub {
    border-radius: 20%;
  }
  .tooltiptext {
    position: relative;
    z-index: 1;
    top: -20px;
    left: -50%;
    z-index: 600;
    display: block;
    width: max-content;
    color: white;
    font-size: 12px;
    background-color: #192733;
    border-radius: 10px;
    padding: 10px 15px 10px 15px;
  }
  #fade {
    opacity: 0;
    transition: opacity 1.5s;
  }
  .nub:hover #fade { opacity: 1; }
</style>
