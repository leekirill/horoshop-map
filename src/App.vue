<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { getCities, getPlaces } from './api/dataAPI.js'
import AppMap from './components/AppMap.vue'
import AppLoader from './components/AppLoader.vue'

const cities = ref([])
const selectedCity = ref('')
const location = ref({})
const nearbyPlaces = ref([])
const searchValue = ref('')
const ratingStarts = ref(new Array(5).fill())
const isLoading = ref(false)
const isOpen = ref(false)

const filteredList = computed(() => {
  return nearbyPlaces.value?.filter((n) =>
    n.name.toLowerCase().includes(searchValue.value.toLowerCase())
  )
})

const arrowClass = computed(() => (isOpen.value ? 'arrow-icon arrow-icon--active' : 'arrow-icon'))

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
const setPlaceLocationToCenter = (i) => {
  location.value = nearbyPlaces.value[i].geometry.location
}

const selectIsOpen = () => {
  isOpen.value = !isOpen.value
}

const selectCity = (e) => {
  selectedCity.value = e.target.innerText
  isOpen.value = !isOpen.value
}

watch(selectedCity, () => {
  getLocationFromCity()
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
      <Transition>
        <div class="backdrop" v-show="isOpen"></div>
      </Transition>
      <form class="sidebar__form" :style="{ position: isOpen ? 'relative' : 'sticky' }">
        <div class="sidebar__select" @click="selectIsOpen">
          <div class="sidebar__select sidebar__select--selected-item">
            <span>{{ selectedCity }}</span>
            <img :class="arrowClass" src="./assets/arrow-icon.svg" alt="arrow-icon" />
          </div>
          <Transition>
            <ul class="sidebar__select-list" v-show="isOpen">
              <li
                class="sidebar__select-item"
                v-for="(city, i) in cities"
                @click.stop="selectCity"
                :key="i"
              >
                {{ city.name }}
              </li>
            </ul>
          </Transition>
        </div>
        <div class="sidebar__search">
          <img
            class="sidebar__search-icon"
            :style="{ opacity: searchValue ? 1 : 0.3 }"
            src="./assets/search-icon.svg"
            alt="search-icon"
          />
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
          @click="setPlaceLocationToCenter(i)"
        >
          <h3>{{ n.name }}</h3>
          <p>{{ n.vicinity }}</p>
          <div class="rating">
            <p>{{ n.rating }}</p>
            <div v-if="n.rating">
              <span
                v-for="(r, index) in ratingStarts"
                :key="index"
                :class="index + 1 < Math.ceil(n.rating) ? 'star' : 'star empty'"
                :id="index"
              ></span>
            </div>
            <span v-else>No rating</span>
          </div>
        </li>
      </ul>
    </aside>
    <div class="map">
      <app-map :location="location" />
    </div>
  </div>
</template>

<style lang="scss">
body {
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
.wrapper {
  max-width: 1200px;
  height: 680px;
  margin: 100px auto;

  display: grid;
  grid-template-columns: 30% 70%;
  overflow: hidden;

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
.sidebar {
  position: relative;
  overflow-y: scroll;
  background: #fff;
  &__form {
    display: flex;
    flex-direction: column;
    gap: 24px;
    position: sticky;
    top: 0;
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
    cursor: pointer;
    background: #f2f2f2;
    transition: 250ms;

    &:hover {
      background: #f5f5f5;
    }
  }
  &__select--selected-item {
    display: flex;
    justify-content: space-between;
    padding: 0;
    background: none;
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
      opacity: 0.3;
      transition: 250ms;
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

::-webkit-scrollbar {
  width: 10px;
  background: #fff;
  padding: 0 2px;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb {
  width: 6px;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 100px;
  border: 2px solid #fff;
}

.rating {
  unicode-bidi: bidi-override;
  direction: rtl;
  margin-top: 16px;
  display: flex;
  flex-flow: row-reverse;
  p {
    margin-right: 8px;
  }
}

.star {
  display: inline-block;
  width: 14px;
  height: 14px;
  background-image: url('./assets/filled-star.svg');
  background-size: cover;
}

.star.empty {
  background-image: url('./assets/empty-star.svg');
}

.arrow-icon {
  transition: 250ms;
  &--active {
    transform: rotate(180deg);
  }
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
