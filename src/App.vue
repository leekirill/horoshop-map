<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { GoogleMap, Marker } from 'vue3-google-map'
import { getCities, getPlaces } from './api/dataAPI.js'
import API_KEY from './api/API_KEY'
import AppLoader from './components/AppLoader.vue'

const cities = ref([])
const selectedCity = ref('')
const location = ref({})
const nearbyPlaces = ref([])
const searchValue = ref('')
const markerOptions = { position: location.value }
const isLoading = ref(false)
const isOpen = ref(false)

const filteredList = computed(() => {
  return nearbyPlaces.value?.filter((n) =>
    n.name.toLowerCase().includes(searchValue.value.toLowerCase())
  )
})
const getLocation = () => {
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
  isLoading.value = true

  getPlaces(lat, lng).then((data) => {
    nearbyPlaces.value = data
    isLoading.value = false
  })
}
const setPlaceLocation = (i) => {
  location.value = nearbyPlaces.value[i].geometry.location
}

const handleSelect = (e) => {
  isOpen.value = !isOpen.value
  selectedCity.value = e.target.innerText
}

watch(selectedCity, () => {
  getLocation()
  getNearbyPlaces(location.value.lat, location.value.lng)
})

onMounted(() => {
  isLoading.value = !isLoading.value

  getCities().then((data) => {
    cities.value = data
    selectedCity.value = data[0].name
    location.value = { lat: data[0].location.latitude, lng: data[0].location.longitude }
    isLoading.value = !isLoading.value
  })
})
</script>

<template>
  <div class="wrapper">
    <aside class="sidebar">
      <div class="backdrop" v-show="isOpen"></div>
      <form class="sidebar__form">
        <div class="sidebar__select" @click="handleSelect">
          <div class="sidebar__select sidebar__select--selected-item">
            {{ selectedCity }}
            <img src="./assets/arrow-icon.svg" alt="arrow-icon" />
          </div>
          <Transition>
            <ul class="sidebar__select-list" v-show="isOpen">
              <li
                class="sidebar__select-item"
                v-for="(city, i) in cities"
                @click.stop="handleSelect"
                :key="i"
              >
                {{ city.name }}
              </li>
            </ul>
          </Transition>
        </div>
        <div class="sidebar__search">
          <img class="sidebar__search-icon" src="./assets/search-icon.svg" alt="search-icon" />
          <input class="sidebar__input" v-model="searchValue" placeholder="Search" />
        </div>
      </form>
      <ul class="sidebar__places-list">
        <app-loader class="loader" v-if="isLoading" />
        <li
          class="sidebar__places-item"
          v-else
          v-for="(n, i) in filteredList"
          :key="i"
          @click="setPlaceLocation(i)"
        >
          <h3>{{ n.name }}</h3>
          <p>{{ n.vicinity }}</p>
        </li>
      </ul>
    </aside>
    <div class="map">
      <GoogleMap
        :api-key="API_KEY"
        style="width: 100%; height: 680px"
        :center="location"
        :zoom="15"
      >
        <Marker :options="markerOptions" />
      </GoogleMap>
    </div>
  </div>
</template>

<style lang="scss">
* {
  font-family: 'Roboto', sans-serif;
  font-style: normal;
}
ul {
  padding: 0;
}
li {
  list-style: none;
  cursor: pointer;
}
.wrapper {
  max-width: 1200px;
  height: 680px;
  margin: auto;

  display: grid;
  grid-template-columns: 30% 70%;

  border: 1px solid #e5e5e5;
  border-radius: 6px;
}
.backdrop {
  background: black;
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 1;
  opacity: 60%;
}
.sidebar {
  position: relative;
  overflow-y: scroll;
  &__form {
    display: flex;
    flex-direction: column;
    gap: 24px;
    // position: sticky;
    // top: 0;
    background: #fff;
    padding: 20px 20px 0px 20px;
    border-bottom: 1px solid #e6e6e6;
  }
  &__select {
    position: relative;
    padding: 10px 14px;
    border-radius: 4px;
    border: none;
    z-index: 1;
    background: #f2f2f2;

    &--selected-item {
      display: flex;
      justify-content: space-between;
      padding: 0;
    }
  }

  &__select-list {
    position: absolute;
    width: 100%;
    height: 300px;
    overflow-y: scroll;
    background: #fff;
    top: 40px;
    left: 0;
    margin: 0px 0px;
    border-radius: 0px 0px 4px 4px;
  }

  &__select-item {
    padding: 14px;
    cursor: pointer;
    transition: 250ms;
    &:hover {
      background: #f2f2f2;
    }
  }
  &__places-list {
    margin: 0;
  }
  &__places-item {
    padding: 18px 20px;
    border-bottom: 1px solid #e6e6e6;
    transition: 250ms;

    h3 {
      font-size: 16px;
      font-weight: 700;
      margin: 0 0 2px 0;
    }
    p {
      font-size: 14px;
      margin: 0;
    }
    &:hover {
      background: #fafafa;
    }
  }
  &__search {
    display: flex;
    align-items: center;
    &-icon {
      width: 16px;
      height: 16px;
    }
  }
  &__input {
    width: 100%;
    height: 38px;
    padding: 0 20px 0 8px;
    border: 0px solid #fff;

    &:focus {
      outline: none;
    }
  }
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
