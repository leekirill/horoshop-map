<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { getCities, getPlaces } from './api/dataAPI.js'
import AppMap from './components/AppMap.vue'
import AppPlacesList from './components/AppPlacesList.vue'
import AppForm from './components/AppForm.vue'

const cities = ref([])
const selectedCity = ref('Choose your city')
const location = ref({})
const nearbyPlaces = ref([])
const searchValue = ref('')
const isLoading = ref(false)
const isOpen = ref(false)

const filteredList = computed(() => {
  return nearbyPlaces.value?.filter((n) =>
    n.name.toLowerCase().includes(searchValue.value.toLowerCase())
  )
})

const getSearchValue = (valueFromEmit) => (searchValue.value = valueFromEmit)

const getLocationFromCity = () => {
  cities.value.filter((city) => {
    if (city.name === selectedCity.value) {
      location.value = {
        lat: Object.values(city.location)[1],
        lng: Object.values(city.location)[2]
      }
    }
  })
}
const getNearbyPlaces = (lat, lng) => {
  isLoading.value = !isLoading.value

  getPlaces(lat, lng).then((data) => {
    nearbyPlaces.value = data
    isLoading.value = !isLoading.value
  })
}
const setPlaceLocationToCenter = (i) => (location.value = nearbyPlaces.value[i].geometry.location)

const selectCity = (e) => {
  selectedCity.value = e.target.innerText
  isOpen.value = !isOpen.value
}
const selectIsOpen = () => (isOpen.value = !isOpen.value)

watch(selectedCity, () => {
  getLocationFromCity()
  getNearbyPlaces(location.value.lat, location.value.lng)
})

onMounted(() => {
  isLoading.value = !isLoading.value

  getCities().then((data) => {
    cities.value = data
    // selectedCity.value = data[0].name
    location.value = { lat: data[0].location.latitude, lng: data[0].location.longitude }
    isLoading.value = !isLoading.value
  })
})
</script>

<template>
  <div class="wrapper">
    <aside class="sidebar">
      <Transition>
        <div class="backdrop" v-show="isOpen"></div>
      </Transition>
      <app-form
        :cities="cities"
        :searchValue="searchValue"
        :isOpen="isOpen"
        @selectCity="selectCity"
        @selectIsOpen="selectIsOpen"
        @searchValue="getSearchValue"
        >{{ selectedCity }}</app-form
      >
      <app-places-list
        :arr="filteredList"
        :isLoading="isLoading"
        @handleItem="setPlaceLocationToCenter"
      ></app-places-list>
    </aside>
    <div class="map">
      <app-map :location="location" />
    </div>
  </div>
</template>

<style lang="scss">
body {
  padding: 0;
  margin: 0;
  background-image: radial-gradient(
    circle farthest-corner at 10% 20%,
    rgba(216, 241, 230, 0.46) 0.1%,
    rgba(233, 226, 226, 0.28) 90.1%
  );
}
ul {
  padding: 0;
}
li {
  list-style: none;
  cursor: pointer;
}
#app {
  position: relative;
  padding: 10px 30px;
  @media (max-width: 768px) {
    padding: 10px 10px;
  }
}
.wrapper {
  max-width: 1200px;
  width: 100%;
  height: 680px;
  margin: auto;

  transform: translate(0%, 10%);

  display: grid;
  grid-template-columns: 30% 70%;
  overflow: hidden;

  @media (max-width: 768px) {
    grid-template-rows: 50% 50%;
    grid-template-columns: none;
    height: 100%;

    transform: translate(0%, 0%);
  }

  border-radius: 10px;
  box-shadow: 0px 40px 30px rgba(0, 0, 0, 0.1);
}
.backdrop {
  background: black;
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 1;
  opacity: 60%;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 250ms ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
