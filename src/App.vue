<script setup>
import { ref, watch, onMounted } from 'vue'
import { GoogleMap, Marker } from 'vue3-google-map'
import { getCities, getPlaces } from './dataAPI.js'
import API_KEY from './API_KEY'

const cities = ref([])
const selectedCity = ref('')
const location = ref({})
const markerOptions = { position: location.value }

watch(selectedCity, () => {
  cities.value.filter((city) => {
    if (city.name === selectedCity.value) {
      location.value = {
        lat: Object.values(city.location)[1],
        lng: Object.values(city.location)[2]
      }
    }
  })

  getPlaces(location.value.lat, location.value.lng)

  // getLocation().then(console.log)
})

// onUpdated(() => {
//   console.log(location)
// })

onMounted(() => {
  getCities().then((data) => {
    cities.value = data
    selectedCity.value = data[0].name
    location.value = { lat: data[0].location.latitude, lng: data[0].location.longitude }
  })

  getPlaces(location.value.lat, location.value.lng)
})
</script>

<template>
  <div class="wrapper">
    <aside class="sidebar">
      <form class="sidebar__form">
        <select v-model="selectedCity" class="sidebar__select">
          <option class="sidebar__option" v-for="(city, i) in cities" :value="city.name" :key="i">
            {{ city.name }}
          </option>
          <ul class="sidebar__cities-list"></ul>
        </select>
        <input class="sidebar__search" placeholder="search" />
      </form>
      <ul class="sidebar__places-list"></ul>
    </aside>
    <div class="map">
      <GoogleMap
        :api-key="API_KEY"
        style="width: 100%; height: 500px"
        :center="location"
        :zoom="15"
      >
        <Marker :options="markerOptions" />
      </GoogleMap>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
