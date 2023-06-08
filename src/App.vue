<script setup>
import { ref, watch, onMounted } from 'vue'
import { GoogleMap, Marker } from 'vue3-google-map'
import getData from './getData'

const API_KEY = 'AIzaSyAYiSUVdUYIiTXsSHQOh2saSqQzvDvjbqI'

const data = ref([])
const option = ref(null)
const location = ref({})

// watch(count, (count, prevCount) => {
//   /* ... */
// })
watch(option, () => {
  data.value.filter((city) => {
    if (city.name === option.value) {
      location.value = city.location

      // надо переименовать ключи на lag lng
      console.log(location.value)
    }
  })
})

onMounted(() => {
  getData().then((cities) => (data.value = cities))
})
</script>

<template>
  <section class="main">
    <aside class="sidebar">
      <form class="form">
        <select v-model="option" class="custom-select">
          <option class="radios" v-for="(city, i) of data" :key="i">
            <input type="radio" name="item" id="default" checked />
            {{ city.name }}
          </option>
          <ul class="citiesList"></ul>
        </select>
        <input class="search" placeholder="search" />
      </form>
      <ul class="placesList"></ul>
    </aside>
    <div id="map">
      <GoogleMap
        :api-key="API_KEY"
        style="width: 100%; height: 500px"
        :center="{ lat: 48.4593, lng: 35.03865 }"
        :zoom="15"
      >
        <Marker :options="{ position: center }" />
      </GoogleMap>
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
