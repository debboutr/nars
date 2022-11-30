<template>
  <div class="flex flex-col h-screen max-h-screen">
		<div class="z-20 flex justify-center relative bg-hero-pattern bg-cover px-2 pt-8 pb-8">
			<div class="w-full max-w-screen-sm">
				<h1 class="text-white text-center text-3xl pb-4">National Aquatic Resource Survey Results</h1>
        <div class="flex justify-center px-4">
          <button class="snow bg-cyan-600" @click="getPoints('nrsa0405','#0891B2','#67E8F9')">NRSA 2004-05</button>
          <button class="snow bg-lime-700" @click="getPoints('nrsa0809','#4D7C0F','#BEF264')">NRSA 2008-09</button>
          <button class="snow bg-yellow-500" @click="getPoints('nrsa1314','#EAB308','#FEF08A')">NRSA 2013-14</button>
        </div>
<!--
  <button class="snow bg-rose-500" @click="getIpInfo">TESTE</button>
		<div id="mapid" class="h-full z-10 border-r-[2px] border-black w-4/5"></div>
-->
			</div>
		</div>
		<div id="mapid" class="h-full z-10"></div>
  </div>
  <div class="bg-hero-pattern bg-cover px-8 pb-8 pt-2 z-10">
			<SiteInfo v-if="siteInfo" v-bind:siteInfo="siteInfo" />
  </div>
</template>

<script>
import SiteInfo from "../components/SiteInfo.vue"
import leaflet from "leaflet"
import { onMounted, ref } from "vue"
import axios from "axios"

export default {
  name: 'HomeView',
  components: { SiteInfo },
  data : function () {
    return {
      "04" : "nrsa0405",
      "05" : "nrsa0405",
      "08" : "nrsa0809",
      "09" : "nrsa0809",
      "13" : "nrsa1314",
      "14" : "nrsa1314"
      }
  },
	setup() {
		let mymap;
		const siteInfo = ref(null);

		onMounted(() => {
			mymap = leaflet.map("mapid").setView([42.924252, -123.296814], 7);

			leaflet.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZGViYm9pdXRyIiwiYSI6IjhlMTk5YzlhZDBiODQ5MWE5NDEzMzE1MjI0OTU4OWJjIn0.jS8URjY-9OvjAv6aTn9I0w', {
					maxZoom: 18,
					id: "mapbox/satellite-v9",
					tileSize: 512,
					zoomOffset: -1,
					attribution: '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a>',
					accessToken: "pk.eyJ1IjoiZGViYm9pdXRyIiwiYSI6IjhlMTk5YzlhZDBiODQ5MWE5NDEzMzE1MjI0OTU4OWJjIn0.jS8URjY-9OvjAv6aTn9I0w",
			}).addTo(mymap);

      //function onMapClick(e) {
      //  alert("You clicked the map at " + e.latlng);
      //}
      //mymap.on('click', onMapClick);

		})

    const drawWatershed = async (e) => {
      var year = parseInt(e.layer.feature.properties.YEAR)
      if (year >= 2012) {
        year = "nrsa1314"
      } else if (year <= 2005) {
        year = "nrsa0405"
      } else {
        year = "nrsa0809"
      }
      var sid = e.layer.feature.properties.SITE_ID;
      let sitedata = await axios.get(`http://narsapi.debbout.info/${year}/point/${sid}`);
      console.log(sitedata.data.properties)
      siteInfo.value = sitedata.data.properties;

      let data = await axios.get(`http://narsapi.debbout.info/${year}/watersheds/${sid}`);
      let dd = data.data
      let ws = leaflet.geoJSON(dd, {
        style: function () {
                return {color: "red"};
            }
      }).addTo(mymap)
      let bounds = ws.getBounds()
      mymap.fitBounds(bounds)
      var scrollDiv = document.getElementById("mapid").offsetTop;
      window.scrollTo({ top: scrollDiv, behavior: 'smooth'});
			let area = leaflet.GeometryUtil.geodesicArea(ws.getLatLngs());
			console.log("area", area)
      //let label = leaflet.marker(bounds.getCenter(), {
      //  icon: leaflet.divIcon({
      //    className: "bg-blue-800 rounded-full text-center justify-center",
      //    html: `<b>${sid}</b>`,
      //    iconSize: [100,20],
      //  })
      //})
      //label.addTo(mymap)
    }

		const getPoints = async (annum, color, fill) => {
			try {
        var geojsonMarkerOptions = {
            radius: 5,
            fillColor: `${fill}`,
            color: `${color}`,
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        };

        const data = await axios.get(`http://narsapi.debbout.info/${annum}/points/`);
				const result = data.data
        console.log(result);
        var poop = leaflet.geoJSON(result, {
          pointToLayer: function (feature, latlng) {
            return leaflet.circleMarker(latlng, geojsonMarkerOptions)
          },
          //onEachFeature: function (feature, layer) {
          //  drawWatershed(feature.properties.SITE_ID);
          //  console.log(feature);
          //  console.log(layer);
          //},
        }).bindTooltip(function (layer) {
          return `<b>SITE_ID: ${layer.feature.properties.SITE_ID}</b>`
        }).addTo(mymap)
        poop.on('click', drawWatershed);
        mymap.fitBounds(poop.getBounds())
			}
			catch(err) {
				alert(err.message)
			}
		}

		const getIpInfo = async () => {
			try {
        mymap.eachLayer(function (layer) {
          console.log(layer);
        })
			}
			catch(err) {
				alert(err.message)
			}
		}
		return { siteInfo, getPoints, getIpInfo };
	},
}
</script>

<style>
  .snow {
    margin-left: 1.5rem;
    margin-right: 1.5rem;
    margin-bottom: 1rem;
    padding-top: .5rem;
    padding-bottom: .5rem;
    padding-left: 1rem;
    padding-right: 1rem;
    border-radius: 9999px;
    font-weight: 700;
   }
 </style>
 
