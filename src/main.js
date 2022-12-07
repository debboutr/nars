import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster/dist/leaflet.markercluster-src.js";
import './assets/tailwind.css'

createApp(App).use(router).mount('#app')
