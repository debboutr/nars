<template>
  <div v-if="squareList" class="flex justify-between flex-wrap pb-2">
    <template v-for="(square, index) in squareList" :key="index">
      <div @click="speak" class="nub w-10 h-10 mx-2 mb-4" :style="{ 'background-color': catNames[square]['color'] }">
        <span id="fade" class="px-4 tooltiptext">{{ catNames[square]['name'] }}</span>
      </div>
    </template>
  </div>
</template>
<script>
//import { toRefs } from "vue"

export default {
  props: ["squareList", "catNames"],
//  setup (props) {
//    const { one, two } = toRefs(props)
//    console.log("..in setup(): ", two)
//    return { one }
//  },
	computed: {
//    filteredCategories: function () {
//      //console.log("reefcat: ", nlcdInfo)
//      return {}
//    },
  }
}
</script>
<!--
--> 
<style>
  .nub {
    border-radius: 20%;
  }
  .tooltiptext {
    position: relative;
    z-index: 1;
    top: -40px;
    left: -50%;
    z-index: 600;
    width: 100%;
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
