<template>
  <div class="flex flex-col items-center bg-hero-pattern bg-repeat-y">
		<div class="w-full flex justify-left px-2 pt-4 pb-4 text-xl">
      <input type="text" placeholder="Search for SITE_ID" class="mx-12 h-12 border-2 border-gray-500 rounded-full" />
      <h3>National Aquatic Resource Survey</h3>
		</div>
		<div id="mapid" class="map-height w-5/6">
       <map-nav @get-points="getPoints" />
    </div>
    <div v-if="watersheds.length" class="h-full w-full px-8 pt-2">
      <transition-group name="cards" tag="div">
        <watershed-card 
          v-for="info in watersheds"
          :key="info.comid"
          :siteInfo="info"
          @zoom-bounds="zoomBounds"
          @remove-watershed="removeWatershed" />
      </transition-group>
    </div>
    <div class="h-96">
    </div>
  </div>
  <BackToTop />
</template>

<script setup>
import { onMounted,  ref } from "vue"
import L from "leaflet"
import axios from "axios"
import MapNav from "@/components/MapNav.vue"
import BackToTop from "@/components/BackToTop.vue"
import WatershedCard from "@/components/WatershedCard.vue"

let mymap;
const watersheds = ref([])

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

  function addNearest (e) {
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
  mymap.on('click', addNearest);

  function flyToNorway(e) {

    mymap.closePopup()
    let year = e.target.dataset.year
    axios.get(`${process.env.VUE_APP_API_URL}/${year}/nearest/${e.path[1].dataset.lat}/${e.path[1].dataset.lng}/`)
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
        mymap.off('click', addNearest);
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

const moveToFirst = (comid) => {
  watersheds.value.forEach((item, i) => {
    if (item.info.COMID === comid) {
      watersheds.value.splice(i, 1)
      watersheds.value.unshift(item)
    }
  })
}

const drawWatershed = async (e) => {
  const featureData = e.layer.feature.properties
  if (!watersheds.value.some(e => e.comid === featureData.COMID)) {
    let yr = parseInt(featureData.YEAR)
    const year = yr >= 2012 ? "nrsa1314" : yr <= 2005 ? "nrsa0405" : "nrsa0809"
    var sid = featureData.SITE_ID;
    var comid = featureData.COMID;
    let data = await axios.get(`${process.env.VUE_APP_API_URL}/${year}/watersheds/${sid}`);
    let dd = data.data
    let ws = L.geoJSON(dd, {
      style: function () {
          return {color: "red"};
        }
      }).addTo(mymap)
    ws.on("click", () => {moveToFirst(comid)})
    let bounds = ws.getBounds()
    mymap.flyToBounds(bounds)
    var scrollDiv = document.getElementById("mapid").offsetTop;
    window.scrollTo({ top: scrollDiv, behavior: 'smooth'});
    axios.get(`${process.env.VUE_APP_API_URL}/nlcd/compare/${comid}/`)
      .then((response) => {
        let comp = response.data.comparable
        let square = response.data.square_list
        watersheds.value.unshift({
          "comid": comid,
          "info": featureData,
          "comparable": comp, 
          "squareList": square,
          "bounds": bounds,
          "polygon": ws
        })
      })
  }
}

const removeWatershed = async (comid, poly) => {
  const idx = watersheds.value.findIndex(o => {
    return o.comid === comid
  })
  watersheds.value.splice(idx, 1)
  mymap.removeLayer(poly)
}

const zoomBounds = async (bnds) => {
  mymap.flyToBounds(bnds)
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
// eslint-disable-next-line no-undef
defineExpose({ getPoints, zoomBounds })
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
  .cards-move {
    transition: transform 1s;
  }
  .map-height {
    height: 500px;
  }
 </style>
