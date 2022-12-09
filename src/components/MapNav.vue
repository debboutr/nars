<template>
  <div class="box">
    <button @click="show = !show" class="btn btna text-center text-3xl text-slate-200/75 pb-4">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
        <!--! Font Awesome Pro 6.2.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
        <path d="M408 120c0 54.6-73.1 151.9-105.2 192c-7.7 9.6-22 9.6-29.6 0C241.1 271.9 168 174.6 168 120C168 53.7 221.7 0 288 0s120 53.7 120 120zm8 80.4c3.5-6.9 6.7-13.8 9.6-20.6c.5-1.2 1-2.5 1.5-3.7l116-46.4C558.9 123.4 576 135 576 152V422.8c0 9.8-6 18.6-15.1 22.3L416 503V200.4zM137.6 138.3c2.4 14.1 7.2 28.3 12.8 41.5c2.9 6.8 6.1 13.7 9.6 20.6V451.8L32.9 502.7C17.1 509 0 497.4 0 480.4V209.6c0-9.8 6-18.6 15.1-22.3l122.6-49zM327.8 332c13.9-17.4 35.7-45.7 56.2-77V504.3L192 449.4V255c20.5 31.3 42.3 59.6 56.2 77c20.5 25.6 59.1 25.6 79.6 0zM288 152c22.1 0 40-17.9 40-40s-17.9-40-40-40s-40 17.9-40 40s17.9 40 40 40z"/>
      </svg>
    </button>
    <Transition>
      <div class="lighten" v-if="show" @click="show = !show">
        <button class="nav yr1" @click="$emit('getPoints','nrsa0405','#0891B2','#67E8F9')">04/05</button>
        <button class="nav yr2" @click="$emit('getPoints','nrsa0809','#4D7C0F','#BEF264')">08/09</button>
        <button class="nav yr3" @click="$emit('getPoints','nrsa1314','#EAB308','#FEF08A')">13/14</button>
      </div>
    </Transition>
  </div>
</template>

<script>
import leaflet from "leaflet"
import { ref, onMounted } from "vue"

export default {
	setup() {
    const show = ref(false)
		onMounted(() => {
      //console.log("hello")
			const box = document.querySelector(".box")
      leaflet.DomEvent.disableClickPropagation(box)
    })
    return { show }
	}
}
</script>
<style>
  .btnb {
    min-width: 50px;
  }
  .btna {
    min-width: 70px;
  }
  .btn {
    padding: 8px;
    border-radius: 100%;
    background-color:rgba(100, 116, 139,0.6);
		margin-bottom: 0.5em;
  }
  .box {
    position: absolute;
		top: 100px;
		max-width: 100px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: .5em;
		margin: 1em;
    background-color:rgba(255,0,0,0);
		z-index: 999;
	}
  .lighten {
    opacity: 0.6;
  }
  .nav {
    height: 70px;
		width: 70px;
		margin-bottom: 1.5em;
    border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 1.5em;
  }
  .yr1 {
		background-color: #0891B2;
  }
  .yr2 {
		background-color: #4D7C0F;
  }
  .yr3 {
		background-color: #EAB308;
  }
  .v-enter-active,
  .v-leave-active {
    transition: all 1s ease-out;
  }
  .v-enter-from,
  .v-leave-to {
    transform: translateX(-40px);
    opacity: 0;
  }
  .v-enter-to,
  .v-leave-from {
  }

</style>
