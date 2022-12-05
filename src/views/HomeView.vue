<template>
  <div class="flex flex-col h-screen max-h-screen">
		<div class="z-20 flex justify-center relative bg-hero-pattern bg-cover px-2 pt-8 pb-8">
			<div class="w-full max-w-screen-sm">
				<h1 class="text-white text-center text-3xl pb-4">National Aquatic Resource Survey Results</h1>
        <div class="flex justify-center px-4">
        </div>
			</div>
		</div>
		<div id="mapid" class="h-full z-10">
       <MapNav @get-points="getPoints" />
    </div>
  </div>
	<BackToTop />
  <div class="bg-hero-pattern bg-cover hold px-8 pb-8 pt-0 z-10">
			<SiteInfo v-if="siteInfo" v-bind:siteInfo="siteInfo" :key="siteInfo.COMID" />
  </div>
</template>

<script>
import SiteInfo from "../components/SiteInfo.vue"
import BackToTop from "../components/BackToTop.vue"
import MapNav from "../components/MapNav.vue"
import leaflet from "leaflet"
import { onMounted, ref } from "vue"
import axios from "axios"

export default {
  name: 'HomeView',
  components: { SiteInfo, BackToTop, MapNav },
	setup() {
		let mymap;
		const siteInfo = ref(null);

		onMounted(() => {

			mymap = leaflet.map("mapid").setView([39.828175, -98.5795], 4);

			leaflet.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZGViYm9pdXRyIiwiYSI6IjhlMTk5YzlhZDBiODQ5MWE5NDEzMzE1MjI0OTU4OWJjIn0.jS8URjY-9OvjAv6aTn9I0w', {
					maxZoom: 18,
					id: "mapbox/satellite-v9",
					tileSize: 512,
					zoomOffset: -1,
					attribution: '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a>',
					accessToken: "pk.eyJ1IjoiZGViYm9pdXRyIiwiYSI6IjhlMTk5YzlhZDBiODQ5MWE5NDEzMzE1MjI0OTU4OWJjIn0.jS8URjY-9OvjAv6aTn9I0w",
			}).addTo(mymap);

      mymap.attributionControl.setPosition('bottomleft');

			function wricky (e) {
				let curZoom = mymap.getZoom()
				mymap.flyTo(e.latlng, curZoom + 1)
				let dot = leaflet.circleMarker([e.latlng.lat, e.latlng.lng], {
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
				let year = e.target.dataset.year
				axios.get(`http://narsapi.debbout.info/${year}/
					nearest/${e.path[1].dataset.lat}/${e.path[1].dataset.lng}`)
					.then((response) => {
						let data = response.data;
						let gobs = leaflet.geoJSON(data, {
							pointToLayer: function (feature, latlng) {
								return leaflet.circleMarker(latlng, {
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
									offset: leaflet.point(0, -20)});
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
      if (year >= 2012) {
        year = "nrsa1314"
      } else if (year <= 2005) {
        year = "nrsa0405"
      } else {
        year = "nrsa0809"
      }
      var sid = e.layer.feature.properties.SITE_ID;
      let sitedata = await axios.get(`http://narsapi.debbout.info/${year}/point/${sid}`);
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
        var poop = leaflet.geoJSON(result, {
          pointToLayer: function (feature, latlng) {
            return leaflet.circleMarker(latlng, geojsonMarkerOptions)
          },
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
 
