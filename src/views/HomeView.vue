<template>
  <div class="flex flex-col h-screen max-h-screen">
		<div class="z-20 flex justify-left relative bg-hero-pattern bg-cover px-2 pt-4 pb-4">
      <input type="text" placeholder="Search for SITE_ID" class="mx-12 h-12 border-2 border-red-500" />
      <div>boo</div>
      <div>boo</div>
      <div>boo</div>
      <div>boo</div>
      <div>boo</div>
		</div>
		<div id="mapid" class="h-full z-10">
       <MapNav @get-points="getPoints" />
    </div>
  </div>
	<BackToTop />
  <div class="bg-hero-pattern bg-cover hold px-8 pb-8 pt-0 z-10">
			<WatershedCard  v-if="siteInfo" v-bind:siteInfo="siteInfo" :key="siteInfo.COMID" />
  </div>
</template>

<script>
import MapNav from "@/components/MapNav.vue"
import BackToTop from "@/components/BackToTop.vue"
// card below will be made with the store.watersheds object
import WatershedCard from "@/components/WatershedCard.vue"
import L from "leaflet"
import { onMounted, ref } from "vue"
import axios from "axios"

export default {
  name: 'HomeView',
  components: { WatershedCard , BackToTop, MapNav },
	setup() {
		let mymap;
    const allInfo = {}
		const siteInfo = ref(null)

		onMounted(() => {

			mymap = L.map("mapid").setView([39.828175, -98.5795], 4);

      L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${process.env.VUE_APP_MB_TOKEN}`, {
					maxZoom: 18,
					id: "mapbox/satellite-v9",
					tileSize: 512,
					zoomOffset: -1,
					attribution: '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a>',
			}).addTo(mymap);

      mymap.attributionControl.setPosition('bottomleft');

			function wricky (e) {
				let curZoom = mymap.getZoom()
				mymap.flyTo(e.latlng, curZoom + 1)
				let dot = L.circleMarker([e.latlng.lat, e.latlng.lng], {
						radius: 5,
						fillColor: `#E11D48`,
						color: `#FED7AA`,
						weight: 2,
						opacity: 1,
						fillOpacity: 0.8,
					}
				)
				dot.addTo(mymap)
				dot.bindPopup(
					() => {
            return `
							<div class="container"
								data-lat="${e.latlng.lat}"
								data-lng="${e.latlng.lng}">
								<button id="nrsa0405" class="rick side bg-cyan-600" 
								data-year="nrsa0405">
									0405
								</button>
								<button id="nrsa0809" class="rick middle bg-lime-700"
								data-year="nrsa0809">
									0809
								</button>
								<button id="nrsa1314" class="rick side bg-yellow-500"
								data-year="nrsa1314">
									1314
								</button>
							</div>`
						}, { closeButton: false }
				).openPopup()
			}
      mymap.on('click', wricky);

			function flyToNorway(e) {

				mymap.closePopup()
        // i put the year in a data- tag | move to store
				let year = e.target.dataset.year
        axios.get(`${process.env.VUE_APP_API_URL}/${year}/
					nearest/${e.path[1].dataset.lat}/${e.path[1].dataset.lng}`)
					.then((response) => {
						let data = response.data;
						let gobs = L.geoJSON(data, {
							pointToLayer: function (feature, latlng) {
								return L.circleMarker(latlng, {
									fillColor: `${years[year].fill}`,
									color: `${years[year].color}`,
									radius: 24,
									weight: 5,
									opacity: 0.9,
									fillOpacity: 0.5,
								})
							},
							onEachFeature: function (feature, layer) {
								layer.bindTooltip(feature.properties.SITE_ID, {
									closeButton: false,
									className: "text",
									offset: L.point(0, -20)});
							}
						})
						gobs.addTo(mymap)
						gobs.on('click', drawWatershed);
						let bounds = gobs.getBounds().pad(0.1)
						mymap.flyToBounds(bounds)
						mymap.off('click', wricky);
					});
			}

			const years = { nrsa0405: {color: "#0891B2", fill: "#67E8F9"},
											nrsa0809: {color: "#4D7C0F", fill: "#BEF264"},
											nrsa1314: {color: "#EAB308", fill: "#FEF08A"}}

			mymap.on('popupopen', function(){
				Object.keys(years).forEach((year) => {
					const link = document.querySelector(`#${year}`)
					link.addEventListener('click', flyToNorway)
				})
			})

			mymap.on('popupclose', function(){
				Object.keys(years).forEach((year) => {
					document.querySelector(`#${year}`).removeEventListener('click', flyToNorway)
				})
			})

		})


    const drawWatershed = async (e) => {
      var year = parseInt(e.layer.feature.properties.YEAR)
      // MAke this a mutation and a property for the store | needed
      if (year >= 2012) {
        year = "nrsa1314"
      } else if (year <= 2005) {
        year = "nrsa0405"
      } else {
        year = "nrsa0809"
      }
      var sid = e.layer.feature.properties.SITE_ID;
      //let sitedata = await axios.get(`${process.env.VUE_APP_API_URL}/${year}/point/${sid}`);
      siteInfo.value = e.layer.feature.properties
      // below is example of mutation needed for state
      allInfo[`${sid}`] = e.layer.feature.properties

      let data = await axios.get(`${process.env.VUE_APP_API_URL}/${year}/watersheds/${sid}`);
      let dd = data.data
      let ws = L.geoJSON(dd, {
        style: function () {
            return {color: "red"};
          }
        }).addTo(mymap)
      // below is what makses the cards flip the data they contai right meow
      // I think the whole funtion can be expressed in store ?mutation?
      // needs to return a function
      // in STORE function returned
      // this function below will just call a mutation that returns th obj[sid]
      ws.on("click", () => { siteInfo.value = allInfo[sid] })
      let bounds = ws.getBounds()
      mymap.fitBounds(bounds)
      var scrollDiv = document.getElementById("mapid").offsetTop;
      window.scrollTo({ top: scrollDiv, behavior: 'smooth'});
    }

		const getPoints = async (annum, color, fill) => {
      mymap.off('click')
      var geojsonMarkerOptions = {
          radius: 5,
          fillColor: `${fill}`,
          color: `${color}`,
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8
      };

      let cg = L.markerClusterGroup()
      const data = await axios.get(`${process.env.VUE_APP_API_URL}/${annum}/points/`)
        .then((response) => {
          return response.data
        })
//
//      data.features.forEach((feat) => {
//        let coords = feat.geometry.coordinates
//        const m = L.circleMarker([coords[1], coords[0]], geojsonMarkerOptions)
//        m.bindTooltip(`<b>SITE_ID: ${feat.properties.SITE_ID}</b>`)
//        m.on("click", drawWatershed)
//        cg.addLayer(m)
//
//      })
      var poop = L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng, geojsonMarkerOptions)
        },
        onEachFeature: function (feature, layer) {
          layer.bindTooltip(`<b>SITE_ID: ${feature.properties.SITE_ID}</b>`, {
            closeButton: false,
            className: "text",
            offset: L.point(0, -20)});
        }
      })
      poop.on('click', drawWatershed);
      cg.addLayer(poop)
      mymap.addLayer(cg)
      mymap.fitBounds(poop.getBounds())
		}
		return { siteInfo, getPoints };
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
   .container {
     display: flex;
     background-color:rgba(255,255,255,0.0);
   }
   .rick {
     width: 50px;
     height: 50px;
     border-radius: 50%;
  }
  .middle {
    margin-left: 1em;
    margin-right: 1em;
    margin-bottom: 1em;
  }
	.side {
    margin-top: 1.5em;
	}
  .leaflet-popup-content {
    padding: 0px;
  }
  .leaflet-popup-content-wrapper, .leaflet-popup-tip {
    background-color:rgba(255,0,0,0);
    box-shadow: none;
  }
  .hold {
    min-height: 400px;
	}
  .leaflet-control-attribution {
    display: hidden;
    opacity: 0%;
  }
 </style>
